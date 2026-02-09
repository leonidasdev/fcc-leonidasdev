require('dotenv').config();
const express = require('express');
const dns = require('dns');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
// parse application/json
app.use(express.json());

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
  const original_url = req.body.url;

  // Validate URL format and protocol
  let parsed;
  try {
    parsed = new URL(original_url);
  } catch (err) {
    return res.json({ error: 'invalid url' });
  }

  if (!/^https?:$/.test(parsed.protocol)) {
    return res.json({ error: 'invalid url' });
  }

  // Use dns.lookup on the hostname to verify it's valid
  dns.lookup(parsed.hostname, (err) => {
    if (err) return res.json({ error: 'invalid url' });

    // Check if URL already stored
    const found = urlDatabase.find(u => u.original_url === original_url);
    if (found) {
      return res.json({ original_url: found.original_url, short_url: found.short_url });
    }

    const short_url = urlDatabase.length + 1;
    urlDatabase.push({ original_url, short_url });

    res.json({ original_url, short_url });
  });
});

app.get('/api/shorturl/:short_url', function(req, res) {
  const short = parseInt(req.params.short_url, 10);
  const entry = urlDatabase.find(u => u.short_url === short);
  if (entry) {
    return res.redirect(entry.original_url);
  }
  res.status(404).json({ error: 'No short URL found for the given input' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});