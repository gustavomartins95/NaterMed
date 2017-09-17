// Excluir table horário
function excluirtablehorario(idhorario) {
    bootbox.confirm({
        title: "Excluir horário",
        message: "Deseja realmente excluir o horário?",
        buttons: {
            cancel: {
                label: 'Cancelar',
                className: 'btn-default'
            },
            confirm: {
                label: 'Excluir',
                className: 'btn-danger'
            }
        },
        callback: function (result) {
            if (result) {
                $.ajax({
                    url: "/excluirtablehorario",
                    type: "post",
                    dataType: "json",
                    async: true,
                    data: idhorario
                }).done(function (callback) {
                    bootbox.alert({
                        message: callback.message,
                        callback: function () {
                            location.reload()
                        }
                    })
                }).fail(function (callback) {
                    jsonCb = JSON.parse(callback.responseText)
                    bootbox.alert({
                        message: jsonCb.message
                    })
                })
            }
        }
    })
}
