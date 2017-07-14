'use strict'

/*
• body-parser: Todos os middlewares preencherão a propriedade req.body com o corpo analisado,
ou um objeto vazio ({}) se não houver nenhum corpo para analisar.
• passport: middleware de autenticação.
• express-session: middleware de sessão. Os dados de sessão são armazenados no lado do servidor.
*/

const bodyParser = require('body-parser'),
      express = require('express'),
      passport = require('passport'),
      session = require('express-session'),
      keySecret = require('./config/secret'),
      app = express()

app.use(bodyParser.urlencoded({
      extended: true
}))
app.use(bodyParser.json())
app.use(express.static("public"))
app.use(session({
      name: 'natermed',
      secret: keySecret,
      cookie: {
            maxAge: 3600000
      },
      resave: false,
      saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

const port = 8080,
      hostname = "localhost"
app.listen(port, onStart())

require('./passport/passport')(passport)
require('./routes')(app, passport)

function onStart() {
      console.log(`Server started at http://${hostname}:${port}`)
}
