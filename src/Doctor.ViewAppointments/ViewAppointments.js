import React, { Component } from 'react';
import axios from 'axios';
import { convertIntegerGenderToString, convertStringUTCDatetoBirthdate, convertStringUTCDatetoAppointmentDateFormat,
  getHHMMfromStringUTCDate, convertMilitaryTimeToAMPMtime, getDatePickerCompatibleDate } from '../_services/Converter.js';
import './ViewAppointments.css';
import Navbar from '../Navbar/Navbar';
import Appointment from './Appointment';

class ViewAppointments extends Component {

  constructor(props) {
    super(props);
    this.state = {
      appointments: [],
      selectedDate: '',         // used to display on the <input type='date'/> and as param to retrieve appointments from database
      loggedUserId: '',        // get from localStorage
    };

    this.onChangeDate = this.onChangeDate.bind(this);
  }

  // this method gets executed first when this component is called
  async componentDidMount(){
    this.setState({
      loggedUserId: JSON.parse(localStorage.getItem('loggedUser')).userId,
      selectedDate: getDatePickerCompatibleDate(new Date())     // converts today's date to String 'YYYY-MM-DD' which is suitable for type='date'
    }, ()=> {
      this.fetchAppointmentsByDoctorIdAndDate(this.state.selectedDate);    // call function to retrieve appointments by doctorId and date
    });

  }


  render() {
    return(
      <div>
        <Navbar/>               {/* patient home page navigation bar */}
        <div className="container">

          <div className="form-group floatRightSide">
            <div className="leftChild">
              <label>Date: </label>
            </div>
            <div className="rightChild">
              <input type="date"
                      className="form-control"
                      value={this.state.selectedDate}
                      onChange={this.onChangeDate}>
              </input>                                   {/* only accepts string value in format 'YYYY-MM-DD' from javascript */}
            </div>
          </div>
          <Appointment appointments={this.state.appointments} />

        </div>
      </div>
    );
  }


  /*
  * Retrieve appointments from database using doctor Id and date whenever user selects date
  * @param : doctorId, _selectedDate
  * @return : [ {appointment: { id: '', startime: '', endtime: '', patient_id: '', firstname: '', lastname: '', birthdate: '', gender: ''}, link: {}}, ...]
  */
  fetchAppointmentsByDoctorIdAndDate(stringDate) {
    if(stringDate !== '') {    // do not make call to the database if user removes date from <input type='date' />
      axios.get('/doctor_or_patient/get_appointments_by_doctorId_on_selected_date/' + this.state.loggedUserId,
                {
                  params: {stringDate: stringDate}
                }
              )
      .then(response => {
        let _appointments = response.data;                       // response.data contains [ {appointment: {}, link: {}}, {appointment: {}, link: {}}, ...]
        console.log('response.data=', response.data);
        _appointments = _appointments.map(x => x.appointment);   // _appointments contains [ {id: 1, firstname: '', lastname: ''}, {id: 2, firstname: '', lastname: ''}, ...]
        /*
        * Convert data from [ {id: 5, starttime: '2020-04-18T08:00:00.000+0000', endtime: '2020-04-18T08:30:00.000+0000', patient_id: 201, ...}, {}, {}, ... ]
        * to [ {id: 5, time: '08:00-08:30', patient_id: 201, firstname: '', ...}, {}, {}, ... ]
        */
        _appointments = _appointments.map(x => {
          let obj = x;
          obj.date = convertStringUTCDatetoAppointmentDateFormat(obj.starttime.substring(0, 10));
          obj.starttime = getHHMMfromStringUTCDate(obj.starttime);
          obj.endtime = getHHMMfromStringUTCDate(obj.endtime);
          obj.time = convertMilitaryTimeToAMPMtime(obj.starttime) + '-' + convertMilitaryTimeToAMPMtime(obj.endtime);   // making time compatible to timeTable
          obj.birthdate = convertStringUTCDatetoBirthdate(obj.birthdate.substring(0, 10));
          obj.gender = convertIntegerGenderToString(obj.gender);
          return obj;
        });

        this.setState({
          appointments: _appointments
        }, ()=> {
            /*
            * notice how we are keeping these statements inside the setState callback function. This is because if we do not put it
            * inside the callback function, we cannot get the value of this.state.patients inside componentDidMount().
            */
            let _appointments = this.state.appointments;
            console.log('this.state.appointments=', this.state.appointments);
            let timeTable = [ '08:00 AM-08:30 AM', '08:30 AM-09:00 AM',
                              '09:00 AM-09:30 AM', '09:30 AM-10:00 AM',
                              '10:00 AM-10:30 AM', '10:30 AM-11:00 AM',
                              '11:00 AM-11:30 AM', '11:30 AM-12:00 PM',
                              '12:00 PM-12:30 PM', '12:30 PM-01:00 PM',
                              '01:00 PM-01:30 PM', '01:30 PM-02:00 PM',
                              '02:00 PM-02:30 PM', '02:30 PM-03:00 PM',
                              '03:00 PM-03:30 PM', '03:30 PM-04:00 PM',
                              '04:00 PM-04:30 PM', '04:30 PM-05:00 PM' ];

            let _updatedList = [];        // _updatedList is what gets displayed

            /*
            * loop through each data of [_appointments] against each data of [timeTable] so that we can compare the
            * 'time' parameter of [_appointments] with data of [timeTable]. If there is a match,
            * push that data from [_appointments] to [_updatedList].
            */
            for(let i of timeTable) {
                let isPresent = false;
                for(let p of _appointments) {
                  if(i === p.time) {
                    _updatedList.push(p);
                    isPresent = true;
                  }
                }
                if(!isPresent) {
                  // if 'time' does not match push emptyJSON data to [_updatedList].
                  let emptyJSON = {time: '', id: '', firstname: '', lastname: '', patient_id: '', gender: '', birthdate: '', status: '', action: ''};
                  emptyJSON.time = i;
                  _updatedList.push(emptyJSON);
                }
            }
            this.setState({
              appointments: _updatedList           // set the state of updatedList which is passed as props to <ListAppointment/>
            }, ()=> {
              //console.log('this.state.updatedList=', this.state.updatedList);
            })
        });

      })
      .catch(function (error) {
        console.log(error);
      })
    } else {
      /*
      * we created else statement because we need to make sure that the empty table will remain displayed even when no appointments are
      * retrieved from the database. Also, if user removes the date from '<date />' empty table will be displayed
      */
      this.setState({
        appointments: []      // no appointments available for that date
      }, ()=> {
          let _appointments = this.state.appointments;
          console.log('this.state.appointments=', this.state.appointments);
          let timeTable = [ '08:00-08:30', '08:30-09:00', '09:00-09:30', '09:30-10:00', '10:00-10:30', '10:30-11:00', '11:00-11:30', '11:30-12:00', '12:00-00:30',
                            '00:30-01:00', '01:00-01:30', '01:30-02:00', '02:00-02:30', '02:30-03:00', '03:00-03:30', '03:30-04:00', '04:00-04:30', '04:30-05:00' ];

          let _updatedList = [];

          for(let i of timeTable) {       // loop through each data from the database so that we can fill the appointment time-table with matching time
              let isPresent = false;
              for(let p of _appointments) {
                if(i === p.time) {
                  _updatedList.push(p);
                  isPresent = true;
                }
              }
              if(!isPresent) {
                let emptyJSON = {time: '', id: '', firstname: '', lastname: '', patient_id: '', gender: '', birthdate: '', status: '', action: ''};
                emptyJSON.time = i;
                _updatedList.push(emptyJSON);     // fill non-scheduled appointment time with emptyJSON data
              }
          }
          this.setState({
            appointments: _updatedList
          }, ()=> {
            //console.log('this.state.updatedList=', this.state.updatedList);
          })
      });
    }
  }



  /*
  * call function fetchAppointmentsByDoctorIdAndDate() when
  * date change event is occured
  */
  onChangeDate(e) {
    let _selectedDate = e.target.value;
    this.setState({
      selectedDate: _selectedDate
    }, ()=> {
      this.fetchAppointmentsByDoctorIdAndDate(this.state.selectedDate);
    });
  }


}

export default ViewAppointments;
