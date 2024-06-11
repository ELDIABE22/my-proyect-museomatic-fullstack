export const formatearFecha = (fechaISO) => {
    var fechaObjeto = new Date(fechaISO);
    var dias = fechaObjeto.getDate();
    var meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    var ano = fechaObjeto.getFullYear();
    return dias + ' ' + meses[fechaObjeto.getMonth()] + ' ' + ano;
}

export const parseEventDate = (dateString) => {
    const parts = dateString.split(" ");
    if (parts.length !== 3 || !["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"].includes(parts[1])) {
        console.error(`Formato de fecha de evento inválido: ${dateString}`);
        return null;
    }

    const monthIndex = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"].indexOf(parts[1]);
    return new Date(parseInt(parts[2]), monthIndex, parseInt(parts[0]));
}

export const isLeapYear = (year) => {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export const getDaysInMonth = (monthIndex, isLeapYear) => {
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (monthIndex === 1 && isLeapYear) {
        return 29;
    }
    return daysInMonth[monthIndex];
}

export const formatearHora = (time) => {
    var partesTiempo = time.split(':');
    var horas = String(partesTiempo[0]).padStart(2, '0');
    var minutos = String(partesTiempo[1]).padStart(2, '0');
    return horas + ':' + minutos;
}
