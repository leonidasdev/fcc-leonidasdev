const express = require('express');
const helmet = require('helmet');
const app = express();

const ninetyDaysInSeconds = 90*24*60*60;

app.use(helmet({
  // Deny page embedding in frames to protect against clickjacking
  frameguard: { action: 'deny' },

  // Enable and configure Content Security Policy (CSP)
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", 'trusted-cdn.com']
    }
  },

  // Disable DNS prefetch control middleware (example of disabling a feature)
  dnsPrefetchControl: false,

  // Configure HSTS via helmet options
  hsts: {
    maxAge: ninetyDaysInSeconds,
    force: true
  }
}));

// `noCache` is not included by default by helmet(), enable explicitly
app.use(helmet.noCache());












































module.exports = app;
const api = require('./server.js');
app.use(express.static('public'));
app.disable('strict-transport-security');
app.use('/_api', api);
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});
let port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Your app is listening on port ${port}`);
});
