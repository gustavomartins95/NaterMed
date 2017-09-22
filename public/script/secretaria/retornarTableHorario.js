// Retorna table profissional
jQuery(document).ready(function () {
    $.ajax({
        url: "/retornartablehorario",
        type: "get",
        dataType: "json",
        async: true,
    }).done(function (callback) {
        criarTable(callback.hour)
    })
})

function criarTable(hour) {
    // Limpa table
    $("#tbodyDadosHorarios tr").remove()
    if (hour.length) {
        for (index = 0; index < hour.length; index++) {
            var idhorario = { id: hour[index].idhorario }
            newRow = $("<tr>")
            columns = ""

            columns += "<td>" + hour[index].profissional_nome_completo + "</td>"
            columns += "<td>" + hour[index].profissional_especialidade + "</td>"
            hour[index].diamo ?
                columns += "<td>Início às " + hour[index].horamo.split(':', 2).join(':') + "H, " + hour[index].fichamo + " Fichas</td>" :
                columns += "<td>-</td>"
            hour[index].diatu ?
                columns += "<td>Início às " + hour[index].horatu.split(':', 2).join(':') + "H, " + hour[index].fichatu + " Fichas</td>" :
                columns += "<td>-</td>"
            hour[index].diawe ?
                columns += "<td>Início às " + hour[index].horawe.split(':', 2).join(':') + "H, " + hour[index].fichawe + " Fichas</td>" :
                columns += "<td>-</td>"
            hour[index].diath ?
                columns += "<td>Início às " + hour[index].horath.split(':', 2).join(':') + "H, " + hour[index].fichath + " Fichas</td>" :
                columns += "<td>-</td>"
            hour[index].diafr ?
                columns += "<td>Início às " + hour[index].horafr.split(':', 2).join(':') + "H, " + hour[index].fichafr + " Fichas</td>" :
                columns += "<td>-</td>"

            columns += "<td class='actions'>"
            columns += "<a href='editartablehorario?id=" + hour[index].idhorario + "' class='btn btn-primary' role='button'>Editar</a> " +
                "<button type='button' class='btn btn-danger' onclick='excluirtablehorario(" + JSON.stringify(idhorario) + "); return false;'>Excluir</button></td>"

            newRow.append(columns)
            appendTable(newRow)
        }
    } else {
        newTrItem = $("<tr class='danger'><td colspan='8'>Nenhum resultado encontrado.</td></tr>")
        appendTable(newTrItem)
    }
}

function appendTable(newRow) {
    $("#tbodyDadosHorarios").append(newRow)
}

