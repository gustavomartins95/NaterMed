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
    if ($('#txtSenha_Acesso').val() == "" || $('#txtConfirmsenha_Acesso').val() == "") {
        msgErrors = ("Todos os campos são obrigatórios.<br />")
    } else {
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
    $.ajax({
        url: "/editarloginsecretaria",
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
        window.location = "/secretaria"
    }).fail(function (callback) {
        jsonCb = JSON.parse(callback.responseText)
        sendMsg(jsonCb.message)
    })
}
