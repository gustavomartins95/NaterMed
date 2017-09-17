// Selecionar profissional
jQuery(document).ready(function () {
    $.ajax({
        url: "/retonarhorarioagendamento",
        type: "get",
        dataType: "json",
        async: true,
    }).done(function (callback) {
        criarSelect(callback.hour)
    })

    $('#txtEsp').change(function () {
        if ($('#txtEsp').val() == 'Não Declarado') {
            $('#calendar').remove()
            $("#tbodyDados tr").remove()
        } else {
            // Criar calendario
            $('#calendar').remove()
            $("#tbodyDados tr").remove()
            criarCalendario()
        }
    })
})

function criarSelect(hour) {
    for (index = 0; index < hour.length; index++) {
        newOptionItem = $("<option value='" + hour[index].profissional_idprofissional + "' " +
            // Informações
            "data-nome_completo='" + hour[index].profissional_nome_completo + "' " +
            "data-especialidade='" + hour[index].profissional_especialidade + "' " +
            // Segunda
            "data-diamo='" + hour[index].diamo + "' " +
            "data-horamo='" + hour[index].horamo + "' " +
            "data-fichamo='" + hour[index].fichamo + "' " +
            // Terça
            "data-diatu='" + hour[index].diatu + "' " +
            "data-horatu='" + hour[index].horatu + "' " +
            "data-fichatu='" + hour[index].fichatu + "' " +
            // Quarta
            "data-diawe='" + hour[index].diawe + "' " +
            "data-horawe='" + hour[index].horawe + "' " +
            "data-fichawe='" + hour[index].fichawe + "' " +
            // Quinta
            "data-diath='" + hour[index].diath + "' " +
            "data-horath='" + hour[index].horath + "' " +
            "data-fichath='" + hour[index].fichath + "' " +
            // Sexta
            "data-diafr='" + hour[index].diafr + "' " +
            "data-horafr='" + hour[index].horafr + "' " +
            "data-fichafr='" + hour[index].fichafr + "'>" +
            hour[index].profissional_nome_completo + " - " +
            hour[index].profissional_especialidade + "</option>")
        appendSelect(newOptionItem)
    }
}
function appendSelect(newOptionItem) {
    $("#txtEsp").append(newOptionItem)
}

// "su","mo","tu","we","th","fr","sa"
function criarCalendario() {
    // Criar novos calendarios
    newDivCalendar = '<div id="calendar"></div>'
    $('.demo-section').append(newDivCalendar)
    // Semana
    semana = ["su", "mo", "tu", "we", "th", "fr", "sa"]
    // Data de hoje
    date = new Date()
    diaAtual = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    mesAtual = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
    anoAtual = date.getFullYear()
    // Calendar
    $("#calendar").kendoCalendar({
        change: function () {
            diaSelecionado = new Date(kendo.toString(this.value(), 'u'))
            // Retornar dados da data escolhida
            retonaragendamento(kendo.toString(this.value(), 'u'),
                $('#txtEsp :selected').data('ficha' + semana[diaSelecionado.getDay() + 1]))
        },
        min: new Date(anoAtual, (mesAtual - 1), diaAtual),
        max: new Date(anoAtual, 11, 31),
        disableDates: ["sa", "su",
            $('#txtEsp :selected').data('diamo') ? "" : "mo",
            $('#txtEsp :selected').data('diatu') ? "" : "tu",
            $('#txtEsp :selected').data('diawe') ? "" : "we",
            $('#txtEsp :selected').data('diath') ? "" : "th",
            $('#txtEsp :selected').data('diafr') ? "" : "fr"
        ],
        footer: "#: kendo.toString(data, 'D') #"
    })
}

