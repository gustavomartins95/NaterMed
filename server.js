'use strict'

/*
• body-parser: Todos os middlewares preencherão a propriedade req.body com o corpo analisado,
ou um objeto vazio ({}) se não houver nenhum corpo para analisar.
*/

const bodyParser = require('body-parser'),
      express = require('express'),
      app = express()

app.use(bodyParser.urlencoded({
      extended: true
}))
app.use(bodyParser.json())
app.use(express.static("public"))

const port = 8080,
      hostname = "localhost"
app.listen(port, onStart())

require('./routes')(app)

function onStart() {
      console.log(`Server started at http://${hostname}:${port}`)
}
