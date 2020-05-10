import React, { Component } from 'react';
import { Container, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

import PatientNavbar from '../PatientNavbar/PatientNavbar';
import './ViewAppointment.css';


class ViewAppointment extends Component {

  constructor(props) {
    super(props);
    this.state = {
      appointments: [],
      isOpen: false,
      status: [],
      selectedStatus: '',
      patientId: 204                   // from Local Storage when user logs in
    };

    this.formatStringDate = this.formatStringDate.bind(this);
    this.toggleModal= this.toggleModal.bind(this);
    this.onChangeStatus = this.onChangeStatus.bind(this);
  }


  async componentDidMount(){
    let _status = [
      {id: 1, name: 'Pending'},               // status id is matched with StatusEnum
      {id: 3, name: 'Completed'},
      {id: 999, name: 'All'}
    ];
    this.setState({
      status: _status
    });

    axios.get('/get_appointments_by_patientid_and_status/' + this.state.patientId + '/status/' + 1)  // initially user sees only pending appointments
    .then(response => {
      let _appointments = response.data;   // response.data contains [ { appointment: {id: 101, starttime: '', endtime: '',..}, link: {} }, {}, ...]
      _appointments = _appointments.map(x => x.appointment);   // _appointments contains [ {id: 101, starttime: '', endtime: '',..}, {}, {}, ...]
      _appointments = _appointments.map(x => {
        let obj = x;
        obj.starttime = this.formatStringDate(obj.starttime);
        obj.endtime = this.formatStringDate(obj.endtime);
        return obj;
      });
      this.setState({
        appointments: _appointments
      }, ()=> {
        console.log('appointments[]=', this.state.appointments);
      });
    })
    .catch(function (error) {
      console.log(error);
    })

  }



  render() {
    return(
      <div>
        <PatientNavbar/>               {/* patient home page navigation bar */}
        <div className="container fluid searchPanel">
          <h2>Appointments</h2>
          <div className="float-right">
            <select className="form-control space"
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
                  </tr>
                </thead>
                <tbody>
                  {this.state.appointments.map((item, i) => {
                    return(
                      <tr key={i}>
                        <td>{this.state.appointments[i].appid}</td>
                        <td>{this.state.appointments[i].starttime}</td>
                        <td>{this.state.appointments[i].endtime}</td>
                        <td>{(this.state.appointments[i].doctorfn) + ' ' + (this.state.appointments[i].doctorln)}</td>
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


  toggleModal() {
    this.setState({
      isOpen: !this.state.isOpen
    }, ()=> {
      console.log('this.state.isOpen=', this.state.isOpen);
    });
  }


  onChangeStatus(e) {
    let _selectedStatus = e.target.value;
    console.log('_selectedStatus=', _selectedStatus);
    this.setState({
      selectedStatus: _selectedStatus
    }, () => {
      if(this.state.selectedStatus === '999') {        // 999 means 'ALL' appointments of the patient
        axios.get('/get_appointments_by_patientid/' + this.state.patientId)
        .then(response => {
          let _appointments = response.data;   // response.data contains [ { appointment: {id: 101, starttime: '', endtime: '',..}, link: {} }, {}, ...]
          _appointments = _appointments.map(x => x.appointment);   // _appointments contains [ {id: 101, starttime: '', endtime: '',..}, {}, {}, ...]
          _appointments = _appointments.map(x => {
            let obj = x;
            obj.starttime = this.formatStringDate(obj.starttime);
            obj.endtime = this.formatStringDate(obj.endtime);
            return obj;
          });
          this.setState({
            appointments: _appointments
          }, ()=> {
            console.log('appointments[]=', this.state.appointments);
          });
        })
        .catch(function (error) {
          console.log(error);
        });
      }
      else {
        axios.get('/get_appointments_by_patientid_and_status/' + this.state.patientId + '/status/' + this.state.selectedStatus)
        .then(response => {
          let _appointments = response.data;   // response.data contains [ { appointment: {id: 101, starttime: '', endtime: '',..}, link: {} }, {}, ...]
          _appointments = _appointments.map(x => x.appointment);   // _appointments contains [ {id: 101, starttime: '', endtime: '',..}, {}, {}, ...]
          _appointments = _appointments.map(x => {
            let obj = x;
            obj.starttime = this.formatStringDate(obj.starttime);
            obj.endtime = this.formatStringDate(obj.endtime);
            return obj;
          });
          this.setState({
            appointments: _appointments
          }, ()=> {
            console.log('appointments[]=', this.state.appointments);
          });
        })
        .catch(function (error) {
          console.log(error);
        });
      }
    });
  }


  formatStringDate(date) {
    let _date = date.substring(0, 10);
    let _hrs = date.substring(11, 13);
    let _mins = date.substring(14, 16);
    return _date + ' ' + _hrs + ':' + _mins;
  }

}

export default ViewAppointment;
