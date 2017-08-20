// Retorna dados do agendamento
function retonaragendamento(dataAgenda) {
    $.ajax({
        url: "/retonaragendamento/" + dataAgenda,
        type: "get",
        dataType: "json",
        async: true,
    }).done(function (callback) {
        criarTable(callback.data, callback.userid, callback.date)
    })
}
function criarTable(data, user, date) {
    // Limpa table
    $("#tbodyDados tr").remove()
    index = 0
    for (ficha = 1; ficha <= 20; ficha++) {
        var agendamento = { ficha: ficha, date: date }
        if (typeof data[index] == 'undefined') {
            newTrItem = $("<tr class='success'>" +
                "<td>" + ficha + "</td>" +
                "<td></td>" +
                "<td><button type='button' class='btn btn-success' onclick='realizaragendamento(" + JSON.stringify(agendamento) + ")'>Marcar</button></td>" +
                "</tr>")
            appendTable(newTrItem)
        } else {
            if (data[index].numero_ficha == ficha) {
                if (data[index].usuario_idusuario == user) {
                    if (data[index].necessidades_esp) {
                        newTrItem = $("<tr class='danger'>" +
                            "<td>" + ficha + "</td>" +
                            "<td><span class='glyphicon glyphicon-ok necessidadeOkay' aria-hidden='true'></span></td>" +
                            "<td><button type='button' class='btn btn-danger' onclick='desmarcaragendamento(" + JSON.stringify(agendamento) + ")'>Desmarcar</button></td>" +
                            "</tr>")
                        appendTable(newTrItem)
                    } else {
                        newTrItem = $("<tr class='danger'>" +
                            "<td>" + ficha + "</td>" +
                            "<td><span class='glyphicon glyphicon-remove necessidadeNo' aria-hidden='true'></span></td>" +
                            "<td><button type='button' class='btn btn-danger' onclick='desmarcaragendamento(" + JSON.stringify(agendamento) + ")'>Desmarcar</button></td>" +
                            "</tr>")
                        appendTable(newTrItem)
                    }
                } else {
                    if (data[index].necessidades_esp) {
                        newTrItem = $("<tr class='warning'>" +
                            "<td>" + ficha + "</td>" +
                            "<td><span class='glyphicon glyphicon-ok necessidadeOkay' aria-hidden='true'></span></td>" +
                            "<td><button type='button' class='btn btn-warning' disabled='disabled'>Marcada</button></td>" +
                            "</tr>")
                        appendTable(newTrItem)
                    } else {
                        newTrItem = $("<tr class='warning'>" +
                            "<td>" + ficha + "</td>" +
                            "<td><span class='glyphicon glyphicon-remove necessidadeNo' aria-hidden='true'></span></td>" +
                            "<td><button type='button' class='btn btn-warning' disabled='disabled'>Marcada</button></td>" +
                            "</tr>")
                        appendTable(newTrItem)
                    }
                }
                // Incrementa index
                index++
            } else {
                newTrItem = $("<tr class='success'>" +
                    "<td>" + ficha + "</td>" +
                    "<td></td>" +
                    "<td><button type='button' class='btn btn-success' onclick='realizaragendamento(" + JSON.stringify(agendamento) + ")'>Marcar</button></td>" +
                    "</tr>")
                appendTable(newTrItem)
            }
        }
    }
}
function appendTable(newTrItem) {
    $("#tbodyDados").append(newTrItem)
}
