// Form submit
jQuery(document).ready(function () {
    $('.search-panel .dropdown-menu').find('a').click(function (e) {
        e.preventDefault()
        var param = $(this).attr("href").replace("#", "")
        var concept = $(this).text()
        $('.search-panel span#search_concept').text(concept)
        $('.input-group #search_param').val(param)
        var iptPesquisar = $('#search_concept').text()
        if (iptPesquisar == "Todos") {
            $('#txtPesquisar').val('')
            $('#txtPesquisar').attr('disabled', true)
        } else {
            $('#txtPesquisar').attr('disabled', false)
        }
    })

    $('.form-users').submit(function (event) {
        event.preventDefault()
        validationRegister()
    })
})

// Validações
function validationRegister() {
    // Limpar
    $("#tbodyDadosUsuarios tr").remove()
    // Mensagens de erros
    msgErrors = ""
    // Todos os campos estão vazios
    if ($('#search_concept').text() == "Opções") {
        msgErrors = "Escolha uma opção."
    }
    if ($('#search_concept').text() != "Todos" &&
        $('#txtPesquisar').val().length == 0) {
        msgErrors = "Digite no mínimo 1 caracteres ..."
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
    var dados = {
        pesquisar: $('#txtPesquisar').val(),
        opcao: $('#search_concept').text()
    }
    $.ajax({
        url: "/buscargeralusuario",
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
        criarTableUsuario(callback.users)
    }).fail(function (callback) {
        jsonCb = JSON.parse(callback.responseText)
        newTrItem = $("<tr class='danger'><td colspan='8'>" + jsonCb.message + "</td></tr>")
        appendTable(newTrItem)
    })
}

function criarTableUsuario(users) {
    for (index = 0; index < users.length; index++) {
        var idusuario = { id: users[index].idusuario }
        newTrItem = $("<tr>" +
            "<td>" + users[index].familia + "</td>" +
            "<td>" + users[index].microarea + "</td>" +
            "<td>" + users[index].nome_completo + "</td>" +
            "<td>" + users[index].nome_mae + "</td>" +
            "<td>" + users[index].cpf + "</td>" +
            "<td>" + users[index].rg + "</td>" +
            "<td>" + users[index].cns + "</td>" +
            "<td><a href='editartablegeralusuario?id=" + users[index].idusuario + "' class='btn btn-primary' role='button'>Editar</a></td>" +
            "</tr>")
        appendTable(newTrItem)
    }
}
function appendTable(newTrItem) {
    $("#tbodyDadosUsuarios").append(newTrItem)
}
