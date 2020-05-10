import React, { Component } from 'react';
import { Button, Container, Table } from 'reactstrap';
import { Link } from 'react-router-dom';



class ListAppointment extends Component {

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    return(
      <div>
        <Table className='table'>
          <thead>
            <tr>
              <th>Time</th>
              <th>Appt.Date</th>
              <th>Appt.ID</th>
              <th>Firsname</th>
              <th>Lastname</th>
              <th>PatientID</th>
              <th>Gender</th>
              <th>Birthdate</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {this.props.appointments.map((item, i) =>{
              return (
                <tr key={i}>
                  <td className='time'>{this.props.appointments[i].time}</td>
                  <td>{this.props.appointments[i].date}</td>
                  <td>{this.props.appointments[i].id}</td>
                  <td>{this.props.appointments[i].firstname}</td>
                  <td>{this.props.appointments[i].lastname}</td>
                  <td>{this.props.appointments[i].patient_id}</td>
                  <td>{this.props.appointments[i].gender}</td>
                  <td>{this.props.appointments[i].birthdate}</td>
                  <td>
                    <a style={this.props.appointments[i].id !== '' ? {} : { display: 'none' }}
                      href={"/doctor/add_description/"+this.props.appointments[i].id}>view details</a>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      </div>
    );
  }
}


export default ListAppointment;
