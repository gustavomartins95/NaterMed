// Form submit
jQuery(document).ready(function () {
    $('.form-users').submit(function (event) {
        event.preventDefault()
        validationRegister()
    })
})

// Validações
function validationRegister() {
    // Mensagens de erros
    msgErrors = ""
    // Todos os campos estão vazios
    if ($('#txtCartaosus_Acesso').val() == "" || $('#txtSenha_Acesso').val() == "" || $('#txtConfirmsenha_Acesso').val() == "") {
        msgErrors = ("Todos os campos são obrigatórios.<br />")
    } else {
        // Validar CNS
        if ($("#txtCNS").is(':checked')) {
            if ($('#txtCartaosus_Acesso').val().length != 15) {
                msgErrors += ("O cartão deve conter 15 caracteres.<br />")
            } else {
                if (!fuValidarCNS($('#txtCartaosus_Acesso').val())) {
                    msgErrors += ("CNS Inválido.<br />")
                }
            }
        }
        // Validar CPF
        if ($("#txtCPF").is(':checked')) {
            if ($('#txtCartaosus_Acesso').val().length != 11) {
                msgErrors += ("O cartão deve conter 11 caracteres.<br />")
            } else {
                if (!fuValidarCPF($('#txtCartaosus_Acesso').val()))
                    msgErrors += ("CPF Inválido.<br />")
            }
        }
        // Tamanho da senha
        if ($('#txtSenha_Acesso').val().length < 6) {
            msgErrors += ("A senha deve conter no mínimo 6 caracteres.<br />")
        }
        // Senhas não conferem
        if ($('#txtSenha_Acesso').val() != $('#txtConfirmsenha_Acesso').val()) {
            msgErrors += ("As senhas não conferem.<br />")
        }
    }
    // Erros ou Dados
    if (msgErrors) {
        sendMsg(msgErrors)
    } else {
        sendMsg(msgErrors)
        $('#divResult').removeClass("alert-danger")
        sendData()
    }
}

// Mostrar mensagens de erros
function sendMsg(msg, options) {
    $('#divResult').addClass("alert-danger")
    $('#result').html(msg)
    $('#divResult').fadeIn(500)
    return false
}

// Enviar formulário via AJAX
function sendData() {
    var dados = {
        cartao: $('#txtCartaosus_Acesso').val(),
        senha: $('#txtSenha_Acesso').val(),
        idlogin: window.location.href.slice(window.location.href.indexOf('?') + 1)
    }
    $.ajax({
        url: "/editargerallogin",
        type: "post",
        dataType: "json",
        async: true,
        data: dados,
        beforeSend: function () {
            $('#btn-loading').button('loading')
        },
        complete: function () {
            setTimeout(function () {
                $('#btn-loading').button('reset')
            }, 1500)
        }
    }).done(function (callback) {
        window.location = "/listargeralusuario"
    }).fail(function (callback) {
        jsonCb = JSON.parse(callback.responseText)
        sendMsg(jsonCb.message)
    })
}
