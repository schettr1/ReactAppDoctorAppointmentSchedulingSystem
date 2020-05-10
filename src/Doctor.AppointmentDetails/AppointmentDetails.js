import React, { Component } from 'react';
import axios from 'axios';
import { convertIntegerStatusToString, convertStringStatusToInteger } from '../_services/Converter.js';
import './AppointmentDetails.css';
import Navbar from '../Navbar/Navbar';

class AppointmentDetails extends Component {

  constructor(props) {
    super(props);
    this.state = {
      appointmentdetail: {
        appointment_id: '',          // from apointment table
        appointment_status: '',      // from apointment table
        patient_firstname: '',      // from user table
        patient_lastname: '',       // from user table
        patient_id: '',             // from user table
        appointmentdetail_id: '',   // from appointment_detail table
        reason: '',                 // from appointment_detail table
        treatment: '',              // from appointment_detail table
        prescription: '',           // from appointment_detail table
        note: '',                   // from appointment_detail table
      },
      isInvalidAppID: false,
      errorMsg: '',
    };
    this.onChangeAppointmentId = this.onChangeAppointmentId.bind(this);
    this.onChangeReason = this.onChangeReason.bind(this);
    this.onChangeTreatment = this.onChangeTreatment.bind(this);
    this.onChangePrescription = this.onChangePrescription.bind(this);
    this.onChangeNote = this.onChangeNote.bind(this);
    this.searchAppointmentDetailByAppointmentId = this.searchAppointmentDetailByAppointmentId.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  // this method gets executed first when this component is called
  async componentDidMount(){
    var _appointmentId = parseInt(this.props.match.params.id);
    if(_appointmentId !== 0 && _appointmentId !== '') {      // display edit_form when paramId !== 0 or else display create_form
      console.error('_appointmentId=', _appointmentId);
      axios.get('/doctor_or_patient/get_appointmentdetail_by_appointmentId/' + _appointmentId)
        .then(response => {
          let _appointmentdetail = response.data.appointmentDetail;
          _appointmentdetail.appointment_id = _appointmentdetail.appointment_id !== null ? _appointmentdetail.appointment_id : '';
          _appointmentdetail.appointment_status = convertIntegerStatusToString(_appointmentdetail.appointment_status);
          _appointmentdetail.patient_id = _appointmentdetail.patient_id !== null ? _appointmentdetail.patient_id : '';
          _appointmentdetail.patient_firstname = _appointmentdetail.patient_firstname !== null ? _appointmentdetail.patient_firstname : '';
          _appointmentdetail.patient_lastname = _appointmentdetail.patient_lastname !== null ? _appointmentdetail.patient_lastname : '';
          _appointmentdetail.reason = _appointmentdetail.reason !== null ? _appointmentdetail.reason : '';
          _appointmentdetail.treatment = _appointmentdetail.treatment !== null ? _appointmentdetail.treatment : '';
          _appointmentdetail.prescription = _appointmentdetail.prescription !== null ? _appointmentdetail.prescription : '';
          _appointmentdetail.note = _appointmentdetail.note !== null ? _appointmentdetail.note : '';
          this.setState({
            appointmentdetail: _appointmentdetail
          }, ()=> {
            console.log('appointmentdetail=', this.state.appointmentdetail);
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
        <Navbar/>
        <div className='container'>
          {this.state.appointmentdetail.appointment_status === 'BOOKED' ?
            <div className='d-flex justify-content-center mb-4 warningMessage'>
              Cannot save details. Patient must be received in the Clinic.
            </div>
            : null
          }
          <div className='d-flex justify-content-center mb-4'>
            <h2>Appointment Details</h2>
          </div>
          <div style={{color: 'red'}}>{ this.state.isInvalidAppID ? this.state.errorMsg : null }</div>
          <form onSubmit={this.onSubmit}>

              <div className="form-group parent">
                <div className="__left-child">
                  <label>Appointment ID:</label>
                </div>

                <div className="__right-child">
                  <div className="__float-left">
                    <input type="text"
                      className="form-control"
                      placeholder='appointment ID'
                      value={this.state.appointmentdetail.appointment_id}
                      onChange={this.onChangeAppointmentId}
                    />
                  </div>
                  <div className="__float-right">
                    <input type="button"
                          value="Search"
                          onClick={this.searchAppointmentDetailByAppointmentId}
                          className="btn btn-primary" />        {/* Search Appointment Detail using appointment Id */}
                  </div>
                </div>
              </div>

              <div className="form-group parent">
                <div className="left-child">
                  <label>Patient ID:</label>
                </div>
                <div className="right-child">
                  <input
                    type="text"
                    className="form-control" disabled
                    value={this.state.appointmentdetail.patient_id} />
                </div>
              </div>

              <div className="form-group parent">
                <div className="left-child">
                  <label>Name:</label>
                </div>
                <div className="right-child">
                  <input
                    type="text"
                    className="form-control" disabled
                    value={this.state.appointmentdetail.patient_firstname + ' ' + this.state.appointmentdetail.patient_lastname} />
                </div>
              </div>

              <div className="form-group parent">
                <div className="left-child">
                  <label>Reason:</label>
                </div>
                <div className="right-child">
                  <input
                    type="text"
                    className="form-control"
                    placeholder='reason'
                    value={this.state.appointmentdetail.reason}
                    onChange={this.onChangeReason}
                  />
                </div>
              </div>

              <div className="form-group parent">
                <div className="left-child">
                  <label>Treatment:</label>
                </div>
                <div className="right-child">
                  <textarea
                    className="form-control text-area2"
                    placeholder='treatment'
                    value={this.state.appointmentdetail.treatment}
                    onChange={this.onChangeTreatment}
                  />
                </div>
              </div>

              <div className="form-group parent">
                <div className="left-child">
                  <label>Prescription:</label>
                </div>
                <div className="right-child">
                  <textarea
                    className="form-control text-area1"
                    placeholder='prescription'
                    value={this.state.appointmentdetail.prescription}
                    onChange={this.onChangePrescription}
                  />
                </div>
              </div>

              <div className="form-group parent">
                <div className="left-child">
                  <label>**Note:</label>
                </div>
                <div className="right-child">
                  <textarea
                    className="form-control text-area2"
                    placeholder='text here...'
                    value={this.state.appointmentdetail.note}
                    onChange={this.onChangeNote}
                  />
                </div>
              </div>

              <div className="form-group">
                  {this.state.appointmentdetail.appointment_status === 'COMPLETED' ? (
                    <input type="submit" value="Update" className="btn btn-primary"/>
                  ) : (
                    ''
                  )}
                  {this.state.appointmentdetail.appointment_status === 'RECEIVED' ? (
                    <input type="submit" value="Save" className="btn btn-primary"/>
                  ) : (
                    ''
                  )}
              </div>
            </form>
          </div>
        </div>
    );
  }


  onSubmit(e) {
    e.preventDefault();
    let _appointmentdetail = {
        appointmentDetailId: '',
        reason: '',
        treatment: '',
        prescription: '',
        note: '',
        appointmentId: '',
        appointmentStatus: '',
    };
    _appointmentdetail.appointmentDetailId = this.state.appointmentdetail.appointmentdetail_id;
    _appointmentdetail.reason = this.state.appointmentdetail.reason;
    _appointmentdetail.treatment = this.state.appointmentdetail.treatment;
    _appointmentdetail.prescription = this.state.appointmentdetail.prescription;
    _appointmentdetail.note = this.state.appointmentdetail.note;
    _appointmentdetail.appointmentId = this.state.appointmentdetail.appointment_id;
    _appointmentdetail.appointmentStatus = convertStringStatusToInteger(this.state.appointmentdetail.appointment_status);

    console.log(_appointmentdetail);
    // update appointmentdetails for status 'COMPLETED' and 'RECEIVED' only, appointmentdetails is created when appointment is created.
    if (this.state.appointmentdetail.appointment_status === 'COMPLETED' || this.state.appointmentdetail.appointment_status === 'RECEIVED') {
      axios.post('/doctor/update_appointmentdetail', _appointmentdetail)
            .then(response => {
              console.log(response.data);
              window.location.reload(false);      // refresh the page
            })
            .catch(function (error) {
              console.log(error);
            })
    }
  }


  searchAppointmentDetailByAppointmentId() {
    let _appointmentId = this.state.appointmentdetail.appointment_id;
    if (_appointmentId !== '') {
      axios.get('/doctor_or_patient/get_appointmentdetail_by_appointmentId/' + _appointmentId)
        .then(response => {
          // do not display 'null' values in the form
          let _appointmentdetail = response.data.appointmentDetail;
          _appointmentdetail.appointment_status = convertStringStatusToInteger(_appointmentdetail.appointment_status);
          _appointmentdetail.reason = _appointmentdetail.reason !== null ? _appointmentdetail.reason : '';
          _appointmentdetail.treatment = _appointmentdetail.treatment !== null ? _appointmentdetail.treatment : '';
          _appointmentdetail.prescription = _appointmentdetail.prescription !== null ? _appointmentdetail.prescription : '';
          _appointmentdetail.note = _appointmentdetail.note !== null ? _appointmentdetail.note : '';

          // clear the form before new data is loaded
          this.clearForm();

          this.setState({
            appointmentdetail: _appointmentdetail,
            isInvalidAppID: false,        // when you search by ID, every search must begin with isInvalidAppID: false
          }, ()=> {
            console.log('appointmentdetail=', this.state.appointmentdetail);
          });

        })
        .catch(error => {
          // error.response = {data: {code:400, status: 'BAD_REQUEST, timestamp: '', message: ''}, status: 400, statusText: '', ... }
          if(error.response.status === 400) {
            // clear the form so that old data will clear
            this.clearForm();
            this.setState({
              isInvalidAppID: true,
              errorMsg: 'Invalid Appointment ID'
            })
          }
        })
    }
  }


  // reset the form data
  clearForm() {
    this.setState(prevState => ({
      appointmentdetail: {
        ...prevState.appointmentdetail,
        appointment_status: '',
        patient_firstname: '',
        patient_lastname: '',
        patient_id: '',
        appointmentdetail_id: '',
        reason: '',
        treatment: '',
        prescription: '',
        note: '',
      }
    }));
  }


  onChangeAppointmentId(e) {
    let _id = e.target.value;
    this.setState(prevState => ({
      appointmentdetail: {
        ...prevState.appointmentdetail,
        appointment_id: _id
      }
    }));
  }

  onChangeReason(e) {
    e.persist();
    this.setState(prevState => ({
      appointmentdetail: {
        ...prevState.appointmentdetail,
        reason: e.target.value
      }
    }));
  }


  onChangeTreatment(e) {
    e.persist();
    this.setState(prevState => ({
      appointmentdetail: {
        ...prevState.appointmentdetail,
        treatment: e.target.value
      }
    }));
  }

  onChangePrescription(e) {
    e.persist();
    this.setState(prevState => ({
      appointmentdetail: {
        ...prevState.appointmentdetail,
        prescription: e.target.value
      }
    }));
  }

  onChangeNote(e) {
    e.persist();
    this.setState(prevState => ({
      appointmentdetail: {
        ...prevState.appointmentdetail,
        note: e.target.value
      }
    }));
  }

}

export default AppointmentDetails;
