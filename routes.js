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
    /* Rotas de acesso */
    app.get('/access', isLoggedIn, function (req, res) {
        if (req.session.passport.user.nivel_acesso == '1')
            res.redirect('/indexsecretaria')
        else if (req.session.passport.user.nivel_acesso == '2')
            res.redirect('/indexprofissional')
        else if (req.session.passport.user.nivel_acesso == '3')
            res.redirect('/usuario')
        else
            res.redirect('/logout')
    })
    /*
        Níveis de acesso:
        3: USUÁRIOS
    */
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
    /* Retornar as cidades */
    app.get('/retornarcidades/:estado', isLoggedIn, function (req, res) {
        controller.retornarcidades(res, req.params.estado)
    })
    /* Home usuários */
    app.get('/indexusuario', isLoggedIn, function (req, res) {
        res.sendFile(path + 'users/usuario/indexUsuario.html')
    })
    /* Agendar */
    app.get('/agendar', isLoggedIn, function (req, res) {
        res.sendFile(path + 'users/usuario/agendarUsuario.html')
    })
    /* Operações do agendar consulta */
    app.get('/retonaragendamento/:date', isLoggedIn, function (req, res) {
        controller.retonaragendamento(res, req.params.date, req.session.passport.user)
    })
    app.post('/realizaragendamento', isLoggedIn, function (req, res) {
        controller.realizaragendamento(req, res, req.session.passport.user)
    })
    app.post('/desmarcaragendamento', isLoggedIn, function (req, res) {
        controller.desmarcaragendamento(req, res, req.session.passport.user)
    })
    /*
        Níveis de acesso:
        2: PROFISSIONAL
    */
    /* Home profissional */
    app.get('/indexprofissional', isLoggedIn, function (req, res) {
        res.sendFile(path + 'users/profissional/indexProfissional.html')
    })
    /*
        Níveis de acesso:
        1: SECRETARIA
    */
    /* Home secretaria */
    app.get('/indexsecretaria', isLoggedIn, function (req, res) {
        res.sendFile(path + 'users/secretaria/indexSecretaria.html')
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