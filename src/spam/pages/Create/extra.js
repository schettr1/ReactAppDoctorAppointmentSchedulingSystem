import React, { Component } from 'react';
import AppNavbar from '../AppNavbar/AppNavbar';
import axios from 'axios';

/*
  In this example we define variables in 'state' instead of JSON data
  and update values of those variables in 'setState'
*/

class Create extends Component {

  constructor(props) {
    super(props);
    this.state = {
      id: '',
      firstname: '',
      lastname: '',
      email: '',
      username: '',
      password: '',
      isEdit: false,
    }
    this.onChangeFirstname = this.onChangeFirstname.bind(this);
    this.onChangeLastname = this.onChangeLastname.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  // this method gets executed first when this component is called
  async componentDidMount(){
    if(this.props.match.params.id === 0) {     // get employee by id only if url param is not 0
      // do nothing
    } else {
      axios.get('/getOnly/'+this.props.match.params.id)    // proxy used is 'http://localhost:8080'
        .then(response => {
          this.setState({
            id: response.data.employee.id,
            firstname: response.data.employee.firstname,
            lastname: response.data.employee.lastname,
            email: response.data.employee.email,
            username: response.data.employee.username,
            password: response.data.employee.password,
            isEdit: true
          });
          console.log('employee', this.state.employee);
        })
        .catch(function (error) {
          console.log(error);
        })
    }
  }

  onSubmit(e) {
      e.preventDefault();
      const emp = {
        firstname: this.state.firstname,
        lastname: this.state.lastname,
        email: this.state.email,
        username: this.state.username,
        password: this.state.password
      };
      console.log(emp);
      this.state.isEdit ? (                       // if isEdit is true, perform update
        axios.put('/update/'+this.state.id, emp)
            .then(response => {
              console.log(response.data);
            })
            .catch(function (error) {
              console.log(error);
            })
      ) : (                                     // else perform save
        axios.post('/save', emp)
            .then(response => {
              console.log(response.data);
            })
            .catch(function (error) {
              console.log(error);
            })
      )
      this.props.history.push('/groups');     // redirect to url '/groups'
    }

  render() {
    return(
      <div>
        <AppNavbar/>
        <div style={{marginTop: 60}}>
          <h3>Add New Employee</h3>
          <form onSubmit={this.onSubmit}>
              <div className="form-group">
                  <label>First Name:  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={this.state.firstname}
                    onChange={this.onChangeFirstname}
                  />
              </div>
              <div className="form-group">
                  <label>Last Name: </label>
                  <input
                    type="text"
                    className="form-control"
                    value={this.state.lastname}
                    onChange={this.onChangeLastname}
                  />
              </div>
              <div className="form-group">
                  <label>Email: </label>
                  <input
                    type="text"
                    className="form-control"
                    value={this.state.email}
                    onChange={this.onChangeEmail}
                  />
              </div>
              <div className="form-group">
                  <label>Username: </label>
                  <input
                    type="text"
                    className="form-control"
                    value={this.state.username}
                    onChange={this.onChangeUsername}
                  />
              </div>
              <div className="form-group">
                  <label>Password: </label>
                  <input
                    type="text"
                    className="form-control"
                    value={this.state.password}
                    onChange={this.onChangePassword}
                  />
              </div>
              <div className="form-group">
                  {this.state.isEdit ? (
                    <input type="submit" value="Update" className="btn btn-primary"/>
                  ) : (
                    <input type="submit" value="Register" className="btn btn-primary"/>
                  )}
              </div>
            </form>
          </div>
        </div>
    );
  }


    onChangeFirstname(e) {
      this.setState({
        firstname: e.target.value
      });
    }

    onChangeLastname(e) {
      this.setState({
        lastname: e.target.value
      });
    }

    onChangeEmail(e) {
      this.setState({
        email: e.target.value
      });
    }

    onChangeUsername(e) {
      this.setState({
        username: e.target.value
      });
    }

    onChangePassword(e) {
      this.setState({
        password: e.target.value
      });
    }

}

export default Create;
