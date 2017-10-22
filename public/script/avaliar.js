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
    if (!$('.respUm').is(":checked") ||
        !$('.respDois').is(":checked") ||
        !$('.respTres').is(":checked") ||
        !$('.respQuatro').is(":checked")) {
        msgErrors = "Responda todo o questionário."
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

// Mostrar mensagens
function sendMsg(msg, options) {
    // Retornar ao topo
    $('html, body').animate({ scrollTop: 0 }, 1000)
    // Mensagens
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
        url: "/avaliar",
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
        sendMsg(callback.message, 1)
        $('#limparCampos').click()
    }).fail(function (callback) {
        jsonCb = JSON.parse(callback.responseText)
        sendMsg(jsonCb.message, 0)
    })
}
