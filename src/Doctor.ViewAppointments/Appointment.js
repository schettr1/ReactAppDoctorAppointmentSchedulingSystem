import React, { Component } from 'react';
import { Table } from 'reactstrap';



class appointment extends Component {

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
              <th>Appt.ID</th>
              <th>Appt.Date</th>
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
                  <td>{this.props.appointments[i].id}</td>
                  <td>{this.props.appointments[i].date}</td>
                  <td>{this.props.appointments[i].firstname}</td>
                  <td>{this.props.appointments[i].lastname}</td>
                  <td>{this.props.appointments[i].patient_id}</td>
                  <td>{this.props.appointments[i].gender}</td>
                  <td>{this.props.appointments[i].birthdate}</td>
                  <td>
                    <a style={this.props.appointments[i].id !== '' ? {} : { display: 'none' }}
                              href={"/appointment_details/"+this.props.appointments[i].id}>update details</a>
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


export default appointment;
