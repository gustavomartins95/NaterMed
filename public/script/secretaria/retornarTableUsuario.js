// Retorna table profissional
jQuery(document).ready(function () {
    $.ajax({
        url: "/retornartablegeralusuario",
        type: "get",
        dataType: "json",
        async: true,
    }).done(function (callback) {
        criarTable(callback.users)
    })
})

function criarTable(users) {
    // Limpa table
    $("#tbodyDadosUsuarios tr").remove()
    if (users.length) {
        for (index = 0; index < users.length; index++) {
            var idusuario = { id: users[index].idusuario }
            newTrItem = $("<tr>" +
                "<td>" + (users[index].familia === null ? "" : users[index].familia) + "</td>" +
                "<td>" + (users[index].microarea === null ? "" : users[index].microarea) + "</td>" +
                "<td>" + users[index].nome_completo + "</td>" +
                "<td>" + users[index].nome_mae + "</td>" +
                "<td>" + users[index].cpf + "</td>" +
                "<td>" + users[index].rg + "</td>" +
                "<td>" + users[index].cns + "</td>" +
                "<td><a href='editartablegeralusuario?id=" + users[index].idusuario + "' class='btn btn-primary' role='button'>Editar</a></td>" +
                "</tr>")
            appendTable(newTrItem)
        }
    } else {
        newTrItem = $("<tr class='danger'><td colspan='8'>Nenhum resultado encontrado.</td></tr>")
        appendTable(newTrItem)
    }
}

function appendTable(newTrItem) {
    $("#tbodyDadosUsuarios").append(newTrItem)
}
