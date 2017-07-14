'use strict'

const controller = require('../controller/controller'),
    LocalStrategy = require('passport-local').Strategy

module.exports = function (passport) {

    passport.serializeUser(function (user, done) {
        let sessionUser = {
            idlogin: user.idlogin,
            nivel_acesso: user.nivel_acesso,
            idusuario: user.idusuario
        }
        done(null, sessionUser)
    })

    passport.deserializeUser(function (sessionUser, done) {
        done(null, sessionUser)
    })

    passport.use('local-login',
        new LocalStrategy({
            usernameField: 'txtCartaosus_Acesso',
            passwordField: 'txtSenha_Acesso'
        }, function (txtCartaosus_Acesso, txtSenha_Acesso, done) {
            controller.login(txtCartaosus_Acesso, txtSenha_Acesso, function (error, user, message) {
                // exceção
                if (error) return done(error)
                // falha de autenticação
                if (!user) return done(null, false, message)
                // autenticado
                return done(null, user)
            })
        })
    )

}

/*
FONTE: http://toon.io/understanding-passportjs-authentication-flow/

FLUXO DE SOLICITAÇÃO DE AUTENTICAÇÃO PASSPORT
01. Quando o usuário submete o formulário de login, um POST pedido para /login é feito resultando na
execução do passport.authenticate middleware que tenha configurado.
02. Como o middleware de autenticação dessa rota está configurado para lidar com a estratégia local,
o passport invocará nossa implementação da estratégia local.
03. Passport leva o req.body.username e req.body.password e passa para a nossa função de verificação na estratégia local.
04. Agora nós fazemos: carregar o usuário a partir do banco de dados e verificar se a senha dada
corresponde ao do banco de dados.
05. No caso de um erro interagindo com o nosso banco de dados, precisamos invocar done(err).
Quando não podemos encontrar o usuário ou as senhas não assistir, invocamos done(null, false).
Se tudo correu bem e queremos que o usuário faça o login, nós invocamos done(null, user).
06. Chamando done fará o fluxo voltar passport.authenticate. É passado o erro, usuário e objeto de informações
adicionais (se definido).
07. Se o usuário foi passado, o middleware irá chamar req.login (uma função de passport anexada ao pedido).
08. Isso chamará nosso passport.serializeUser método que definimos anteriormente. Esse método pode acessar
o objeto de usuário que passamos de volta ao middleware. É seu trabalho determinar quais dados do objeto do
usuário devem ser armazenados na sessão. O resultado do serializeUser método é anexado à sessão como
req.session.passport.user = { // our serialised user object // }.
09. O resultado também é anexado ao pedido como req.user.
10. Uma vez feito, nosso requestHandler é invocado. No exemplo, o usuário é redirecionado para a página inicial.

FLUXO DE SOLICITAÇÕES AUTENTICADAS SUBSEQÜENTES
01. O Express carrega os dados da sessão e os anexa ao req. Como o passport armazena o usuário serializado na sessão,
o objeto de usuário serializado pode ser encontrado em req.session.passport.user.
02. O middleware de passport geral que setup (passport.initialize) é invocado no pedido, ele encontra o
passport.user anexo à sessão. Se não é (o usuário ainda não está autenticado) ele cria como req.passport.user = {}.
03. Em seguida, passport.session é invocado. Este middleware é uma estratégia de passport invocada em cada
solicitação. Se ele encontrar um objeto de usuário serializado na sessão, ele considerará essa solicitação autenticada.
04. As passport.session chamadas de middleware que configuramos passport.deserializeUser. Anexando o objeto de
usuário carregado ao pedido como req.user.

RESUMO DE MÉTODOS DE PASSAPORT E MIDDLEWARE
• passport.initializeMiddleware é invocado em cada solicitação. Ele garante que a sessão contém um passport.user
objeto, que pode estar vazio.
• passport.session Middleware é uma estratégia do passport que carregará o objeto do usuário no req.user se um
objeto de usuário serializado for encontrado no servidor.
• passport.deserializeUser é invocado em cada pedido por passport.session. Ele nos permite carregar informações
adicionais do usuário em cada solicitação. Este objeto de usuário é anexado ao pedido como req.user torná-lo
acessível no nosso pedido manipulação.
• Nossa passport.authenticate estratégia local só é chamada na rota que usa o middleware.
• Somente durante esta autenticação passport.serializeUser é invocado permitindo-nos especificar quais informações
de usuário devem ser armazenadas na sessão.

*/
