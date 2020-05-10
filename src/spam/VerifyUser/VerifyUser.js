import React, { Component } from 'react';
import './VerifyUser.css';


/*
* New registered patients must verify during loggin in for first time by entering a 5 digit code sent to their email.
* NOT IMPLEMENTED
*/
class VerifyUser extends Component {

  constructor(props) {
    super(props);
    this.state = {
      pin: '',

    };
    this.onSubmitPIN = this.onSubmitPIN.bind(this);
    this.onVerifyPIN = this.onVerifyPIN.bind(this);
    this.onVerifyUser = this.onVerifyUser.bind(this);
    this.onChangePin = this.onChangePin.bind(this);
  }


  async componentDidMount(){
    // this method gets executed first when this component is called
  }

  render() {
    return(
      <div className='container'>
        <form className='' onSubmit={this.onSubmitPIN}>
        <h2>2 Step Verification</h2>
        <hr/><br/>
          <div className='d-flex justify-content-center mb-4'>
            <div className='col-md-4'>
              <div style={{color: 'gray'}}>Please enter the PIN that has been sent to your email.</div>
              <br/>
              <input
                type="text"
                className="form-control"
                placeholder='PIN'
                value={this.state.pin}
                onChange={this.onChangePin}
              />
            </div>
          </div>
          <div className="form-group _button">
              <input type="submit" value="Submit" className="btn btn-info"/>
          </div>
        </form>
      </div>
    );
  }


  onSubmitPIN(e) {
    // when submit button is pressed
    e.preventDefault();
    this.onVerifyPIN();
  }


  onVerifyPIN() {
    // form verification is done here
    this.onVerifyUser();
  }


  onVerifyUser() {
    // post data and re-direct to home page
    console.log('PIN submitted=', this.state.pin);
    this.props.history.push('/home');
  }


  onChangePin(e) {
    let _pin = e.target.value;
    this.setState({
        pin: _pin
    });
  }


}

export default VerifyUser;
