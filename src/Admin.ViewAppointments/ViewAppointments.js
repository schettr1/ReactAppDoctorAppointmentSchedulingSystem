import React, { Component } from 'react';
import { Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import ModalConfirmation from './ModalConfirmation';
import ModalCheckStatus from './ModalCheckStatus';
import ModalRevoked from './ModalRevoked';
import { convertIntegerStatusToString, convertStringUTCDateToAppointmentDateTimeFormat,
  convertStringUTCDatetoBirthdate, convertDatePickerDateToAppointmentDate } from '../_services/Converter.js';

import axios from 'axios';
import './ViewAppointments.css';
import Pagination from '../Pagination/Pagination';

class ViewAppointments extends Component {

  constructor(props) {
    super(props);
    this.state = {
      appointments: [],
      updatedList: [],
      pageOfItems: [],        // list of items in any single page
      selectedDate: '',
      isModalConfirmationOpen: false,
      isModalStatusOpen: false,
      isModalRevokedOpen: false,
    };
    this.getAllAppointments = this.getAllAppointments.bind(this);
    this.onChangeDate = this.onChangeDate.bind(this);
    this.searchTextFunc = this.searchTextFunc.bind(this);
    this.cancelOrRevoke = this.cancelOrRevoke.bind(this);
    this.openModalConfirmation = this.openModalConfirmation.bind(this);
    this.closeModalConfirmation = this.closeModalConfirmation.bind(this);
    this.closeModalRevoked = this.closeModalRevoked.bind(this);
    this.openModalRevoked = this.openModalRevoked.bind(this);
    this.openModalCheckStatus = this.openModalCheckStatus.bind(this);
    this.closeModalCheckStatus = this.closeModalCheckStatus.bind(this);
    this.cancelAppointment = this.cancelAppointment.bind(this);
    this.updateStatusFromBookedToReceived = this.updateStatusFromBookedToReceived.bind(this);
    this.onChangePage = this.onChangePage.bind(this);     // pagination
  }


  async componentDidMount(){
    this.getAllAppointments();
  }


  // pagination
  onChangePage(pageOfItems) {
    this.setState({
      pageOfItems: pageOfItems
    });
  }


  render() {

    // Read props value inside render(). You cannot read its value inside componentDidMount()
    let updatedList = this.state.updatedList;

    return(
      <div className="container">
        <div className="leftFloat">
          <input type="text" className="form-control form-control-lg" placeholder='Search'
                  onChange={this.searchTextFunc}/>
        </div>
        <div className="rightFloat">
          <div className="form-group parent">
            <div className="left-child">
              <label>Date: </label>
            </div>
            <div className="right-child">
              <input type="date"
                      className="form-control"
                      value={this.state.selectedDate}
                      onChange={this.onChangeDate}>
              </input>
            </div>
          </div>
        </div>

        <div>
          <Table>
            <thead>
              <tr>
                <th>ApptID</th>
                <th>Start</th>
                <th>End</th>
                <th>Patient</th>
                <th>Birthdate</th>
                <th>Doctor</th>
                <th colSpan="2">Action</th>
              </tr>
            </thead>
            <tbody>
              {this.state.pageOfItems.map((item) => {
                return(
                  <tr key={item.appointment_id}>
                    <td>{item.appointment_id}</td>
                    <td>{item.appointment_starttime}</td>
                    <td>{item.appointment_endtime}</td>
                    <td>{item.patient_firstname + ' ' + item.patient_lastname}</td>
                    <td>{item.patient_birthdate}</td>
                    <td>{item.doctor_firstname + ' ' + item.doctor_lastname}</td>
                    <td>
                        {/* Modal - Check Status */}
                        <Link to={'#'} onClick={(e)=>this.openModalCheckStatus(e, item.appointment_id,
                                                                                  item.appointment_status,
                                                                                  item.patient_phone,
                                                                                  item.patient_email)}>status</Link>
                        <ModalCheckStatus
                            show={this.state.isModalStatusOpen}
                            onUpdateStatus={(e)=>this.updateStatusFromBookedToReceived(e, this.state.props_id)}
                            onClose={this.closeModalCheckStatus}
                            appointmentId={this.state.props_id}
                            status={this.state.props_status}>
                            <div>Appt ID - {this.state.props_id}</div>
                            <div>Status - {this.state.props_status}</div>
                            <br/>
                            <div><img style={image_icon} src='/images/phone.png' alt=""/>  - {this.state.props_phone}</div>
                            <div><img style={image_icon} src='/images/email.jpg' alt=""/> - {this.state.props_email}</div>
                        </ModalCheckStatus>
                    </td>
                    <td>
                                          {/* Modal - Confirm Cancellation */}
                          <Link to={'#'}
                                onClick={(e)=>this.cancelOrRevoke(e, item.appointment_id,
                                                                    item.patient_firstname,
                                                                    item.patient_lastname,
                                                                    item.appointment_starttime,
                                                                    item.appointment_status
                                                                  )}>cancel</Link>
                          <ModalConfirmation
                              show={this.state.isModalConfirmationOpen}
                              onCancel={(e)=>this.cancelAppointment(e, this.state.props_id)}
                              onClose={this.closeModalConfirmation}
                              appointmentId={item.appointment_id}>
                              <div style={{color: 'red'}}>Are you sure you want to cancel the appointment for</div>
                              <div style={{color: 'red'}}>{this.state.props_fn + ' ' + this.state.props_ln + ' on ' + this.state.props_date} ?</div>
                          </ModalConfirmation>

                          <ModalRevoked
                              show={this.state.isModalRevokedOpen}
                              onClose={this.closeModalRevoked}>
                              <br/>
                              <div>Only BOOKED appointment can be canceled.</div>
                          </ModalRevoked>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
          <Pagination items={updatedList} onChangePage={this.onChangePage} />
        </div>
      </div>
    );

  }



  openModalCheckStatus(e, id, status, phone, email) {
    this.setState({
      isModalStatusOpen: !this.state.isModalStatusOpen,
      props_id: id,
      props_status: convertIntegerStatusToString(parseInt(status)),
      props_email: email,
      props_phone: phone,
    }, ()=> {
      console.log('id=', id, ', this.state.props_status=', this.state.props_status, ', phone=', phone, ', email=', email);
    });
  }

  closeModalCheckStatus() {
    this.setState({
      isModalStatusOpen: !this.state.isModalStatusOpen
    });
  }


  cancelOrRevoke(e, id, fn, ln, date, status) {
    // if status is BOOKED, open ModalConfirmation
    if (status === '1') {
      this.openModalConfirmation(e, id, fn, ln, date, status);
    }
    // for any other status, open ModalRevoked
    else {
      this.openModalRevoked();
    }
  }


  openModalConfirmation(e, id, fn, ln, date, status) {
    this.setState({
      isModalConfirmationOpen: !this.state.isModalConfirmationOpen,
      props_id: id,
      props_fn: fn,
      props_ln: ln,
      props_date: date.substring(0, 10) + ' at ' + date.substring(11, 16),
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


  /*
  * delete appointment by // Id
  * @param : appointmentId
  * @return : HttpResponse.SUCCESS
  */
  cancelAppointment(e, id) {
    console.log('appointmentId=', id);
    axios.delete('/admin/delete_appointment_and_appointmentdetail_by_appointmentId/' + id)
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


  /*
  * update patient status from BOOKED to RECEIVED
  * @param : appointmentId
  * @return : Appointment
  */
  updateStatusFromBookedToReceived(e, id) {
    console.log('appointmentId=', id);
    axios.put('/admin/update_status_by_appointmentId/' + id)
    .then(response => {
      console.log('response.data=', response.data);
      window.location.reload(false);
    })
    .catch(function (error) {
      console.log(error);
    })

  }


  onChangeDate(e) {
    // get the date from the datePicker
    let selectedDate = e.target.value;       // e.target.value = '2020-05-01'
    console.log('selectedDate=', selectedDate);
    this.setState({
      selectedDate: selectedDate
    })
    // if no date is selected, show all appointments
    if(e.target.value === '') {
      this.setState({
        updatedList: this.state.appointments
      });
    }
    // if date is selected then filter appointments
    else {
      let _updatedList = this.state.appointments;
      _updatedList = _updatedList.filter(x => {
        let obj = x;
        let _selectedDate = convertDatePickerDateToAppointmentDate(e.target.value);     // convert '2020-05-01' to '05/01/2020'
        let _starttime = obj.appointment_starttime.substring(0, 10);   // convert '05/01/2020 14:00' to '05/01/2020'
        console.log('appointment.starttime=', _starttime);
        if(_selectedDate === _starttime) {
          return obj;
        }
        return null;
      });
      this.setState({
        updatedList: _updatedList
      });
    }
  }


  searchTextFunc(event) {
    const searchText = event.target.value.toLowerCase();
    //console.log('searchText=', searchText);
    let _updatedList = this.state.appointments;
    _updatedList = _updatedList.filter(function(item) {
      return (
        Object.keys(item).some(key =>
                  item[key].toString().toLowerCase().includes(searchText))
      );
    });
    /*
    * we use updatedList[] for the props because if we use doctors[] as props and setState on doctors[] instead of updatedList[],
    * matching list of doctors[] is displayed when we enter 'searchText', but when we remove 'searchText' postState doctors[]
    * will not display the preState doctors[] (initial list) again
    */
    this.setState({
      updatedList: _updatedList
    },()=>{
      console.log('updatedList=', this.state.updatedList);
    });
  }


  /*
   * Retrieve all appointments
   */
  getAllAppointments() {
    axios.get('/admin/get_all_appointments')    // using proxy 'http://localhost:8080'
    .then(response => {
      let _appointments = response.data;   // response.data contains [{appointment: {}, link: {}}, {feedback: {}, link: {}}, {feedback: {}, link: {}}]
      _appointments = _appointments.map(x => x.appointment);   // _feedbacks contains [{id: 1, date: '', message: ''}, {id: 2, date: '', message: ''}]
      _appointments = _appointments.map(x => {              // convert time: '2020-03-02T16:00:00.000+0000' to date: '2020-03-15 14:00'
        let obj = x;
        obj.appointment_starttime = convertStringUTCDateToAppointmentDateTimeFormat(obj.appointment_starttime);
        obj.appointment_endtime = convertStringUTCDateToAppointmentDateTimeFormat(obj.appointment_endtime);
        obj.patient_birthdate = convertStringUTCDatetoBirthdate(obj.patient_birthdate);
        return obj;
      });
      console.log('_appointments=', _appointments);
      this.setState({
        appointments: _appointments,
        updatedList: _appointments
      });
    })
    .catch(function (error) {
      console.log(error);
    })
  }





}


const image_icon = {
  height: 20,
  width: 20
}

export default ViewAppointments;
