// Retornar dados horario
jQuery(document).ready(function () {
    $.ajax({
        url: "/retornareditartablehorario?" + window.location.href.slice(window.location.href.indexOf('?') + 1),
        type: "get",
        dataType: "json",
        async: true
    }).done(function (callback) {
        popularHorario(callback.hour)
    })
})
function popularHorario(hour) {
    $("#txtProfissional").append('<option value="' + hour[0].profissional_idprofissional + '">'
        + hour[0].profissional_nome_completo + " - " + hour[0].profissional_especialidade + '</option>')

    if (hour[0].diamo) {
        $('#txt_diamo').prop('checked', true)
        $("#txt_horamo").attr('disabled', false).val(hour[0].horamo)
        $("#txt_fichamo").attr('disabled', false).val(hour[0].fichamo)
    } else $('#txt_diamo').prop('checked', false)
    if (hour[0].diatu) {
        $('#txt_diatu').prop('checked', true)
        $("#txt_horatu").attr('disabled', false).val(hour[0].horatu)
        $("#txt_fichatu").attr('disabled', false).val(hour[0].fichatu)
    } else $('#txt_diatu').prop('checked', false)
    if (hour[0].diawe) {
        $('#txt_diawe').prop('checked', true)
        $("#txt_horawe").attr('disabled', false).val(hour[0].horawe)
        $("#txt_fichawe").attr('disabled', false).val(hour[0].fichawe)
    } else $('#txt_diawe').prop('checked', false)
    if (hour[0].diath) {
        $('#txt_diath').prop('checked', true)
        $("#txt_horath").attr('disabled', false).val(hour[0].horath)
        $("#txt_fichath").attr('disabled', false).val(hour[0].fichath)
    } else $('#txt_diath').prop('checked', false)
    if (hour[0].diafr) {
        $('#txt_diafr').prop('checked', true)
        $("#txt_horafr").attr('disabled', false).val(hour[0].horafr)
        $("#txt_fichafr").attr('disabled', false).val(hour[0].fichafr)
    } else $('#txt_diafr').prop('checked', false)

}
