// Form submit
jQuery(document).ready(function () {
    $('.form-users').submit(function (event) {
        event.preventDefault()
        validationRegister()
    })
})

// Validações
function validationRegister() {
    // Mensagens de erros
    msgErrors = ""
    // Todos os campos estão vazios
    if ($('#txtAno').val() == "") {
        msgErrors = "Informe o ano para gerar o relatório."
    }
    // Erros ou Dados
    if (msgErrors) {
        sendMsg(msgErrors)
    } else {
        sendMsg(msgErrors)
        $('#divResult').removeClass("alert-danger")
        sendData()
    }
}

// Mostrar mensagens de erros
function sendMsg(msg) {
    $('#divResult').addClass("alert-danger")
    $('#result').html(msg)
    $('#divResult').fadeIn(500)
    return false
}

// Enviar formulário via AJAX
function sendData() {
    $.ajax({
        url: "/retornarrelatoriousuario",
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
        criarRelatorio(callback.dbSeries)
    }).fail(function (callback) {
        console.log(callback)
        jsonCb = JSON.parse(callback.responseText)
        sendMsg(jsonCb.message)
    })
}

function criarRelatorio(dbSeries) {
    // Opções do gráfico
    var myChartOptions = {
        chart: {
            renderTo: 'relatorio',
            type: 'column'
        },
        title: {
            text: 'Total de agendamentos realizados no ano de ' + $('#txtAno').val()
        },
        xAxis: {
            categories: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Total de agendamentos realizados com cada profissional no ano de ' + $('#txtAno').val()
            },
            stackLabels: {
                enabled: true,
                style: {
                    fontWeight: 'bold',
                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                }
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
            headerFormat: '<b>{point.x}</b><br/>',
            pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
        },
        plotOptions: {
            column: {
                stacking: 'normal',
                dataLabels: {
                    enabled: true,
                    color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
                }
            }
        },
        series: []
    }

    // Criar a series do gráfico
    for (let i = 0; i < dbSeries.length; i++) {
        // Variável que identifica se algum Dr. foi encontrado na series
        var encontrado = 0
        // Verificar se já tem o Dr. na series
        for (let j = 0; j < myChartOptions.series.length; j++) {
            // Se já tem, modifica o data []
            if (myChartOptions.series[j].name == (dbSeries[i].profissional_nome_completo + ' - ' + dbSeries[i].profissional_especialidade)) {
                myChartOptions.series[j].data[dbSeries[i].mes - 1] = dbSeries[i].qtd_agen
                // Modifica a variável e break
                encontrado = 1
                break
            }
        }
        // Se não tem, criar uma nova series
        if (encontrado == 0) {
            var createSeries = {
                data: []
            }
            createSeries.name = dbSeries[i].profissional_nome_completo + ' - ' + dbSeries[i].profissional_especialidade
            for (let j = 0; j < 12; j++) {
                if (dbSeries[i].mes == (j + 1)) createSeries.data.push(dbSeries[i].qtd_agen)
                else createSeries.data.push("")
            }
            myChartOptions.series.push(createSeries)
        }
    }

    // Criar o gráfico
    var myChart = new Highcharts.Chart(myChartOptions)
}
