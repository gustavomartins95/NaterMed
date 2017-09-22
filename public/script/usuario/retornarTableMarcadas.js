// Retorna table das consultas marcadas
jQuery(document).ready(function () {
    $.ajax({
        url: "/retornartablemarcadas",
        type: "get",
        dataType: "json",
        async: true,
    }).done(function (callback) {
        criarTable(callback.consulta)
    })
})

function criarTable(consulta) {
    // Limpa table
    $("#tbodyDados tr").remove()
    if (consulta.length) {
        for (index = 0; index < consulta.length; index++) {
            newTrItem = $("<tr>" +
                "<td>" + consulta[index].profissional_nome_completo + "</td>" +
                "<td>" + consulta[index].profissional_especialidade + "</td>" +
                "<td>" + consulta[index].data_agendamento + "</td>" +
                "<td>" + consulta[index].numero_ficha + "</td>" +
                "</tr>")
            appendTable(newTrItem)
        }
    } else {
        newTrItem = $("<tr class='danger'><td colspan='4'>Nenhum resultado encontrado.</td></tr>")
        appendTable(newTrItem)
    }
}

function appendTable(newTrItem) {
    $("#tbodyDados").append(newTrItem)
}
