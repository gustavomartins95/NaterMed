// Retorna dados do agendamento
function retonaragendamento(dataAgenda, qtd_ficha) {
    // Limpa table
    $("#tbodyDados tr").remove()
    $.ajax({
        url: "/retonaragendamento?id=" + $('#txtEsp :selected').val() + "&date=" + dataAgenda,
        type: "get",
        dataType: "json",
        async: true,
    }).done(function (callback) {
        criarTable(callback.data, callback.userid, callback.date, qtd_ficha)
    })
}
function criarTable(data, user, date, qtd_ficha) {
    // Limpa table
    $("#tbodyDados tr").remove()
    index = 0
    for (ficha = 1; ficha <= qtd_ficha; ficha++) {
        // Profissional escolhido
        agendamento = {
            ficha: ficha, date: date,
            id_profissional: $('#txtEsp :selected').val(),
            nome_profissional: $('#txtEsp :selected').data('nome_completo'),
            especialidade: $('#txtEsp :selected').data('especialidade')
        }
        if (typeof data[index] == 'undefined') {
            newTrItem = $("<tr class='success'>" +
                "<td>" + ficha + "</td>" +
                "<td></td>" +
                "<td><button type='button' class='btn btn-success' onclick='realizaragendamento(" + JSON.stringify(agendamento) + ")'>Marcar</button></td>" +
                "</tr>")
            appendTable(newTrItem)
        } else {
            if (data[index].numero_ficha == ficha) {
                newTrItem = $(
                    (data[index].usuario_idusuario == user ?
                        "<tr class='danger'>" :
                        "<tr class='warning'>") +
                    "<td>" + ficha + "</td>" +
                    (data[index].necessidades_esp == 1 ?
                        "<td><span class='glyphicon glyphicon-ok necessidadeOkay' aria-hidden='true'></span></td>" :
                        "<td><span class='glyphicon glyphicon-remove necessidadeNo' aria-hidden='true'></span></td>") +
                    (data[index].usuario_idusuario == user ?
                        "<td><button type='button' class='btn btn-danger' onclick='desmarcaragendamento(" + JSON.stringify(agendamento) + ")'>Desmarcar</button></td>" :
                        "<td><button type='button' class='btn btn-warning' disabled='disabled'>Marcada</button></td>") +
                    "</tr>")
                appendTable(newTrItem)
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
