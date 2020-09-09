
export function date(){

    var data = new Date();
    var dia = data.getDate();
    var mes = data.getMonth() + 1;
    var ano = data.getFullYear();

    if(dia < 10){ dia = '0' + dia }
    if(mes < 10){ mes = '0' + mes }
    const dataCompleta = `${dia}/${mes}/${ano}`
    return dataCompleta;
 }