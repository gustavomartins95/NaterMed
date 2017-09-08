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
            res.redirect('/secretaria')
        else if (req.session.passport.user.nivel_acesso == '2')
            res.redirect('/profissional')
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
    app.get('/usuario', isLoggedIn, isAuthorized(['3']), function (req, res) {
        res.sendFile(path + 'users/usuario/escolherUsuario.html')
    })
    /* Retornar usuários */
    app.get('/retornarusuario', isLoggedIn, isAuthorized(['3']), function (req, res) {
        controller.retornarusuario(res, req.session.passport.user)
    })
    /* Salvar usuário escolhido na session */
    app.post('/escolherusuario', isLoggedIn, isAuthorized(['3']), function (req, res) {
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
        .get(isLoggedIn, isAuthorized(['3']), function (req, res) {
            res.sendFile(path + 'users/usuario/cadastrarUsuario.html')
        })
        .post(isLoggedIn, isAuthorized(['3']), function (req, res) {
            controller.cadastrarusuario(req, res, req.session.passport.user)
        })
    /* Retornar as cidades */
    app.get('/retornarcidades/:estado', isLoggedIn, isAuthorized(['3']), function (req, res) {
        controller.retornarcidades(res, req.params.estado)
    })
    /* Editar login usuário */
    app.route('/editarloginusuario')
        .get(isLoggedIn, isAuthorized(['3']), function (req, res) {
            res.sendFile(path + 'users/usuario/editarLoginUsuario.html')
        })
        .post(isLoggedIn, isAuthorized(['3']), function (req, res) {
            controller.editarloginusuario(req, res, req.session.passport.user)
        })
    /* Retornar login usuários */
    app.get('/retornarloginusuario', isLoggedIn, isAuthorized(['3']), function (req, res) {
        controller.retornarloginusuario(res, req.session.passport.user)
    })
    /* Editar usuário */
    app.route('/editarusuario')
        .get(isLoggedIn, isAuthorized(['3']), function (req, res) {
            res.sendFile(path + 'users/usuario/editarUsuario.html')
        })
        .post(isLoggedIn, isAuthorized(['3']), function (req, res) {
            controller.editarusuario(req, res, req.session.passport.user)
        })
    /* Retornar dados usuários */
    app.get('/retornardadosusuario', isLoggedIn, isAuthorized(['3']), function (req, res) {
        controller.retornardadosusuario(res, req.session.passport.user)
    })
    /* Excluir dados do usuário */
    app.post('/excluirusuario', isLoggedIn, isAuthorized(['3']), function (req, res) {
        controller.excluirusuario(res, req.session.passport.user)
    })
    /* Home usuários */
    app.get('/indexusuario', isLoggedIn, isAuthorized(['3']), function (req, res) {
        res.sendFile(path + 'users/usuario/indexUsuario.html')
    })
    /* Agendar */
    app.get('/agendar', isLoggedIn, isAuthorized(['3']), function (req, res) {
        res.sendFile(path + 'users/usuario/agendarUsuario.html')
    })
    /* Operações do agendar consulta */
    app.get('/retonaragendamento/:date', isLoggedIn, isAuthorized(['3']), function (req, res) {
        controller.retonaragendamento(res, req.params.date, req.session.passport.user)
    })
    app.post('/realizaragendamento', isLoggedIn, isAuthorized(['3']), function (req, res) {
        controller.realizaragendamento(req, res, req.session.passport.user)
    })
    app.post('/desmarcaragendamento', isLoggedIn, isAuthorized(['3']), function (req, res) {
        controller.desmarcaragendamento(req, res, req.session.passport.user)
    })
    /* Horários */
    app.get('/horarios', isLoggedIn, isAuthorized(['3']), function (req, res) {
        res.sendFile(path + 'users/usuario/horariosUsuario.html')
    })
    /*
        Níveis de acesso:
        2: PROFISSIONAL
    */
    /* Escolher profissional */
    app.get('/profissional', isLoggedIn, isAuthorized(['2']), function (req, res) {
        res.sendFile(path + 'users/profissional/escolherProfissional.html')
    })
    /* Retornar profissional */
    app.get('/retornarprofissional', isLoggedIn, isAuthorized(['2']), function (req, res) {
        controller.retornarprofissional(res, req.session.passport.user)
    })
    /* Salvar profissional escolhido na session */
    app.post('/escolherprofissional', isLoggedIn, isAuthorized(['2']), function (req, res) {
        let newDataSession = []
        newDataSession.idlogin = req.session.passport.user.idlogin
        newDataSession.nivel_acesso = req.session.passport.user.nivel_acesso
        newDataSession.idusuario = req.body.idprofissional
        // Atualizar session
        req.login(newDataSession, function (error) {
            return res.status(200).json({ message: "Logado" })
        })
    })
    /* Home profissional */
    app.get('/indexprofissional', isLoggedIn, isAuthorized(['2']), function (req, res) {
        res.sendFile(path + 'users/profissional/indexProfissional.html')
    })
    /*
        Níveis de acesso:
        1: SECRETARIA
    */
    /* Escolher secretaria */
    app.get('/secretaria', isLoggedIn, isAuthorized(['1']), function (req, res) {
        res.sendFile(path + 'users/secretaria/escolherSecretaria.html')
    })
    /* Retornar secretaria */
    app.get('/retornarsecretaria', isLoggedIn, isAuthorized(['1']), function (req, res) {
        controller.retornarsecretaria(res, req.session.passport.user)
    })
    /* Salvar secretaria escolhido na session */
    app.post('/escolhersecretaria', isLoggedIn, isAuthorized(['1']), function (req, res) {
        let newDataSession = []
        newDataSession.idlogin = req.session.passport.user.idlogin
        newDataSession.nivel_acesso = req.session.passport.user.nivel_acesso
        newDataSession.idusuario = req.body.idsecretaria
        // Atualizar session
        req.login(newDataSession, function (error) {
            return res.status(200).json({ message: "Logado" })
        })
    })
    /* Home secretaria */
    app.get('/indexsecretaria', isLoggedIn, isAuthorized(['1']), function (req, res) {
        res.sendFile(path + 'users/secretaria/indexSecretaria.html')
    })
    /*
        Todos os níveis de acesso
    */
    /* Dados da session */
    app.get('/session', isLoggedIn, isAuthorized(['1', '2', '3']), function (req, res) {
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

function isAuthorized(access) {
    return function (req, res, next) {
        if (access.indexOf(req.session.passport.user.nivel_acesso) != -1)
            return next()
        else
            res.redirect('/logout')
    }
}
