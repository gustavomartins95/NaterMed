// Escolher profissional
function escolherprofissional(idprofissional) {
    var dados = {
        idprofissional: idprofissional
    }
    $.ajax({
        url: "/escolherprofissional",
        type: "post",
        dataType: "json",
        async: true,
        data: dados
    }).done(function () {
        window.location = "/indexprofissional"
    })
}
