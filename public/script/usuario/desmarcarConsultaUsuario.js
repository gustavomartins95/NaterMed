// Desmarcar consulta
function desmarcaragendamento(agendamento) {
    bootbox.confirm({
        title: "Desmarcar consulta",
        message: "Deseja realmente desmarcar sua consulta?",
        buttons: {
            cancel: {
                label: 'Cancelar',
                className: 'btn-default'
            },
            confirm: {
                label: 'Desmarcar',
                className: 'btn-danger'
            }
        },
        callback: function (result) {
            // Semana
            semana = ["su", "mo", "tu", "we", "th", "fr", "sa"]
            if (result) {
                $.ajax({
                    url: "/desmarcaragendamento",
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
