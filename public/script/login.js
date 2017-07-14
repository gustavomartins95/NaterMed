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
    if ($('#txtCartaosus_Acesso').val() == "" || $('#txtSenha_Acesso').val() == "") {
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
    }
    // Erros ou Dados
    if (msgErrors) {
        sendMsg(msgErrors)
    } else {
        $('#divResult').removeClass("alert-danger")
        sendData()
    }
}

// Mostrar mensagens de erros
function sendMsg(msg) {
    $('#divResult').addClass("alert-danger")
    $('#result').html(msg)
    $('#divResult').fadeIn(500)
    return false
}

// Enviar formulário via AJAX
function sendData() {
    $.ajax({
        url: "/login",
        type: "post",
        dataType: "json",
        async: true,
        data: $("form").serialize(),
        beforeSend: function () {
            $('#btn-users').val("AGUARDE ...")
        },
        complete: function () {
            $('#btn-users').val("ACESSAR")
        }
    }).done(function(){
        window.location = "/indexusuario"
    }).fail(function (callback) {
        callbackMsg = JSON.parse(callback.responseText)
        sendMsg(callbackMsg.info)
    })
}
