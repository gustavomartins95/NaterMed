// Retornar profissional
jQuery(document).ready(function () {
    $.ajax({
        url: "/retornarprofissional",
        type: "get",
        dataType: "json",
        async: true
    }).done(function (callback) {
        criarProfile(callback.users)
    })
})
function criarProfile(users) {
    newLiItem = $("<li class='item'>" +
        "<div class='profile-box'>" +
        "<div class='profile-title'>" +
        "<h1>Conta existente</h1>" +
        "</div>" +
        "<div class='profile-content'>" +
        "<p>" + users[0].nome_completo + "</p>" +
        "</div>" +
        "<div class='profile-button'>" +
        "<button class='btn btn-primary' type='button' onclick='escolherprofissional(" + users[0].idprofissional + "); return false;'>ACESSAR</button>" +
        "</div>" +
        "</div>" +
        "</li>")
    $(".cards").append(newLiItem)
}
