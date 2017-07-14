// Form submit
jQuery(document).ready(function () {
    $('.form-users').submit(function (event) {
        event.preventDefault();
        validationRegister();
    });
});

// Validações
function validationRegister() {
    // Mensagens de erros
    msgErrors = "";
    // Todos os campos estão vazios
    if ($('#txtNome_Completo').val() == "") {
        msgErrors = ("Campos obrigatórios<br />");
    }
    // Erros ou Dados
    if (msgErrors) {
        sendMsg(msgErrors);
    } else {
        $('#divResult').removeClass("alert-danger");
        sendData();
    }
}

// Mostrar mensagens de erros
function sendMsg(msg) {
    $('#divResult').addClass("alert-danger")
    $('#result').html(msg);
    $('#divResult').fadeIn(500);
    return false;
}

// Enviar formulário via AJAX
function sendData() {
    $.ajax({
        url: "/cadastrarusuario",
        type: "post",
        dataType: "json",
        async: true,
        data: $("form").serialize(),
        beforeSend: function () {
            $('#btn-users').val("AGUARDE ...");
        },
        complete: function () {
            $('#btn-users').val("CADASTRAR");
        }
    }).done(function (callback) {
        window.location = "/usuario"
    }).fail(function (callback) {
        jsonCb = JSON.parse(callback.responseText)
        sendMsg(jsonCb.message);
    });
}
