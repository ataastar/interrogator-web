function requireHTTPS(req, res, next) {
  // The 'x-forwarded-proto' check is for Heroku
  if (!req.secure && req.get('x-forwarded-proto') !== 'https') {
    return res.redirect('https://' + req.get('host') + req.url);
  }
  next();
}

const express = require('express');
const app = express();

// set up rate limiter
const RateLimit = require('express-rate-limit');
const limiter = RateLimit({
  windowMs: 1000,
  max: 1,
});
// apply rate limiter to all requests
app.use(limiter);

app.use(requireHTTPS);
app.use(express.static('./build'));

app.get('/*', (req, res) =>
  res.sendFile('index.html', {root: 'build/'}),
);

app.listen(process.env.PORT || 8080);
