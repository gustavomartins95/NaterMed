// Retorna table notícia
jQuery(document).ready(function () {
    $.ajax({
        url: "/retornarnoticia",
        type: "get",
        dataType: "json",
        async: true,
    }).done(function (callback) {
        criarTable(callback.noticia)
    })
})

function criarTable(noticia) {
    for (index = 0; index < noticia.length; index++) {
        newNotice = $("<div class='panel panel-default'>" +
            "<div class='panel-heading icon'><i class='glyphicon glyphicon-envelope'></i></div>" +
            "<div class='panel-heading'><h3>" + noticia[index].titulo + "</h3></div>" +
            "<div class='panel-body'><textarea class='form-control' rows='10' disabled>" + noticia[index].texto + "</textarea></div>" +
            "<ul class='list-group'>" +
            (noticia[index].inicio ? "<li class='list-group-item'>Início: " + noticia[index].inicio + "</li>" : "") +
            (noticia[index].termino ? "<li class='list-group-item'>Término: " + noticia[index].termino + "</li>" : "") +
            "<li class='list-group-item'>Data da postagem: " + noticia[index].data_publicacao + "</li>" +
            "</ul>")
        appendTable(newNotice)
    }
}

function appendTable(newNotice) {
    $("#noticias").append(newNotice)
}
