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
    retonarhorarioagendamento: function (res) {
        service.retonarhorarioagendamento(function (error, status, hour) {
            res.status(status).json({ hour: hour })
        })
    },
    retonaragendamento: function (res, id, date, dataSession) {
        service.retonaragendamento(id, date, function (error, status, data) {
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
    retornartablemarcadas: function (res, dataSession) {
        service.retornartablemarcadas(dataSession, function (error, consulta) {
            res.status(httpStatus.OK).json({ consulta: consulta })
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
    },
    /* Operações do horário */
    cadastrarhorario: function (req, res) {
        service.cadastrarhorario(req.body, function (error, status, message) {
            res.status(status).json({ message: message })
        })
    },
    retornarprofcadastrarhorario: function (res) {
        service.retornarprofcadastrarhorario(function (error, professionals) {
            res.status(httpStatus.OK).json({ professionals: professionals })
        })
    },
    retornartablehorario: function (res) {
        service.retornartablehorario(function (error, hour) {
            res.status(httpStatus.OK).json({ hour: hour })
        })
    },
    retornareditartablehorario: function (res, idhorario) {
        service.retornareditartablehorario(idhorario, function (error, hour) {
            res.status(httpStatus.OK).json({ hour: hour })
        })
    },
    editarhorario: function (req, res) {
        service.editarhorario(req.body, function (error, status, message) {
            res.status(status).json({ message: message })
        })
    },
    excluirtablehorario: function (req, res) {
        service.excluirtablehorario(req.body, function (error, status, message) {
            res.status(status).json({ message: message })
        })
    },
    /* Operações do medicamento */
    cadastrarmedicamento: function (req, res, idsecretaria) {
        service.cadastrarmedicamento(req.body, idsecretaria, function (error, status, message) {
            res.status(status).json({ message: message })
        })
    },
    retornartablemedicamento: function (res) {
        service.retornartablemedicamento(function (error, medicamento) {
            res.status(httpStatus.OK).json({ medicamento: medicamento })
        })
    },
    retornareditartablemedicamento: function (res, idmedicamento) {
        service.retornareditartablemedicamento(idmedicamento, function (error, medicamento) {
            res.status(httpStatus.OK).json({ medicamento: medicamento })
        })
    },
    editarmedicamento: function (req, res) {
        service.editarmedicamento(req.body, function (error, status, message) {
            res.status(status).json({ message: message })
        })
    },
    excluirtablemedicamento: function (req, res) {
        service.excluirtablemedicamento(req.body, function (error, status, message) {
            res.status(status).json({ message: message })
        })
    },
    /* Operações da notícia */
    cadastrarnoticia: function (req, res, idsecretaria) {
        service.cadastrarnoticia(req.body, idsecretaria, function (error, status, message) {
            res.status(status).json({ message: message })
        })
    },
    retornartablenoticia: function (res) {
        service.retornartablenoticia(function (error, noticia) {
            res.status(httpStatus.OK).json({ noticia: noticia })
        })
    },
    retornareditartablenoticia: function (res, idnoticia) {
        service.retornareditartablenoticia(idnoticia, function (error, noticia) {
            res.status(httpStatus.OK).json({ noticia: noticia })
        })
    },
    editarnoticia: function (req, res) {
        service.editarnoticia(req.body, function (error, status, message) {
            res.status(status).json({ message: message })
        })
    },
    excluirtablenoticia: function (req, res) {
        service.excluirtablenoticia(req.body, function (error, status, message) {
            res.status(status).json({ message: message })
        })
    },
    retornarnoticia: function (res) {
        service.retornarnoticia(function (error, noticia) {
            res.status(httpStatus.OK).json({ noticia: noticia })
        })
    },
    // Gerenciamento da secretaria - Agendamento
    retonargeralhorarioagendamento: function (res) {
        service.retonargeralhorarioagendamento(function (error, status, hour) {
            res.status(status).json({ hour: hour })
        })
    },
    retonargeralusuario: function (res, search) {
        service.retonargeralusuario(search, function (error, status, message, dataUsers) {
            if (status == httpStatus.OK) res.status(status).json({ message: message, dataUsers: dataUsers })
            else res.status(status).json({ message: message })
        })
    },
    retonargeralagendamento: function (res, id, date) {
        service.retonargeralagendamento(id, date, function (error, status, data) {
            res.status(status).json({ data: data, date: date })
        })
    },
    realizargeralagendamento: function (req, res) {
        service.realizargeralagendamento(req.body, function (error, status, message) {
            res.status(status).json({ message: message })
        })
    },
    desmarcargeralagendamento: function (req, res) {
        service.desmarcargeralagendamento(req.body, function (error, status, message) {
            res.status(status).json({ message: message })
        })
    }
}

module.exports = controller
