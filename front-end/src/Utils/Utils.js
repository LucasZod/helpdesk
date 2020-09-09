
export function date(){

    let data = new Date();
    let dia = data.getDate();
    let mes = data.getMonth() + 1;
    let ano = data.getFullYear();

    if(dia < 10){ dia = '0' + dia }
    if(mes < 10){ mes = '0' + mes }
    const dataCompleta = `${dia}/${mes}/${ano}`
    return dataCompleta;
 }

 export function DataPrev(){

    let data = new Date();
    let dia = data.getDate() + 3;
    let mes = data.getMonth() + 1;
    let ano = data.getFullYear();

    if(dia < 10){ dia = '0' + dia }
    if(mes < 10){ mes = '0' + mes }

    const dataCompleta = parseInt(`${ano}${mes}${dia}`);
    return dataCompleta;
 }


 export function DataFinalizada(){

   let data = new Date();
   let dia = data.getDate();
   let mes = data.getMonth() + 1;
   let ano = data.getFullYear();

   if(dia < 10){ dia = '0' + dia }
   if(mes < 10){ mes = '0' + mes }

   const dataCompleta = parseInt(`${ano}${mes}${dia}`);
   return dataCompleta;
}