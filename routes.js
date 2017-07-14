'use strict'

const path = __dirname + '/public/'
const controller = require('./controller/controller')

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
    app.route('/register')
        .get(function (req, res) {
            res.sendFile(path + 'register.html')
        })
        .post(function (req, res) {
            controller.register(req, res)
        })
    /* Login */
    app.get('/login', function (req, res) {
        res.sendFile(path + 'login.html')
    })
    /* 404 */
    app.use(function (req, res, next) {
        res.status(404).sendFile(path + '404.html')
    })

}