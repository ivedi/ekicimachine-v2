const express = require('express')
const app = express()
const port = 3000

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.redirect(307, '/home')
})

app.get('/home', (req, res) => {
  res.sendFile(__dirname + '/pages/en/index.html')
})

app.listen(port, () => {
  console.log(`The party is at http://localhost:${port}`)
})