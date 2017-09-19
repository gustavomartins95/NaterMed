// Retorna table profissional
jQuery(document).ready(function () {
    $.ajax({
        url: "/retornartableprofissional",
        type: "get",
        dataType: "json",
        async: true,
    }).done(function (callback) {
        criarTable(callback.professionals)
    })
})

function criarTable(professionals) {
    // Limpa table
    $("#tbodyDadosProfissionais tr").remove()
    if (professionals.length) {
        for (index = 0; index < professionals.length; index++) {
            var idprofissional = { id: professionals[index].idprofissional }
            newTrItem = $("<tr>" +
                "<td>" + professionals[index].nome_completo + "</td>" +
                "<td>" + professionals[index].especialidade + "</td>" +
                "<td>" + professionals[index].celular + "</td>" +
                "<td>" + professionals[index].email + "</td>" +
                "<td><a href='editartableprofissional?id=" + professionals[index].idprofissional + "' class='btn btn-primary' role='button'>Editar</a> " +
                "<button type='button' class='btn btn-danger' onclick='excluirtableprofissional(" + JSON.stringify(idprofissional) + "); return false;'>Excluir</button></td>" +
                "</tr>")
            appendTable(newTrItem)
        }
    } else {
        newTrItem = $("<tr class='danger'><td colspan='5'>Nenhum resultado encontrado.</td></tr>")
        appendTable(newTrItem)
    }
}

function appendTable(newTrItem) {
    $("#tbodyDadosProfissionais").append(newTrItem)
}
