'use strict'

const service = require('../service/service'),
    httpStatus = require('http-status')

var controller = {
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
    }
}

module.exports = controller
