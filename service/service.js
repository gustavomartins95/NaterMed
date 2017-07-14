'use strict'

const async = require('async'),
    bcrypt = require('bcryptjs'),
    connection = require('../config/connection'),
    httpStatus = require('http-status')

var service = {
    // Registrar novo login/cartão
    register: function (data, callback) {
        let hashedPassword = bcrypt.hashSync(data.txtSenha_Acesso, 10),
            dataAtual = new Date(),
            sql = 'INSERT INTO login (cartaosus_acesso, senha_acesso, data_cadastro) VALUES (?, ?, ?)'
        // Query no Banco de Dados
        connection.query(sql, [data.txtCartaosus_Acesso, hashedPassword, dataAtual], function (error, result) {
            if (error) {
                if (error.code == 'ER_DUP_ENTRY')
                    callback(error, httpStatus.CONFLICT, 'Cartão ' + data.txtCartaosus_Acesso + ' já está em uso.')
                else
                    callback(error, httpStatus.INTERNAL_SERVER_ERROR, 'Desculpe-nos :( Tente novamente.')
            } else {
                callback(null, httpStatus.CREATED, 'Cartão ' + data.txtCartaosus_Acesso + ' cadastrado com sucesso.')
            }
        })
    },
    // Login
    access: function (txtCartaosus_Acesso, txtSenha_Acesso, callback) {
        async.waterfall([
            dbLogin,
            dbPass,
            dbUpdateLastLogin
        ], function (error, status, message, user) {
            if (error) callback(error, status, message)
            else callback(error, status, message, user)
        })
        function dbLogin(cb) {
            let sql = 'SELECT * FROM login WHERE cartaosus_acesso = ? LIMIT 1'
            connection.query(sql, txtCartaosus_Acesso, function (error, result) {
                if (error) {
                    cb(error, httpStatus.INTERNAL_SERVER_ERROR, 'Desculpe-nos :( Tente novamente.')
                } else {
                    if (result == null || result.length == 0) {
                        cb(new Error(), httpStatus.UNAUTHORIZED, 'Cartão não encontrado.')
                    } else {
                        cb(null, result[0])
                    }
                }
            })
        }
        function dbPass(dbResult, cb) {
            if (bcrypt.compareSync(txtSenha_Acesso, dbResult.senha_acesso)) {
                cb(null, dbResult)
            } else {
                cb(new Error(), httpStatus.UNAUTHORIZED, 'Senha inválida.')
            }
        }
        function dbUpdateLastLogin(dbResult, cb) {
            let dataAtual = new Date(),
                sql = 'UPDATE login SET data_ultimo_acesso = ? WHERE idlogin = ?'
            connection.query(sql, [dataAtual, dbResult.idlogin], function (error, result) {
                if (error) {
                    cb(error, httpStatus.INTERNAL_SERVER_ERROR, 'Desculpe-nos :( Tente novamente.')
                } else {
                    cb(null, httpStatus.OK, 'Login efetudado com sucesso.', dbResult)
                }
            })
        }
    }
}

module.exports = service
