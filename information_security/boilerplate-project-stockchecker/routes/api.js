'use strict';

const https = require('https');
const crypto = require('crypto');

const STOCK_PROXY_ROOT = 'https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/';

const stockLikes = {}; // { SYMBOL: Set(hashedIp) }

function fetchStockPrice(symbol) {
  const url = STOCK_PROXY_ROOT + encodeURIComponent(symbol) + '/quote';
  return new Promise((resolve, reject) => {
    https.get(url, (resp) => {
      let data = '';
      resp.on('data', chunk => data += chunk);
      resp.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          // proxy returns latestPrice and symbol
          const price = parsed && (parsed.latestPrice || parsed.latestprice || parsed.latest_price);
          const sym = (parsed && parsed.symbol) || symbol.toUpperCase();
          resolve({ symbol: sym, price: Number(price) });
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', err => reject(err));
  });
}

function getAnonIp(req) {
  const ip = req.headers['x-forwarded-for'] || req.ip || req.connection.remoteAddress || '';
  // hash and truncate to anonymize
  return crypto.createHash('sha256').update(ip).digest('hex').slice(0,16);
}

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(async function (req, res){
      try {
        let { stock, like } = req.query;
        if(!stock) return res.json({ error: 'stock query required' });

        const doLike = (like === true || like === 'true' || like === 'on');
        const clientId = getAnonIp(req);

        const symbols = Array.isArray(stock) ? stock : [stock];
        const results = await Promise.all(symbols.map(s => fetchStockPrice(s)));

        // apply likes
        results.forEach(r => {
          const sym = r.symbol.toUpperCase();
          if(!stockLikes[sym]) stockLikes[sym] = new Set();
          if(doLike) stockLikes[sym].add(clientId);
        });

        if(results.length === 1) {
          const r = results[0];
          const sym = r.symbol.toUpperCase();
          const likesCount = stockLikes[sym] ? stockLikes[sym].size : 0;
          return res.json({ stockData: { stock: sym, price: r.price, likes: likesCount } });
        }

        if(results.length === 2) {
          const a = results[0];
          const b = results[1];
          const sa = a.symbol.toUpperCase();
          const sb = b.symbol.toUpperCase();
          const likesA = stockLikes[sa] ? stockLikes[sa].size : 0;
          const likesB = stockLikes[sb] ? stockLikes[sb].size : 0;
          const relA = likesA - likesB;
          const relB = likesB - likesA;
          return res.json({ stockData: [
            { stock: sa, price: a.price, rel_likes: relA },
            { stock: sb, price: b.price, rel_likes: relB }
          ] });
        }

        // more than 2 stocks - return data array
        const data = results.map(r => {
          const sym = r.symbol.toUpperCase();
          return { stock: sym, price: r.price, likes: stockLikes[sym] ? stockLikes[sym].size : 0 };
        });
        return res.json({ stockData: data });

      } catch (err) {
        return res.status(500).json({ error: 'unable to fetch stock data' });
      }
    });
    
};
