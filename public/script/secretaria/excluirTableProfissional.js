// Excluir table profissional
function excluirtableprofissional(idprofissional) {
    bootbox.confirm({
        title: "Excluir profissional",
        message: "Será apagado os dados do profissional juntamente com seu login e horário.",
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
                    url: "/excluirtableprofissional",
                    type: "post",
                    dataType: "json",
                    async: true,
                    data: idprofissional
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
