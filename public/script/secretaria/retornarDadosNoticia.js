// Retornar dados notícia
jQuery(document).ready(function () {
    $.ajax({
        url: "/retornareditartablenoticia?" + window.location.href.slice(window.location.href.indexOf('?') + 1),
        type: "get",
        dataType: "json",
        async: true
    }).done(function (callback) {
        popularProfissional(callback.noticia)
    })
})
function popularProfissional(noticia) {
    $('#txtIdNoticia').val(noticia[0].idnoticia)
    $('#txtTitulo').val(noticia[0].titulo)
    $('#txtData_Inicio').val(noticia[0].inicio)
    $('#txtData_Termino').val(noticia[0].termino)
    $('#txtTexto').val(noticia[0].texto)
}
