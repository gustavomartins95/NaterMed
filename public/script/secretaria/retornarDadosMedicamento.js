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
    $('#txtPosologia').val(medicamento[0].posologia)
    $('#txtLaboratorio').val(medicamento[0].laboratorio)
    $('#txtViaAdministracao').val(medicamento[0].via_administracao)

    if (medicamento[0].generico == "1") $('#txtGenericoSim').prop('checked', true)
    else $('#txtGenericoNao').prop('checked', true)
    if (medicamento[0].estoque == "1") $('#txtEstoqueSim').prop('checked', true)
    else $('#txtEstoqueNao').prop('checked', true)
}
