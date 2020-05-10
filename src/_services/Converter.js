import statesArray from '../Admin.AddDoctor/States';
//import {convertIntegerStateToString} from '../_services/Converter.js';


/*
* convert integer value of State to String value
* @param - Integer (ex: 1, 2 etc)
* @return - String (ex: AK, AR etc)
*/
export function convertIntegerStateToString(num) {
  let _state = '';
  statesArray.map(x=>{
    let _obj = x;
    if (num === _obj.value) {
      _state = _obj.label;
    }
    return null;
  });
  return _state;
}



/*
* convert integer value from database to String value
* @param - 1
* @return - MALE
*/
export function convertIntegerCategoryToString(num) {
  switch(num) {
    case 1:
      return 'GENERAL_PHYSICIAN';
    case 2:
      return 'DERMATOLOGIST';
    case 3:
      return 'ORTHOPEDIC';
    case 4:
      return 'PEDIATRIC';
    default:  // case 5
      return 'NEUROLOGIST';
  }
}



/*
* convert integer value from database to String value
* @param - Integer (ex: 1, 2, etc)
* @return - String (ex: MALE, FEMALE etc)
*/
export function convertIntegerGenderToString(num) {
  switch(num) {
    case 1:
      return 'MALE';
    case 2:
      return 'FEMALE';
    default: // case 3
      return 'OTHER';
  }
}


/*
* convert Status from Number to Name
* @param : 1
* @return : 'BOOKED'
*/
export function convertIntegerStatusToString(num) {
  switch(num) {
    case 1:
      return 'BOOKED';
    case 2:
      return 'RECEIVED';
    case 3:
      return 'COMPLETED';
    case 4:
      return 'NOT_ARRIVED';
    default:  // case 5
      return 'CANCELED';
  }
}


/*
* convert Status from Name to Number
* @param : 'BOOKED'
* @return : 1
*/
export function convertStringStatusToInteger(num) {
  switch(num) {
    case 'BOOKED':
      return 1;
    case 'RECEIVED':
      return 2;
    case 'COMPLETED':
      return 3;
    case 'NOT_ARRIVED':
      return 4;
    default:  // case 'CANCELED'
      return 5;
  }
}


/*
* convert Status from Number to Name
* @param : [1, 8]
* @return : 'MD', 'PhD'
*/
export function convertIntegerDegreesToString(arr) {
  let _degrees = '';
  arr.forEach((item, i) => {
    let value = '';
    if(item === 1) {
      value = 'MD';
    }
    if(item === 2) {
      value = 'DO';
    }
    if(item === 3) {
      value = 'MBBS';
    }
    if(item === 4) {
      value = 'MPH';
    }
    if(item === 5) {
      value = 'MHS';
    }
    if(item === 6) {
      value = 'MEd';
    }
    if(item === 7) {
      value = 'MS';
    }
    if(item === 8) {
      value = 'MBA';
    }
    if(item === 9) {
      value = 'PhD';
    }
    _degrees = _degrees + ', ' + value;
  });
  _degrees = _degrees.substring(1, _degrees.length);
  return _degrees;
}


/*
* param - 2020-05-01
* return - 05/01/2020
*/
export function convertDatePickerDateToAppointmentDate(date) {
  var year = date.substring(0, 4);
  var month = date.substring(5, 7);
  var day = date.substring(8, 10);
  return month + '/' + day + '/' + year;
}


/*
* Birthdate was stored to Database as String UTC value '2014-04-11T14:00'
* param - String UTC '2014-04-11T14:00:00.000+0000'
* return - String '04/11/2014'
*/
export function convertStringUTCDatetoBirthdate(stringUTC) {
  var year = stringUTC.substring(0, 4);
  var month = stringUTC.substring(5, 7);
  var day = stringUTC.substring(8, 10);
  return month + '/' + day + '/' + year;
}



/*
* round number to tenth place
* param - 4.3333 or 3
* return - 4.0 or 3.0
*/
export function roundNumberToTenthPlace(num) {
  let _num = num.toString().concat('.0');
  return _num.substring(0,3);
}



/*
* Feedback is saved as Date object to the database. This date represents the localtime of user while feedback was posted.
* Therefore, we must use new Date(stringUTC). This new date represents the localtime of viewer when feedback was posted.
* param - stringUTC = '2014-04-11 14:00:00.000+0000'
* return - localtime_date = '04/11/2014 10:00'
*/
export function convertStringUTCDateToLocalTimeFormat(stringUTC) {
  var date = new Date(stringUTC);
  var year = date.getFullYear();
  var month = 1 + date.getMonth();	// January = 0 and December = 11
  month = ('0' + month).slice(-2);	// single digit month such as 2 becomes two digit month 02
  var day = date.getDate();
  day = ('0' + day).slice(-2);		// single digit day such as 2 becomes two digit day 02
  var hrs = date.getHours();
  hrs = ('0' + hrs).slice(-2);
  var mins = date.getMinutes();
  mins = ('0' + mins).slice(-2);
  let localtime_date = month + '/' + day + '/' + year + ' ' + hrs + ':' + mins;
  return localtime_date;
}



/*
* Appointment is saved as String value '2014-04-11 14:00:00.000+0000' to the database.
* It's value does not change when it is retrieved from the database.
* param - stringUTC = '2014-04-11 14:00:00.000+0000'
* return - date = '04/11/2014 14:00'
*/
export function convertStringUTCDateToAppointmentDateTimeFormat(stringUTC) {
  var year = stringUTC.substring(0, 4);
  var month = stringUTC.substring(5, 7);
  var day = stringUTC.substring(8, 10);
  var time = stringUTC.substring(11, 16);
  return month + '/' + day + '/' + year + ' ' + time;
}



/*
* Needed when selecting appointments by date by Admin.
* param - stringUTC = '2014-04-11 14:00:00.000+0000'
* return - date = '04/11/2014'
*/
export function convertStringUTCDatetoAppointmentDateFormat(stringUTC) {
  var year = stringUTC.substring(0, 4);
  var month = stringUTC.substring(5, 7);
  var day = stringUTC.substring(8, 10);
  return month + '/' + day + '/' + year;
}


export function getHHMMfromStringUTCDate(stringUTC) {
  return stringUTC.substring(11, 16);
}



//
// Only used for displaying Doctor's Daily Schedule in Doctor.ViewAppointments
// converts UTC date to string value HH:MM
// @param : 2020-05-01T15:00:00.000+0000
// @return : 03:00
//
export function convertDateUTCtoHHMMampm(utc) {  // 2020-05-01T15:00:00.000+0000
  let _hrs = utc.substring(11, 13);       // _hrs = 15
  let _mins = utc.substring(14, 16);       // _mins = 00
  if(parseInt(_hrs) >= 12) {          // _hrs = 15 becomes 3
    _hrs = _hrs - 12;
    _hrs = ('0' + _hrs).slice(-2);
    return _hrs + ':' + _mins + ' PM';
  }
  _hrs = ('0' + _hrs).slice(-2);
  return _hrs + ':' + _mins + ' AM';
}



// convert new Date() object to string format 'YYYY-MM-DD' because
// <input type='date' value=''/> accepts value in 'YYYY-MM-DD' format.

export function getDatePickerCompatibleDate(date) {   // date = new Date();
  var year = date.getFullYear();
  var month = 1 + date.getMonth();	// adding 1 makes month accurate January = 1 + 0 = 1 and December = 1 + 11 = 12
  month = ('0' + month).slice(-2);	// adding 0 makes single digit months 2 digit so that you get last 2 digits i.e. 2 -> 02 and 11 -> 11
  var day = date.getDate();
  day = ('0' + day).slice(-2);		// single digit day such as 2 becomes two digit day 02
  return year + '-' + month + '-' +  day;
}



/*
* @paramId -> 08:30 AM / 03:00 PM
* @return -> 08:00 / 15:00
* Conversion https://stackoverflow.com/questions/15083548/convert-12-hour-hhmm-am-pm-to-24-hour-hhmm
*/
export function convertAMPMtimeToMilitaryTime(time) {
  console.log('time=', time);

  let _hrs = time.substring(0, 2);    // get hrs only from '08:00 AM'
  // convert hours 01, 02, 03, 04, 05... to military time 13, 14, 15, 16, 17...
  if(time.includes('PM') && parseInt(_hrs) < 12) {
    console.log('time includes PM and hrs < 12');
    _hrs = parseInt(_hrs);
    _hrs = _hrs + 12;
  }
  else if(time.includes('AM') && parseInt(_hrs) === 12) {
    console.log('time includes AM and hrs === 12');
    _hrs = 0;
  }
  else { // if(time.includes('AM') && parseInt(_hrs) < 12) || if(time.includes('PM') && parseInt(_hrs) === 12)
    console.log('time includes AM and hrs < 12 OR time includes PM and hrs == 12');
    _hrs = parseInt(_hrs);
  }
  _hrs = ('0' + _hrs).slice(-2);		    // single digit hrs such as 2 becomes two digit hour 02

  let _mins = time.substring(3, 5);   // get mins only from '11:30'
  _mins = parseInt(_mins);
  _mins = ('0' + _mins).slice(-2);		  // single digit mins such as 2 becomes two digit mins 02

  let _hhmm = _hrs + ':' + _mins;
  console.log('Military-Time HH:MM=', _hhmm);
  return _hhmm;
}




/*
* @paramId -> UTC String = '2020-01-01T16:00.000+0000', '2020-01-01T13:00.000+0000'
* @return -> localtime = '12:00 PM', '09:00 AM'
*/
export function convertMilitaryTimeToAMPMtime(militaryTime) {
  let hrs = militaryTime.substring(0, 2);
  let _AMorPM = hrs >= 12 ? 'PM' : 'AM';
  if(hrs > 12) {                                //  if hrs = 18 then return 6; No need to change when hrs <= 12
    hrs = hrs - 12;
  }
  hrs = ('0' + hrs).slice(-2);		             // single digit _hrs such as 2 becomes two digit _hrs 02
  let mins = militaryTime.substring(3, 5);
  mins = ('0' + mins).slice(-2);		             // single digit _hrs such as 2 becomes two digit _hrs 02
  let time = hrs + ':' + mins + ' ' + _AMorPM;
  return time;
}
