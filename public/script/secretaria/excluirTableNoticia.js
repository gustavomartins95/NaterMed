// Excluir table notícia
function excluirtablenoticia(idnoticia) {
    bootbox.confirm({
        title: "Excluir noticia",
        message: "Deseja realmente excluir a notícia?",
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
                    url: "/excluirtablenoticia",
                    type: "post",
                    dataType: "json",
                    async: true,
                    data: idnoticia
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
