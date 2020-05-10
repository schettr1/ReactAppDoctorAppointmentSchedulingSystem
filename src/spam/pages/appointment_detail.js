import React, { Component } from 'react';
import { Button, Container, Table } from 'reactstrap';
import { Link } from 'react-router-dom';


class appointment_detail extends Component {

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    return(
      <div className="container fluid">
        <h2>Appointment Detail</h2>
        <Table className='table1'>
          <thead>
            <tr>
              <th>Time</th>
              <th>Appt.ID</th>
              <th>Date</th>
              <th>Firsname</th>
              <th>Lastname</th>
              <th>DOB</th>
              <th>Phone</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {this.props.patients.map((item, i) =>{
              return (
                <tr key={i}>
                  <td className='time1'>{this.props.patients[i].time}</td>
                  <td>{this.props.patients[i].id}</td>
                  <td>{this.props.patients[i].date}</td>
                  <td>{this.props.patients[i].firstname}</td>
                  <td>{this.props.patients[i].lastname}</td>
                  <td>{this.props.patients[i].birthdate}</td>
                  <td>{this.props.patients[i].phone}</td>
                  <td>
                    <a href={"/doctor/add_description/"+this.props.patients[i].id}>add description</a>
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


export default appointment_detail;
