const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const port = 3000;

const Client = require('./models/client');

app.use(cookieParser());
app.use(express.static('public'));

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
app.get('/contact', (req, res) => sendHtmlPage(req, res, 'contact'));

app.get('/anasayfa', (_, res) => res.sendFile(getHtmlPageFilePath('index', 'tr')));
app.get('/makineler', (_, res) => res.sendFile(getHtmlPageFilePath('machines', 'tr')));
app.get('/otomasyon', (_, res) => res.sendFile(getHtmlPageFilePath('automation', 'tr')));
app.get('/referanslar', (_, res) => res.sendFile(getHtmlPageFilePath('reference', 'tr')));
app.get('/haberler', (_, res) => res.sendFile(getHtmlPageFilePath('news', 'tr')));
app.get('/iletisim', (_, res) => res.sendFile(getHtmlPageFilePath('contact', 'tr')));

app.listen(port, () => {
  console.log(`The party is at http://localhost:${port}`);
});

const sendHtmlPage = (req, res, pageName) => {
  const client = new Client(req);
  const language = client.getLanguage();
  const filePath = getHtmlPageFilePath(pageName, language);
  res.sendFile(filePath);
};

const getHtmlPageFilePath = (pageName, language) => {
  return `${__dirname}/pages/${pageName}.${language}.html`;
};