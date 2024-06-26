const express = require('express');
const proxy = require('express-http-proxy');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

const PORT = 3001;
const HOST = 'localhost';

app.use(cors());
app.use(morgan('dev'));

// Функция для динамического определения целевого URL на основе поддомена
function getTargetUrl(req) {
  const host = req.headers.host;
  const subdomainMatch = host.match(/^(.*?)\.clubfriends.online$/);
  if (subdomainMatch) {
    const subdomain = subdomainMatch[1];
    return `https://${subdomain}.gotinder.com`;
  }
  return null;
}

// Настройка прокси с динамическим целевым URL
app.use('/', (req, res, next) => {
  const targetUrl = getTargetUrl(req);
  console.log(targetUrl)
  if (targetUrl) {
    proxy(targetUrl, {
      proxyReqPathResolver: () => req.url
    })(req, res, next);
  } else {
    res.status(404).send('Not Found');
  }
});

app.listen(PORT, HOST, () => {
  console.log(`Starting Proxy at ${HOST}:${PORT}`);
});
