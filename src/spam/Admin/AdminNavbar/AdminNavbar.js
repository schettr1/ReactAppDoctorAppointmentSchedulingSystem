import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import ModalLogout from './ModalLogout';

import './AdminNavbar.css';

class AdminNavbar extends Component {

  constructor(props) {
    super(props);
    this.state = ({
      isOpen: false
    });
    this.openLogoutModal = this.openLogoutModal.bind(this);
    this.closeLogoutModal = this.closeLogoutModal.bind(this);
    this.signOutLoggerUser = this.signOutLoggerUser.bind(this);
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
                <li><a href="/admin/">My Details</a></li>
                <li><a href="/admin/view_appointment">View Appointment</a></li>
                <li><a href="/admin/add_doctor/0">Add Doctor</a></li>
                <li><a href="/admin/view_doctor">View Doctor</a></li>
                <li><a href="/admin/view_patient">View Patient</a></li>
                <li><a href="/admin/view_feedback">View Feedback</a></li>
                <li>
                  <Link to={'#'} onClick={this.openLogoutModal}>Logout</Link>                     {/* Modal */}
                  <ModalLogout
                      show={this.state.isOpen}
                      onAccept={this.signOutLoggerUser}
                      onClose={this.closeLogoutModal}>
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


  openLogoutModal() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }


  closeLogoutModal() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  signOutLoggerUser() {
    console.log('localStorage before clear()=', localStorage.getItem('loggedUser'));
    localStorage.removeItem('loggedUser');
    console.log('localStorage after clear()=', localStorage.getItem('loggedUser'));
    this.closeLogoutModal();
    this.props.history.push('/login');
  }
}

let imageProperty = {
  width: 100,
  height: 100
};

export default withRouter(AdminNavbar);
