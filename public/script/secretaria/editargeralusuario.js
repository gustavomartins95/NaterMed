// Form submit
jQuery(document).ready(function () {
    $('.form-users').submit(function (event) {
        event.preventDefault()
        validationRegister()
    })
    // Checkbox checked desativa o input
    $("#che-cpf, #che-rg, #che-cns").on('change', function () {
        $("#che-cpf").is(':checked') ?
            $("#inp-cpf").attr('disabled', 'disabled').val('') :
            $("#inp-cpf").removeAttr('disabled')
        $("#che-rg").is(':checked') ?
            $("#inp-rg").attr('disabled', 'disabled').val('') :
            $("#inp-rg").removeAttr('disabled')
        $("#che-cns").is(':checked') ?
            $("#inp-cns").attr('disabled', 'disabled').val('') :
            $("#inp-cns").removeAttr('disabled')
    })
})

// Validações
function validationRegister() {
    // Mensagens de erros
    msgErrors = ""
    // Todos os campos estão vazios
    if ($('#txtNome_Completo').val() == "" ||
        $('#txtNome_Mae').val() == "" ||
        $('#txtNaturalidade').val() == "" ||
        $('#txtData_Nasc').val() == "" ||
        $('#txtEstado').val() == "" ||
        $('#txtCidade').val() == "" ||
        ($('#inp-cpf').val() == "" && !$('#che-cpf').is(":checked")) ||
        ($('#inp-rg').val() == "" && !$('#che-rg').is(":checked")) ||
        ($('#inp-cns').val() == "" && !$('#che-cns').is(":checked"))) {
        msgErrors = "Fique atento aos campos obrigatórios indicados pelo asterisco (*)<br />"
    }
    // Informe o input ou marque o checkbox
    $('#inp-cpf').val() == "" && !$('#che-cpf').is(":checked") ?
        $(".error-cpf").css("display", "block").text("Informe o campo ou marque a opção acima") :
        $(".error-cpf").css("display", "block").text("")
    $('#inp-rg').val() == "" && !$('#che-rg').is(":checked") ?
        $(".error-rg").css("display", "block").text("Informe o campo ou marque a opção acima") :
        $(".error-rg").css("display", "block").text("")
    $('#inp-cns').val() == "" && !$('#che-cns').is(":checked") ?
        $(".error-cns").css("display", "block").text("Informe o campo ou marque a opção acima") :
        $(".error-cns").css("display", "block").text("")
    // Validar CNS
    if (!$('#che-cns').is(":checked")) {
        if (!fuValidarCNS($('#inp-cns').val()))
            msgErrors += ("Cartão SUS Inválido.<br />")
    }
    // Validar CPF
    if (!$('#che-cpf').is(":checked")) {
        if (!fuValidarCPF($('#inp-cpf').val()))
            msgErrors += ("CPF Inválido.<br />")
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
        url: "/editargeralusuario",
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
        window.location = "/listargeralusuario"
    }).fail(function (callback) {
        jsonCb = JSON.parse(callback.responseText)
        sendMsg(jsonCb.message)
    })
}
