// Form submit
jQuery(document).ready(function () {
    $('.form-users').submit(function (event) {
        event.preventDefault()
        validationRegister()
    })
})

// Validações
function validationRegister() {
    // Limpar select
    $("#txtPaciente option").remove()
    // Mensagens de erros
    msgErrors = ""
    // Todos os campos estão vazios
    if ($('#txtPesquisar').val().length < 3) {
        msgErrors = "Digite no mínimo três caracteres ..."
        newOptionItem = $("<option value=''>Nenhum resultado encontrado.</option>")
        appendSelectUsuario(newOptionItem)
    }
    // Erros ou Dados
    if (msgErrors) {
        sendMsg(msgErrors, 0)
    } else {
        sendMsg(msgErrors, 1)
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
        url: "/retonargeralusuario",
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
        newOptionItem = $("<option value=''>Selecione o paciente.</option>")
        appendSelectUsuario(newOptionItem)
        criarSelectUsuario(callback.dataUsers)
        // Enviar mensagem
        sendMsg(callback.message, 1)
    }).fail(function (callback) {
        newOptionItem = $("<option value=''>Nenhum resultado encontrado.</option>")
        appendSelectUsuario(newOptionItem)
        // Enviar mensagem
        jsonCb = JSON.parse(callback.responseText)
        sendMsg(jsonCb.message, 0)
    })
}

function criarSelectUsuario(users) {
    for (index = 0; index < users.length; index++) {
        newOptionItem = $("<option value=" + users[index].idusuario + ">"
            + "Família: " + (users[index].familia === null ? "" : users[index].familia)
            + " - Microárea: " + (users[index].microarea === null ? "" : users[index].microarea)
            + " - Paciente: " + users[index].nome_completo
            + " - Mãe do Paciente: " + users[index].nome_mae + "</option >")
        appendSelectUsuario(newOptionItem)
    }
}
function appendSelectUsuario(newOptionItem) {
    $("#txtPaciente").append(newOptionItem)
}
