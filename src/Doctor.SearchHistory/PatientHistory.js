import React, { Component } from 'react';
import { Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import ModalAppointmentDetail from './ModalAppointmentDetail';
import axios from 'axios';

class PatientHistory extends Component {

  constructor(props) {
    super(props);
    this.state = {
      appointmentdetail: '',
      isOpen: false,
    };
    this.openModalAppointmentDetail= this.openModalAppointmentDetail.bind(this);
    this.closeModalAppointmentDetail= this.closeModalAppointmentDetail.bind(this);
  }

  render() {
    if(this.props.appointments.length > 0) {
      return(
        <div className="container fluid">
          <h2>Patient History</h2>
          <Table className='table1'>
            <thead>
              <tr>
                <th>Appt.ID</th>
                <th>Date</th>
                <th>Time</th>
                <th>Doctor</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {this.props.appointments.map((item, i) =>{
                return (
                  <tr key={i}>
                    <td className='time1'>{this.props.appointments[i].appointment_id}</td>
                    <td>{this.props.appointments[i].date}</td>
                    <td>{this.props.appointments[i].time}</td>
                    <td>{this.props.appointments[i].doctor_name}</td>
                    <td>
                      {/* Modal - Confirm Cancellation */}
                      <Link to={'#'} onClick={(e)=>this.openModalAppointmentDetail(e, this.props.appointments[i].appointment_id)}>view detail</Link>
                      <ModalAppointmentDetail
                          show={this.state.isOpen}
                          onClose={this.closeModalAppointmentDetail} >
                          <table className="table table-sm">
                            <tbody>
                              <tr>
                                <td>Appt#ID:</td><td>{this.state.appointmentdetail.appointment_id}</td>
                              </tr>
                              <tr>
                                <td>Patient:</td><td>{this.state.appointmentdetail.patient_firstname + ' ' + this.state.appointmentdetail.patient_lastname}</td>
                              </tr>
                              <tr>
                                <td>Status:</td><td>{this.state.appointmentdetail.appointment_status}</td>
                              </tr>
                              <tr>
                                <td>Reason:</td><td>{this.state.appointmentdetail.reason}</td>
                              </tr>
                              <tr>
                                <td>Treatment:</td><td>{this.state.appointmentdetail.treatment}</td>
                              </tr>
                              <tr>
                                <td>Prescription:</td><td>{this.state.appointmentdetail.prescription}</td>
                              </tr>
                              <tr>
                                <td>Note:</td><td>{this.state.appointmentdetail.note}</td>
                              </tr>
                            </tbody>
                          </table>
                      </ModalAppointmentDetail>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </div>
      );
    } else {
      return (
        <div className="container fluid">
          <h3>No Data Found</h3>
        </div>
      );
    }

  }


  /* open the modal */
  openModalAppointmentDetail(e, appointmentId) {
    axios.get('/doctor_or_patient/get_appointmentdetail_by_appointmentId/' + appointmentId)
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
    this.setState({
      isOpen: !this.state.isOpen
    });
  }


  /* close the modal */
  closeModalAppointmentDetail() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }


  logoutUser() {
    localStorage.removeItem("loggedUser");
    console.log('localStorage.getItem("loggedUser")=', localStorage.getItem("loggedUser"));
    this.props.history.push('/login');
    window.location.reload(false);            // refresh the page
  }

  convertStatusNumberToName(num) {
    switch(num) {
      case 1:
        return 'BOOKED';
      case 2:
        return 'RECEIVED';
      case 3:
        return 'COMPLETED';
      case 4:
        return 'NOT_ARRIVED';
      default:
        return 'CANCELED';
    }
  }

}


export default PatientHistory;
