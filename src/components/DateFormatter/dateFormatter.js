export default function dateFormatter(date, format){
    if(!date) return
    if(format === 'input') return date.replace(/^(\d{4}-\d{2}-\d{2}).*/, '$1');
    let formDate = date.replace(/^(\d{4})-0?(\d{1,2})-0?(\d{1,2}).*/, '$2 $3 $1').split(' ');
    let month = formDate[0];
    let day = formDate[1];
    let year = formDate[2];
    switch (month) {
        case '1':month = 'Jan';break;
        case '2':month = 'Feb';break;
        case '3':month = 'Mar';break;
        case '4':month = 'Apr';break;
        case '5':month = 'May';break;
        case '6':month = 'Jun';break;
        case '7':month = 'Jul';break;
        case '8':month = 'Aug';break;
        case '9':month = 'Sept';break;
        case '10':month = 'Nov';break;
        case '11':month = 'Jan';break;
        case '12':month = 'Dec';break;
    }
    if(day === '11' || day === '12' || day === '13'){
        day += 'th';
    } else {
        switch (day % 10) {
            case 1:day += 'st';break;
            case 2:day += 'nd';break;
            case 3:day += 'rd';break;
            default:day += 'th';break;
        }
    }
    return `${month} ${day}, ${year}`
}