// Agendar consulta
function realizargeralagendamento(agendamento) {
    // Usuário
    if (!$('#txtPaciente :selected').val()) {
        sendMsg("Escolha o usuário!", 0)
        bootbox.alert("Escolha o usuário!")
        // Retornar ao topo
        $('html, body').animate({ scrollTop: 0 }, 1000)
    } else {
        bootbox.confirm({
            title: "Marcar consulta",
            message: "Deseja realmente marcar sua consulta?",
            buttons: {
                cancel: {
                    label: 'Cancelar',
                    className: 'btn-default'
                },
                confirm: {
                    label: 'Marcar',
                    className: 'btn-success'
                }
            },
            callback: function (result) {
                // Semana
                semana = ["su", "mo", "tu", "we", "th", "fr", "sa"]
                if (result) {
                    $.ajax({
                        url: "/realizargeralagendamento",
                        type: "post",
                        dataType: "json",
                        async: true,
                        data: agendamento
                    }).done(function (callback) {
                        bootbox.alert({
                            message: callback.message,
                            callback: function () {
                                diaSelecionado = new Date(agendamento.date)
                                retonargeralagendamento(agendamento.date,
                                    $('#txtEsp :selected').data('ficha' + semana[diaSelecionado.getDay() + 1]))
                            }
                        })
                    }).fail(function (callback) {
                        jsonCb = JSON.parse(callback.responseText)
                        bootbox.alert({
                            message: jsonCb.message,
                            callback: function () {
                                diaSelecionado = new Date(agendamento.date)
                                retonargeralagendamento(agendamento.date,
                                    $('#txtEsp :selected').data('ficha' + semana[diaSelecionado.getDay() + 1]))
                            }
                        })
                    })
                }
            }
        })
    }
}
