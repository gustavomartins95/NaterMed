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
            // Semana
            semana = ["su", "mo", "tu", "we", "th", "fr", "sa"]
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
                            diaSelecionado = new Date(agendamento.date)
                            retonaragendamento(agendamento.date,
                                $('#txtEsp :selected').data('ficha' + semana[diaSelecionado.getDay() + 1]))
                        }
                    })
                }).fail(function (callback) {
                    jsonCb = JSON.parse(callback.responseText)
                    bootbox.alert({
                        message: jsonCb.message,
                        callback: function () {
                            diaSelecionado = new Date(agendamento.date)
                            retonaragendamento(agendamento.date,
                                $('#txtEsp :selected').data('ficha' + semana[diaSelecionado.getDay() + 1]))
                        }
                    })
                })
            }
        }
    })
}
