import React, { Component } from 'react';
import axios from 'axios';

import './SearchHistory.css';
import Navbar from '../Navbar/Navbar';
import PatientHistory from './PatientHistory';

class SearchHistory extends Component {

  constructor(props) {
    super(props);
    this.state = {
      appointments: [],
      show: false,
      patientId: '',      // search by patient ID
      isInvalidPatientID: false,
      errorMsg: '',
    };


    this.onSearchClicked = this.onSearchClicked.bind(this);
    this.onChangePatientID = this.onChangePatientID.bind(this);
    this.retrievePatientAppointmentsByID = this.retrievePatientAppointmentsByID.bind(this);
  }


  // this method gets executed first when this component is called
  async componentDidMount(){

  }


  render() {
    return(
      <div>
        <Navbar/>               {/* patient home page navigation bar */}
        <div className="container fluid d-flex justify-content-center">

          <div className="float-left-div">
            <input type="text"
                  className="form-control form-control-lg"
                  placeholder='Patient ID'
                  value={this.state.patientId}
                  onChange={this.onChangePatientID}
            />
            <div style={{color: 'red'}}>{ this.state.isInvalidPatientID ? this.state.errorMsg : null }</div>
          </div>

          <div className="float-right-div">
            <input type='button' onClick={this.onSearchClicked} value='Search' className='btn btn-primary'/>
          </div>

        </div>
        <div className="clear-right">
          { this.state.show && <PatientHistory appointments={this.state.appointments}/> }
        </div>

        <br/>
      </div>
    );
  }


  onSearchClicked(e) {
    this.setState({
      show: true,            // display PatientHistory Modal
      isInvalidPatientID: false,    // hide previous error messages
      errorMsg: '',
    });
    this.retrievePatientAppointmentsByID(this.state.patientId);
  }


  /*
  * function - retrieve Appointments by Patient ID
  * @param - patient ID
  * @return - appointments
  */
  retrievePatientAppointmentsByID(_patientId) {
    if(_patientId !== '' || isNaN(_patientId)) {
      axios.get('/doctor_or_patient/get_appointments_by_patientid/' + _patientId)
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
      .catch(error => {
        // error.response = {data: {code:400, status: 'BAD_REQUEST, timestamp: '', message: ''}, status: 400, statusText: '', ... }
        if(error.response.status === 400) {
          // clear the form so that old data will clear
          //this.clearForm();
          this.setState({
            isInvalidPatientID: true,
            errorMsg: 'Invalid Patient ID',
            show: false,            // donot display PatientHistory Modal
          })
        }
      })
    }
  }



  onChangePatientID(e) {
    let _patientId = e.target.value;
    this.setState({
      patientId: _patientId
    });
  }


}

export default SearchHistory;
