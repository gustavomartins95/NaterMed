// Retornar estatística
jQuery(document).ready(function () {
    $.ajax({
        url: "/retornarestatistica",
        type: "get",
        dataType: "json",
        async: true
    }).done(function (callback) {
        criarProfile(callback.data)
    })
})
function criarProfile(dados) {
    $('#counter-contas').attr('data-count', dados[0].qtd)
    $('#counter-consultas').attr('data-count', dados[1].qtd)
}
