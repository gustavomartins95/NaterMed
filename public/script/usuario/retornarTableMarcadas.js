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
                "<td>" + (consulta[index].faltam == 0 ? 'Hoje' : consulta[index].faltam + ' dia(as)') + "</td>" +
                "<td>" + consulta[index].data_agend_format + "</td>" +
                "<td>" + consulta[index].numero_ficha + "</td>" +
                "<td>" + consulta[index].profissional_nome_completo + "</td>" +
                "<td>" + consulta[index].profissional_especialidade + "</td>" +
                "</tr>")
            appendTable(newTrItem)
        }
    } else {
        newTrItem = $("<tr class='danger'><td colspan='5'>Nenhum resultado encontrado.</td></tr>")
        appendTable(newTrItem)
    }
}

function appendTable(newTrItem) {
    $("#tbodyDados").append(newTrItem)
}
