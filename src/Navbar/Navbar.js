import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ModalLogout from './ModalLogout';
import './Navbar.css';
import { hasRole } from "./permissions";
import { NavLink, withRouter } from 'react-router-dom';

class Navbar extends Component {

  constructor(props) {
    super(props);
    this.state = ({
      isOpen: false,
    });
    this.logoutUser = this.logoutUser.bind(this);
    this.toggleLogoutModal= this.toggleLogoutModal.bind(this);
  }



  render() {
    /* Authorized users can only access <Navbar> */
    if(localStorage.getItem("loggedUser") !== null) {
      const user = JSON.parse(localStorage.getItem("loggedUser"));  // {access_token: '', refresh_token: '', userId: '', role: ['ROLE_ADMIN']}

      return(
        <div className="_navbar">
          <div className="_navbar_content">
            <div><img style={imageProperty} src='/images/medical-icon.png' alt=''/></div>
            <div><a href="/home" className='_navbar_logo_name'>Medical_Clinic</a></div>
            <div className="_spacer"/>
            <nav className="_navbar-items">
              <ul>
                {hasRole(user, ["ROLE_ADMIN", "ROLE_PATIENT", "ROLE_DOCTOR"]) && <li><NavLink to="/home" activeClassName='active'>Home</NavLink></li>}
                {hasRole(user, ["ROLE_DOCTOR"]) && <li className="item"><NavLink to="/appointment_details/0">Appointment_Details</NavLink></li>}
                {hasRole(user, ["ROLE_DOCTOR"]) && <li className="item"><NavLink to="/doctor_view_appointments">View_Appointments</NavLink></li>}
                {hasRole(user, ["ROLE_DOCTOR"]) && <li className="item"><NavLink to="/search_history">Search_History</NavLink></li>}

                {hasRole(user, ["ROLE_ADMIN"]) && <li className="item"><NavLink to="/add_doctor/0">Add_Doctor</NavLink></li>}
                {hasRole(user, ["ROLE_ADMIN"]) && <li className="item"><NavLink to="/view_doctors">View_Doctors</NavLink></li>}
                {hasRole(user, ["ROLE_ADMIN"]) && <li className="item"><NavLink to="/view_patients">View_Patients</NavLink></li>}
                {hasRole(user, ["ROLE_ADMIN"]) && <li className="item"><NavLink to="/admin_view_appointments">View_Appointments</NavLink></li>}
                {hasRole(user, ["ROLE_ADMIN"]) && <li className="item"><NavLink to="/view_feedbacks">View_Feedbacks</NavLink></li>}

                {hasRole(user, ["ROLE_PATIENT"]) && <li className="item"><NavLink to="/book_appointment/0">Book_Appointment</NavLink></li>}
                {hasRole(user, ["ROLE_PATIENT"]) && <li className="item"><NavLink to={"/patient_view_appointments/"+user.userId}>View_Appointments</NavLink></li>}
                {hasRole(user, ["ROLE_PATIENT"]) && <li className="item"><NavLink to="/search_doctor">Search_Doctor</NavLink></li>}
                {hasRole(user, ["ROLE_PATIENT"]) && <li className="item"><NavLink to="/submit_feedback">Send_Feedback</NavLink></li>}
                <li>
                  <Link to={'#'} onClick={this.toggleLogoutModal}>Logout</Link>                     {/* Modal */}
                  <ModalLogout
                      show={this.state.isOpen}
                      onLogout={this.logoutUser}
                      onClose={this.toggleLogoutModal}>
                      Are you sure you want to log out?
                  </ModalLogout>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      );
    }
    else {
      return null;
    }
  }

  toggleLogoutModal() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }


  logoutUser() {
    localStorage.removeItem("loggedUser");
    console.log('localStorage.getItem("loggedUser")=', localStorage.getItem("loggedUser"));
    this.props.history.push('/login');
    window.location.reload(false);            // refresh the page
  }

}

let imageProperty = {
  width: 56,
  height: 56
};

export default withRouter(Navbar);
