// Retorna table notícia
jQuery(document).ready(function () {
    $.ajax({
        url: "/retornartablenoticia",
        type: "get",
        dataType: "json",
        async: true,
    }).done(function (callback) {
        criarTable(callback.noticia)
    })
})

function criarTable(noticia) {
    // Limpa table
    $("#tbodyDadosNoticias tr").remove()
    if (noticia.length) {
        for (index = 0; index < noticia.length; index++) {
            var idnoticia = { id: noticia[index].idnoticia }
            newTrItem = $("<tr>" +
                "<td>" + noticia[index].titulo + "</td>" +
                "<td>" + noticia[index].inicio + "</td>" +
                "<td>" + noticia[index].termino + "</td>" +
                "<td>" + noticia[index].texto + "</td>" +
                "<td><a href='editartablenoticia?id=" + noticia[index].idnoticia + "' class='btn btn-primary' role='button'>Editar</a> " +
                "<button type='button' class='btn btn-danger' onclick='excluirtablenoticia(" + JSON.stringify(idnoticia) + "); return false;'>Excluir</button></td>" +
                "</tr>")
            appendTable(newTrItem)
        }
    } else {
        newTrItem = $("<tr class='danger'><td colspan='5'>Nenhum resultado encontrado.</td></tr>")
        appendTable(newTrItem)
    }
}

function appendTable(newTrItem) {
    $("#tbodyDadosNoticias").append(newTrItem)
}
