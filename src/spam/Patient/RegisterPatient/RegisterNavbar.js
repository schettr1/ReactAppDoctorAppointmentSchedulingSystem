import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './RegisterPatient.css';

class RegisterNavbar extends Component {

  render() {
    return(
      <div className="navbar">
        <div className="navbarHeader">
          <nav className="navbar_nav">
            <div>
              <img style={imageProperty} src='/images/medical-icon.png' alt=''/>
              <span><a href="#" className='navbar_logos'>Medical Clinic</a></span>
            </div>
          </nav>
        </div>
      </div>
    );
  }

}

let imageProperty = {
  width: 100,
  height: 100
};

export default RegisterNavbar;
