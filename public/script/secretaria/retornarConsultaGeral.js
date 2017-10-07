// Retorna dados do agendamento
function retonargeralagendamento(dataAgenda, qtd_ficha) {
    // Limpa table
    $("#tbodyDados tr").remove()
    $.ajax({
        url: "/retonargeralagendamento?id=" + $('#txtEsp :selected').val() + "&date=" + dataAgenda,
        type: "get",
        dataType: "json",
        async: true,
    }).done(function (callback) {
        criarTable(callback.data, callback.date, qtd_ficha)
    })
}
function criarTable(data, date, qtd_ficha) {
    // Limpa table
    $("#tbodyDados tr").remove()
    index = 0
    for (ficha = 1; ficha <= qtd_ficha; ficha++) {
        agendamento = {
            ficha: ficha, date: date,
            id_profissional: $('#txtEsp :selected').val(),
            nome_profissional: $('#txtEsp :selected').data('nome_completo'),
            especialidade: $('#txtEsp :selected').data('especialidade'),
            idusuario: $('#txtPaciente :selected').val()
        }
        if (typeof data[index] == 'undefined') {
            newTrItem = $("<tr class='success'>" +
                "<td>" + ficha + "</td>" +
                "<td></td>" +
                "<td></td>" +
                "<td></td>" +
                "<td></td>" +
                "<td></td>" +
                "<td><button type='button' class='btn btn-success' onclick='realizargeralagendamento(" + JSON.stringify(agendamento) + ")'>Marcar</button></td>" +
                "</tr>")
            appendTable(newTrItem)
        } else {
            if (data[index].numero_ficha == ficha) {
                desmarcarAgendamento = {
                    ficha: ficha, date: date,
                    idusuario: data[index].usuario_idusuario
                }
                if (data[index].necessidades_esp) {
                    newTrItem = $("<tr class='danger'>" +
                        "<td>" + ficha + "</td>" +
                        "<td>" + data[index].familia + "</td>" +
                        "<td>" + data[index].microarea + "</td>" +
                        "<td>" + data[index].nome_completo_usuario + "</td>" +
                        "<td>" + data[index].nome_mae + "</td>" +
                        "<td><span class='glyphicon glyphicon-ok necessidadeOkay' aria-hidden='true'></span></td>" +
                        "<td><button type='button' class='btn btn-danger' onclick='desmarcargeralagendamento(" + JSON.stringify(desmarcarAgendamento) + ")'>Desmarcar</button></td>" +
                        "</tr>")
                    appendTable(newTrItem)
                } else {
                    newTrItem = $("<tr class='danger'>" +
                        "<td>" + ficha + "</td>" +
                        "<td>" + data[index].familia + "</td>" +
                        "<td>" + data[index].microarea + "</td>" +
                        "<td>" + data[index].nome_completo_usuario + "</td>" +
                        "<td>" + data[index].nome_mae + "</td>" +
                        "<td><span class='glyphicon glyphicon-remove necessidadeNo' aria-hidden='true'></span></td>" +
                        "<td><button type='button' class='btn btn-danger' onclick='desmarcargeralagendamento(" + JSON.stringify(desmarcarAgendamento) + ")'>Desmarcar</button></td>" +
                        "</tr>")
                    appendTable(newTrItem)
                }
                // Incrementa index
                index++
            } else {
                newTrItem = $("<tr class='success'>" +
                    "<td>" + ficha + "</td>" +
                    "<td></td>" +
                    "<td></td>" +
                    "<td></td>" +
                    "<td></td>" +
                    "<td></td>" +
                    "<td><button type='button' class='btn btn-success' onclick='realizargeralagendamento(" + JSON.stringify(agendamento) + ")'>Marcar</button></td>" +
                    "</tr>")
                appendTable(newTrItem)
            }
        }
    }
}
function appendTable(newTrItem) {
    $("#tbodyDados").append(newTrItem)
}
