import React, { Component } from 'react';
import { Button, Container, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

import AppNavbar from './AppNavbar/AppNavbar';

class Home extends Component {

  constructor(props) {
    super(props);
    this.state = { employee: "" };
  }

  // this method gets executed first when this component is called
  async componentDidMount(){
    axios.get('/getOnly/1')    // proxy used is 'http://localhost:8080'
      .then(response => {
        this.setState({ employee: response.data.employee });
        console.log(this.state.employee);
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  render() {
    return(
      <div>
        <AppNavbar/>
        <h2>This is Home Page</h2>
        <Container fluid>
          <div className="float-right">
            <Button color="success" tag={Link} to="/edit">Edit</Button>
          </div>
          <Table>
            <tbody>
              <tr>
                <td>Firstname</td><td>{this.state.employee.firstname}</td>
              </tr>
              <tr>
                <td>Lastname</td><td>{this.state.employee.lastname}</td>
              </tr>
              <tr>
                <td>Email</td><td>{this.state.employee.email}</td>
              </tr>
              <tr>
                <td>Username</td><td>{this.state.employee.username}</td>
              </tr>
              <tr>
                <td>Password</td><td>{this.state.employee.username}</td>
              </tr>
            </tbody>
          </Table>
        </Container>
      </div>
    );

  }
}

export default Home;
