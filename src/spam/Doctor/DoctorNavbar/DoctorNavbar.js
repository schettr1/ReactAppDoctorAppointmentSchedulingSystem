import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ModalLogout from './ModalLogout';

import './DoctorNavbar.css';

class DoctorNavbar extends Component {

  constructor(props) {
    super(props);
    this.state = ({
      isOpen: false
    });
    this.toggleLogoutModal= this.toggleLogoutModal.bind(this);
  }


  render() {
    return(
      <div className="navbar">
        <div className="navbarHeader">
          <nav className="navbar_nav">
            <div><img style={imageProperty} src='/images/medical-icon.png' alt=''/><span><a href="#" className='navbar_logo'>Medical Clinic</a></span></div>
            <div className="spacer"/>
            <div className="navbar-items">
              <ul>
                <li><a href="/doctor/">My Details</a></li>
                <li><a href="/doctor/add_description/0">Add Description</a></li>
                <li><a href="/doctor/my_appointment">My Appointment</a></li>
                <li><a href="/doctor/patient_history">Patient History</a></li>
                <li>
                  <Link to={'#'} onClick={this.toggleLogoutModal}>Logout</Link>                     {/* Modal */}
                  <ModalLogout
                      show={this.state.isOpen}
                      onClose={this.toggleLogoutModal}>
                      Are you sure you want to log out?
                  </ModalLogout>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </div>
    );
  }

  toggleLogoutModal() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

}

let imageProperty = {
  width: 100,
  height: 100
};

export default DoctorNavbar;
