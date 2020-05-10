import React, { Component } from 'react';
import { Button, Container, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

import './PatientHistory.css';
import DoctorNavbar from '../DoctorNavbar/DoctorNavbar';
import ListHistory from './ListHistory';

class PatientHistory extends Component {

  constructor(props) {
    super(props);
    this.state = {
      appointments: [],
      show: false,
      patientId: '',      // search by patient ID
    };

    this.onFindClicked = this.onFindClicked.bind(this);
    this.onChangePatientID = this.onChangePatientID.bind(this);
    this.retrievePatientAppointmentsByID = this.retrievePatientAppointmentsByID.bind(this);
  }


  // this method gets executed first when this component is called
  async componentDidMount(){

  }


  render() {
    return(
      <div>
        <DoctorNavbar/>               {/* patient home page navigation bar */}
        <div className="container fluid">
          <div className="float-left-div">
            <input type="text"
                  className="form-control form-control-lg"
                  placeholder='Patient ID'
                  value={this.state.patientId}
                  onChange={this.onChangePatientID}/>
          </div>
          <div className="float-right-div">
            <input type='button' onClick={this.onFindClicked} value='Search' className='btn btn-primary'/>
          </div>
        </div>
        <div className="clear-right">
          { this.state.show && <ListHistory appointments={this.state.appointments}/> }
        </div>
      </div>
    );
  }


  onChangePatientID(e) {
    let _patientId = e.target.value;
    this.setState({
      patientId: _patientId
    });
  }

  onFindClicked(e) {
    this.setState({
      show: !this.state.show
    }, ()=> {
      this.retrievePatientAppointmentsByID(this.state.patientId);
    });
  }


  retrievePatientAppointmentsByID(_patientId) {
    if(_patientId !== '' || _patientId !== NaN) {
      axios.get('/get_appointments_by_patientid/' + _patientId)
      .then(response => {
        console.log('response.data=', response.data);
        let _appointments = response.data;   // response.data contains [{doctor: {}, link: {}}, {feedback: {}, link: {}}, {feedback: {}, link: {}}]
        _appointments = _appointments.map(x => x.appointment);   // _doctors contains [{id: 1, date: '', message: ''}, {id: 2, date: '', message: ''}]
        _appointments = _appointments.map(x => {
          let obj = x;
          obj.date = obj.starttime.substring(0, 10);         // convert String "0, 8" to "MD, PhD" .....
          obj.time = obj.starttime.substring(11, 16) + '-' + obj.endtime.substring(11, 16);
          obj.appointment_id = obj.appid;    // convert 4.3333 -> 4.3 or 3 -> 3.0 ...
          obj.doctor_name = obj.doctorfn + ' ' + obj.doctorln;      // convert 0 -> 'General Physician', 1 -> 'Dermatologist' ....
          return obj;
        });
        this.setState({
          appointments: _appointments
        }, ()=> {
          console.log('appointments=', this.state.appointments);
        });
      })
      .catch(function (error) {
        console.log(error);
      })
    }
  }
}

export default PatientHistory;
