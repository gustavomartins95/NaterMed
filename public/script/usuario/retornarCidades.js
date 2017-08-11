// Retornar estados e cidades
jQuery(document).ready(function () {
    $('#txtEstado').change(function () {
        var estado = $(this).val()
        $.ajax({
            url: "/retornarcidades/" + estado,
            type: "get",
            dataType: "json",
            async: true
        }).done(function (callback) {
            criarCidades(callback.cidades)
        })
    })
})

function criarCidades(cidades) {
    $("#txtCidade").empty()
    if (cidades.length) {
        for (index = 0; index < cidades.length; index++)
            $("#txtCidade").append('<option value="' + cidades[index].nome + '">' + cidades[index].nome + '</option>')
    } else {
        $("#txtCidade").append("<option value=''>Escolha um estado</option>")
    }
}
