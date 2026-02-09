require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dns = require('dns');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

// body parser for POST requests
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

// In-memory store for shortened URLs
const urlDatabase = [];

app.post('/api/shorturl', function(req, res) {
  const original = req.body.url;

  // validate protocol and parse
  let hostname;
  try {
    const urlObj = new URL(original);
    hostname = urlObj.hostname;
  } catch (err) {
    return res.json({ error: 'invalid url' });
  }

  // verify hostname via DNS lookup
  dns.lookup(hostname, (dnsErr) => {
    if (dnsErr) return res.json({ error: 'invalid url' });

    // check if already exists
    const existingIndex = urlDatabase.findIndex(u => u === original);
    if (existingIndex !== -1) {
      return res.json({ original_url: original, short_url: existingIndex + 1 });
    }

    // store and return id
    urlDatabase.push(original);
    const id = urlDatabase.length; // 1-based
    res.json({ original_url: original, short_url: id });
  });
});

app.get('/api/shorturl/:id', function(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1 || id > urlDatabase.length) {
    return res.json({ error: 'No short URL found for the given input' });
  }
  const original = urlDatabase[id - 1];
  res.redirect(original);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
