import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';

import Login from './Login/Login.js';
import Home from './Home/Home';
import AppointmentDetails from './Doctor.AppointmentDetails/AppointmentDetails.js';
import SearchHistory from './Doctor.SearchHistory/SearchHistory.js';
import DoctorViewAppointments from './Doctor.ViewAppointments/ViewAppointments.js';
import AddDoctor from './Admin.AddDoctor/AddDoctor.js';
import AdminViewAppointments from './Admin.ViewAppointments/ViewAppointments.js';
import ViewDoctors from './Admin.ViewDoctors/ViewDoctors.js';
import ViewFeedbacks from './Admin.ViewFeedbacks/ViewFeedbacks.js';
import ViewPatients from './Admin.ViewPatients/ViewPatients.js';
import RegisterPatient from './Patient.RegisterPatient/RegisterPatient.js';
import PatientViewAppointments from './Patient.ViewAppointments/ViewAppointments.js';
import BookAppointment from './Patient.BookAppointment/BookAppointment.js';
import SearchDoctor from './Patient.SearchDoctor/SearchDoctor.js';
import SubmitFeedback from './Patient.SubmitFeedback/SubmitFeedback.js';
import SecuredRoute from './_services/SecuredRoute';
// if 'file.js' is inside 'file' folder with same name than you can specify path as './file/file' instead of './file/file.js'
import Navbar from './Navbar/Navbar';
import EmptyNavbar from './Navbar/EmptyNavbar';
import Footer from './Footer/Footer';
import Error_PageNotFound from './Error_PageNotFound/Error_PageNotFound.js';
import Error_ConnectionFailed from './_services/Error_ConnectionFailed.js';
/*
* Same component {RegisterPatient} has 2 paths -
* '/register_patient/:id' path has no SecuredRoute because we want anybody to sign up as patient
* '/update_patient/:id' path has SecuredRoute because we want users with role=ROLE_ADMIN to update patient info
*
* Add wildcard '*' path at the very last path of your routes to handle 404 PageNotFound Error.
*/
function App() {
  return (
    <Router>
      <div className='_content'>
        <Switch>

          <Route path={["/login", "/"]} component={Login} exact={true} />
          <Route path='/register_patient/:id' component={RegisterPatient} exact={true} />

          <SecuredRoute path='/home' component={Home} exact={true} />

          <SecuredRoute path='/appointment_details/:id' roles={['ROLE_DOCTOR']} component={AppointmentDetails} exact={true} />
          <SecuredRoute path='/search_history' roles={["ROLE_DOCTOR"]} component={SearchHistory} exact={true} />
          <SecuredRoute path='/doctor_view_appointments' roles={['ROLE_DOCTOR']} component={DoctorViewAppointments} exact={true} />

          <SecuredRoute path='/add_doctor/:id' roles={["ROLE_ADMIN"]} component={AddDoctor} exact={true} />
          <SecuredRoute path='/update_doctor/:id' roles={["ROLE_ADMIN", 'ROLE_DOCTOR']} component={AddDoctor} exact={true} />
          <SecuredRoute path='/admin_view_appointments' roles={['ROLE_ADMIN']} component={AdminViewAppointments} exact={true} />
          <SecuredRoute path='/view_doctors' roles={['ROLE_ADMIN']} component={ViewDoctors} exact={true} />
          <SecuredRoute path='/view_feedbacks' roles={['ROLE_ADMIN']} component={ViewFeedbacks} exact={true} />
          <SecuredRoute path='/view_patients' roles={['ROLE_ADMIN']} component={ViewPatients} exact={true} />
          <SecuredRoute path='/update_patient/:id' roles={['ROLE_ADMIN', 'ROLE_PATIENT']} component={RegisterPatient} exact={true} />

          <SecuredRoute path='/patient_view_appointments/:id' roles={['ROLE_PATIENT']} component={PatientViewAppointments} exact={true} />
          <SecuredRoute path='/book_appointment/:id' roles={['ROLE_PATIENT']} component={BookAppointment} exact={true} />
          <SecuredRoute path='/search_doctor' roles={['ROLE_PATIENT']} component={SearchDoctor} exact={true} />
          <SecuredRoute path='/submit_feedback' roles={['ROLE_PATIENT']} component={SubmitFeedback} exact={true} />

          <Route  path='/connectionError' component={Error_ConnectionFailed} />
          <Route path='*' component={Error_PageNotFound} />

        </Switch>
      </div>

      {/* Place header below the content to maintain stacking order, header has postion:fixed and it's position
       * will not be affected by placing it below the content. It will maintain the stacking order and will not
       * display form elements above the ModalLogout.
       */}
      <div className='_header'>
        {localStorage.getItem('loggedUser') ? <Navbar/> : <EmptyNavbar/>}
      </div>

      <div className='_footer'>
        <Footer/>
      </div>

    </Router>
  );
}

export default App;
