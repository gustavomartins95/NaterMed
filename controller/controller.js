'use strict'

const service = require('../service/service'),
    httpStatus = require('http-status')

var controller = {
    // Retornar estatística
    retornarestatistica: function (res) {
        service.retornarestatistica(function (error, data) {
            res.status(httpStatus.OK).json({ data: data })
        })
    },
    // Registrar novo login/cartão
    register: function (req, res) {
        service.register(req.body, function (error, status, message) {
            res.status(status).json({ message: message })
        })
    },
    // Login usuário
    login: function (txtCartaosus_Acesso, txtSenha_Acesso, callback) {
        service.access(txtCartaosus_Acesso, txtSenha_Acesso, function (error, status, message, user) {
            if (status == httpStatus.OK) callback(null, user)
            else if (status == httpStatus.UNAUTHORIZED) callback(null, false, message)
            else callback(error)
        })
    },
    /*
        Níveis de acesso:
        3: USUÁRIOS
    */
    // Cadastrar dados dos usuários
    cadastrarusuario: function (req, res, dataSession) {
        service.cadastrarusuario(req.body, dataSession, function (error, status, message) {
            res.status(status).json({ message: message })
        })
    },
    // Editar login do usuário
    editarloginusuario: function (req, res, dataSession) {
        service.editarloginusuario(req.body, dataSession, function (error, status, message) {
            res.status(status).json({ message: message })
        })
    },
    // Retornar login dos usuários
    retornarloginusuario: function (res, dataSession) {
        service.retornarloginusuario(dataSession, function (error, login) {
            res.status(httpStatus.OK).json({ login: login })
        })
    },
    // Editar dados do usuário
    editarusuario: function (req, res, dataSession) {
        service.editarusuario(req.body, dataSession, function (error, status, message) {
            res.status(status).json({ message: message })
        })
    },
    // Retornar dados dos usuários
    retornardadosusuario: function (res, dataSession) {
        service.retornardadosusuario(dataSession, function (error, users) {
            res.status(httpStatus.OK).json({ users: users })
        })
    },
    // Excluir dados do usuário
    excluirusuario: function (res, dataSession) {
        service.excluirusuario(dataSession, function (error, status, message) {
            res.status(status).json({ message: message })
        })
    },
    // Retornar as cidades
    retornarcidades: function (res, estado) {
        service.retornarcidades(estado, function (error, cidades) {
            res.status(httpStatus.OK).json({ cidades: cidades })
        })
    },
    // Retornar dados dos usuários
    retornarusuario: function (res, dataSession) {
        service.retornarusuario(dataSession, function (error, users) {
            res.status(httpStatus.OK).json({ users: users })
        })
    },
    // Operações do agendar consulta
    retonaragendamento: function (res, date, dataSession) {
        service.retonaragendamento(date, function (error, status, data) {
            res.status(status).json({ data: data, userid: dataSession.idusuario, date: date })
        })
    },
    realizaragendamento: function (req, res, dataSession) {
        service.realizaragendamento(req.body, dataSession, function (error, status, message) {
            res.status(status).json({ message: message })
        })
    },
    desmarcaragendamento: function (req, res, dataSession) {
        service.desmarcaragendamento(req.body, dataSession, function (error, status, message) {
            res.status(status).json({ message: message })
        })
    },
    /*
        Níveis de acesso:
        2: PROFISSIONAL
    */
    // Retornar dados dos profissionais
    retornarprofissional: function (res, dataSession) {
        service.retornarprofissional(dataSession, function (error, users) {
            res.status(httpStatus.OK).json({ users: users })
        })
    },
    /*
        Níveis de acesso:
        1: SECRETARIA
    */
    // Retornar dados da secretaria
    retornarsecretaria: function (res, dataSession) {
        service.retornarsecretaria(dataSession, function (error, users) {
            res.status(httpStatus.OK).json({ users: users })
        })
    },
    /* Operações do profissional */
    cadastrarprofissional: function (req, res) {
        service.cadastrarprofissional(req.body, function (error, status, message) {
            res.status(status).json({ message: message })
        })
    },
    retornartableprofissional: function (res) {
        service.retornartableprofissional(function (error, professionals) {
            res.status(httpStatus.OK).json({ professionals: professionals })
        })
    },
    retornareditartableprofissional: function (res, idprofissional) {
        service.retornareditartableprofissional(idprofissional, function (error, professionals) {
            res.status(httpStatus.OK).json({ professionals: professionals })
        })
    },
    editarprofissional: function (req, res) {
        service.editarprofissional(req.body, function (error, status, message) {
            res.status(status).json({ message: message })
        })
    },
    excluirtableprofissional: function (req, res) {
        service.excluirtableprofissional(req.body, function (error, status, message) {
            res.status(status).json({ message: message })
        })
    }
}

module.exports = controller
