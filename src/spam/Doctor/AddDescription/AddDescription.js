import React, { Component } from 'react';
import { Button, Container, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

import './AddDescription.css';
import DoctorNavbar from '../DoctorNavbar/DoctorNavbar';

class AddDescription extends Component {

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
    };
    this.onChangeAppointmentId = this.onChangeAppointmentId.bind(this);
    this.onChangeReason = this.onChangeReason.bind(this);
    this.onChangeTreatment = this.onChangeTreatment.bind(this);
    this.onChangePrescription = this.onChangePrescription.bind(this);
    this.onChangeNote = this.onChangeNote.bind(this);
    this.searchAppointmentDetailByAppointmentId = this.searchAppointmentDetailByAppointmentId.bind(this);
    this.convertStatusNumberToName = this.convertStatusNumberToName.bind(this);
    this.convertStatusNameToNumber = this.convertStatusNameToNumber.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  // this method gets executed first when this component is called
  async componentDidMount(){
    var _appointmentId = parseInt(this.props.match.params.id);
    if(_appointmentId !== 0 && _appointmentId !== '') {      // display edit_form when paramId !== 0 or else display create_form
      console.error('_appointmentId=', _appointmentId);
      axios.get('/get_appointmentdetail_by_appointmentId/' + _appointmentId)
        .then(response => {
          let _appointmentdetail = response.data.appointmentDetail;
          _appointmentdetail.appointment_id = _appointmentdetail.appointment_id !== null ? _appointmentdetail.appointment_id : '';
          _appointmentdetail.appointment_status = this.convertStatusNumberToName(_appointmentdetail.appointment_status);
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
        <DoctorNavbar/>
        <div className='container'>
          <h2>Appointment Details</h2>
          <form onSubmit={this.onSubmit}>

              <div className="form-group parent">
                <div className="left-child">
                  <label>Appointment ID:</label>
                </div>

                <div className="right-child">
                  <div className="float-left">
                    <input type="text"
                      className="form-control"
                      placeholder='appointment ID'
                      value={this.state.appointmentdetail.appointment_id}
                      onChange={this.onChangeAppointmentId}
                    />
                  </div>
                  <div className="float-right">
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
                  {this.state.appointmentdetail.appointment_status === 'BOOKED' ? (
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
    _appointmentdetail.appointmentStatus = this.convertStatusNameToNumber(this.state.appointmentdetail.appointment_status);

    console.log(_appointmentdetail);
    if (this.state.appointmentdetail.appointment_status === 'COMPLETED') {
      axios.post('/update_appointmentdetail', _appointmentdetail)
            .then(response => {
              console.log(response.data);
            })
            .catch(function (error) {
              console.log(error);
            })
    }
    if (this.state.appointmentdetail.appointment_status === 'BOOKED') {
      axios.post('/update_appointmentdetail', _appointmentdetail)
          .then(response => {
            console.log(response.data);
          })
          .catch(function (error) {
            console.log(error);
          })
    }
    //window.location.reload(false);      // refresh the page
  }


  searchAppointmentDetailByAppointmentId() {
    let _appointmentId = this.state.appointmentdetail.appointment_id;
    if (_appointmentId !== '') {
      axios.get('/get_appointmentdetail_by_appointmentId/' + _appointmentId)
        .then(response => {
          // because new appointment detail return null values for reason, treatment, prescription and note, we do not want that to display for users
          let _appointmentdetail = response.data.appointmentDetail;
          _appointmentdetail.appointment_id = _appointmentdetail.appointment_id;
          _appointmentdetail.appointmentdetail_id = _appointmentdetail.appointmentdetail_id;
          _appointmentdetail.appointment_status = this.convertStatusNumberToName(_appointmentdetail.appointment_status);
          _appointmentdetail.patient_id = _appointmentdetail.patient_id;
          _appointmentdetail.patient_firstname = _appointmentdetail.patient_firstname;
          _appointmentdetail.patient_lastname = _appointmentdetail.patient_lastname;
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


  convertStatusNumberToName(num) {
    switch(num) {
      case 1:
        return 'BOOKED';
        break;
      case 2:
        return 'RECEIVED';
        break;
      case 3:
        return 'COMPLETED';
        break;
      case 4:
        return 'NOT_ARRIVED';
        break;
      case 5:
        return 'CANCELED';
        break;
    }
  }

  convertStatusNameToNumber(name) {
    switch(name) {
      case 'BOOKED':
        return 1;
        break;
      case 'RECEIVED':
        return 2;
        break;
      case 'COMPLETED':
        return 3;
        break;
      case 'NOT_ARRIVED':
        return 4;
        break;
      case 'CANCELED':
        return 5;
        break;
    }
  }
}

export default AddDescription;
