import React, { Component } from 'react';
import AppNavbar from '../AppNavbar/AppNavbar';
import axios from 'axios';

class Create extends Component {

  constructor(props) {
    super(props);
    this.state = {
      employee: {
        id: '',
        firstname: '',
        lastname: '',
        email: '',
        username: '',
        password: ''
      },
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
    var paramId = parseInt(this.props.match.params.id);
    if( paramId !== 0) {      // display edit_form when paramId !== 0 or else display create_form
      console.error('paramId !== 0 ', paramId);
      axios.get('/getOnly/'+paramId)    // proxy used is 'http://localhost:8080'
        .then(response => {
          this.setState({
            employee: response.data.employee,
            isEdit: true
          });
          console.log('/getOnly/0', this.state.employee.id);
        })
        .catch(function (error) {
          console.log(error);
        })
    }
  }

  onSubmit(e) {
      e.preventDefault();
      const emp = this.state.employee;
      console.log(emp);
      this.state.isEdit ? (                       // if isEdit is true, perform update
        axios.put('/update/'+this.state.employee.id, emp)
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
                    value={this.state.employee.firstname}
                    onChange={this.onChangeFirstname}
                  />
              </div>
              <div className="form-group">
                  <label>Last Name: </label>
                  <input
                    type="text"
                    className="form-control"
                    value={this.state.employee.lastname}
                    onChange={this.onChangeLastname}
                  />
              </div>
              <div className="form-group">
                  <label>Email: </label>
                  <input
                    type="text"
                    className="form-control"
                    value={this.state.employee.email}
                    onChange={this.onChangeEmail}
                  />
              </div>
              <div className="form-group">
                  <label>Username: </label>
                  <input
                    type="text"
                    className="form-control"
                    value={this.state.employee.username}
                    onChange={this.onChangeUsername}
                  />
              </div>
              <div className="form-group">
                  <label>Password: </label>
                  <input
                    type="text"
                    className="form-control"
                    value={this.state.employee.password}
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

    // When tried to update the employee record, the form cannot be altered.
    onChangeFirstname(e) {
      let _firstname = e.target.value;
      this.setState(prevState => ({
        employee: {
          ...prevState.employee,
          firstname: _firstname
        }
      }));
    }

    onChangeLastname(e) {
      let _lastname = e.target.value;
      this.setState(prevState => ({
        employee: {
          ...prevState.employee,
          lastname: _lastname
        }
      }));
    }

    onChangeEmail(e) {
      e.persist();
      this.setState(prevState => ({
        employee: {
          ...prevState.employee,
          email: e.target.value
        }
      }));
    }

    onChangeUsername(e) {
      e.persist();
      this.setState(prevState => ({
        employee: {
          ...prevState.employee,
          username: e.target.value
        }
      }));
    }

    onChangePassword(e) {
      e.persist();
      this.setState(prevState => ({
        employee: {
          ...prevState.employee,
          password: e.target.value
        }
      }));
    }

}

export default Create;
