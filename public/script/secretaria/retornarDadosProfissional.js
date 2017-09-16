// Retornar dados profissional
jQuery(document).ready(function () {
    $.ajax({
        url: "/retornareditartableprofissional?" + window.location.href.slice(window.location.href.indexOf('?') + 1),
        type: "get",
        dataType: "json",
        async: true
    }).done(function (callback) {
        popularProfissional(callback.professionals)
    })
})
function popularProfissional(professionals) {
    $('#txtIdProfissional').val(professionals[0].idprofissional)
    $('#txtNome_Completo').val(professionals[0].nome_completo)
    $('#txtEspecialidade').val(professionals[0].especialidade)
    $('#txtNaturalidade').val(professionals[0].naturalidade)
    $('#txtSexo').val(professionals[0].sexo)
    $('#txtData_Nasc').val(professionals[0].data_nasc)

    if (professionals[0].cpf == "Não Declarado") {
        $("#inp-cpf").attr('disabled', 'disabled').val('')
        $('#che-cpf').prop('checked', true)
    } else $('#inp-cpf').val(professionals[0].cpf)
    if (professionals[0].rg == "Não Declarado") {
        $("#inp-rg").attr('disabled', 'disabled').val('')
        $('#che-rg').prop('checked', true)
    } else $('#inp-rg').val(professionals[0].rg)
    if (professionals[0].cns == "Não Declarado") {
        $("#inp-cns").attr('disabled', 'disabled').val('')
        $('#che-cns').prop('checked', true)
    } else $('#inp-cns').val(professionals[0].cns)

    $('#txtEmail').val(professionals[0].email)
    $('#txtTelefone').val(professionals[0].telefone)
    $('#txtCelular').val(professionals[0].celular)

    $('#txtEstado').val(professionals[0].estado)
    $("#txtCidade").append('<option value="' + professionals[0].cidade + '" selected>' + professionals[0].cidade + '</option>')

    $('#txtRua').val(professionals[0].rua)
    $('#txtBairro').val(professionals[0].bairro)
    $('#txtNumero').val(professionals[0].numero_casa)
}
