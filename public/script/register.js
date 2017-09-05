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
        // Tamanho do cartão
        if ($('#txtCartaosus_Acesso').val().length < 15 || $('#txtCartaosus_Acesso').val().length > 15) {
            msgErrors = ("O cartão deve conter 15 caracteres.<br />")
        }
        // Tamanho da senha
        if ($('#txtSenha_Acesso').val().length < 6) {
            msgErrors += ("A senha deve conter no mínimo 6 caracteres.<br />")
        } else if ($('#txtSenha_Acesso').val().length > 20) {
            msgErrors += ("A senha deve conter no máximo 20 caracteres.<br />")
        }
        // Senhas não conferem
        if ($('#txtSenha_Acesso').val() != $('#txtConfirmsenha_Acesso').val()) {
            msgErrors += ("As senhas não conferem.<br />")
        }
    }
    // Erros ou Dados
    if (msgErrors) {
        sendMsg(msgErrors, 0)
    } else {
        sendMsg(msgErrors)
        $('#divResult').removeClass("alert-danger").removeClass("alert-success")
        sendData()
    }
}

// Mostrar mensagens de erros
function sendMsg(msg, options) {
    $('#divResult').removeClass("alert-danger").removeClass("alert-success")
    if (options == 0) {
        $('#divResult').addClass("alert-danger")
    } else {
        $('#divResult').addClass("alert-success")
    }
    $('#result').html(msg)
    $('#divResult').fadeIn(500)
    return false
}

// Enviar formulário via AJAX
function sendData() {
    $.ajax({
        url: "/register",
        type: "post",
        dataType: "json",
        async: true,
        data: $("form").serialize(),
        beforeSend: function () {
            $('#btn-loading').button('loading')
        },
        complete: function () {
            setTimeout(function () {
                $('#btn-loading').button('reset')
            }, 1500)
        }
    }).done(function (callback) {
        $('form').find('input[type="number"], input[type="password"]').val("")
        $('#txtCartaosus_Acesso').focus()
        sendMsg(callback.message, 1)
    }).fail(function (callback) {
        jsonCb = JSON.parse(callback.responseText)
        sendMsg(jsonCb.message, 0)
    })
}
