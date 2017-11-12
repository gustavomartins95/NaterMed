// Retorna table medicamento
jQuery(document).ready(function () {
    $.ajax({
        url: "/retornartablemedicamento",
        type: "get",
        dataType: "json",
        async: true,
    }).done(function (callback) {
        criarTable(callback.medicamento)
    })
})

function criarTable(medicamento) {
    // Limpa table
    $("#tbodyDadosMedicamentos tr").remove()
    if (medicamento.length) {
        for (index = 0; index < medicamento.length; index++) {
            var idmedicamento = { id: medicamento[index].idmedicamento }
            newTrItem = $("<tr>" +
                "<td>" + medicamento[index].nome + "</td>" +
                "<td>" + ( medicamento[index].estoque == "1" ? "Disponível" : "Indisponível" ) + "</td>" +
                "<td><a href='editartablemedicamento?id=" + medicamento[index].idmedicamento + "' class='btn btn-primary' role='button'>Editar</a> " +
                "<button type='button' class='btn btn-danger' onclick='excluirtablemedicamento(" + JSON.stringify(idmedicamento) + "); return false;'>Excluir</button></td>" +
                "</tr>")
            appendTable(newTrItem)
        }
    } else {
        newTrItem = $("<tr class='danger'><td colspan='3'>Nenhum resultado encontrado.</td></tr>")
        appendTable(newTrItem)
    }
}

function appendTable(newTrItem) {
    $("#tbodyDadosMedicamentos").append(newTrItem)
}
