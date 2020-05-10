import React, { Component } from 'react';
import './PatientNavbar.css';
import { Link } from 'react-router-dom';
import ModalLogout from './ModalLogout';


class PatientNavbar extends Component {

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
                <li><a href="/patient">My Details</a></li>
                <li><a href="/patient/book_appointment/0">Book Appointment</a></li>
                <li><a href="/patient/view_appointment">View Appointments</a></li>
                <li><a href="/patient/search_doctor">Search Doctor</a></li>
                <li><a href="/patient/feedback">Feedback</a></li>
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

export default PatientNavbar;
