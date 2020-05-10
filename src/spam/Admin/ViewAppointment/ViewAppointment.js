import React, { Component } from 'react';
import { Container, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import ModalConfirmation from './ModalConfirmation';
import ModalCheckStatus from './ModalCheckStatus';

import axios from 'axios';
import './ViewAppointment.css';
import AdminNavbar from '../AdminNavbar/AdminNavbar';

class ViewAppointment extends Component {

  constructor(props) {
    super(props);
    this.state = {
      appointments: [],
      updatedList: [],
      todayDate: '',
      isModalConfirmationOpen: false,
      isModalStatusOpen: false,
    };

    this.onChangeDate = this.onChangeDate.bind(this);
    this.searchTextFunc = this.searchTextFunc.bind(this);
    this.convertStatusNumberToName = this.convertStatusNumberToName.bind(this);
    this.openModalConfirmation = this.openModalConfirmation.bind(this);
    this.closeModalConfirmation = this.closeModalConfirmation.bind(this);
    this.openModalCheckStatus = this.openModalCheckStatus.bind(this);
    this.closeModalCheckStatus = this.closeModalCheckStatus.bind(this);
    this.cancelAppointment = this.cancelAppointment.bind(this);
    this.updateStatus = this.updateStatus.bind(this);
  }

  // this method gets executed first when this component is called
  async componentDidMount(){
    axios.get('/get_all_appointments')    // proxy used is 'http://localhost:8080'
    .then(response => {
      let _appointments = response.data;   // response.data contains [{appointment: {}, link: {}}, {feedback: {}, link: {}}, {feedback: {}, link: {}}]
      _appointments = _appointments.map(x => x.appointment);   // _feedbacks contains [{id: 1, date: '', message: ''}, {id: 2, date: '', message: ''}]
      _appointments = _appointments.map(x => {              // convert time: '2020-03-02T16:00:00.000+0000' to date: '2020-03-15 14:00'
        let obj = x;
        obj.appointment_starttime = this.convert_StringUTC_to_AppointmentDateTime(obj.appointment_starttime);
        obj.appointment_endtime = this.convert_StringUTC_to_AppointmentDateTime(obj.appointment_endtime);
        obj.patient_birthdate = this.convert_StringUTC_to_Birthdate(obj.patient_birthdate);
        return obj;
      });
      this.setState({
        appointments: _appointments,
        updatedList: _appointments,
        isEdit: true
      }, ()=> {
        console.log('appointments=', this.state.appointments);
      });
    })
    .catch(function (error) {
      console.log(error);
    })
  }


  render() {
    return(
      <div>
        <AdminNavbar/>               {/* patient home page navigation bar */}
        <Container>
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
                        value={this.state.todayDate}
                        onChange={this.onChangeDate}>
                </input>
              </div>
            </div>
          </div>
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
              {this.state.updatedList.map((item) => {
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
                        <Link to={'#'} onClick={(e)=>this.openModalCheckStatus(e, item.appointment_id, item.appointment_status, item.patient_phone, item.patient_email)}>status</Link>
                        <ModalCheckStatus
                            show={this.state.isModalStatusOpen}
                            onUpdateStatus={(e)=>this.updateStatus(e, this.state.props_id)}
                            onClose={this.closeModalCheckStatus}
                            appointmentId={item.appointment_id}>
                            <div>Status - {this.state.props_status}</div>
                            <br/>
                            <div><img style={image_icon} src='/images/phone.png' alt=""/>  - {this.state.props_phone}</div>
                            <div><img style={image_icon} src='/images/email.jpg' alt=""/> - {this.state.props_email}</div>
                        </ModalCheckStatus>
                    </td>
                    <td>
                        {/* Modal - Confirm Cancellation */}
                        <Link to={'#'} onClick={(e)=>this.openModalConfirmation(e, item.appointment_id, item.patient_firstname, item.patient_lastname, item.appointment_starttime)}>cancel</Link>
                        <ModalConfirmation
                            show={this.state.isModalConfirmationOpen}
                            onCancel={(e)=>this.cancelAppointment(e, this.state.props_id)}
                            onClose={this.closeModalConfirmation}
                            appointmentId={item.appointment_id}>
                            <div>Are you sure you want to cancel the appointment for</div>
                            <div>{this.state.props_fn + ' ' + this.state.props_ln + ' on ' + this.state.props_date} ?</div>
                        </ModalConfirmation>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </Container>
      </div>
    );

  }



  openModalCheckStatus(e, id, status, phone, email) {
    this.setState({
      isModalStatusOpen: !this.state.isModalStatusOpen,
      props_id: id,
      props_status: this.convertStatusNumberToName(status),
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

  openModalConfirmation(e, id, fn, ln, date) {
    this.setState({
      isModalConfirmationOpen: !this.state.isModalConfirmationOpen,
      props_id: id,
      props_fn: fn,
      props_ln: ln,
      props_date: date.substring(0, 10) + ' at ' + date.substring(11, 16),
    });
  }

  closeModalConfirmation() {
    this.setState({
      isModalConfirmationOpen: !this.state.isModalConfirmationOpen
    });
  }


  /*
  * delete appointment by // Id
  * @param : appointmentId
  * @return : HttpResponse.SUCCESS
  */
  cancelAppointment(e, id) {
    console.log('appointmentId=', id);
    axios.delete('/delete_appointment_and_appointmentdetail_by_appointmentId/' + id)
    .then(response => {
      console.log('response.data=', response.data);
    })
    .catch(function (error) {
      console.log(error);
    })
    window.location.reload(false);
  }


  /*
  * update patient status from BOOKED to RECEIVED
  * @param : appointmentId
  * @return : Appointment
  */
  updateStatus(e, id) {
    console.log('appointmentId=', id);
    axios.put('/update_status_by_appointmentId/' + id)
    .then(response => {
      console.log('response.data=', response.data);
    })
    .catch(function (error) {
      console.log(error);
    })
    window.location.reload(false);
  }


  onChangeDate(e) {
    // change the date on the datePicker
    console.log('e.target.value=', e.target.value);
    this.setState({
      todayDate: e.target.value
    });
    // if no date is selected, show all appointments
    if(e.target.value === '') {
      this.setState({
        updatedList: this.state.appointments
      });
    }
    else {
      // if date is selected then update the list of appointments scheduled on that date
      let _updatedList = this.state.appointments;
      _updatedList = _updatedList.filter(x => {   // filter out those feedbacks whose date is < 7 days
        let obj = x;
        let _selectedDate = e.target.value;     // String value of '2020-05-01'
        console.log('_selectedDate=', _selectedDate);
        let _starttime = obj.starttime.substring(0, 10);   // convert '2020-05-01 14:00' to '2020-05-01'
        console.log('_starttime=', _starttime);
        if(_selectedDate === _starttime) {
          return obj;
        }
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
    });
  }


  /**
 * converts String UTC '2014-04-11T14:00:00.000+0000' to String '04/11/2014 14:00'
 */
  convert_StringUTC_to_AppointmentDateTime(UTC) {
    var _date = UTC.substring(0, 10);
    var _time = UTC.substring(11, 16);
    return _date + ' ' + _time;
  }

  /**
 * converts String UTC '2014-04-11T14:00:00.000+0000' to String '04/11/2014'
 */
  convert_StringUTC_to_Birthdate(UTC) {
    var _date = UTC.substring(0, 10);
    return _date;
  }


  /*
  * convert Status from Number to Name
  * @param : 1
  * @return : 'BOOKED'
  */
  convertStatusNumberToName(num) {
    switch(num) {
      case '1':
        return 'BOOKED';
        break;
      case '2':
        return 'RECEIVED';
        break;
      case '3':
        return 'COMPLETED';
        break;
      case '4':
        return 'NOT_ARRIVED';
        break;
      case '5':
        return 'CANCELED';
        break;
    }
  }

}


const image_icon = {
  height: 20,
  width: 20
}

export default ViewAppointment;
