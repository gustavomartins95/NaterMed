// Retornar login usuário
jQuery(document).ready(function () {
    $.ajax({
        url: "/retornarloginusuario",
        type: "get",
        dataType: "json",
        async: true
    }).done(function (callback) {
        popularLogin(callback.login)
    })
})
function popularLogin(login) {
    $('#txtCartaosus_Acesso').val(login[0].cartaosus_acesso)
}
