// Excluir table medicamento
function excluirtablemedicamento(idmedicamento) {
    bootbox.confirm({
        title: "Excluir medicamento",
        message: "Deseja realmente excluir o medicamento?",
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
                    url: "/excluirtablemedicamento",
                    type: "post",
                    dataType: "json",
                    async: true,
                    data: idmedicamento
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
