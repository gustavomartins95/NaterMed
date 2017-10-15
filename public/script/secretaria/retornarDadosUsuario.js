// Retornar dados usuário
jQuery(document).ready(function () {
    $.ajax({
        url: "/retornareditartablegeralusuario?" + window.location.href.slice(window.location.href.indexOf('?') + 1),
        type: "get",
        dataType: "json",
        async: true
    }).done(function (callback) {
        popularUsuarios(callback.user)
    })
})
function popularUsuarios(user) {
    $('#txtIdUsuario').val(user[0].idusuario)
    $('#txtNome_Completo').val(user[0].nome_completo)
    $('#txtNome_Mae').val(user[0].nome_mae)
    $('#txtNome_Pai').val(user[0].nome_pai)
    $('#txtNaturalidade').val(user[0].naturalidade)
    $('#txtSexo').val(user[0].sexo)
    $('#txtTipo_Sanguineo').val(user[0].tipo_sang)
    $('#txtEscolaridade').val(user[0].escolaridade)
    $('#txtSituacao').val(user[0].situacao)
    $('#txtEstado_Civil').val(user[0].estado_civil)
    $('#txtData_Nasc').val(user[0].data_nasc)

    if (user[0].cpf == "Não Declarado") {
        $("#inp-cpf").attr('disabled', 'disabled').val('')
        $('#che-cpf').prop('checked', true)
    } else $('#inp-cpf').val(user[0].cpf)
    if (user[0].rg == "Não Declarado") {
        $("#inp-rg").attr('disabled', 'disabled').val('')
        $('#che-rg').prop('checked', true)
    } else $('#inp-rg').val(user[0].rg)
    if (user[0].cns == "Não Declarado") {
        $("#inp-cns").attr('disabled', 'disabled').val('')
        $('#che-cns').prop('checked', true)
    } else $('#inp-cns').val(user[0].cns)
    $('#inp-familia').val(user[0].familia)
    $('#inp-microarea').val(user[0].microarea)

    $('#txtEmail').val(user[0].email)
    $('#txtTelefone').val(user[0].telefone)
    $('#txtCelular').val(user[0].celular)

    $('#txtEstado').val(user[0].estado)
    $("#txtCidade").append('<option value="' + user[0].cidade + '" selected>' + user[0].cidade + '</option>')

    $('#txtRua').val(user[0].rua)
    $('#txtBairro').val(user[0].bairro)
    $('#txtNumero').val(user[0].numero_casa)

    if (user[0].necessidades_esp == "1") $('#txtNecessidadeSim').prop('checked', true)
    else $('#txtNecessidadeNao').prop('checked', true)
    if (user[0].ambulancia == "1") $('#txtAmbulanciaSim').prop('checked', true)
    else $('#txtAmbulanciaNao').prop('checked', true)
}
