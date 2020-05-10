import React, { Component } from 'react';
import { Button, Container, Table } from 'reactstrap';
import { Link } from 'react-router-dom';


class ListHistory extends Component {

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
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
                    <a href={"/doctor/add_description/"+this.props.appointments[i].appointment_id}>view details</a>
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


export default ListHistory;
