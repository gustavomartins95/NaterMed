// Form submit
jQuery(document).ready(function () {
    $('.search-panel .dropdown-menu').find('a').click(function (e) {
        e.preventDefault()
        var param = $(this).attr("href").replace("#", "")
        var concept = $(this).text()
        $('.search-panel span#search_concept').text(concept)
        $('.input-group #search_param').val(param)
        var iptPesquisar = $('#search_concept').text()
        if (iptPesquisar == "Disponível" || iptPesquisar == "Indisponível" || iptPesquisar == "Todos") {
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
    $("#tbodyDadosMedicamentos tr").remove()
    // Mensagens de erros
    msgErrors = ""
    // Todos os campos estão vazios
    if ($('#search_concept').text() == "Opções") {
        msgErrors = "Escolha uma opção."
    }
    if ($('#search_concept').text() == "Nome" && $('#txtPesquisar').val().length < 3) {
        msgErrors = "Digite no mínimo três caracteres ..."
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
        url: "/buscartablemedicamento",
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
        criarSelectMedicamento(callback.medicamento)
    }).fail(function (callback) {
        jsonCb = JSON.parse(callback.responseText)
        newTrItem = $("<tr class='danger'><td colspan='2'>" + jsonCb.message + "</td></tr>")
        appendTable(newTrItem)
    })
}

function criarSelectMedicamento(medicamento) {
    for (index = 0; index < medicamento.length; index++) {
        var idmedicamento = { id: medicamento[index].idmedicamento }
        newTrItem = $("<tr>" +
            "<td>" + medicamento[index].nome + "</td>" +
            "<td>" + (medicamento[index].estoque == "1" ? "Disponível" : "Indisponível") + "</td>" +
            "</tr>")
        appendTable(newTrItem)
    }
}
function appendTable(newTrItem) {
    $("#tbodyDadosMedicamentos").append(newTrItem)
}
