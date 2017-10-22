'use strict'

const async = require('async'),
    bcrypt = require('bcryptjs'),
    connection = require('../config/connection'),
    httpStatus = require('http-status')

var service = {
    // Retornar estatística
    retornarestatistica: function (callback) {
        let sql = '(SELECT COUNT(*) AS qtd FROM usuario) ' +
            'UNION ALL ' +
            '(SELECT COUNT(*) FROM agendamento)'
        // Query no Banco de Dados
        connection.query(sql, function (error, result) {
            if (error) {
                callback(error, httpStatus.INTERNAL_SERVER_ERROR, 'Desculpe-nos :( Tente novamente.')
            } else {
                callback(null, result)
            }
        })
    },
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
    },
    /*
        Níveis de acesso:
        3: USUÁRIOS
    */
    // Cadastrar dados dos usuários
    cadastrarusuario: function (data, dataSession, callback) {
        let sql = 'INSERT INTO usuario ' +
            '(login_idlogin, nome_completo, nome_mae, nome_pai, data_nasc, sexo, escolaridade, situacao, estado_civil, ' +
            'naturalidade, cpf, rg, cns, familia, microarea, tipo_sang, email, telefone, celular, ' +
            'estado, cidade, rua, bairro, numero_casa, necessidades_esp, ambulancia) ' +
            'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        // Query no Banco de Dados
        connection.query(sql,
            [dataSession.idlogin, data.txtNome_Completo, data.txtNome_Mae, data.txtNome_Pai, data.txtData_Nasc, data.txtSexo,
            data.txtEscolaridade, data.txtSituacao, data.txtEstado_Civil, data.txtNaturalidade, data.txtCpf, data.txtRg,
            data.txtCns, data.txtFamilia, data.txtMicroarea, data.txtTipo_Sanguineo, data.txtEmail, data.txtTelefone, data.txtCelular,
            data.txtEstado, data.txtCidade, data.txtRua, data.txtBairro, data.txtNumero, data.txtNecessidade, data.txtAmbulancia],
            function (error, result) {
                if (error) {
                    callback(error, httpStatus.INTERNAL_SERVER_ERROR, 'Desculpe-nos :( Tente novamente.')
                } else {
                    callback(null, httpStatus.OK, 'Cadastrado com sucesso.')
                }
            })
    },
    // Editar login do usuário
    editarloginusuario: function (data, dataSession, callback) {
        let hashedPassword = bcrypt.hashSync(data.txtSenha_Acesso, 10),
            sql = 'UPDATE login SET ' +
                'cartaosus_acesso=?, senha_acesso=? ' +
                'WHERE idlogin = ?'
        // Query no Banco de Dados
        connection.query(sql,
            [data.txtCartaosus_Acesso, hashedPassword, dataSession.idlogin],
            function (error, result) {
                if (error) {
                    if (error.code == 'ER_DUP_ENTRY')
                        callback(error, httpStatus.CONFLICT, 'Cartão ' + data.txtCartaosus_Acesso + ' já está em uso.')
                    else
                        callback(error, httpStatus.INTERNAL_SERVER_ERROR, 'Desculpe-nos :( Tente novamente.')
                } else {
                    callback(null, httpStatus.OK, 'Login atualizado com sucesso.')
                }
            })
    },
    // Retornar login dos usuários
    retornarloginusuario: function (dataSession, callback) {
        let sql = 'SELECT cartaosus_acesso FROM login WHERE idlogin = ?'
        // Query no Banco de Dados
        connection.query(sql, [dataSession.idlogin], function (error, result) {
            if (error) {
                callback(error, httpStatus.INTERNAL_SERVER_ERROR, 'Desculpe-nos :( Tente novamente.')
            } else {
                callback(null, result)
            }
        })
    },
    // Editar dados do usuário
    editarusuario: function (data, dataSession, callback) {
        connection.beginTransaction(function (err) {
            if (err) { throw err }
            async.waterfall([
                dbEditarUsuario,
                dbEditarAgendamento
            ], function (error, status, message) {
                if (error) {
                    return connection.rollback(function () {
                        callback(error, status, message)
                    })
                } else {
                    connection.commit(function (err) {
                        if (err) {
                            return connection.rollback(function () {
                                callback(err, httpStatus.INTERNAL_SERVER_ERROR, 'Desculpe-nos :( Tente novamente.')
                            })
                        }
                        callback(error, status, message)
                    })
                }
            })
            function dbEditarUsuario(cb) {
                let sql = 'UPDATE usuario SET ' +
                    'nome_completo=?, nome_mae=?, nome_pai=?, data_nasc=?, sexo=?, escolaridade=?, situacao=?, estado_civil=?, ' +
                    'naturalidade=?, cpf=?, rg=?, cns=?, tipo_sang=?, email=?, telefone=?, celular=?, ' +
                    'estado=?, cidade=?, rua=?, bairro=?, numero_casa=?, necessidades_esp=?, ambulancia=? ' +
                    'WHERE idusuario = ? && login_idlogin = ?'
                // Query no Banco de Dados
                connection.query(sql,
                    [data.txtNome_Completo, data.txtNome_Mae, data.txtNome_Pai, data.txtData_Nasc, data.txtSexo,
                    data.txtEscolaridade, data.txtSituacao, data.txtEstado_Civil, data.txtNaturalidade, data.txtCpf, data.txtRg,
                    data.txtCns, data.txtTipo_Sanguineo, data.txtEmail, data.txtTelefone, data.txtCelular,
                    data.txtEstado, data.txtCidade, data.txtRua, data.txtBairro, data.txtNumero, data.txtNecessidade, data.txtAmbulancia,
                    dataSession.idusuario, dataSession.idlogin],
                    function (error, result) {
                        if (error) {
                            cb(error, httpStatus.INTERNAL_SERVER_ERROR, 'Desculpe-nos :( Tente novamente.')
                        } else {
                            cb(null)
                        }
                    })
            }
            function dbEditarAgendamento(cb) {
                let sql = 'UPDATE agendamento SET ' +
                    'nome_completo_usuario=?, necessidades_esp=?, ambulancia=? ' +
                    'WHERE usuario_idusuario = ?'
                // Query no Banco de Dados
                connection.query(sql,
                    [data.txtNome_Completo, data.txtNecessidade, data.txtAmbulancia, dataSession.idusuario],
                    function (error, result) {
                        if (error) {
                            cb(error, httpStatus.INTERNAL_SERVER_ERROR, 'Desculpe-nos :( Tente novamente.')
                        } else {
                            cb(null, httpStatus.OK, 'Usuário atualizado com sucesso.')
                        }
                    })
            }
        })
    },
    // Retornar dados dos usuários
    retornardadosusuario: function (dataSession, callback) {
        let sql = 'SELECT * FROM usuario WHERE idusuario = ? && login_idlogin = ?'
        // Query no Banco de Dados
        connection.query(sql, [dataSession.idusuario, dataSession.idlogin], function (error, result) {
            if (error) {
                callback(error, httpStatus.INTERNAL_SERVER_ERROR, 'Desculpe-nos :( Tente novamente.')
            } else {
                callback(null, result)
            }
        })
    },
    // Excluir dados do usuário
    excluirusuario: function (dataSession, callback) {
        connection.beginTransaction(function (err) {
            if (err) { throw err }
            async.waterfall([
                dbExcluirAgendamento,
                dbExcluirUsuario
            ], function (error, status, message) {
                if (error) {
                    return connection.rollback(function () {
                        callback(error, status, message)
                    })
                } else {
                    connection.commit(function (err) {
                        if (err) {
                            return connection.rollback(function () {
                                callback(err, httpStatus.INTERNAL_SERVER_ERROR, 'Desculpe-nos :( Tente novamente.')
                            })
                        }
                        callback(error, status, message)
                    })
                }
            })
            function dbExcluirAgendamento(cb) {
                let sql = 'DELETE FROM agendamento WHERE usuario_idusuario = ?'
                // Query no Banco de Dados
                connection.query(sql, [dataSession.idusuario], function (error, result) {
                    if (error) {
                        cb(error, httpStatus.INTERNAL_SERVER_ERROR, 'Desculpe-nos :( Tente novamente.')
                    } else {
                        cb(null)
                    }
                })
            }
            function dbExcluirUsuario(cb) {
                let sql = 'DELETE FROM usuario WHERE idusuario = ? && login_idlogin = ?'
                // Query no Banco de Dados
                connection.query(sql, [dataSession.idusuario, dataSession.idlogin], function (error, result) {
                    if (error) {
                        cb(error, httpStatus.INTERNAL_SERVER_ERROR, 'Desculpe-nos :( Tente novamente.')
                    } else {
                        cb(null, httpStatus.OK, 'Usuário excluído com sucesso. Você será redirecionado a seleção de usuário existente.')
                    }
                })
            }
        })
    },
    // Retornar as cidades
    retornarcidades: function (estado, callback) {
        let sql = 'SELECT nome FROM cidades WHERE estados = ?'
        // Query no Banco de Dados
        connection.query(sql, [estado], function (error, result) {
            if (error) {
                callback(error, httpStatus.INTERNAL_SERVER_ERROR, 'Desculpe-nos :( Tente novamente.')
            } else {
                callback(null, result)
            }
        })
    },
    // Retornar dados dos usuários
    retornarusuario: function (dataSession, callback) {
        let sql = 'SELECT idusuario, nome_completo FROM usuario WHERE login_idlogin = ?'
        // Query no Banco de Dados
        connection.query(sql, [dataSession.idlogin], function (error, result) {
            if (error) {
                callback(error, httpStatus.INTERNAL_SERVER_ERROR, 'Desculpe-nos :( Tente novamente.')
            } else {
                callback(null, result)
            }
        })
    },
    // Operações do agendar consulta
    retonarhorarioagendamento: function (callback) {
        let sql = 'SELECT * FROM horario WHERE profissional_especialidade="Clínico Geral" || profissional_especialidade="Pediatra"'
        // Query no Banco de Dados
        connection.query(sql, function (error, result) {
            if (error) {
                callback(error, httpStatus.INTERNAL_SERVER_ERROR, 'Desculpe-nos :( Tente novamente.')
            } else {
                callback(null, httpStatus.OK, result)
            }
        })
    },
    retonaragendamento: function (id, date, callback) {
        let sql = 'SELECT * FROM agendamento WHERE profissional_idprofissional = ? && ' +
            'data_agendamento = ? ORDER BY numero_ficha'
        // Query no Banco de Dados
        connection.query(sql, [id, date], function (error, result) {
            if (error) {
                callback(error, httpStatus.INTERNAL_SERVER_ERROR, 'Desculpe-nos :( Tente novamente.')
            } else {
                callback(null, httpStatus.OK, result)
            }
        })
    },
    realizaragendamento: function (data, dataSession, callback) {
        async.waterfall([
            dbNecessAmbu,
            dbCheckIdUser,
            dbCheckDate,
            dbMark
        ], function (error, status, message) {
            callback(error, status, message)
        })
        function dbNecessAmbu(cb) {
            let sql = 'SELECT necessidades_esp, ambulancia, nome_completo FROM usuario WHERE idusuario = ?'
            connection.query(sql, [dataSession.idusuario], function (error, result) {
                if (error) {
                    cb(error, httpStatus.INTERNAL_SERVER_ERROR, 'Desculpe-nos :( Tente novamente.')
                } else {
                    cb(null, result[0])
                }
            })
        }
        function dbCheckIdUser(dbResult, cb) {
            let sql = 'SELECT idagendamento FROM agendamento WHERE data_agendamento = ? ' +
                '&& usuario_idusuario = ? && profissional_idprofissional = ?'
            connection.query(sql, [data.date, dataSession.idusuario, data.id_profissional], function (error, result) {
                if (error) {
                    cb(error, httpStatus.INTERNAL_SERVER_ERROR, 'Desculpe-nos :( Tente novamente.')
                } else {
                    if (result == null || result.length == 0)
                        cb(null, dbResult)
                    else
                        cb(new Error(), httpStatus.UNAUTHORIZED, 'Não é possível marcar mais de uma consulta por usuário no dia.')
                }
            })
        }
        function dbCheckDate(dbResult, cb) {
            let sql = 'SELECT idagendamento FROM agendamento WHERE data_agendamento = ? ' +
                '&& numero_ficha = ? && profissional_idprofissional = ?'
            connection.query(sql, [data.date, data.ficha, data.id_profissional], function (error, result) {
                if (error) {
                    cb(error, httpStatus.INTERNAL_SERVER_ERROR, 'Desculpe-nos :( Tente novamente.')
                } else {
                    if (result == null || result.length == 0)
                        cb(null, dbResult)
                    else
                        cb(new Error(), httpStatus.CONFLICT, 'Ficha já está em uso.')
                }
            })
        }
        function dbMark(dbResult, cb) {
            let sql = 'INSERT INTO agendamento ' +
                '(profissional_idprofissional, usuario_idusuario, ' +
                'profissional_nome_completo, profissional_especialidade, nome_completo_usuario, ' +
                'data_agendamento, numero_ficha, necessidades_esp, ambulancia)' +
                ' VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
            connection.query(sql,
                [data.id_profissional, dataSession.idusuario, data.nome_profissional, data.especialidade,
                dbResult.nome_completo, data.date, data.ficha, dbResult.necessidades_esp, dbResult.ambulancia],
                function (error, result) {
                    if (error) {
                        cb(error, httpStatus.INTERNAL_SERVER_ERROR, 'Desculpe-nos :( Tente novamente.')
                    } else {
                        cb(null, httpStatus.OK, 'Agendamento realizado com sucesso.')
                    }
                })
        }
    },
    desmarcaragendamento: function (data, dataSession, callback) {
        let sql = 'DELETE FROM agendamento WHERE data_agendamento = ? && numero_ficha = ? && usuario_idusuario = ?'
        // Query no Banco de Dados
        connection.query(sql, [data.date, data.ficha, dataSession.idusuario], function (error, result) {
            if (error) {
                callback(error, httpStatus.INTERNAL_SERVER_ERROR, 'Desculpe-nos :( Tente novamente.')
            } else {
                callback(null, httpStatus.OK, 'Consulta desmarcada com sucesso.')
            }
        })
    },
    retornartablemarcadas: function (dataSession, callback) {
        let sql = 'SELECT profissional_nome_completo, profissional_especialidade, ' +
            'DATE_FORMAT(data_agendamento, "%d-%m-%Y") AS data_agend_format, ' +
            'numero_ficha, DATEDIFF(data_agendamento, CURRENT_DATE) AS faltam FROM agendamento ' +
            'WHERE data_agendamento >= CURRENT_DATE && usuario_idusuario = ? ' +
            'ORDER BY data_agendamento ASC'
        // Query no Banco de Dados
        connection.query(sql, [dataSession.idusuario], function (error, result) {
            if (error) {
                callback(error, httpStatus.INTERNAL_SERVER_ERROR, 'Desculpe-nos :( Tente novamente.')
            } else {
                callback(null, result)
            }
        })
    },
    /* Operações do relatório */
    retornarrelatoriousuario: function (data, dataSession, callback) {
        let sql = 'SELECT profissional_nome_completo, EXTRACT(MONTH FROM data_agendamento) AS mes, ' +
            'COUNT(*) as qtd_agen FROM agendamento WHERE usuario_idusuario = ? AND ' +
            'EXTRACT(YEAR FROM data_agendamento) = ? ' +
            'GROUP BY profissional_nome_completo, EXTRACT(MONTH FROM data_agendamento) ' +
            'ORDER BY EXTRACT(MONTH FROM data_agendamento)'
        // Query no Banco de Dados
        connection.query(sql, [dataSession.idusuario, data.txtAno], function (error, result) {
            if (error) {
                callback(error, httpStatus.INTERNAL_SERVER_ERROR, 'Desculpe-nos :( Tente novamente.')
            } else {
                if (result == null || result.length == 0)
                    callback(new Error(), httpStatus.UNAUTHORIZED, 'Nenhum resultado encontrado.')
                else
                    callback(null, httpStatus.OK, 'Resultados encontrados.', result)
            }
        })
    },
    alertaragendamento: function (dataSession, callback) {
        let sql = 'SELECT usuario_idusuario, profissional_nome_completo, profissional_especialidade, ' +
            'DATE_FORMAT(data_agendamento, "%d-%m-%Y") AS data_agend_format, numero_ficha, ' +
            'DATEDIFF(data_agendamento, CURRENT_DATE) AS faltam FROM agendamento ' +
            'WHERE data_agendamento >= CURRENT_DATE && usuario_idusuario = ? && ' +
            '(DATEDIFF(data_agendamento, CURRENT_DATE)<=3) ORDER BY data_agendamento ASC'
        // Query no Banco de Dados
        connection.query(sql, [dataSession.idusuario], function (error, result) {
            if (error) {
                callback(error, httpStatus.INTERNAL_SERVER_ERROR, 'Desculpe-nos :( Tente novamente.')
            } else {
                callback(null, httpStatus.OK, 'Resultados encontrados.', result)
            }
        })
    },
    /*
        Níveis de acesso:
        2: PROFISSIONAL
    */
    // Retornar dados dos profissionais
    retornarprofissional: function (dataSession, callback) {
        let sql = 'SELECT idprofissional, nome_completo FROM profissional WHERE login_idlogin = ?'
        // Query no Banco de Dados
        connection.query(sql, [dataSession.idlogin], function (error, result) {
            if (error) {
                callback(error, httpStatus.INTERNAL_SERVER_ERROR, 'Desculpe-nos :( Tente novamente.')
            } else {
                callback(null, result)
            }
        })
    },
    /*
        Níveis de acesso:
        1: SECRETARIA
    */
    // Retornar dados da secretaria
    retornarsecretaria: function (dataSession, callback) {
        let sql = 'SELECT idsecretaria, nome_completo FROM secretaria WHERE login_idlogin = ?'
        // Query no Banco de Dados
        connection.query(sql, [dataSession.idlogin], function (error, result) {
            if (error) {
                callback(error, httpStatus.INTERNAL_SERVER_ERROR, 'Desculpe-nos :( Tente novamente.')
            } else {
                callback(null, result)
            }
        })
    },
    // Editar login do secretaria
    editarloginsecretaria: function (data, dataSession, callback) {
        let hashedPassword = bcrypt.hashSync(data.txtSenha_Acesso, 10),
            sql = 'UPDATE login SET senha_acesso = ? WHERE idlogin = ?'
        // Query no Banco de Dados
        connection.query(sql, [hashedPassword, dataSession.idlogin], function (error, result) {
            if (error) {
                callback(error, httpStatus.INTERNAL_SERVER_ERROR, 'Desculpe-nos :( Tente novamente.')
            } else {
                callback(null, httpStatus.OK, 'Login atualizado com sucesso.')
            }
        })
    },
    /* Operações do profissional */
    cadastrarprofissional: function (data, callback) {
        let sql = 'INSERT INTO profissional ' +
            '(especialidade, nome_completo, data_nasc, naturalidade, sexo, ' +
            'estado, cidade, rua, bairro, numero_casa, celular, telefone, email, cpf, rg, cns) ' +
            'VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
        // Query no Banco de Dados
        connection.query(sql,
            [data.txtEspecialidade, data.txtNome_Completo, data.txtData_Nasc, data.txtNaturalidade, data.txtSexo,
            data.txtEstado, data.txtCidade, data.txtRua, data.txtBairro, data.txtNumero, data.txtCelular,
            data.txtTelefone, data.txtEmail, data.txtCpf, data.txtRg, data.txtCns],
            function (error, result) {
                if (error) {
                    callback(error, httpStatus.INTERNAL_SERVER_ERROR, 'Desculpe-nos :( Tente novamente.')
                } else {
                    callback(null, httpStatus.OK, 'Cadastrado com sucesso.')
                }
            })
    },
    retornartableprofissional: function (callback) {
        let sql = 'SELECT * FROM profissional ORDER BY especialidade'
        // Query no Banco de Dados
        connection.query(sql, function (error, result) {
            if (error) {
                callback(error, httpStatus.INTERNAL_SERVER_ERROR, 'Desculpe-nos :( Tente novamente.')
            } else {
                callback(null, result)
            }
        })
    },
    retornareditartableprofissional: function (idprofissional, callback) {
        let sql = 'SELECT * FROM profissional WHERE idprofissional=? LIMIT 1'
        // Query no Banco de Dados
        connection.query(sql, [idprofissional], function (error, result) {
            if (error) {
                callback(error, httpStatus.INTERNAL_SERVER_ERROR, 'Desculpe-nos :( Tente novamente.')
            } else {
                callback(null, result)
            }
        })
    },
    editarprofissional: function (data, callback) {
        connection.beginTransaction(function (err) {
            if (err) { throw err }
            async.waterfall([
                dbSelectAgendamento,
                dbUpdateProfissional,
                dbUpdateHorario,
                dbUpdateAgendamento
            ], function (error, status, message) {
                if (error) {
                    return connection.rollback(function () {
                        callback(error, status, message)
                    })
                } else {
                    connection.commit(function (err) {
                        if (err) {
                            return connection.rollback(function () {
                                callback(err, httpStatus.INTERNAL_SERVER_ERROR, 'Desculpe-nos :( Tente novamente.')
                            })
                        }
                        callback(error, status, message)
                    })
                }
            })
            function dbSelectAgendamento(cb) {
                let sql = 'SELECT profissional_especialidade FROM agendamento ' +
                    'WHERE profissional_idprofissional=?'
                // Query no Banco de Dados
                connection.query(sql, [data.txtIdProfissional], function (error, result) {
                    if (error) {
                        cb(error, httpStatus.INTERNAL_SERVER_ERROR, 'Desculpe-nos :( Tente novamente.')
                    } else {
                        if (result == null || result.length == 0)
                            cb(null)
                        else {
                            if (result[0].profissional_especialidade == data.txtEspecialidade)
                                cb(null)
                            else
                                cb(new Error(), httpStatus.UNAUTHORIZED, 'Não é possível atualizar a especialidade caso haja consulta agendada.')
                        }
                    }
                })
            }
            function dbUpdateProfissional(cb) {
                let sql = 'UPDATE profissional SET ' +
                    'nome_completo=?, especialidade=?, naturalidade=?, sexo=?, data_nasc=?, cpf=?, rg=?, cns=?, ' +
                    'estado=?, cidade=?, rua=?, bairro=?, numero_casa=?, celular=?, telefone=?, email=? ' +
                    'WHERE idprofissional=?'
                // Query no Banco de Dados
                connection.query(sql,
                    [data.txtNome_Completo, data.txtEspecialidade, data.txtNaturalidade, data.txtSexo, data.txtData_Nasc,
                    data.txtCpf, data.txtRg, data.txtCns, data.txtEstado, data.txtCidade, data.txtRua, data.txtBairro,
                    data.txtNumero, data.txtCelular, data.txtTelefone, data.txtEmail, data.txtIdProfissional],
                    function (error, result) {
                        if (error) {
                            cb(error, httpStatus.INTERNAL_SERVER_ERROR, 'Desculpe-nos :( Tente novamente.')
                        } else {
                            cb(null)
                        }
                    })
            }
            function dbUpdateHorario(cb) {
                let sql = 'UPDATE horario SET ' +
                    'profissional_nome_completo=?, profissional_especialidade=? ' +
                    'WHERE profissional_idprofissional=?'
                // Query no Banco de Dados
                connection.query(sql, [data.txtNome_Completo, data.txtEspecialidade, data.txtIdProfissional],
                    function (error, result) {
                        if (error) {
                            cb(error, httpStatus.INTERNAL_SERVER_ERROR, 'Desculpe-nos :( Tente novamente.')
                        } else {
                            cb(null)
                        }
                    })
            }
            function dbUpdateAgendamento(cb) {
                let sql = 'UPDATE agendamento SET ' +
                    'profissional_nome_completo=?, profissional_especialidade=? ' +
                    'WHERE profissional_idprofissional=?'
                // Query no Banco de Dados
                connection.query(sql, [data.txtNome_Completo, data.txtEspecialidade, data.txtIdProfissional],
                    function (error, result) {
                        if (error) {
                            cb(error, httpStatus.INTERNAL_SERVER_ERROR, 'Desculpe-nos :( Tente novamente.')
                        } else {
                            cb(null, httpStatus.OK, 'Profissional atualizado com sucesso.')
                        }
                    })
            }
        })
    },
    excluirtableprofissional: function (data, callback) {
        connection.beginTransaction(function (err) {
            if (err) { throw err }
            async.waterfall([
                dbSelectAgendamento,
                dbExcluirHorario,
                dbExcluirProfissional
            ], function (error, status, message) {
                if (error) {
                    return connection.rollback(function () {
                        callback(error, status, message)
                    })
                } else {
                    connection.commit(function (err) {
                        if (err) {
                            return connection.rollback(function () {
                                callback(err, httpStatus.INTERNAL_SERVER_ERROR, 'Desculpe-nos :( Tente novamente.')
                            })
                        }
                        callback(error, status, message)
                    })
                }
            })
            function dbSelectAgendamento(cb) {
                let sql = 'SELECT idagendamento FROM agendamento ' +
                    'WHERE profissional_idprofissional=?'
                // Query no Banco de Dados
                connection.query(sql, [data.id], function (error, result) {
                    if (error) {
                        cb(error, httpStatus.INTERNAL_SERVER_ERROR, 'Desculpe-nos :( Tente novamente.')
                    } else {
                        if (result == null || result.length == 0)
                            cb(null)
                        else {
                            cb(new Error(), httpStatus.UNAUTHORIZED, 'Não é possível excluir profissional caso haja consulta agendada.')
                        }
                    }
                })
            }
            function dbExcluirHorario(cb) {
                let sql = 'DELETE FROM horario WHERE profissional_idprofissional = ?'
                // Query no Banco de Dados
                connection.query(sql, [data.id], function (error, result) {
                    if (error) {
                        cb(error, httpStatus.INTERNAL_SERVER_ERROR, 'Desculpe-nos :( Tente novamente.')
                    } else {
                        cb(null)
                    }
                })
            }
            function dbExcluirProfissional(cb) {
                let sql = 'DELETE FROM profissional WHERE idprofissional = ?'
                // Query no Banco de Dados
                connection.query(sql, [data.id], function (error, result) {
                    if (error) {
                        cb(error, httpStatus.INTERNAL_SERVER_ERROR, 'Desculpe-nos :( Tente novamente.')
                    } else {
                        cb(null, httpStatus.OK, 'Profissional excluído com sucesso.')
                    }
                })
            }
        })
    },
    /* Operações do horário */
    cadastrarhorario: function (data, callback) {
        async.waterfall([
            dbProfissional,
            dbHorario
        ], function (error, status, message) {
            callback(error, status, message)
        })
        function dbProfissional(cb) {
            let sql = 'SELECT idprofissional, nome_completo, especialidade ' +
                'FROM profissional WHERE idprofissional = ? LIMIT 1'
            // Query no Banco de Dados
            connection.query(sql, [data.txtProfissional], function (error, result) {
                if (error) {
                    cb(error, httpStatus.INTERNAL_SERVER_ERROR, 'Desculpe-nos :( Tente novamente.')
                } else {
                    cb(null, result[0])
                }
            })
        }
        function dbHorario(dbResult, cb) {
            let sql = 'INSERT INTO horario ' +
                '(profissional_idprofissional, profissional_nome_completo, profissional_especialidade, diamo, horamo, ' +
                'fichamo, diatu, horatu, fichatu, diawe, horawe, fichawe, diath, horath, fichath, diafr, horafr, fichafr) ' +
                'VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
            // Query no Banco de Dados
            connection.query(sql,
                [dbResult.idprofissional, dbResult.nome_completo, dbResult.especialidade,
                data.txt_diamo, data.txt_horamo, data.txt_fichamo,
                data.txt_diatu, data.txt_horatu, data.txt_fichatu,
                data.txt_diawe, data.txt_horawe, data.txt_fichawe,
                data.txt_diath, data.txt_horath, data.txt_fichath,
                data.txt_diafr, data.txt_horafr, data.txt_fichafr],
                function (error, result) {
                    if (error) {
                        if (error.code == 'ER_DUP_ENTRY')
                            cb(error, httpStatus.CONFLICT, 'Só é possível cadastrar um horário por profissional.')
                        else
                            cb(error, httpStatus.INTERNAL_SERVER_ERROR, 'Desculpe-nos :( Tente novamente.')
                    } else {
                        cb(null, httpStatus.OK, 'Cadastrado com sucesso.')
                    }
                })
        }
    },
    retornarprofcadastrarhorario: function (callback) {
        let sql = 'SELECT idprofissional, nome_completo, especialidade FROM profissional'
        // Query no Banco de Dados
        connection.query(sql, function (error, result) {
            if (error) {
                callback(error, httpStatus.INTERNAL_SERVER_ERROR, 'Desculpe-nos :( Tente novamente.')
            } else {
                callback(null, result)
            }
        })
    },
    retornartablehorario: function (callback) {
        let sql = 'SELECT * FROM horario ORDER BY profissional_especialidade'
        // Query no Banco de Dados
        connection.query(sql, function (error, result) {
            if (error) {
                callback(error, httpStatus.INTERNAL_SERVER_ERROR, 'Desculpe-nos :( Tente novamente.')
            } else {
                callback(null, result)
            }
        })
    },
    retornareditartablehorario: function (idhorario, callback) {
        let sql = 'SELECT * FROM horario WHERE idhorario=? LIMIT 1'
        // Query no Banco de Dados
        connection.query(sql, [idhorario], function (error, result) {
            if (error) {
                callback(error, httpStatus.INTERNAL_SERVER_ERROR, 'Desculpe-nos :( Tente novamente.')
            } else {
                callback(null, result)
            }
        })
    },
    editarhorario: function (data, callback) {
        let sql = 'UPDATE horario SET ' +
            'diamo=?, horamo=?, fichamo=?, diatu=?, horatu=?, fichatu=?, diawe=?, horawe=?, fichawe=?, ' +
            'diath=?, horath=?, fichath=?, diafr=?, horafr=?, fichafr=? ' +
            'WHERE profissional_idprofissional=?'
        // Query no Banco de Dados
        connection.query(sql,
            [data.txt_diamo, data.txt_horamo, data.txt_fichamo,
            data.txt_diatu, data.txt_horatu, data.txt_fichatu,
            data.txt_diawe, data.txt_horawe, data.txt_fichawe,
            data.txt_diath, data.txt_horath, data.txt_fichath,
            data.txt_diafr, data.txt_horafr, data.txt_fichafr, data.txtProfissional],
            function (error, result) {
                if (error) {
                    callback(error, httpStatus.INTERNAL_SERVER_ERROR, 'Desculpe-nos :( Tente novamente.')
                } else {
                    callback(null, httpStatus.OK, 'Horário atualizado com sucesso.')
                }
            })
    },
    excluirtablehorario: function (data, callback) {
        async.waterfall([
            dbIdProfissional,
            dbAgendamento,
            dbExcluirHorario
        ], function (error, status, message) {
            callback(error, status, message)
        })
        function dbIdProfissional(cb) {
            let sql = 'SELECT profissional_idprofissional FROM horario WHERE idhorario = ?'
            // Query no Banco de Dados
            connection.query(sql, [data.id], function (error, result) {
                if (error) {
                    cb(error, httpStatus.INTERNAL_SERVER_ERROR, 'Desculpe-nos :( Tente novamente.')
                } else {
                    cb(null, result[0])
                }
            })
        }
        function dbAgendamento(dbResult, cb) {
            let sql = 'SELECT idagendamento FROM agendamento ' +
                'WHERE profissional_idprofissional=?'
            // Query no Banco de Dados
            connection.query(sql, [dbResult.profissional_idprofissional], function (error, result) {
                if (error) {
                    cb(error, httpStatus.INTERNAL_SERVER_ERROR, 'Desculpe-nos :( Tente novamente.')
                } else {
                    if (result == null || result.length == 0)
                        cb(null)
                    else {
                        cb(new Error(), httpStatus.UNAUTHORIZED, 'Não é possível excluir profissional caso haja consulta agendada.')
                    }
                }
            })
        }
        function dbExcluirHorario(cb) {
            let sql = 'DELETE FROM horario WHERE idhorario = ?'
            // Query no Banco de Dados
            connection.query(sql, [data.id], function (error, result) {
                if (error) {
                    cb(error, httpStatus.INTERNAL_SERVER_ERROR, 'Desculpe-nos :( Tente novamente.')
                } else {
                    cb(null, httpStatus.OK, 'Horário excluído com sucesso.')
                }
            })
        }
    },
    /* Operações do medicamento */
    cadastrarmedicamento: function (data, idsecretaria, callback) {
        let sql = 'INSERT INTO medicamento (secretaria_idsecretaria, nome, posologia, laboratorio, ' +
            'via_administracao, generico, estoque) VALUES (?, ?, ?, ?, ?, ?, ?)'
        // Query no Banco de Dados
        connection.query(sql,
            [idsecretaria, data.txtNome, data.txtPosologia, data.txtLaboratorio,
                data.txtViaAdministracao, data.txtGenerico, data.txtEstoque],
            function (error, result) {
                if (error) {
                    callback(error, httpStatus.INTERNAL_SERVER_ERROR, 'Desculpe-nos :( Tente novamente.')
                } else {
                    callback(null, httpStatus.OK, 'Cadastrado com sucesso.')
                }
            })
    },
    retornartablemedicamento: function (callback) {
        let sql = 'SELECT * FROM medicamento ORDER BY nome'
        // Query no Banco de Dados
        connection.query(sql, function (error, result) {
            if (error) {
                callback(error, httpStatus.INTERNAL_SERVER_ERROR, 'Desculpe-nos :( Tente novamente.')
            } else {
                callback(null, result)
            }
        })
    },
    retornareditartablemedicamento: function (idmedicamento, callback) {
        let sql = 'SELECT * FROM medicamento WHERE idmedicamento=? LIMIT 1'
        // Query no Banco de Dados
        connection.query(sql, [idmedicamento], function (error, result) {
            if (error) {
                callback(error, httpStatus.INTERNAL_SERVER_ERROR, 'Desculpe-nos :( Tente novamente.')
            } else {
                callback(null, result)
            }
        })
    },
    editarmedicamento: function (data, callback) {
        let sql = 'UPDATE medicamento SET ' +
            'nome=?, posologia=?, laboratorio=?, via_administracao=?, generico=?, estoque=? ' +
            'WHERE idmedicamento=?'
        // Query no Banco de Dados
        connection.query(sql,
            [data.txtNome, data.txtPosologia, data.txtLaboratorio, data.txtViaAdministracao,
            data.txtGenerico, data.txtEstoque, data.txtIdMedicamento],
            function (error, result) {
                if (error) {
                    callback(error, httpStatus.INTERNAL_SERVER_ERROR, 'Desculpe-nos :( Tente novamente.')
                } else {
                    callback(null, httpStatus.OK, 'Medicamento atualizado com sucesso.')
                }
            })
    },
    excluirtablemedicamento: function (data, callback) {
        let sql = 'DELETE FROM medicamento WHERE idmedicamento = ?'
        // Query no Banco de Dados
        connection.query(sql, [data.id], function (error, result) {
            if (error) {
                callback(error, httpStatus.INTERNAL_SERVER_ERROR, 'Desculpe-nos :( Tente novamente.')
            } else {
                callback(null, httpStatus.OK, 'Medicamento excluído com sucesso.')
            }
        })
    },
    buscartablemedicamento: function (search, callback) {
        async.waterfall([
            dbSql,
            dbPesquisar
        ], function (error, status, message, medicamento) {
            callback(error, status, message, medicamento)
        })
        function dbSql(cb) {
            if (search.opcao == "Todos") {
                let sql = 'SELECT * FROM medicamento ORDER BY nome'
                cb(null, sql)
            } else if (search.opcao == "Nome") {
                let sql = 'SELECT * FROM medicamento WHERE nome LIKE "%' + search.pesquisar + '%"' +
                    'ORDER BY nome'
                cb(null, sql)
            } else {
                let sql = 'SELECT * FROM medicamento WHERE estoque = "' + (search.opcao == "Disponível" ? "1" : "0") + '" ORDER BY nome'
                cb(null, sql)
            }
        }
        function dbPesquisar(sql, cb) {
            // Query no Banco de Dados
            connection.query(sql, function (error, result) {
                if (error) {
                    cb(error, httpStatus.INTERNAL_SERVER_ERROR, 'Desculpe-nos :( Tente novamente.')
                } else {
                    if (result == null || result.length == 0)
                        cb(null, httpStatus.UNAUTHORIZED, 'Nenhum resultado encontrado.')
                    else
                        cb(null, httpStatus.OK, result.length + ' medicamento(os) encontrado(os).', result)
                }
            })
        }
    },
    /* Operações da notícia */
    cadastrarnoticia: function (data, idsecretaria, callback) {
        let dataAtual = new Date(),
            sql = 'INSERT INTO noticia (secretaria_idsecretaria, data_publicacao, titulo, texto, ' +
                'inicio, termino) VALUES (?, ?, ?, ?, ?, ?)'
        // Query no Banco de Dados
        connection.query(sql,
            [idsecretaria, dataAtual, data.txtTitulo, data.txtTexto, data.txtData_Inicio, data.txtData_Termino],
            function (error, result) {
                if (error) {
                    callback(error, httpStatus.INTERNAL_SERVER_ERROR, 'Desculpe-nos :( Tente novamente.')
                } else {
                    callback(null, httpStatus.OK, 'Cadastrado com sucesso.')
                }
            })
    },
    retornartablenoticia: function (callback) {
        let sql = 'SELECT DATE_FORMAT(data_publicacao, "%d/%m/%Y") AS data_publicacao, ' +
            'idnoticia, titulo, texto, inicio, termino FROM noticia ORDER BY idnoticia DESC'
        // Query no Banco de Dados
        connection.query(sql, function (error, result) {
            if (error) {
                callback(error, httpStatus.INTERNAL_SERVER_ERROR, 'Desculpe-nos :( Tente novamente.')
            } else {
                callback(null, result)
            }
        })
    },
    retornareditartablenoticia: function (idnoticia, callback) {
        let sql = 'SELECT * FROM noticia WHERE idnoticia=? LIMIT 1'
        // Query no Banco de Dados
        connection.query(sql, [idnoticia], function (error, result) {
            if (error) {
                callback(error, httpStatus.INTERNAL_SERVER_ERROR, 'Desculpe-nos :( Tente novamente.')
            } else {
                callback(null, result)
            }
        })
    },
    editarnoticia: function (data, callback) {
        let sql = 'UPDATE noticia SET ' +
            'titulo=?, texto=?, inicio=?, termino=? ' +
            'WHERE idnoticia=?'
        // Query no Banco de Dados
        connection.query(sql,
            [data.txtTitulo, data.txtTexto, data.txtData_Inicio, data.txtData_Termino, data.txtIdNoticia],
            function (error, result) {
                if (error) {
                    callback(error, httpStatus.INTERNAL_SERVER_ERROR, 'Desculpe-nos :( Tente novamente.')
                } else {
                    callback(null, httpStatus.OK, 'Notícia atualizada com sucesso.')
                }
            })
    },
    excluirtablenoticia: function (data, callback) {
        let sql = 'DELETE FROM noticia WHERE idnoticia = ?'
        // Query no Banco de Dados
        connection.query(sql, [data.id], function (error, result) {
            if (error) {
                callback(error, httpStatus.INTERNAL_SERVER_ERROR, 'Desculpe-nos :( Tente novamente.')
            } else {
                callback(null, httpStatus.OK, 'Notícia excluída com sucesso.')
            }
        })
    },
    retornarnoticia: function (callback) {
        let sql = 'SELECT DATE_FORMAT(data_publicacao, "%d/%m/%Y") AS data_publicacao, ' +
            'titulo, texto, inicio, termino FROM noticia ORDER BY idnoticia DESC'
        // Query no Banco de Dados
        connection.query(sql, function (error, result) {
            if (error) {
                callback(error, httpStatus.INTERNAL_SERVER_ERROR, 'Desculpe-nos :( Tente novamente.')
            } else {
                callback(null, result)
            }
        })
    },
    /* Operações do usuário */
    retornartablegeralusuario: function (callback) {
        let sql = 'SELECT idusuario, familia, microarea, nome_mae, nome_completo, cpf, rg, cns FROM usuario ORDER BY nome_completo'
        // Query no Banco de Dados
        connection.query(sql, function (error, result) {
            if (error) {
                callback(error, httpStatus.INTERNAL_SERVER_ERROR, 'Desculpe-nos :( Tente novamente.')
            } else {
                callback(null, result)
            }
        })
    },
    retornareditartablegeralusuario: function (idusuario, callback) {
        let sql = 'SELECT * FROM usuario WHERE idusuario=? LIMIT 1'
        // Query no Banco de Dados
        connection.query(sql, [idusuario], function (error, result) {
            if (error) {
                callback(error, httpStatus.INTERNAL_SERVER_ERROR, 'Desculpe-nos :( Tente novamente.')
            } else {
                callback(null, result)
            }
        })
    },
    editargeralusuario: function (data, callback) {
        connection.beginTransaction(function (err) {
            if (err) { throw err }
            async.waterfall([
                dbEditarUsuario,
                dbEditarAgendamento
            ], function (error, status, message) {
                if (error) {
                    return connection.rollback(function () {
                        callback(error, status, message)
                    })
                } else {
                    connection.commit(function (err) {
                        if (err) {
                            return connection.rollback(function () {
                                callback(err, httpStatus.INTERNAL_SERVER_ERROR, 'Desculpe-nos :( Tente novamente.')
                            })
                        }
                        callback(error, status, message)
                    })
                }
            })
            function dbEditarUsuario(cb) {
                let sql = 'UPDATE usuario SET ' +
                    'nome_completo=?, nome_mae=?, nome_pai=?, data_nasc=?, sexo=?, escolaridade=?, situacao=?, estado_civil=?, ' +
                    'naturalidade=?, cpf=?, rg=?, cns=?, familia=?, microarea=?, tipo_sang=?, email=?, telefone=?, celular=?, ' +
                    'estado=?, cidade=?, rua=?, bairro=?, numero_casa=?, necessidades_esp=?, ambulancia=? ' +
                    'WHERE idusuario = ?'
                // Query no Banco de Dados
                connection.query(sql,
                    [data.txtNome_Completo, data.txtNome_Mae, data.txtNome_Pai, data.txtData_Nasc, data.txtSexo,
                    data.txtEscolaridade, data.txtSituacao, data.txtEstado_Civil, data.txtNaturalidade, data.txtCpf, data.txtRg,
                    data.txtCns, data.txtFamilia, data.txtMicroarea, data.txtTipo_Sanguineo, data.txtEmail, data.txtTelefone, data.txtCelular,
                    data.txtEstado, data.txtCidade, data.txtRua, data.txtBairro, data.txtNumero, data.txtNecessidade, data.txtAmbulancia,
                    data.txtIdUsuario],
                    function (error, result) {
                        if (error) {
                            cb(error, httpStatus.INTERNAL_SERVER_ERROR, 'Desculpe-nos :( Tente novamente.')
                        } else {
                            cb(null)
                        }
                    })
            }
            function dbEditarAgendamento(cb) {
                let sql = 'UPDATE agendamento SET ' +
                    'nome_completo_usuario=?, necessidades_esp=?, ambulancia=? ' +
                    'WHERE usuario_idusuario = ?'
                // Query no Banco de Dados
                connection.query(sql,
                    [data.txtNome_Completo, data.txtNecessidade, data.txtAmbulancia, data.txtIdUsuario],
                    function (error, result) {
                        if (error) {
                            cb(error, httpStatus.INTERNAL_SERVER_ERROR, 'Desculpe-nos :( Tente novamente.')
                        } else {
                            cb(null, httpStatus.OK, 'Usuário atualizado com sucesso.')
                        }
                    })
            }
        })
    },
    buscargeralusuario: function (search, callback) {
        async.waterfall([
            dbSql,
            dbPesquisar
        ], function (error, status, message, users) {
            callback(error, status, message, users)
        })
        function dbSql(cb) {
            if (search.opcao == "Todos") {
                let sql = 'SELECT idusuario, familia, microarea, nome_mae, nome_completo, cpf, rg, cns ' +
                    'FROM usuario ORDER BY nome_completo'
                cb(null, sql)
            } else if (search.opcao == "Nome") {
                let sql = 'SELECT idusuario, familia, microarea, nome_mae, nome_completo, cpf, rg, cns ' +
                    'FROM usuario WHERE nome_completo LIKE "%' + search.pesquisar + '%" ORDER BY nome_completo'
                cb(null, sql)
            } else if (search.opcao == "Família") {
                let sql = 'SELECT idusuario, familia, microarea, nome_mae, nome_completo, cpf, rg, cns ' +
                    'FROM usuario WHERE familia LIKE "%' + search.pesquisar + '%" ORDER BY nome_completo'
                cb(null, sql)
            } else if (search.opcao == "Microárea") {
                let sql = 'SELECT idusuario, familia, microarea, nome_mae, nome_completo, cpf, rg, cns ' +
                    'FROM usuario WHERE microarea LIKE "%' + search.pesquisar + '%" ORDER BY nome_completo'
                cb(null, sql)
            } else if (search.opcao == "CPF") {
                let sql = 'SELECT idusuario, familia, microarea, nome_mae, nome_completo, cpf, rg, cns ' +
                    'FROM usuario WHERE cpf LIKE "%' + search.pesquisar + '%" ORDER BY nome_completo'
                cb(null, sql)
            } else if (search.opcao == "RG") {
                let sql = 'SELECT idusuario, familia, microarea, nome_mae, nome_completo, cpf, rg, cns ' +
                    'FROM usuario WHERE rg LIKE "%' + search.pesquisar + '%" ORDER BY nome_completo'
                cb(null, sql)
            } else {
                let sql = 'SELECT idusuario, familia, microarea, nome_mae, nome_completo, cpf, rg, cns ' +
                    'FROM usuario WHERE cns LIKE "%' + search.pesquisar + '%" ORDER BY nome_completo'
                cb(null, sql)
            }
        }
        function dbPesquisar(sql, cb) {
            // Query no Banco de Dados
            connection.query(sql, function (error, result) {
                if (error) {
                    cb(error, httpStatus.INTERNAL_SERVER_ERROR, 'Desculpe-nos :( Tente novamente.')
                } else {
                    if (result == null || result.length == 0)
                        cb(null, httpStatus.UNAUTHORIZED, 'Nenhum resultado encontrado.')
                    else
                        cb(null, httpStatus.OK, result.length + ' usuario(os) encontrado(os).', result)
                }
            })
        }
    },
    // Gerenciamento da secretaria - Agendamento
    retonargeralhorarioagendamento: function (callback) {
        let sql = 'SELECT * FROM horario WHERE profissional_especialidade!="Dentista"'
        // Query no Banco de Dados
        connection.query(sql, function (error, result) {
            if (error) {
                callback(error, httpStatus.INTERNAL_SERVER_ERROR, 'Desculpe-nos :( Tente novamente.')
            } else {
                callback(null, httpStatus.OK, result)
            }
        })
    },
    retonargeralusuario: function (search, callback) {
        let sql = 'SELECT idusuario, familia, microarea, nome_completo, nome_mae FROM usuario ' +
            'WHERE nome_completo LIKE "%' + search.txtPesquisar + '%"'
        // Query no Banco de Dados
        connection.query(sql, function (error, result) {
            if (error) {
                callback(error, httpStatus.INTERNAL_SERVER_ERROR, 'Desculpe-nos :( Tente novamente.')
            } else {
                if (result == null || result.length == 0)
                    callback(null, httpStatus.UNAUTHORIZED, 'Nenhum resultado encontrado.')
                else
                    callback(null, httpStatus.OK, result.length + ' usuário(os) encontrado(os).', result)
            }
        })
    },
    retonargeralagendamento: function (id, date, callback) {
        let sql = 'SELECT a.usuario_idusuario, a.nome_completo_usuario, a.numero_ficha, a.necessidades_esp, u.nome_mae, ' +
            'u.familia, u.microarea, u.cns FROM agendamento a JOIN usuario u ON a.usuario_idusuario = u.idusuario ' +
            'WHERE a.profissional_idprofissional = ? && ' +
            'a.data_agendamento = ? ORDER BY a.numero_ficha'
        // Query no Banco de Dados
        connection.query(sql, [id, date], function (error, result) {
            if (error) {
                callback(error, httpStatus.INTERNAL_SERVER_ERROR, 'Desculpe-nos :( Tente novamente.')
            } else {
                callback(null, httpStatus.OK, result)
            }
        })
    },
    realizargeralagendamento: function (data, callback) {
        async.waterfall([
            dbNecessAmbu,
            dbCheckIdUser,
            dbCheckDate,
            dbMark
        ], function (error, status, message) {
            callback(error, status, message)
        })
        function dbNecessAmbu(cb) {
            let sql = 'SELECT necessidades_esp, ambulancia, nome_completo FROM usuario WHERE idusuario = ?'
            connection.query(sql, [data.idusuario], function (error, result) {
                if (error) {
                    cb(error, httpStatus.INTERNAL_SERVER_ERROR, 'Desculpe-nos :( Tente novamente.')
                } else {
                    cb(null, result[0])
                }
            })
        }
        function dbCheckIdUser(dbResult, cb) {
            let sql = 'SELECT idagendamento FROM agendamento WHERE data_agendamento = ? ' +
                '&& usuario_idusuario = ? && profissional_idprofissional = ?'
            connection.query(sql, [data.date, data.idusuario, data.id_profissional], function (error, result) {
                if (error) {
                    cb(error, httpStatus.INTERNAL_SERVER_ERROR, 'Desculpe-nos :( Tente novamente.')
                } else {
                    if (result == null || result.length == 0)
                        cb(null, dbResult)
                    else
                        cb(new Error(), httpStatus.UNAUTHORIZED, 'Não é possível marcar mais de uma consulta por usuário no dia.')
                }
            })
        }
        function dbCheckDate(dbResult, cb) {
            let sql = 'SELECT idagendamento FROM agendamento WHERE data_agendamento = ? ' +
                '&& numero_ficha = ? && profissional_idprofissional = ?'
            connection.query(sql, [data.date, data.ficha, data.id_profissional], function (error, result) {
                if (error) {
                    cb(error, httpStatus.INTERNAL_SERVER_ERROR, 'Desculpe-nos :( Tente novamente.')
                } else {
                    if (result == null || result.length == 0)
                        cb(null, dbResult)
                    else
                        cb(new Error(), httpStatus.CONFLICT, 'Ficha já está em uso.')
                }
            })
        }
        function dbMark(dbResult, cb) {
            let sql = 'INSERT INTO agendamento ' +
                '(profissional_idprofissional, usuario_idusuario, ' +
                'profissional_nome_completo, profissional_especialidade, nome_completo_usuario, ' +
                'data_agendamento, numero_ficha, necessidades_esp, ambulancia)' +
                ' VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
            connection.query(sql,
                [data.id_profissional, data.idusuario, data.nome_profissional, data.especialidade,
                dbResult.nome_completo, data.date, data.ficha, dbResult.necessidades_esp, dbResult.ambulancia],
                function (error, result) {
                    if (error) {
                        cb(error, httpStatus.INTERNAL_SERVER_ERROR, 'Desculpe-nos :( Tente novamente.')
                    } else {
                        cb(null, httpStatus.OK, 'Agendamento realizado com sucesso.')
                    }
                })
        }
    },
    desmarcargeralagendamento: function (data, callback) {
        let sql = 'DELETE FROM agendamento WHERE data_agendamento = ? && numero_ficha = ? && usuario_idusuario = ?'
        // Query no Banco de Dados
        connection.query(sql, [data.date, data.ficha, data.idusuario], function (error, result) {
            if (error) {
                callback(error, httpStatus.INTERNAL_SERVER_ERROR, 'Desculpe-nos :( Tente novamente.')
            } else {
                callback(null, httpStatus.OK, 'Consulta desmarcada com sucesso.')
            }
        })
    },
    /* Operações do relatório */
    retornarsecretariarelatorio: function (data, callback) {
        let sql = 'SELECT profissional_nome_completo, EXTRACT(MONTH FROM data_agendamento) AS mes, ' +
            'COUNT(*) as qtd_agen FROM agendamento WHERE EXTRACT(YEAR FROM data_agendamento) = ? ' +
            'GROUP BY profissional_nome_completo, EXTRACT(MONTH FROM data_agendamento) ' +
            'ORDER BY EXTRACT(MONTH FROM data_agendamento)'
        // Query no Banco de Dados
        connection.query(sql, [data.txtAno], function (error, result) {
            if (error) {
                callback(error, httpStatus.INTERNAL_SERVER_ERROR, 'Desculpe-nos :( Tente novamente.')
            } else {
                if (result == null || result.length == 0)
                    callback(new Error(), httpStatus.UNAUTHORIZED, 'Nenhum resultado encontrado.')
                else
                    callback(null, httpStatus.OK, 'Resultados encontrados.', result)
            }
        })
    }
}

module.exports = service
