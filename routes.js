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
    /* Retornar estatística */
    app.get('/retornarestatistica', function (req, res) {
        controller.retornarestatistica(res)
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
    app.get('/retonarhorarioagendamento', isLoggedIn, isAuthorized(['3']), function (req, res) {
        controller.retonarhorarioagendamento(res)
    })
    app.get('/retonaragendamento/:id?:date?', isLoggedIn, isAuthorized(['3']), function (req, res) {
        controller.retonaragendamento(res, req.query.id, req.query.date, req.session.passport.user)
    })
    app.post('/realizaragendamento', isLoggedIn, isAuthorized(['3']), function (req, res) {
        controller.realizaragendamento(req, res, req.session.passport.user)
    })
    app.post('/desmarcaragendamento', isLoggedIn, isAuthorized(['3']), function (req, res) {
        controller.desmarcaragendamento(req, res, req.session.passport.user)
    })
    /* Consultas marcadas */
    app.get('/retornaragenda', isLoggedIn, isAuthorized(['3']), function (req, res) {
        res.sendFile(path + 'users/usuario/retornarAgenda.html')
    })
    app.get('/retornartablemarcadas', isLoggedIn, isAuthorized(['3']), function (req, res) {
        controller.retornartablemarcadas(res, req.session.passport.user)
    })
    /* Horários */
    app.get('/horariosusuario', isLoggedIn, isAuthorized(['3']), function (req, res) {
        res.sendFile(path + 'users/usuario/horariosProfissionais.html')
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
    /* Horários */
    app.get('/horariosprofissional', isLoggedIn, isAuthorized(['2']), function (req, res) {
        res.sendFile(path + 'users/profissional/horariosProfissionais.html')
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
    /* Operações do profissional */
    app.route('/cadastrarprofissional')
        .get(isLoggedIn, isAuthorized(['1']), function (req, res) {
            res.sendFile(path + 'users/secretaria/cadastrarProfissional.html')
        })
        .post(isLoggedIn, isAuthorized(['1']), function (req, res) {
            controller.cadastrarprofissional(req, res)
        })
    app.get('/listarprofissional', isLoggedIn, isAuthorized(['1']), function (req, res) {
        res.sendFile(path + 'users/secretaria/listarProfissional.html')
    })
    app.get('/retornartableprofissional', isLoggedIn, isAuthorized(['1']), function (req, res) {
        controller.retornartableprofissional(res)
    })
    app.get('/editartableprofissional/:id?', isLoggedIn, isAuthorized(['1']), function (req, res) {
        res.sendFile(path + 'users/secretaria/editarProfissional.html')
    })
    app.get('/retornareditartableprofissional/:id?', isLoggedIn, isAuthorized(['1']), function (req, res) {
        controller.retornareditartableprofissional(res, req.query.id)
    })
    app.post('/editarprofissional', isLoggedIn, isAuthorized(['1']), function (req, res) {
        controller.editarprofissional(req, res)
    })
    app.post('/excluirtableprofissional', isLoggedIn, isAuthorized(['1']), function (req, res) {
        controller.excluirtableprofissional(req, res)
    })
    /* Operações do horário */
    app.route('/cadastrarhorario')
        .get(isLoggedIn, isAuthorized(['1']), function (req, res) {
            res.sendFile(path + 'users/secretaria/cadastrarHorario.html')
        })
        .post(isLoggedIn, isAuthorized(['1']), function (req, res) {
            controller.cadastrarhorario(req, res)
        })
    app.get('/retornarprofcadastrarhorario', isLoggedIn, isAuthorized(['1']), function (req, res) {
        controller.retornarprofcadastrarhorario(res)
    })
    app.get('/listarhorario', isLoggedIn, isAuthorized(['1']), function (req, res) {
        res.sendFile(path + 'users/secretaria/listarHorario.html')
    })
    app.get('/editartablehorario/:id?', isLoggedIn, isAuthorized(['1']), function (req, res) {
        res.sendFile(path + 'users/secretaria/editarHorario.html')
    })
    app.get('/retornareditartablehorario/:id?', isLoggedIn, isAuthorized(['1']), function (req, res) {
        controller.retornareditartablehorario(res, req.query.id)
    })
    app.post('/editarhorario', isLoggedIn, isAuthorized(['1']), function (req, res) {
        controller.editarhorario(req, res)
    })
    app.post('/excluirtablehorario', isLoggedIn, isAuthorized(['1']), function (req, res) {
        controller.excluirtablehorario(req, res)
    })
    /* Operações do medicamento */
    app.route('/cadastrarmedicamento')
        .get(isLoggedIn, isAuthorized(['1']), function (req, res) {
            res.sendFile(path + 'users/secretaria/cadastrarmedicamento.html')
        })
        .post(isLoggedIn, isAuthorized(['1']), function (req, res) {
            controller.cadastrarmedicamento(req, res, req.session.passport.user.idlogin)
        })
    app.get('/listarmedicamento', isLoggedIn, isAuthorized(['1']), function (req, res) {
        res.sendFile(path + 'users/secretaria/listarMedicamento.html')
    })
    app.get('/retornartablemedicamento', isLoggedIn, isAuthorized(['1']), function (req, res) {
        controller.retornartablemedicamento(res)
    })
    app.get('/editartablemedicamento/:id?', isLoggedIn, isAuthorized(['1']), function (req, res) {
        res.sendFile(path + 'users/secretaria/editarMedicamento.html')
    })
    app.get('/retornareditartablemedicamento/:id?', isLoggedIn, isAuthorized(['1']), function (req, res) {
        controller.retornareditartablemedicamento(res, req.query.id)
    })
    app.post('/editarmedicamento', isLoggedIn, isAuthorized(['1']), function (req, res) {
        controller.editarmedicamento(req, res)
    })
    app.post('/excluirtablemedicamento', isLoggedIn, isAuthorized(['1']), function (req, res) {
        controller.excluirtablemedicamento(req, res)
    })
    /*
        Todos os níveis de acesso
    */
    /* Retornar dados do horários dos profissionais */
    app.get('/retornartablehorario', isLoggedIn, isAuthorized(['1', '2', '3']), function (req, res) {
        controller.retornartablehorario(res)
    })
    /* Retornar as cidades */
    app.get('/retornarcidades/:estado', isLoggedIn, isAuthorized(['1', '3']), function (req, res) {
        controller.retornarcidades(res, req.params.estado)
    })
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
