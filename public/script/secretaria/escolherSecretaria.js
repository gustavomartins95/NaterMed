// Escolher secretaria
function escolhersecretaria(idsecretaria) {
    var dados = {
        idsecretaria: idsecretaria
    }
    $.ajax({
        url: "/escolhersecretaria",
        type: "post",
        dataType: "json",
        async: true,
        data: dados
    }).done(function () {
        window.location = "/indexsecretaria"
    })
}
