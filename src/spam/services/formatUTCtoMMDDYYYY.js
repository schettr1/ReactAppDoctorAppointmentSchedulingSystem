/**
* converts UTC Date '2014-04-11 14:00:00+000.0000' to String value '04/11/2014'
* You can use EcmaScript5 to export function like this
* export function formatUTCtoMMDDYYYY(utc) { ... }
*/
export const formatUTCtoMMDDYYYY = (utc) => {
  var date = new Date(utc);
  var year = date.getFullYear();
  var month = 1 + date.getMonth();	// January = 0 and December = 11
  month = ('0' + month).slice(-2);	// single digit month such as 2 becomes two digit month 02
  var day = date.getDate();
  day = ('0' + day).slice(-2);		// single digit day such as 2 becomes two digit day 02
  var hrs = date.getHours();
  //hrs = ('0' + hrs).slice(-2);
  //var mins = date.getMinutes();
  //mins = ('0' + mins).slice(-2);
  //return month + '/' + day + '/' + year + ' ' + hrs + ':' + mins;
    return month + '/' + day + '/' + year;
}
