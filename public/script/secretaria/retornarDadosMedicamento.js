// Retornar dados medicamento
jQuery(document).ready(function () {
    $.ajax({
        url: "/retornareditartablemedicamento?" + window.location.href.slice(window.location.href.indexOf('?') + 1),
        type: "get",
        dataType: "json",
        async: true
    }).done(function (callback) {
        popularProfissional(callback.medicamento)
    })
})
function popularProfissional(medicamento) {
    $('#txtIdMedicamento').val(medicamento[0].idmedicamento)
    $('#txtNome').val(medicamento[0].nome)
    $('#txtEstoque').val(medicamento[0].estoque)
}
