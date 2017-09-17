// Form submit
jQuery(document).ready(function () {
    $('.form-users').submit(function (event) {
        event.preventDefault()
        validationRegister()
    })
    // Checkbox checked desativa o input
    $("#txt_diamo, #txt_diatu, #txt_diawe, #txt_diath, #txt_diafr").on('change', function () {
        $("#txt_diamo").is(':not(:checked)') ?
            $("#txt_horamo").attr('disabled', 'disabled').val('') &&
            $("#txt_fichamo").attr('disabled', 'disabled').val('') :
            $("#txt_horamo").removeAttr('disabled') &&
            $("#txt_fichamo").removeAttr('disabled')
        $("#txt_diatu").is(':not(:checked)') ?
            $("#txt_horatu").attr('disabled', 'disabled').val('') &&
            $("#txt_fichatu").attr('disabled', 'disabled').val('') :
            $("#txt_horatu").removeAttr('disabled') &&
            $("#txt_fichatu").removeAttr('disabled')
        $("#txt_diawe").is(':not(:checked)') ?
            $("#txt_horawe").attr('disabled', 'disabled').val('') &&
            $("#txt_fichawe").attr('disabled', 'disabled').val('') :
            $("#txt_horawe").removeAttr('disabled') &&
            $("#txt_fichawe").removeAttr('disabled')
        $("#txt_diath").is(':not(:checked)') ?
            $("#txt_horath").attr('disabled', 'disabled').val('') &&
            $("#txt_fichath").attr('disabled', 'disabled').val('') :
            $("#txt_horath").removeAttr('disabled') &&
            $("#txt_fichath").removeAttr('disabled')
        $("#txt_diafr").is(':not(:checked)') ?
            $("#txt_horafr").attr('disabled', 'disabled').val('') &&
            $("#txt_fichafr").attr('disabled', 'disabled').val('') :
            $("#txt_horafr").removeAttr('disabled') &&
            $("#txt_fichafr").removeAttr('disabled')
    })
})

// Validações
function validationRegister() {
    // Verificar
    msgErrors = "Informe os campos do dia marcado."
    errors = ""
    // Informe ao menos um
    if (!$("#txt_diamo, #txt_diatu, #txt_diawe, #txt_diath, #txt_diafr").is(':checked')) {
        errors = 1
        msgErrors = "Nenhum dia foi marcado."
    }
    // Informe o input ou marque o checkbox
    $("#txt_diamo").is(':checked') && ($('#txt_horamo').val() == "" || $('#txt_fichamo').val() == "") ?
        errors = 1 &&
        $(".error-mo").css("display", "block").text("Informe os campos de segunda-feira.") :
        $(".error-mo").css("display", "block").text("")
    $("#txt_diatu").is(':checked') && ($('#txt_horatu').val() == "" || $('#txt_fichatu').val() == "") ?
        errors = 1 &&
        $(".error-tu").css("display", "block").text("Informe os campos de terça-feira.") :
        $(".error-tu").css("display", "block").text("")
    $("#txt_diawe").is(':checked') && ($('#txt_horawe').val() == "" || $('#txt_fichawe').val() == "") ?
        errors = 1 &&
        $(".error-we").css("display", "block").text("Informe os campos de quarta-feira.") :
        $(".error-we").css("display", "block").text("")
    $("#txt_diath").is(':checked') && ($('#txt_horath').val() == "" || $('#txt_fichath').val() == "") ?
        errors = 1 &&
        $(".error-th").css("display", "block").text("Informe os campos de quinta-feira.") :
        $(".error-th").css("display", "block").text("")
    $("#txt_diafr").is(':checked') && ($('#txt_horafr').val() == "" || $('#txt_fichafr').val() == "") ?
        errors = 1 &&
        $(".error-fr").css("display", "block").text("Informe os campos de sexta-feira.") :
        $(".error-fr").css("display", "block").text("")
    // Erros ou Dados
    if (errors != "") {
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
    if ($('#txtIdentificacao').val() == 'cadastrar') {
        $.ajax({
            url: "/cadastrarhorario",
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
            window.location = "/listarhorario"
        }).fail(function (callback) {
            jsonCb = JSON.parse(callback.responseText)
            sendMsg(jsonCb.message)
        })
    } else {
        $.ajax({
            url: "/editarhorario",
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
            window.location = "/listarhorario"
        }).fail(function (callback) {
            jsonCb = JSON.parse(callback.responseText)
            sendMsg(jsonCb.message)
        })
    }
}
