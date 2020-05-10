import React, { Component } from 'react';
import axios from 'axios';
import './BookAppointment.css';
import { convertAMPMtimeToMilitaryTime, convertMilitaryTimeToAMPMtime } from '../_services/Converter.js';

class TimePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appointmentTimePicker: [],   // initialize from componentDidMount
      selectedRow: -1,             // -1 means no row is selected from the table; it represents each row of _appointmentPicker.
      selectedDate: '',            // we need to monitor whether preState of selectedDate has changed

      // 5 paramters of 'appointment' object
      id: '',
      doctorid_fk: '',
      patientid_fk: '',
      starttime: '',
      endtime: '',
      successMsg: '',   // used to alert user when appointment is created

    }

    this.onSelectEvent = this.onSelectEvent.bind(this);
    this.onBookingAppointment = this.onBookingAppointment.bind(this);
  }


  componentDidMount(){
    console.warn('this.props.selectedDoctor (ID)=', this.props.myprop[0]);
    console.warn('this.props.selectedDate=', this.props.myprop[1]);   // prop='dateSelected' from 'BookAppointment.js'

    let _selectedDoctorId = this.props.myprop[0];
    let _selectedDate = this.props.myprop[1];
    this.setState({
      selectedDate: _selectedDate
    },()=>{
      this.retrieveAppointmentsByDoctorIdAndSelectedDate(_selectedDoctorId, _selectedDate);
    })

  }



  componentDidUpdate(_, prevState){
    // change in props.myprop[1] values will trigger this code
    if (this.props.myprop[1] !== prevState.selectedDate) {
      let _selectedDoctorId = this.props.myprop[0];
      let _selectedDate = this.props.myprop[1];
      this.setState({
        selectedDate: _selectedDate
      },()=>{
        this.retrieveAppointmentsByDoctorIdAndSelectedDate(_selectedDoctorId, _selectedDate);
      })
    }

    // change in state of successMsg will trigger setTimeout()
    if (this.state.successMsg && !prevState.successMsg) {
      setTimeout(() => {
        this.setState({
          successMsg:''
        },()=>{
          window.location.reload(false);    // update the page
        })
      }, 2000);       // setState of successMsg:'' after 2 seconds of having state.successMsg:'Thankyou for the feedabck!'
    }
  }



  render() {
    return(
      <div className='container'>
        <table className='_alignCenter'>
          <tbody>
            <tr>
              {this.state.appointmentTimePicker.map((item, i) => {
                if(i<4) {
                  return (
                    <td key={i}>
                      <input type='button'
                             value={this.state.appointmentTimePicker[i].starttime + '-' + this.state.appointmentTimePicker[i].endtime}
                             className={"_buttonStyle " + (this.state.appointmentTimePicker[i].isBooked ? 'isBooked' : (this.state.selectedRow === i ? 'rowClicked' : 'rowNotClicked'))}
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
                             value={this.state.appointmentTimePicker[i].starttime + '-' + this.state.appointmentTimePicker[i].endtime}
                             className={"_buttonStyle " + (this.state.appointmentTimePicker[i].isBooked ? 'isBooked' : (this.state.selectedRow === i ? 'rowClicked' : 'rowNotClicked'))}
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
                             value={this.state.appointmentTimePicker[i].starttime + '-' + this.state.appointmentTimePicker[i].endtime}
                             className={"_buttonStyle " + (this.state.appointmentTimePicker[i].isBooked ? 'isBooked' : (this.state.selectedRow === i ? 'rowClicked' : 'rowNotClicked'))}
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
                             value={this.state.appointmentTimePicker[i].starttime + '-' + this.state.appointmentTimePicker[i].endtime}
                             className={"_buttonStyle " + (this.state.appointmentTimePicker[i].isBooked ? 'isBooked' : (this.state.selectedRow === i ? 'rowClicked' : 'rowNotClicked'))}
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
            <input type="button"
                   className="bookButton btn btn-primary"
                   value="Book"
                   onClick={this.onBookingAppointment}
                   disabled={this.props.myprop[0] && this.props.myprop[1] && this.state.selectedRow !== -1 ? false : true}/>
        </div>

        {/* style={position:'fixed' & top:'75px'}
         *  Even if you scroll the page all the way down or shrink the page height, message will display at the same position.
         *  To position the stacking order of elements place this code below form elements
        */}
        {this.state.successMsg ?
          <div className='container ___successMsg'>
              {this.state.successMsg}
          </div>
          : null
        }

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
  * @param => 0, 1, 2, ....
  */
  onBookingAppointment(e) {
    let _selectedTime = this.state.selectedRow;
    console.log('_selectedTime=', _selectedTime);

    let _doctorid_fk = this.props.myprop[0];
    console.log('_doctorid_fk=', _doctorid_fk);
    let _patientid_fk = JSON.parse(localStorage.getItem('loggedUser')).userId;  // retrieve this from localStorage
    console.log('_patientid_fk=', _patientid_fk);
    let _starttime = this.state.appointmentTimePicker[_selectedTime].starttime;
    _starttime = convertAMPMtimeToMilitaryTime(_starttime);     // convert '12:00 AM' to '00:00' and '12:00 PM' to '12:00'
    _starttime = this.props.myprop[1].concat('T').concat(_starttime);  // append '2020-05-01T' to '15:30'
    console.log('_starttime=', _starttime);
    let _endtime = this.state.appointmentTimePicker[_selectedTime].endtime;
    _endtime = convertAMPMtimeToMilitaryTime(_endtime);     // convert '09:00 AM' to '09:00' and '05:00 PM' to '17:00'
    _endtime = this.props.myprop[1].concat('T').concat(_endtime);     // append '2020-05-01T' to '15:30'
    console.log('_endtime=', _endtime);

    this.setState({
          doctorid_fk: _doctorid_fk,
          patientid_fk: _patientid_fk,
          starttime: _starttime,             // Server recognizes either Date object or String value in format 'YYYY-MM-DDThh:mm' NOT 'YYYY-MM-DD hh:mm'
          endtime: _endtime
    }, ()=>{
      console.log('post starttime=', this.state.starttime);
      console.log('post endtime=', this.state.endtime);

      // SYNTAX: axios.post('url', object_body).then(response => console.log(response.data));
      axios.post('/patient/save_appointment',
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
        this.setState({
          successMsg: 'Appointment has been scheduled.'
        })
        // refresh page in componentDidUpdate()
      })
      .catch(function (error) {
        console.log(error);
      })

    });
  }



  retrieveAppointmentsByDoctorIdAndSelectedDate(_selectedDoctorId, _selectedDate) {
    // fetch appointments of doctor for a specified date only if selectedDoctor is neither NULL nor '0' meaning '--Select--'
    if(_selectedDoctorId !== '' && _selectedDoctorId !== '0') {
      axios.get('/doctor_or_patient/get_appointments_by_doctorId_on_selected_date/' + _selectedDoctorId,      // this.props.myprop[0] = selectedDoctor (BookAppointment.js)
                {
                  params: {stringDate: _selectedDate}               // // this.props.myprop[1] = selectedDate (BookAppointment.js)
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
          {id: '', starttime: '08:00 AM', endtime: '08:30 AM', isBooked: false, selectedRow: 0},
          {id: '', starttime: '08:30 AM', endtime: '09:00 AM', isBooked: false, selectedRow: 1},
          {id: '', starttime: '09:00 AM', endtime: '09:30 AM', isBooked: false, selectedRow: 2},
          {id: '', starttime: '09:30 AM', endtime: '10:00 AM', isBooked: false, selectedRow: 3},
          {id: '', starttime: '10:00 AM', endtime: '10:30 AM', isBooked: false, selectedRow: 4},
          {id: '', starttime: '10:30 AM', endtime: '11:00 AM', isBooked: false, selectedRow: 5},
          {id: '', starttime: '11:00 AM', endtime: '11:30 AM', isBooked: false, selectedRow: 6},
          {id: '', starttime: '11:30 AM', endtime: '12:00 PM', isBooked: false, selectedRow: 7},
          {id: '', starttime: '01:00 PM', endtime: '01:30 PM', isBooked: false, selectedRow: 8},
          {id: '', starttime: '01:30 PM', endtime: '02:00 PM', isBooked: false, selectedRow: 9},
          {id: '', starttime: '02:00 PM', endtime: '02:30 PM', isBooked: false, selectedRow: 10},
          {id: '', starttime: '02:30 PM', endtime: '03:00 PM', isBooked: false, selectedRow: 11},
          {id: '', starttime: '03:00 PM', endtime: '03:30 PM', isBooked: false, selectedRow: 12},
          {id: '', starttime: '03:30 PM', endtime: '04:00 PM', isBooked: false, selectedRow: 13},
          {id: '', starttime: '04:00 PM', endtime: '04:30 PM', isBooked: false, selectedRow: 14},
          {id: '', starttime: '04:30 PM', endtime: '05:00 PM', isBooked: false, selectedRow: 15}
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
            let _starttime = convertMilitaryTimeToAMPMtime(obj.starttime.substring(11, 16)); // for each response.data, convert starttime '2020-05-01T20:30:00.000+0000' to '04:30 PM'
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


}

export default TimePicker;
