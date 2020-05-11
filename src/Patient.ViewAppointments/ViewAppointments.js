import React, { Component } from 'react';
import { Container, Table } from 'reactstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { convertStringUTCDateToAppointmentDateTimeFormat, convertIntegerStatusToString } from '../_services/Converter.js';
import Navbar from '../Navbar/Navbar';
import './ViewAppointments.css';
import ModalAppointmentDetail from './ModalAppointmentDetail';
import ModalConfirmation from './ModalConfirmation';
import ModalRevoked from './ModalRevoked';

class ViewAppointments extends Component {

  constructor(props) {
    super(props);
    this.state = {
      appointments: [],       // this is what we fetch from database
      updatedList: [],        // this is what we display to user because we may need to map or filter the appointments
      isOpen: false,
      status: [],
      selectedStatus: '',
      patientId: '',     // retrieve 'userId' from LocalStorage or from path "/patient_view_appointments/302"
      appointmentdetail: '',
    };
    this.onChangeStatus = this.onChangeStatus.bind(this);
    this.cancelOrRevoke = this.cancelOrRevoke.bind(this);
    this.openModalConfirmation = this.openModalConfirmation.bind(this);
    this.closeModalConfirmation = this.closeModalConfirmation.bind(this);
    this.openModalRevoked = this.openModalRevoked.bind(this);
    this.closeModalRevoked = this.closeModalRevoked.bind(this);
    this.cancelAppointment = this.cancelAppointment.bind(this);
    this.openModalAppointmentDetail= this.openModalAppointmentDetail.bind(this);
    this.closeModalAppointmentDetail= this.closeModalAppointmentDetail.bind(this);
  }


  async componentDidMount(){
    let _statuses = [
      {id: 1, name: 'Booked'},               // status id is matched with StatusEnum
      {id: 2, name: 'Received'},
      {id: 3, name: 'Completed'},
      {id: 999, name: 'All'}
    ];
    // get patientId from path-param
    let _patientId = parseInt(this.props.match.params.id);

    // retrieve all appointments of the patient
    axios.get('/doctor_or_patient/get_appointments_by_patientid/' + _patientId)
    .then(response => {
      let _appointments = response.data;   // response.data contains [ { appointment: {id: 101, starttime: '', endtime: '',..}, link: {} }, {}, ...]
      _appointments = _appointments.map(x => x.appointment);   // _appointments contains [ {id: 101, starttime: '', endtime: '',..}, {}, {}, ...]
      _appointments = _appointments.map(x => {
        let obj = x;
        obj.starttime = convertStringUTCDateToAppointmentDateTimeFormat(obj.starttime);        // 2020-05-01T15:00:00.000+0000 to 05/01/2020 15:00
        obj.endtime = convertStringUTCDateToAppointmentDateTimeFormat(obj.endtime);            // 2020-05-01T15:30:00.000+0000 to 05/01/2020 15:30
        return obj;
      });
      //console.log('_appointments=', _appointments);

      // filter booked appointments only
      let _updatedList = _appointments.filter(x => x.status === 'BOOKED');   // 1 means status = 'BOOKED'
      //console.log('_updatedList=', _updatedList);

      this.setState({
        appointments: _appointments,        // we will need this when we are filtering appointments by status again
        updatedList: _updatedList,
        status: _statuses,
      }, ()=> {
        console.log('updatedList[]=', this.state.updatedList);
      });

    })
    .catch(function (error) {
      console.log(error);
    });

  }



  render() {
    return(
      <div>
        <Navbar/>               {/* patient home page navigation bar */}
        <div className="container fluid searchPanel">
          <h2>Appointments</h2>
          <div className="float__right">
            <select className="form-control"
                    onChange={this.onChangeStatus}>
              {
                this.state.status.map((x) => {
                  return (<option key={x.id} value={x.id}>{x.name}</option>)
                })
              }
            </select>
          </div>

          <Container fluid>
            <div>
              <Table>
                <thead>
                  <tr>
                    <th>App# ID.</th>
                    <th>StartDate</th>
                    <th>EndDate</th>
                    <th>Doctor</th>
                    <th colSpan='2'>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.updatedList.map((item) => {
                    return(
                      <tr key={item.appid}>
                        <td>{item.appid}</td>
                        <td>{item.starttime}</td>
                        <td>{item.endtime}</td>
                        <td>{item.doctorfn + ' ' + item.doctorln}</td>
                        <td>
                          {/* display 'details' link */}
                          <Link to={'#'} onClick={(e)=>this.openModalAppointmentDetail(e, item.appid)}>details</Link>
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
                        <td>
                          {/* display 'cancel' link if status is BOOKED */}
                          {item.status === 'BOOKED' ?
                            (<Link to={'#'}
                                  onClick={(e)=>this.cancelOrRevoke(e, item.appid,
                                                                      item.doctorfn,
                                                                      item.doctorln,
                                                                      item.starttime,
                                                                      item.status,
                                                                    )}>cancel</Link>)
                            : (null)
                          }
                            <ModalConfirmation
                                show={this.state.isModalConfirmationOpen}
                                onCancel={(e)=>this.cancelAppointment(e, this.state.props_id)}
                                onClose={this.closeModalConfirmation}
                                appointmentId={item.appointment_id}>
                                <div style={{color: 'red'}}>Are you sure you want to cancel your appointment with</div>
                                <div style={{color: 'red'}}>{this.state.props_fn + ' ' + this.state.props_ln + ' on ' + this.state.props_date} ?</div>
                            </ModalConfirmation>

                            <ModalRevoked
                                show={this.state.isModalRevokedOpen}
                                onClose={this.closeModalRevoked}>
                                <br/>
                                <div style={{color: 'red'}}>Appointments that are due in less than 48 hrs cannot be canceled online. Please call the clinic</div>
                            </ModalRevoked>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </Table>
            </div>
          </Container>
        </div>
      </div>
    );

  }


  /* open the modal */
  openModalAppointmentDetail(e, appointmentId) {
    axios.get('/doctor_or_patient/get_appointmentdetail_by_appointmentId/' + appointmentId)
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


  cancelOrRevoke(e, id, fn, ln, startdate, status) {                        // parameters = (event, 12, 'YOUNG', 'LEE', '06/02/2020 08:00', 'BOOKED')
    let now = new Date();                                                   // now = Sun May 03 2020 20:43:12 GMT-0400 (Eastern Daylight Time)
    let nowUNIX = now.getTime();                                            // UNIX value is in milliseconds ex: 1588948991893
    console.log('nowUNIX=', nowUNIX);

    var date = new Date(nowUNIX);
    console.log('nowUNIX.toUTCString()=', date.toUTCString());

    // add 'z' to String value so that the _startdate is in UTC.
    let _startdate = new Date(startdate.concat('z'));
    console.log('_startdate.toUTCString()=', _startdate.toUTCString());      // displays in UTC and not in localtime
    let _startdateUNIX = _startdate.getTime();
    console.log('_startdateUNIX=', _startdateUNIX);

    let diffSeconds = (_startdateUNIX - nowUNIX)/1000;                   // convert milliseconds to seconds
    console.log('diffSeconds=', diffSeconds);

    if (status === 'BOOKED' && diffSeconds >= 172800) {         // 48 hours = 2880 minutes = 172800 seconds
      this.openModalConfirmation(e, id, fn, ln, startdate, status);
    }
    // if status !== BOOKED or diffHours < 48
    else {
      this.openModalRevoked();
    }
  }


  openModalConfirmation(e, id, fn, ln, startdate, status) {
    this.setState({
      isModalConfirmationOpen: !this.state.isModalConfirmationOpen,
      props_id: id,
      props_fn: fn,
      props_ln: ln,
      props_date: startdate.substring(0, 10) + ' at ' + startdate.substring(11, 16),
      props_status: status,
    },()=>{
      console.log('status=', this.state.props_status);
    });
  }

  closeModalConfirmation() {
    this.setState({
      isModalConfirmationOpen: !this.state.isModalConfirmationOpen
    });
  }


  openModalRevoked() {
    this.setState({
      isModalRevokedOpen: !this.state.isModalRevokedOpen,
    });
  }


  closeModalRevoked() {
    this.setState({
      isModalRevokedOpen: !this.state.isModalRevokedOpen,
    });
  }



  onChangeStatus(e) {
    let _selectedStatus = e.target.value;
    //console.log('_selectedStatus=', _selectedStatus);
    this.setState({
      selectedStatus: _selectedStatus
    }, () => {
      this.getAppointmentsOfPatientByAppointmentStatus(this.state.selectedStatus);
    });
  }


  /*
   * Function - get Appointments of Patient By Appointment Status
   * @param - this.state.appointments, appointment status
   */
  getAppointmentsOfPatientByAppointmentStatus(_selectedStatus) {     // _selectedStatus = '1'
      let _appointments = this.state.appointments;
      // if user does not select 'ALL' from the options donot filter appointments
      if(parseInt(_selectedStatus) !== 999) {
        _appointments = _appointments.filter(x => x.status === convertIntegerStatusToString(parseInt(_selectedStatus)));   // _selectedStatus === '2'
      }
      this.setState({
        updatedList: _appointments
      });
  }


  /*
  * delete appointment by Id
  * ensure that appointment starttime is more than 48 hours(172800 seconds) from cancellation time.
  * @param : appointmentId
  * @return : HttpResponse.SUCCESS
  */
  cancelAppointment(e, id) {
    console.log('appointmentId=', id);
    axios.delete('/patient/delete_appointment_and_appointmentdetail_by_appointmentId/' + id)
    .then(response => {
      console.log('response.data=', response.data);
      window.location.reload(false);    // refresh page to display updated data
    })
    .catch(function (error) {
      console.log(error);
    })
    /* window.location.reload(false); DONOT USE this line here. Use it inside .then(resonse=>{}) because if access_token is expired
    * while delete request is made, reloading page will occur before failed request is re-tried which will
    */
  }


}

export default ViewAppointments;
