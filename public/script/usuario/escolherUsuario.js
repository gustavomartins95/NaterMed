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
