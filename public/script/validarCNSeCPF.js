function fuValidarCNS(CNS) {
    if (CNS.match("[1-2]\\d{10}00[0-1]\\d") || CNS.match("[7-9]\\d{14}")) {
        return somaPonderada(CNS) % 11 == 0
    }
    return false
}

function somaPonderada(CNS) {
    let soma = 0
    for (let i = 0; i < CNS.length; i++) {
        soma += Math.floor(CNS[i], 10) * (15 - i)
    }
    return soma
}

function fuValidarCPF(CPF) {
    CPF = CPF.replace(/[^\d]+/g, '')
    if (CPF == '') return false
    // Elimina CPFs invalidos conhecidos    
    if (CPF.length != 11 ||
        CPF == "00000000000" ||
        CPF == "11111111111" ||
        CPF == "22222222222" ||
        CPF == "33333333333" ||
        CPF == "44444444444" ||
        CPF == "55555555555" ||
        CPF == "66666666666" ||
        CPF == "77777777777" ||
        CPF == "88888888888" ||
        CPF == "99999999999")
        return false
    // Valida 1o digito 
    add = 0
    for (i = 0; i < 9; i++)
        add += parseInt(CPF.charAt(i)) * (10 - i)
    rev = 11 - (add % 11)
    if (rev == 10 || rev == 11)
        rev = 0
    if (rev != parseInt(CPF.charAt(9)))
        return false
    // Valida 2o digito 
    add = 0
    for (i = 0; i < 10; i++)
        add += parseInt(CPF.charAt(i)) * (11 - i)
    rev = 11 - (add % 11)
    if (rev == 10 || rev == 11)
        rev = 0
    if (rev != parseInt(CPF.charAt(10)))
        return false
    return true
}