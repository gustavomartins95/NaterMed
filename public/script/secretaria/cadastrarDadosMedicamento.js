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
    if ($('#txtNome').val() == "") {
        msgErrors = "Campo nome é obrigatório."
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
function sendMsg(msg) {
    $('#divResult').addClass("alert-danger")
    $('#result').html(msg)
    $('#divResult').fadeIn(500)
    return false
}

// Enviar formulário via AJAX
function sendData() {
    if ($('#txtIdentificacao').val() == 'editar') {
        $.ajax({
            url: "/editarmedicamento",
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
            window.location = "/listarmedicamento"
        }).fail(function (callback) {
            jsonCb = JSON.parse(callback.responseText)
            sendMsg(jsonCb.message)
        })
    } else {
        $.ajax({
            url: "/cadastrarmedicamento",
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
            window.location = "/listarmedicamento"
        }).fail(function (callback) {
            jsonCb = JSON.parse(callback.responseText)
            sendMsg(jsonCb.message)
        })
    }
}
