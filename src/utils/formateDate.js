export const formatearFecha = (fechaISO) => {
    var fechaObjeto = new Date(fechaISO);
    var dias = fechaObjeto.getDate();
    var meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    var ano = fechaObjeto.getFullYear();
    return dias + ' ' + meses[fechaObjeto.getMonth()] + ' ' + ano;
}

export const formatearHora = (time) => {
    var partesTiempo = time.split(':');
    var horas = String(partesTiempo[0]).padStart(2, '0');
    var minutos = String(partesTiempo[1]).padStart(2, '0');
    return horas + ':' + minutos;
}
