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
    app.route('/login')
        .get(function (req, res) {
            res.sendFile(path + 'login.html')
        })
        .post(function (req, res, next) {
            passport.authenticate('local-login',
                function (error, user, info) {
                    if (error) return res.status(500).json({ info: 'Desculpe-nos :( Tente novamente.' })
                    if (!user) return res.status(403).json({ info })
                    req.login(user, function (error) {
                        if (error) return res.status(500).json({ info: 'Desculpe-nos :( Tente novamente.' })
                        return res.status(200).json({ info })
                    })
                }
            )(req, res, next)
        })
    /* Home usuários */
    app.get('/indexusuario', isLoggedIn, function (req, res) {
        res.sendFile(path + 'users/usuario/indexUsuario.html')
    })
    /* Logout */
    app.get('/logout', function (req, res) {
        req.session.destroy(function (error) {
            if (error) { return next(error) }
            res.clearCookie('natermed')
            req.logout()
            res.redirect('/login')
        })
    })
    /* 404 */
    app.use(function (req, res, next) {
        res.status(404).sendFile(path + '404.html')
    })

}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next()
    else
        res.redirect('/logout')
}