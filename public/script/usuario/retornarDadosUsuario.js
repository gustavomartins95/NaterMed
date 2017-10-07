// Retornar dados usuário
jQuery(document).ready(function () {
    $.ajax({
        url: "/retornardadosusuario",
        type: "get",
        dataType: "json",
        async: true
    }).done(function (callback) {
        popularUsuarios(callback.users)
    })
})
function popularUsuarios(users) {
    $('#txtNome_Completo').val(users[0].nome_completo)
    $('#txtNome_Mae').val(users[0].nome_mae)
    $('#txtNome_Pai').val(users[0].nome_pai)
    $('#txtNaturalidade').val(users[0].naturalidade)
    $('#txtSexo').val(users[0].sexo)
    $('#txtTipo_Sanguineo').val(users[0].tipo_sang)
    $('#txtEscolaridade').val(users[0].escolaridade)
    $('#txtSituacao').val(users[0].situacao)
    $('#txtEstado_Civil').val(users[0].estado_civil)
    $('#txtData_Nasc').val(users[0].data_nasc)

    if (users[0].cpf == "Não Declarado") {
        $("#inp-cpf").attr('disabled', 'disabled').val('')
        $('#che-cpf').prop('checked', true)
    } else $('#inp-cpf').val(users[0].cpf)
    if (users[0].rg == "Não Declarado") {
        $("#inp-rg").attr('disabled', 'disabled').val('')
        $('#che-rg').prop('checked', true)
    } else $('#inp-rg').val(users[0].rg)
    if (users[0].cns == "Não Declarado") {
        $("#inp-cns").attr('disabled', 'disabled').val('')
        $('#che-cns').prop('checked', true)
    } else $('#inp-cns').val(users[0].cns)
    $('#inp-familia').val(users[0].familia)
    $('#inp-microarea').val(users[0].microarea)

    $('#txtEmail').val(users[0].email)
    $('#txtTelefone').val(users[0].telefone)
    $('#txtCelular').val(users[0].celular)

    $('#txtEstado').val(users[0].estado)
    $("#txtCidade").append('<option value="' + users[0].cidade + '" selected>' + users[0].cidade + '</option>')

    $('#txtRua').val(users[0].rua)
    $('#txtBairro').val(users[0].bairro)
    $('#txtNumero').val(users[0].numero_casa)

    if (users[0].necessidades_esp == "1") $('#txtNecessidadeSim').prop('checked', true)
    else $('#txtNecessidadeNao').prop('checked', true)
    if (users[0].ambulancia == "1") $('#txtAmbulanciaSim').prop('checked', true)
    else $('#txtAmbulanciaNao').prop('checked', true)
}
