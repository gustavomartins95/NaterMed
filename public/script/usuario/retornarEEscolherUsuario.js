// Retornar usuário
jQuery(document).ready(function () {
    $.ajax({
        url: "/retornarusuario",
        type: "get",
        dataType: "json",
        async: true
    }).done(function (callback) {
        criarProfile(callback.users)
    })
})
function criarProfile(users) {
    if (!users.length) {
        newH1 = $("<li><h1>Crie quantos usuários quiser !</h1></li>")
        $(".cards").append(newH1)
    } else {
        for (i = 0; i < users.length; i++) {
            newLiItem = $("<li class='item'>" +
                "<div class='profile-box'>" +
                "<div class='profile-title'>" +
                "<h1>Conta existente</h1>" +
                "</div>" +
                "<div class='profile-content'>" +
                "<p>" + users[i].nome_completo + "</p>" +
                "</div>" +
                "<div class='profile-button'>" +
                "<button class='btn btn-primary' type='button' onclick='escolherusuario(" + users[i].idusuario + "); return false;'>ACESSAR</button>" +
                "</div>" +
                "</div>" +
                "</li>")
            $(".cards").append(newLiItem)
        }
    }
}

// Escolher usuário
function escolherusuario(idusuario) {
    var dados = {
        idusuario: idusuario
    }
    $.ajax({
        url: "/escolherusuario",
        type: "post",
        dataType: "json",
        async: true,
        data: dados
    }).done(function () {
        window.location = "/indexusuario"
    })
}