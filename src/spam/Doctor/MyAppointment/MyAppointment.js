import React, { Component } from 'react';
import { Button, Container, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

import './MyAppointment.css';
import DoctorNavbar from '../DoctorNavbar/DoctorNavbar';
import ListAppointment from './ListAppointment';

class MyAppointment extends Component {

  constructor(props) {
    super(props);
    this.state = {
      appointments: [],
      selectedDate: '',         // used to display on the <input type='date'/> and as param to retrieve appointments from database
      loggedUserId: 101,        // get from localStorage
    };

    this.onChangeDate = this.onChangeDate.bind(this);
    this.convertNewDateToDateType = this.convertNewDateToDateType.bind(this);     // convert new Date() object to string format 'YYYY-MM-DD' so <input type='date'/> understands
    this.convertIntegerGenderToStringGender = this.convertIntegerGenderToStringGender.bind(this);
    this.convertYYYYMMDDtoMMDDYYFormat = this.convertYYYYMMDDtoMMDDYYFormat.bind(this); // convert string 'YYYY-MM-DD' to 'MM/DD/YYYY'
    this.convertMilitaryTimeToAMPM = this.convertMilitaryTimeToAMPM.bind(this);     // convert UTC date '2020-05-01T15:00:00.000+0000' to '03:00'
  }

  // this method gets executed first when this component is called
  async componentDidMount(){
    this.setState({
      selectedDate: this.convertNewDateToDateType(new Date())     // converts today date to string format 'YYYY-MM-DD'
    }, ()=> {
      this.fetchAppointmentsByDoctorIdAndDate(this.state.selectedDate);    // call function to retrieve appointments by doctorId and date
    });

  }


  render() {
    return(
      <div>
        <DoctorNavbar/>               {/* patient home page navigation bar */}
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
          <ListAppointment appointments={this.state.appointments} />

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
    if(stringDate != '') {    // do not make call to the database if user removes date from <input type='date' />
      axios.get('/get_appointments_by_doctorId_on_selected_date/' + this.state.loggedUserId,
                {
                  params: {stringDate: stringDate}
                }
              )
      .then(response => {
        let _appointments = response.data;                       // response.data contains [ {appointment: {}, link: {}}, {appointment: {}, link: {}}, ...]
        console.log('response.data=', response.data);
        _appointments = _appointments.map(x => x.appointment);   // _appointments contains [ {id: 1, firstname: '', lastname: ''}, {id: 2, firstname: '', lastname: ''}, ...]
        /*
        * Transform data from [ {id: 5, starttime: '2020-04-18T08:00:00.000+0000', endtime: '2020-04-18T08:30:00.000+0000', patient_id: 201, ...}, {}, {}, ... ]
        * to [ {id: 5, time: '08:00-08:30', patient_id: 201, firstname: '', ...}, {}, {}, ... ]
        */
        _appointments = _appointments.map(x => {
          let obj = x;
          obj.id = obj.id;
          obj.date = this.convertYYYYMMDDtoMMDDYYFormat(obj.starttime.substring(0, 10));
          obj.time = this.convertMilitaryTimeToAMPM(obj.starttime) + '-' + this.convertMilitaryTimeToAMPM(obj.endtime);
          obj.firstname = obj.firstname;
          obj.lastname = obj.lastname;
          obj.patient_id = obj.patient_id;
          obj.birthdate = this.convertYYYYMMDDtoMMDDYYFormat(obj.birthdate.substring(0, 10));
          obj.gender = this.convertIntegerGenderToStringGender(obj.gender);
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
            let timeTable = [ '08:00-08:30', '08:30-09:00', '09:00-09:30', '09:30-10:00', '10:00-10:30', '10:30-11:00', '11:00-11:30', '11:30-00:00', '00:00-00:30',
                              '00:30-01:00', '01:00-01:30', '01:30-02:00', '02:00-02:30', '02:30-03:00', '03:00-03:30', '03:30-04:00', '04:00-04:30', '04:30-05:00' ];

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


  /*
  * convert new Date() object to string format 'YYYY-MM-DD' because
  * <input type='date' value=''/> only accepts value in this format.
  */
  convertNewDateToDateType() {
    var date = new Date();        // today's date
    var year = date.getFullYear();
    var month = 1 + date.getMonth();	// adding 1 makes month accurate January = 1 + 0 = 1 and December = 1 + 11 = 12
    month = ('0' + month).slice(-2);	// adding 0 makes single digit months 2 digit so that you get last 2 digits i.e. 2 -> 02 and 11 -> 11
    var day = date.getDate();
    day = ('0' + day).slice(-2);		// single digit day such as 2 becomes two digit day 02
    return year + '-' + month + '-' +  day;
  }


  /*
  * converts UTC date to string value '02:00' or '11:30'
  * @param : 2020-05-01T15:00:00.000+0000
  * @return : 03:00
  */
  convertMilitaryTimeToAMPM(datetime) {
    let _hrs = datetime.substring(11, 13);       // ex: 18, 10
    let _mins = datetime.substring(14, 16);       // ex: 00, 30
    if(parseInt(_hrs) >= 12) {
      _hrs = _hrs - 12;
    }
    _hrs = ('0' + _hrs).slice(-2);
    return _hrs + ':' + _mins;
  }


  /*
  * convert integer value from database to String value
  * @param - Integer (ex: 1, 2, etc)
  * @return - String (ex: MALE, FEMALE etc)
  */
  convertIntegerGenderToStringGender(num) {
    switch(num) {
      case 1:
        return 'MALE';
        break;
      case 2:
        return 'FEMALE';
        break;
      case 3:
        return 'OTHER';
        break;
    }
  }


  /*
  * convert string date format 'YYYY-MM-DD' to 'MM/DD/YYYY'
  * @param - 2014-04-01
  * @return - 04/01/2014
  */
  convertYYYYMMDDtoMMDDYYFormat(stringDate) {
    let _yy = stringDate.substring(0, 4);
    let _mm = stringDate.substring(5, 7);
    let _dd = stringDate.substring(8, 10);
    return _mm + '/' + _dd + '/' + _yy;
  }
}

export default MyAppointment;
