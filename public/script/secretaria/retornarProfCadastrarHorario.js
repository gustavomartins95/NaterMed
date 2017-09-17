// Retornar lista profissionais
jQuery(document).ready(function () {
    $.ajax({
        url: "/retornarprofcadastrarhorario",
        type: "get",
        dataType: "json",
        async: true
    }).done(function (callback) {
        popularProfissional(callback.professionals)
    })
})
function popularProfissional(professionals) {
    for (index = 0; index < professionals.length; index++) {
        $("#txtProfissional").append('<option value="' + professionals[index].idprofissional + '">'
            + professionals[index].nome_completo + " - " + professionals[index].especialidade + '</option>')
    }
}
