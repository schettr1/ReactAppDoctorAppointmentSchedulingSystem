import React, { Component } from 'react';
import './EmptyNavbar.css';

class EmptyNavbar extends Component {

  render() {
    return(
      <div className="__navbar">
        <div className="__navbarHeader">
          <nav className="__navbar_nav">
            <div>
              <img style={imageProperty} src='/images/medical-icon.png' alt=''/>
              <span><a href="/" className='__navbar_logo_name'>Medical Clinic</a></span>
            </div>
          </nav>
        </div>
      </div>
    );
  }

}

let imageProperty = {
  width: 56,
  height: 56
};

export default EmptyNavbar;
