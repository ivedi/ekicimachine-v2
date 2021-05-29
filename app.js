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

app.get('/home', (req, res) => {
  const client = new Client(req);
  const language = client.getLanguage();
  const filePath = `${__dirname}/pages/index.${language}.html`;
  res.sendFile(filePath);
});

app.get('/anasayfa', (_, res) => {
  const filePath = `${__dirname}/pages/index.tr.html`;
  res.sendFile(filePath);
});

app.listen(port, () => {
  console.log(`The party is at http://localhost:${port}`);
});