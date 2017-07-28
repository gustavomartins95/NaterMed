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
    /* Escolher usuário */
    app.get('/usuario', isLoggedIn, function (req, res) {
        res.sendFile(path + 'users/usuario/escolherUsuario.html')
    })
    /* Retornar usuários */
    app.get('/retornarusuario', isLoggedIn, function (req, res) {
        controller.retornarusuario(res, req.session.passport.user)
    })
    /* Salvar usuário escolhido na session */
    app.post('/escolherusuario', isLoggedIn, function (req, res) {
        let newDataSession = []
        newDataSession.idlogin = req.session.passport.user.idlogin
        newDataSession.nivel_acesso = req.session.passport.user.nivel_acesso
        newDataSession.idusuario = req.body.idusuario
        // Atualizar session
        req.login(newDataSession, function (error) {
            return res.status(200).json({ message: "Logado" })
        })
    })
    /* Cadastrar dados dos usuários */
    app.route('/cadastrarusuario')
        .get(isLoggedIn, function (req, res) {
            res.sendFile(path + 'users/usuario/cadastrarUsuario.html')
        })
        .post(isLoggedIn, function (req, res) {
            controller.cadastrarusuario(req, res, req.session.passport.user)
        })
    /* Home usuários */
    app.get('/indexusuario', isLoggedIn, function (req, res) {
        res.sendFile(path + 'users/usuario/indexUsuario.html')
    })
    /* Agendar */
    app.get('/agendar', isLoggedIn, function (req, res) {
        res.sendFile(path + 'users/usuario/agendarUsuario.html')
    })
    /* Horários */
    app.get('/horarios', isLoggedIn, function (req, res) {
        res.sendFile(path + 'users/horarios.html')
    })
    /* Dados da session */
    app.get('/session', isLoggedIn, function (req, res) {
        console.log(req.session.passport.user)
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