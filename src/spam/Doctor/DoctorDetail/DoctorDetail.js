import React, { Component } from 'react';
import { Button, Container, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

import './DoctorDetail.css';
import DoctorNavbar from '../DoctorNavbar/DoctorNavbar';

class DoctorDetail extends Component {

  constructor(props) {
    super(props);
    this.state = {
      doctor: ''
    };
  }

  // this method gets executed first when this component is called
  async componentDidMount(){
    var userId = JSON.parse(localStorage.getItem('loggedUser')).userId;
    axios.get('/get_user_by_id/' + userId)    // proxy object 'http://localhost:8080/' defined in package.json
      .then(response => {
        this.setState({
          doctor: response.data.user          // reponse.data = {user: {}, links: {}}  and reponse.data.user = {id: '', firstname: '', ...}
        },()=>{
          console.log(this.state.doctor);
        });
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  render() {
    return(
      <div>
        <DoctorNavbar/>               {/* patient home page navigation bar */}
        <div className='container fluid'>
          <h2>Details</h2>
          <div className='main-container'>
            <div className="left-div">
                <Table>
                  <tbody>
                    <tr>
                      <td>Firstname</td><td>{this.state.doctor.firstname}</td>
                    </tr>
                    <tr>
                      <td>Lastname</td><td>{this.state.doctor.lastname}</td>
                    </tr>
                    <tr>
                      <td>Email</td><td>{this.state.doctor.email}</td>
                    </tr>
                    <tr>
                      <td>Username</td><td>{this.state.doctor.username}</td>
                    </tr>
                    <tr>
                      <td>Password</td><td>{this.state.doctor.username}</td>
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

export default DoctorDetail;
