// Agendar consulta
function realizaragendamento(agendamento) {
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
            if (result) {
                $.ajax({
                    url: "/realizaragendamento",
                    type: "post",
                    dataType: "json",
                    async: true,
                    data: agendamento
                }).done(function (callback) {
                    bootbox.alert({
                        message: callback.message,
                        callback: function () {
                            retonaragendamento(agendamento.date)
                        }
                    })
                }).fail(function (callback) {
                    jsonCb = JSON.parse(callback.responseText)
                    bootbox.alert({
                        message: jsonCb.message,
                        callback: function () {
                            retonaragendamento(agendamento.date)
                        }
                    })
                })
            }
        }
    })
}
