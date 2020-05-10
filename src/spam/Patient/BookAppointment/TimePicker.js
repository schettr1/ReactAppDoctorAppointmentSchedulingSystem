import React, { Component } from 'react';
import axios from 'axios';
//import { Container, Row, Col } from 'reactstrap';
import './BookAppointment.css';

class TimePicker extends Component {

  constructor(props) {
    super(props);
    this.state = {
      appointmentTimePicker: [],   // initialize from componentDidMount
      selectedRow: -1,             // -1 means no row is selected from the table; it represents each row of _appointmentPicker.

      // 5 paramters of 'appointment' object
      id: '',
      doctorid_fk: '',
      patientid_fk: '',
      starttime: '',
      endtime: ''

    }

    this.onSelectEvent = this.onSelectEvent.bind(this);
    this.convertDateToStringHrsMins = this.convertDateToStringHrsMins.bind(this);
    this.convertStringHrsMinsToDate = this.convertStringHrsMinsToDate.bind(this);
    this.onBookingAppointment = this.onBookingAppointment.bind(this);
  }


  // sequence of execution - constructor(props), this.state, render(), componentDidMount()
  // when setState() is called, any changes in initial state will call render() again
  componentDidMount(){
    console.warn('this.props.selectedDoctor (ID)=', this.props.myprop[0]);
    console.warn('this.props.selectedDate=', this.props.myprop[1]);   // prop='dateSelected' from 'BookAppointment.js'

    if(this.props.myprop[0] !== '' && this.props.myprop[0] !== '0') {       // fetch appointments of doctor for a specified date only if selectedDoctor is neither NULL nor '0' meaning '--Select--'
      axios.get('/get_appointments_by_doctorId_on_selected_date/' + this.props.myprop[0],      // this.props.myprop[0] = selectedDoctor (BookAppointment.js)
                {
                  params: {stringDate: this.props.myprop[1]}               // // this.props.myprop[1] = selectedDate (BookAppointment.js)
                }
              )
      .then(response => {
        let _appointments = response.data;                       // response.data contains [ {appointment: {}, link: {}}, {doctor: {}, link: {}}, ...]
        _appointments = _appointments.map(x => x.appointment);   // _appointments contains [ {id: 1, firstname: '', lastname: ''}, {id: 2, firstname: '', lastname: ''}, ...]
        console.log('_appointments=', _appointments);

        /*
        * create empty time-slots.
        */
        let _appointmentPicker = [
          {id: '', starttime: '08:00', endtime: '08:30', isBooked: false, selectedRow: 0},
          {id: '', starttime: '08:30', endtime: '09:00', isBooked: false, selectedRow: 1},
          {id: '', starttime: '09:00', endtime: '09:30', isBooked: false, selectedRow: 2},
          {id: '', starttime: '09:30', endtime: '10:00', isBooked: false, selectedRow: 3},
          {id: '', starttime: '10:00', endtime: '10:30', isBooked: false, selectedRow: 4},
          {id: '', starttime: '10:30', endtime: '11:00', isBooked: false, selectedRow: 5},
          {id: '', starttime: '11:00', endtime: '11:30', isBooked: false, selectedRow: 6},
          {id: '', starttime: '11:30', endtime: '12:00', isBooked: false, selectedRow: 7},
          {id: '', starttime: '01:00', endtime: '01:30', isBooked: false, selectedRow: 8},
          {id: '', starttime: '01:30', endtime: '02:00', isBooked: false, selectedRow: 9},
          {id: '', starttime: '02:00', endtime: '02:30', isBooked: false, selectedRow: 10},
          {id: '', starttime: '02:30', endtime: '03:00', isBooked: false, selectedRow: 11},
          {id: '', starttime: '03:00', endtime: '03:30', isBooked: false, selectedRow: 12},
          {id: '', starttime: '03:30', endtime: '04:00', isBooked: false, selectedRow: 13},
          {id: '', starttime: '04:00', endtime: '04:30', isBooked: false, selectedRow: 14},
          {id: '', starttime: '04:30', endtime: '05:00', isBooked: false, selectedRow: 15}
        ];

        /*
        * Incoming DATA.RESPONSE = [ {id: 5, starttime: '2020-04-18T14:00:00.000+0000', endtime: '2020-04-18T14:30:00.000+0000'}, {}, {}, ... ]
        * Transform this DATA to [ {id: 5, starttime: '02:00', endtime: '02:30', isBooked: true, selectedRow: 4}, {}, {}, ... ]
        * The starttime will be compared to empty time-slots and whenever it matches,
        * id: '' => id: 5
        * isBooked: false => isBooked: true
        * Compare 'starttime' between '_appointments' and '_appointmentPicker'
        */
        for(let i = 0; i < _appointmentPicker.length; i++) {
          for(let j = 0; j < _appointments.length; j++) {
            let obj = _appointments[j];
            let _starttime = this.convertDateToStringHrsMins(obj.starttime); // for each response.data, convert starttime '2020-05-01T20:30:00.000+0000' to '08:30'
            if(_starttime === _appointmentPicker[i].starttime) {
              console.log('Starttime Matches');
              _appointmentPicker[i].id = obj.id;
              _appointmentPicker[i].isBooked = true;
            }
          }
        }

        this.setState({
          appointmentTimePicker: _appointmentPicker
        }, ()=>{
          console.log('this.state.appointmentTimePicker=', this.state.appointmentTimePicker);
        });
      })
      .catch(function (error) {
        console.log(error);
      })
    }
  }



  render() {
    return(
      <div>
        <table>
          <tbody>
            <tr>
              {this.state.appointmentTimePicker.map((item, i) => {
                if(i<4) {
                  return (
                    <td key={i}>
                      <input type='button'
                             value={this.state.appointmentTimePicker[i].starttime + ' - ' + this.state.appointmentTimePicker[i].endtime}
                             className={"buttonStyle " + (this.state.appointmentTimePicker[i].isBooked ? 'isBooked' : (this.state.selectedRow === i ? 'rowClicked' : 'rowNotClicked'))}
                             disabled={this.state.appointmentTimePicker[i].isBooked}
                             onClick={(e)=>this.onSelectEvent(i, e)} />
                    </td>
                  )
                } else return null;
              })}
            </tr>

            <tr>
              {this.state.appointmentTimePicker.map((item, i) => {
                if(i>=4 && i<8) {
                  return (
                    <td key={i}>
                      <input type='button'
                             value={this.state.appointmentTimePicker[i].starttime + ' - ' + this.state.appointmentTimePicker[i].endtime}
                             className={"buttonStyle " + (this.state.appointmentTimePicker[i].isBooked ? 'isBooked' : (this.state.selectedRow === i ? 'rowClicked' : 'rowNotClicked'))}
                             disabled={this.state.appointmentTimePicker[i].isBooked}
                             onClick={(e)=>this.onSelectEvent(i, e)} />
                    </td>
                  )
                } else return null;
              })}
            </tr>

            <tr>
              {this.state.appointmentTimePicker.map((item, i) => {
                if(i>=8 && i<12) {
                  return (
                    <td key={i}>
                      <input type='button'
                             value={this.state.appointmentTimePicker[i].starttime + ' - ' + this.state.appointmentTimePicker[i].endtime}
                             className={"buttonStyle " + (this.state.appointmentTimePicker[i].isBooked ? 'isBooked' : (this.state.selectedRow === i ? 'rowClicked' : 'rowNotClicked'))}
                             disabled={this.state.appointmentTimePicker[i].isBooked}
                             onClick={(e)=>this.onSelectEvent(i, e)} />
                    </td>
                  )
                } else return null;
              })}
            </tr>

            <tr>
              {this.state.appointmentTimePicker.map((item, i) => {
                if(i>=12) {
                  return (
                    <td key={i}>
                      <input type='button'
                             value={this.state.appointmentTimePicker[i].starttime + ' - ' + this.state.appointmentTimePicker[i].endtime}
                             className={"buttonStyle " + (this.state.appointmentTimePicker[i].isBooked ? 'isBooked' : (this.state.selectedRow === i ? 'rowClicked' : 'rowNotClicked'))}
                             disabled={this.state.appointmentTimePicker[i].isBooked}
                             onClick={(e)=>this.onSelectEvent(i, e)} />
                    </td>
                  )
                } else return null;
              })}
            </tr>
          </tbody>
        </table>

        <div>
            <input type="button" value="Book" onClick={this.onBookingAppointment} className="bookButton btn btn-primary"/>
        </div>
      </div>
    );
  }


  /*
  * This code is taken from internet and can be translated to javascript using online
  * tools such as babel converter or other ES6 to javascript converter. Here
  * i and e are parameters. When patient clicks on any Time Button from TimePicker, event is triggered
  * and value of 'i' is passed. i vaue for '08:00-08:30' is 0; i vaue for '08:30-09:00' is 1; and so on...
  * State of 'selectedRow' is set to 'i' inside onSelectEvent(). When patient clicks on 'Book' button data
  * from 'appointmentTimePicker' with selectedRow = i is used to collect starttime and endtime. These values
  * are used along with doctorid_fk and patientid_fk to create new appointment.
  */

  onSelectEvent(i, e) {
    console.log('i=', i, 'e.target.value=', e.target.value);
    if (i !== undefined) {
      this.setState({
       selectedRow: i
      });
    }
  }


  /*
  * @paramId -> Local Time or EST 2020-01-01T08:30:00.000+0000/ 2020-01-01T15:00:00.000+0000
  * @return -> 08:30/ 03:00
  * Military time (hrs) greater than 12 must be converted to (hrs-12)
  * so that it becomes 01, 02, 03, 04 and 05.
  */
  convertDateToStringHrsMins(datetime) {
    let date = datetime.substring(0, 10);
    let time = datetime.substring(11, 16);
    let newDate = new Date(date + ' ' + time);       // use new Date('2020-01-01 15:00') instead of new Date('2020-01-01T15:00:00.000+0000') because the later +4 hrs more
    //console.log('newDate=', newDate);
    let _hrs = newDate.getHours();
    if(_hrs > 12) {                                  // if hrs = 14 then return 2; if hrs = 06 then return 06
      _hrs = _hrs - 12;
    }
    _hrs = ('0' + _hrs).slice(-2);		             // single digit _hrs such as 2 becomes two digit _hrs 02
    let _mins = newDate.getMinutes();
    _mins = ('0' + _mins).slice(-2);		             // single digit _hrs such as 2 becomes two digit _hrs 02
    //console.log('_hrs=', _hrs, ' _mins=', _mins);
    return _hrs + ':' + _mins;
  }



  /*
  * @paramId -> 08:30/ 03:00
  * @return -> 2020-01-01T08:30:00.000+0000/ 2020-01-01T15:00:00.000+0000
  */
  convertStringHrsMinsToDate(string) {
    console.log('string=', string);
    let _hrs = string.substring(0, 2);    // get hrs only from '08:00'
    _hrs = parseInt(_hrs);
    if(_hrs < 8) {
      _hrs = _hrs + 12;                   // convert hours 01, 02, 03, 04 and 05 to military time 13, 14, 15, 16 and 17
    }
    _hrs = ('0' + _hrs).slice(-2);		    // single digit hrs such as 2 becomes two digit hour 02
    let _mins = string.substring(3, 5);   // get mins only from '11:30'
    _mins = parseInt(_mins);
    _mins = ('0' + _mins).slice(-2);		  // single digit mins such as 2 becomes two digit mins 02

    const received_date = this.props.myprop[1].concat('T').concat(_hrs).concat(':').concat(_mins);  // this.props.myprop[1] == this.state.selectedDate (BookAppointment.js)
    console.log('this.props.myprop[1]=', this.props.myprop[1]);
    //console.log('received_date=', received_date);
    return received_date;
  }


  /*
  * @param => 0, 1, 2, ....
  */
  onBookingAppointment(e) {
    let _selectedTime = this.state.selectedRow;
    console.log('_selectedTime=', _selectedTime);

    let _doctorid_fk = this.props.myprop[0];
    console.log('_doctorid_fk=', _doctorid_fk);
    let _patientid_fk = 204;                      // retrieve this from login user credentials
    console.log('_patientid_fk=', _patientid_fk);
    let _starttime = this.state.appointmentTimePicker[_selectedTime].starttime;
    console.log('_starttime=', _starttime);
    let _endtime = this.state.appointmentTimePicker[_selectedTime].endtime;
    console.log('_endtime=', _endtime);

    this.setState({
          doctorid_fk: _doctorid_fk,
          patientid_fk: _patientid_fk,
          starttime: this.convertStringHrsMinsToDate(_starttime),     // convert '08:30' to '2020-05-01T20:30:00.000+0000'
          endtime: this.convertStringHrsMinsToDate(_endtime)
    }, ()=>{
      console.log('post starttime=', this.state.starttime);
      console.log('post endtime=', this.state.endtime);

      // SYNTAX: axios.post('url', object_body).then(response => console.log(response.data));
      axios.post('/save_appointment',
        {
          id: '',
          doctorid_fk: this.state.doctorid_fk,
          patientid_fk: this.state.patientid_fk,
          starttime: this.state.starttime,
          endtime: this.state.endtime
        }
      )
      .then(response => {
        console.log('response.data=', response.data);
      })
      .catch(function (error) {
        console.log(error);
      })

    });
    alert('Appointment has been scheduled!');
    window.location.reload(false);      // re-fresh the page
  }




}

export default TimePicker;
