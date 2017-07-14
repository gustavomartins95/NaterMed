'use strict'

const path = __dirname + '/public/'

module.exports = function (app, passport) {

    /* Rotas */
    app.use(function (req, res, next) {
        console.log('%s %s', req.method, req.url)
        next()
    })
    /* Home do Site */
    app.get('/', function (req, res) {
        res.sendFile(path + 'index.html')
    })
    /* Registrar */
    app.get('/register', function (req, res) {
        res.sendFile(path + 'register.html')
    })
    /* Login */
    app.get('/login', function (req, res) {
        res.sendFile(path + 'login.html')
    })

}