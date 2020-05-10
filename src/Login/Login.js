import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import { Base64Encode } from '../_services/Base64Encode.js';
import ValidationMessage from '../_services/FormValidationMessage';
import SessionExpiredAlert from '../_services/SessionExpiredAlert.js';


class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      credentials: {
        username: '',
        password: '',
      },
      isValidUsername: '',
      isValidPassword: '',
      isFormSubmitted: '',
      isValidCredentials: '',
      errorMsg: {},     // errorMsg: {username: 'required field', password: 'required field'}
      isRefreshTokenExpired: false,         // Session expires when refresh_token expires
      sessionExpiredMsg: '',
      dataLoading: false,

      loggedUser: {
        access_token: '',
        refresh_token: '',
        userId: '',
        role: ''
      }
    };
    this.onLogin = this.onLogin.bind(this);
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.submitUserCredentials = this.submitUserCredentials.bind(this);
  }


  // When refresh_token expires any request to the Server will return status 401 and the interceptor will
  // re-direct to '/login' path. componentDidMount() method gets executed and refresh_token expiration is
  // evaluated. If expired refresh_token, display sessionExpiredMsg.
  componentDidMount(){
    let isRefreshTokenExpired = localStorage.getItem('isRefreshTokenExpired');      // 'isRefreshTokenExpired: true' item is set inside Interceptors.js
    // check whether refresh_token is expired when Login.js loads
    if(isRefreshTokenExpired) {
      this.setState({
        isRefreshTokenExpired,
        sessionExpiredMsg: 'Your session has expired! Please login again.'
      });
      // set 'isRefreshTokenExpired: false' after 3 seconds so that sessionExpiredMsg will disappear
      setTimeout(() => {
        this.setState({
          isRefreshTokenExpired: false
        },()=>{
          localStorage.removeItem('isRefreshTokenExpired');   // remove item 'isRefreshTokenExpired' from localStorage
        })
      }, 3000);
    }
    
  }



  render() {
    return(
      <div className='container wrapper'>
        <form className='loginForm' onSubmit={this.onLogin}>
        <h2>Login</h2>
        <hr/><br/>
          <div className='d-flex justify-content-center mb-4'>
            <div className='col-md-4'>
              <ValidationMessage valid={this.state.isValidCredentials} message={this.state.errorMsg.credentials}/>
              <input
                type="text"
                className="form-control"
                placeholder='username'
                value={this.state.credentials.username}
                onChange={this.onChangeUsername}
              />
              <ValidationMessage valid={this.state.isValidUsername} message={this.state.errorMsg.username}/>
            </div>
          </div>
          <div className='d-flex justify-content-center mb-4'>
            <div className='col-md-4'>
              <input
                type="text"
                className="form-control"
                placeholder='password'
                value={this.state.credentials.password}
                onChange={this.onChangePassword}
              />
              <ValidationMessage valid={this.state.isValidPassword} message={this.state.errorMsg.password}/>
            </div>
          </div>

          <div>
            {
              this.state.isFormSubmitted && this.state.dataLoading ?
                <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" alt=''/>
              : null
            }
          </div>

          <div className="form-group _button">
              <input type="submit" value="Submit" className="btn btn-info"/>
          </div>
          <div className="form-group _button">
              Not Registered? <Link to={"/register_patient/" + 0} >Click here</Link>
          </div>
        </form>

        {
          this.state.isRefreshTokenExpired ?
            <SessionExpiredAlert show={this.state.isRefreshTokenExpired} message={this.state.sessionExpiredMsg}/> : null
        }

      </div>
    );
  }


  onLogin(e) {
    this.setState({
      dataLoading: true
    })
    e.preventDefault();
    this.validateForm();
  }


  validateForm() {
    let username = this.state.credentials.username;
    let password = this.state.credentials.password;
    let errorMsg = {...this.state.errorMsg};
    let isValidUsername = true;
    let isValidPassword = true;
    let isFormSubmitted = true;

    // required field
    if (username.length === 0) {
      isValidUsername = false;                 // set usename as invalid
      errorMsg.username = 'required field';     // set error message
      isFormSubmitted = false;                  // do not allow to submit form data
    }
    // required field
    if (password.length === 0) {
      isValidPassword = false;                // set password as invalid
      errorMsg.password = 'required field';     // set error message
      isFormSubmitted = false;                 // do not allow to submit form data
    }
    this.setState({
      isValidUsername,
      isValidPassword,
      isFormSubmitted,
      errorMsg,
      isValidCredentials: true, // this will make sure when 'required field' message is displayed 'Invalid Credentials' message will be hidden
    },()=>{
      // submit form data
      if(isFormSubmitted) {
        console.log('Posting data');
        this.submitUserCredentials();
      }
    })
  }


  submitUserCredentials() {
    const credentials = this.state.credentials;
    console.log(credentials);
    var authdata = Base64Encode(credentials.username + ':' + credentials.password);

    axios
    .post('/authorize', null, {
        headers: {
            "Authorization" : "Basic " + authdata
        }
    })
    .then(response => {
      this.setState({
        loggedUser: response.data,         // response.data = {access_token: '', refresh_token: '', userId: '', role: ''}
        dataLoading: false
      }, ()=> {
        var _loggedUser = this.state.loggedUser;
        _loggedUser.role = [_loggedUser.role];      // convert role:"ROLE_ADMIN" to role:["ROLE_ADMIN"] because our hasRole(user, roles[]) requires roles[]
        localStorage.setItem('loggedUser', JSON.stringify(_loggedUser));	// store String in localStorage (won't be deleted if page is refreshed)
        console.log('localStorage=', localStorage.getItem('loggedUser'));
        this.props.history.push('/home');
        window.location.reload(false); // refresh the page once you get to home page so that App.js gets localStorage value and display <Navbar> instead of <EmptyNavbar>
      })
    })
    // handle 401 Unauthorized response status from database
    .catch(error => {           // .catch(function(error) {}) does not allow to set State objects.
      console.log('error.response.data=', error.response.data);
      if(error.response.data.status === 'UNAUTHORIZED') {
        console.log("Invalid Login Credentials");
        // alert Invalid Credentials message
        let errorMsg = {...this.state.errorMsg};
        let isValidCredentials = false;
        errorMsg.credentials = "Invalid Credentials";
        console.log("isValidCredentials=", isValidCredentials);
        console.log("errorMsg=", errorMsg);
        this.setState({
          isValidCredentials: isValidCredentials,
          errorMsg: errorMsg,
          dataLoading: false
        })
      }
    })

  }



  // When tried to update the employee record, the form cannot be altered.
  onChangeUsername(e) {
    let _username = e.target.value;
    this.setState(prevState => ({
      credentials: {
        ...prevState.credentials,
        username: _username
      }
    }));
  }

  onChangePassword(e) {
    let _password = e.target.value;
    this.setState(prevState => ({
      credentials: {
        ...prevState.credentials,
        password: _password
      }
    }));
  }


}

export default Login;
