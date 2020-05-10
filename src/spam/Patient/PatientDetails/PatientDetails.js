import React, { Component } from 'react';
import { Button, Container, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

import './PatientDetails.css';
import PatientNavbar from '../PatientNavbar/PatientNavbar';

class PatientHome extends Component {

  constructor(props) {
    super(props);
    this.state = {
      patient: ''
    };
  }

  // this method gets executed first when this component is called
  async componentDidMount(){
    axios.get('/getOnly/1')    // proxy object 'http://localhost:8080/' defined in package.json
      .then(response => {
        this.setState({
          patient: {
            id: 999,
            firstname: 'Surya',
            lastname: 'Chettri',
            email: 'suny4evers@hotmail.com',
            username: 'surya',
            password: 'chettri'
          } });
        console.log(this.state.patient);
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  render() {
    return(
      <div>
        <PatientNavbar/>               {/* patient home page navigation bar */}
        <div className='container fluid'>
          <h2>Details</h2>
          <div className='main-container'>
            <div className="left-div">
                <Table>
                  <tbody>
                    <tr>
                      <td>Firstname</td><td>{this.state.patient.firstname}</td>
                    </tr>
                    <tr>
                      <td>Lastname</td><td>{this.state.patient.lastname}</td>
                    </tr>
                    <tr>
                      <td>Email</td><td>{this.state.patient.email}</td>
                    </tr>
                    <tr>
                      <td>Username</td><td>{this.state.patient.username}</td>
                    </tr>
                    <tr>
                      <td>Password</td><td>{this.state.patient.username}</td>
                    </tr>
                  </tbody>
                </Table>
                <div className="buttonStyle">
                  <Button color="primary" tag={Link} to="/edit">Edit</Button>
                </div>
            </div>
            <div className="right-div">
              <img style={imageProperty} src='/images/person.png' alt="" />
            </div>
          </div>
        </div>
      </div>
    );

  }
}

let imageProperty = {
    width: 200,
    height: 200
};

export default PatientHome;
