// Form submit
jQuery(document).ready(function () {
    $('.form-users').submit(function (event) {
        event.preventDefault()
        sendData()
    })
})

// Mostrar mensagens de erros
function sendMsg(msg, options) {
    $('#divResult').removeClass("alert-danger").removeClass("alert-success")
    if (options == 0) {
        $('#divResult').addClass("alert-danger")
    } else {
        $('#divResult').addClass("alert-success")
    }
    $('#result').html(msg)
    $('#divResult').fadeIn(500)
    return false
}

function sendData() {
    $.ajax({
        url: "/avaliacao",
        type: "post",
        dataType: "json",
        async: true,
        data: $("form").serialize(),
        beforeSend: function () {
            $('#btn-loading').button('loading')
        },
        complete: function () {
            setTimeout(function () {
                $('#btn-loading').button('reset')
            }, 1500)
        }
    }).done(function (callback) {
        sendMsg(callback.message, 1)
        criarRelatorio(callback.dbAvaliacao)
    }).fail(function (callback) {
        jsonCb = JSON.parse(callback.responseText)
        sendMsg(jsonCb.message, 0)
    })
}

function criarRelatorio(dbAvaliacao) {
    // Opções do gráfico
    var myChartOptions = {
        chart: {
            renderTo: 'relatorio',
            type: 'column'
        },
        title: {
            text: $('#txtIdQuestao :selected').text()
        },
        xAxis: {
            categories: [$('#txtIdQuestao :selected').text()]
        },
        yAxis: {
            title: {
                text: 'Relatório de avaliações'
            }
        },
        legend: {
            align: 'center',
            x: 0,
            verticalAlign: 'top',
            y: 25,
            floating: false,
            backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
            borderColor: '#CCC',
            borderWidth: 1,
            shadow: false
        },
        tooltip: {
            formatter: function () {
                return '<b>' + this.x + '</b><br/>' +
                    this.series.name + ': ' + this.y + '<br/>'
            }
        },
        series: []
    }

    // Criar a series do gráfico
    for (var i = 0; i < 3; i++) {
        var createSeries = {
            data: []
        }
        if (typeof dbAvaliacao[i] == 'undefined') {
            createSeries.name = $('#txtIdQuestao :selected').data('resp-' + (i + 1))
            createSeries.data.push(0)
        } else {
            createSeries.name = $('#txtIdQuestao :selected').data('resp-' + (i + 1))
            createSeries.data.push(dbAvaliacao[i].qtd_aval)
        }
        myChartOptions.series.push(createSeries)
    }

    // Criar o gráfico
    var myChart = new Highcharts.Chart(myChartOptions)
}
