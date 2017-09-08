// Excluir usuario
function excluirusuario() {
    bootbox.confirm({
        title: "Excluir usuário",
        message: "Deseja realmente excluir seu usuário?",
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
                    url: "/excluirusuario",
                    type: "post",
                    dataType: "json",
                    async: true
                }).done(function (callback) {
                    bootbox.alert({
                        message: callback.message,
                        callback: function () {
                            window.location = "/usuario"
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
