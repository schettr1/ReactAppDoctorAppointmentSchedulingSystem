import React, { Component } from 'react';
import './EmptyNavbar.css';

class EmptyNavbar extends Component {

  render() {
    return(
      <div className="navbar_">
        <div className="navbarHeader_">
          <nav>
            <div>
              <img style={imageProperty} src='/images/medical-icon.png' alt=''/>
              <span><a href="/" className='navbar_logo_name_'>Medical Clinic</a></span>
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
