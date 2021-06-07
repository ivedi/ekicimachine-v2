require('dotenv').config();
const cookieParser = require('cookie-parser');
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

const Client = require('./models/client');

app.use(cookieParser());
app.use(express.static('public'));
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
      return;
    }
    next();
  });
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  const client = new Client(req);
  if (client.getLanguage() === 'tr') {
    res.redirect(307, '/anasayfa');
    return;
  }
  res.redirect(307, '/home');
});

app.get('/home', (req, res) => sendHtmlPage(req, res, 'index'));
app.get('/machines', (req, res) => sendHtmlPage(req, res, 'machines'));
app.get('/automation', (req, res) => sendHtmlPage(req, res, 'automation'));
app.get('/references', (req, res) => sendHtmlPage(req, res, 'reference'));
app.get('/news', (req, res) => sendHtmlPage(req, res, 'news'));
app.get('/contact', (req, res) => renderHtmlPage(req, res, 'contact', {
  GOOGLE_MAP_API_KEY: process.env.GOOGLE_MAP_API_KEY
}));

app.get('/anasayfa', (_, res) => res.sendFile(getHtmlPageFilePath('index', 'tr')));
app.get('/makineler', (_, res) => res.sendFile(getHtmlPageFilePath('machines', 'tr')));
app.get('/otomasyon', (_, res) => res.sendFile(getHtmlPageFilePath('automation', 'tr')));
app.get('/referanslar', (_, res) => res.sendFile(getHtmlPageFilePath('reference', 'tr')));
app.get('/haberler', (_, res) => res.sendFile(getHtmlPageFilePath('news', 'tr')));
app.get('/iletisim', (req, res) => renderHtmlPage(req, res, 'contact', {
  GOOGLE_MAP_API_KEY: process.env.GOOGLE_MAP_API_KEY
}));

app.get('/ping', (req, res) => res.send('pong@v2.0.0'));

app.listen(process.env.PORT || port, () =>
  console.log(`The party is at http://localhost:${port}`));

const sendHtmlPage = (req, res, pageName) => {
  const client = new Client(req);
  const language = client.getLanguage();
  const filePath = getHtmlPageFilePath(pageName, language);
  res.sendFile(filePath);
};

const renderHtmlPage = (req, res, pageName, variables) => {
  const client = new Client(req);
  const language = client.getLanguage();
  const viewPath = getViewPath(pageName, language);
  res.render(viewPath, variables);
};

const getHtmlPageFilePath = (pageName, language) =>
  `${__dirname}/views/pages/${pageName}.${language}.html`;

const getViewPath = (pageName, language) =>
  `pages/${pageName}-${language}`;