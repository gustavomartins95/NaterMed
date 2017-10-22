// Retorna table notícia
jQuery(document).ready(function () {
    $.ajax({
        url: "/alertaragendamento",
        type: "get",
        dataType: "json",
        async: true,
    }).done(function (callback) {
        criarTableAlertas(callback.alerta)
    })
})

function criarTableAlertas(alerta) {
    if (alerta.length) {
        // Verificar se clicou no botão 'Não mostrar alerta'
        let msgAlerta = sessionStorage.getItem('msgAlerta_' + alerta[0].usuario_idusuario)
        if (msgAlerta == null) {
            for (index = 0; index < alerta.length; index++) {
                switch (alerta[index].faltam) {
                    case 0:
                        newTr = "<tr class='danger'>"
                        break
                    default:
                        newTr = "<tr>"
                        break
                }
                newTrItem = $(newTr +
                    "<td>" + (alerta[index].faltam == 0 ? 'Hoje' : alerta[index].faltam + ' dia(as)') + "</td>" +
                    "<td>" + alerta[index].data_agend_format + "</td>" +
                    "<td>" + alerta[index].numero_ficha + "</td>" +
                    "<td>" + alerta[index].profissional_nome_completo + "</td>" +
                    "<td>" + alerta[index].profissional_especialidade + "</td>" +
                    "</tr>")
                appendTableAlertas(newTrItem)
            }
            $(".modal-footer").append("<button type='button' class='btn btn-warning' data-dismiss='modal' " +
                "onclick='naoMostrarAlerta(" + alerta[0].usuario_idusuario + ")'>Não mostrar alerta</button>")
            $(".modal-footer").append("<button type='button' class='btn btn-danger' data-dismiss='modal'>Fechar</button>")
            $('#alertas').modal('show')
        }
    }
}

function appendTableAlertas(newTrItem) {
    $("#tbodyAlerta").append(newTrItem)
}

function naoMostrarAlerta(identificacao) {
    sessionStorage.setItem('msgAlerta_' + identificacao, 'Não mostrar alerta.')
}