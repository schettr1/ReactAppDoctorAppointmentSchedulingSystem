import React, { Component } from 'react';
import './Validation.css';
import Navbar from '../Navbar/Navbar';

/*
 * https://medium.com/@verdi/form-validation-in-react-2019-27bc9e39feac
*/
class Validation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '', emailValid: false,
      username: '', usernameValid: false,
      password: '', passwordValid: false,
      formValid: false,
      errorMsg: {},
      isSubmitted: false,
    };
    this.submitForm = this.submitForm.bind(this);
    this.updateUsername = this.updateUsername.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
    this.updateEmail = this.updateEmail.bind(this);
    this.validateRequiredField = this.validateRequiredField.bind(this);
  }



  render() {
    return (
      <div>
        <Navbar/>
        <div className='feedback-container validation_body'>
          <header>
            Form Validation
          </header>
          <main role='main'>
            <form onSubmit={this.submitForm}>
              <div className='form-group'>
                < ValidationMessage valid={this.state.usernameValid} message={this.state.errorMsg.username} />
                <input type='text'
                       name='username'
                       className='form-field'
                       placeholder='username'
                       value={this.state.username}
                       onChange={this.updateUsername}/>
              </div>
              <div className='form-group'>
                < ValidationMessage valid={this.state.emailValid} message={this.state.errorMsg.email} />
                <input type='email'
                       name='email'
                       className='form-field'
                       placeholder='email'
                       value={this.state.email}
                       onChange={this.updateEmail}/>
              </div>
              <div className='form-group'>
                < ValidationMessage valid={this.state.passwordValid} message={this.state.errorMsg.password} />
                <input type='password'
                       name='password'
                       className='form-field'
                       placeholder='password'
                       value={this.state.password}
                       onChange={this.updatePassword}/>
              </div>
              <div className='form-controls'>
                <input type='submit' className='btn btn-primary' />
              </div>
            </form>
          </main>
        </div>
      </div>
    );
  }



  submitForm(e) {
    e.preventDefault();
    this.setState({
      isSubmitted: true
    },()=>{
      this.validateRequiredField();
    });
  }


  validateRequiredField() {
    let username = this.state.username;
    let password = this.state.password;
    let email = this.state.email;
    let usernameValid = true;
    let passwordValid = true;
    let emailValid = true;
    let errorMsg = {...this.state.errorMsg};
    let isSubmitted = true;

    if (username.length === 0) {
      usernameValid = false;
      errorMsg.username = 'required field';
      isSubmitted = false;
    }
    // required field
    if (email.length === 0) {
      emailValid = false;
      errorMsg.email = 'required field';
      isSubmitted = false;
    }
    // required field
    if (password.length === 0) {
      passwordValid = false;
      errorMsg.password = 'required field';
      isSubmitted = false;
    }
    this.setState({
      usernameValid,
      passwordValid,
      emailValid,
      errorMsg,
      isSubmitted,
    },()=>{
      console.log('usernameValid=', usernameValid);
      console.log('passwordValid=', passwordValid);
      console.log('emailValid=', emailValid);
      console.log('errorMsg=', errorMsg);
      console.log('isSubmitted=', isSubmitted);
      if(isSubmitted) {
        console.log('Posting data');
      }
    })
  }


  updateUsername(e) {
    let _username = e.target.value;
    this.setState({
      username: _username
    },()=>{
      this.validateUsername();
    })
  }


  validateUsername() {
    let username = this.state.username;
    let usernameValid = true;
    let errorMsg = {...this.state.errorMsg}       // this.state.errorMsg = {id: '', name: ''}
    let isSubmitted = true;

    if (username.length < 5) {
      console.log('username < 5');
      usernameValid = false;
      errorMsg.username = 'Length must be at least 5 characters';
      isSubmitted = false;
    }

    this.setState({
      usernameValid: usernameValid,
      errorMsg: errorMsg,
      isSubmitted: isSubmitted
    })
  }


  updateEmail(e) {
    let _email = e.target.value;
    this.setState({
      email: _email
    },()=>{
      this.validateEmail();
    })
  }


  validateEmail() {
    let email = this.state.email;
    let emailValid = true;
    let errorMsg = {...this.state.errorMsg}
    let isSubmitted = true;

    // checks for format _@_._
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
      emailValid = false;
      errorMsg.email = 'Invalid email format';
      isSubmitted = false;
    }

    this.setState({
      emailValid,
      errorMsg,
      isSubmitted
    })
  }


  updatePassword(e) {
    let _password = e.target.value;
    this.setState({
      password: _password
    },()=>{
      this.validatePassword()
    })
  }


  validatePassword() {
    let password = this.state.password;
    let passwordValid = true;
    let errorMsg = {...this.state.errorMsg};
    let isSubmitted = true;
    // must be 6 chars
    // must contain a number
    // must contain a special character
    if (password.length < 6) {
      passwordValid = false;
      errorMsg.password = 'Password must be at least 6 characters long';
      isSubmitted = false;
    } else if (!/\d/.test(password)){
      passwordValid = false;
      errorMsg.password = 'Password must contain a digit';
      isSubmitted = false;
    } else if (!/[!@#$%^&*]/.test(password)){
      passwordValid = false;
      errorMsg.password = 'Password must contain special character: !@#$%^&*';
      isSubmitted = false;
    }
    this.setState({
      passwordValid,
      errorMsg,
      isSubmitted
    },()=>{
      //this.validateForm();
    })
  }





}
export default Validation;           /* END OF CLASS */




function ValidationMessage(props) {         // props = {valid: '', message: ''}
  if (props.valid === false) {
    return(
      <div className='error-msg'>{props.message}</div>
    )
  }
  return null;
}
