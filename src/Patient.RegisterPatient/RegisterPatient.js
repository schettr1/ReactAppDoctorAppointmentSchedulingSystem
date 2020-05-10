import React, { Component } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { convertIntegerStateToString, convertIntegerGenderToString } from '../_services/Converter.js';
import ValidationMessage from '../_services/FormValidationMessage';
import './RegisterPatient.css';
import EmptyNavbar from '../Navbar/EmptyNavbar';
import Navbar from '../Navbar/Navbar';
import statesArray from './States';

class RegisterPatient extends Component {

  constructor(props) {
    super(props);
    this.state = {
      patient: {
        id: '',
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        gender: '',
        birthdate: '',
        street: '',
        city: '',
        state: '',
        zipcode: '',
        username: '',
        password: '',
      },
      isValidFirstname: true,
      isValidLastname: true,
      isValidEmail: true,
      isValidPhone: true,
      isValidGender: true,
      isValidBirthdate: true,
      isValidStreet: true,
      isValidCity: true,
      isValidState: true,
      isValidZipcode: true,
      isValidUsername: true,
      isValidPassword: true,
      isFormValid: true,
      errorMsg: {},     // used in form-validation; errorMsg: {firstname: 'required field', username: 'try different username', password: 'must be 5 characters'}
      successMsg: '',   // used to alert user when patient is created or updated

      genders: [],                                         // initialize values in componentDidMount()
      selectedGender: {label: '--Select--', value: '0'},   // default-value of Gender to be displayed in the <Select>
      states: [],                                          // initialize values in componentDidMount()
      selectedState: {label: '--state--', value: '0'},    // default-value of State to be displayed in the <Select>
      isEdit: false,                                       // differentiate between create doctor form or update doctor form
    };
    this.onChangeFirstname = this.onChangeFirstname.bind(this);
    this.onChangeLastname = this.onChangeLastname.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePhone = this.onChangePhone.bind(this);
    this.onChangeGender = this.onChangeGender.bind(this);
    this.onChangeBirthdate = this.onChangeBirthdate.bind(this);
    this.onChangeStreet = this.onChangeStreet.bind(this);
    this.onChangeCity = this.onChangeCity.bind(this);
    this.onChangeState = this.onChangeState.bind(this);
    this.onChangeZipcode = this.onChangeZipcode.bind(this);
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onSubmitForm = this.onSubmitForm.bind(this);
  }


  // this method is executed after state variables are initialized
  componentDidMount(){
    let _genders = [
      {label: 'MALE', value: '1'},
      {label: 'FEMALE', value: '2'},
      {label: 'OTHER', value: '3'}
    ];
    this.setState({
      genders: _genders
    });

    this.setState({
      states: statesArray           /* 'statesArray' contains JSON data with 'label' and 'value' parameters */
    });

    /*
    * paramId send from "/admin/ViewPatient/ListPatients.js"
    * creating new patient has url "/register/0" whereas,
    * updating existing doctor has url "/register/paramId", where
    * paramId = doctorId;
    * Convert Integer values of Gender, State to String equivalent.
    * Convert UTC Date 'yyyy-mm-ddThh:mm:ss.000+0000' String to 'yyyy-mm-dd' String using substring()
    */
    var paramId = parseInt(this.props.match.params.id);   // get 'params.id' from the pathname '/register_patient/0'
    if( paramId !== 0) {      // show update_form when paramId !== 0 or else show register_form
      console.warn('paramId=', paramId);
      axios.get('/user/get_patient_by_Id/' + paramId)
      .then(response => {
        console.log('response.data=', response.data);   // response.data = { patient: {id: 101, state: "6", username: "young", …}, _links: {} }
        let _patient = response.data.patient;
        let _genderValue = _patient.gender;
        let _genderLabel = convertIntegerGenderToString(_genderValue);    // convert integer value of Gender to String value
        let _stateValue = _patient.state;
        let _stateLabel = convertIntegerStateToString(_stateValue);    // convert integer value of State to String value
        _patient.birthdate = _patient.birthdate.substring(0, 10);
        this.setState({
          isEdit: true,                                       // Change button "Register" to "Update" and replace '--Select--' with update Doctor data
          patient: _patient,                                            // {id: 101, firstname: "Surya", lastname: "Chettri", ...}
          selectedGender: {label: _genderLabel, value: _genderValue},       // {value: '0', label: 'MALE'}, set Gender value in <Select>
          selectedState: {label: _stateLabel, value: _stateValue},          // {value: '0', label: 'AK'}, set State value in <Select>
        },()=>{
          console.log('this.state.patient.gender=', this.state.patient.gender);
          console.log('this.state.isEdit=', this.state.isEdit);
        });
      })
      .catch(function (error) {
        console.log(error);
      })
    }

  }


  // update in this.state.successMsg will be detected
  componentDidUpdate(_, prevState){
    if (this.state.successMsg && !prevState.successMsg) {
      setTimeout(() => {
        this.setState({
          successMsg:''
        },()=>{
          this.props.history.push('/view_patients');     // If isEdit == true, loggedUser Admin will be able to access path '/view_patients', If Edit = false, New Patient will be redirected to '/login'. <SecuredRoute> will re-direct from '/view_patients' to '/login'
          window.location.reload(false);    // update the page
        })
      }, 2000);       // setState of successMsg:'' after 2 seconds of having state.successMsg:'Thankyou for the feedabck!'
    }
  }



  render() {
    return(
      <div>
        { this.props.match.params.id === '0' ? <EmptyNavbar/> : <Navbar/> }
        <div className='container'>
          <h2>Register Patient</h2>
          <form onSubmit={this.onSubmitForm}>
              <div className="form-group parent">
                <div className="left-child">
                  <label>Firstname:</label>
                </div>
                <div className="right-child">
                  <input
                    type="text"
                    className="form-control"
                    placeholder='firstname'
                    value={this.state.patient.firstname}
                    onChange={this.onChangeFirstname}
                  />
                  <ValidationMessage valid={this.state.isValidFirstname} message={this.state.errorMsg.firstname} />
                </div>
              </div>

              <div className="form-group parent">
                <div className="left-child">
                  <label>Lastname:</label>
                </div>
                <div className="right-child">
                  <input
                    type="text"
                    className="form-control"
                    placeholder='lastname'
                    value={this.state.patient.lastname}
                    onChange={this.onChangeLastname}
                  />
                  <ValidationMessage valid={this.state.isValidLastname} message={this.state.errorMsg.lastname} />
                </div>
              </div>

              <div className="form-group parent">
                <div className="left-child">
                  <label>Email:</label>
                </div>
                <div className="right-child">
                  <input
                    type="text"
                    className="form-control"
                    placeholder='email'
                    value={this.state.patient.email}
                    onChange={this.onChangeEmail}
                  />
                  <ValidationMessage valid={this.state.isValidEmail} message={this.state.errorMsg.email} />
                </div>
              </div>

              <div className="form-group parent">
                <div className="left-child">
                  <label>Phone:</label>
                </div>
                <div className="right-child">
                  <input
                    type="text"
                    className="form-control"
                    placeholder='phone'
                    value={this.state.patient.phone}
                    onChange={this.onChangePhone}
                  />
                  <ValidationMessage valid={this.state.isValidPhone} message={this.state.errorMsg.phone} />
                </div>
              </div>

              <div className="form-group parent">
                <div className="left-child">
                  <label className="control-lable">Gender:</label>
                </div>
                <div className="right-child">
                  <Select value={this.state.selectedGender}            /* value can be {label: '--Select--', value: 0} or updating doctor's gender {label: 'MALE', value: 1} */
                          onChange={this.onChangeGender}
                          options={this.state.genders}
                  />
                  <ValidationMessage valid={this.state.isValidGender} message={this.state.errorMsg.gender} />
                </div>
              </div>

              <div className="form-group parent">
                <div className="left-child">
                  <label>Birthdate:</label>
                </div>
                <div className="right-child">
                  <input type="date"
                          className="form-control"
                          value={this.state.patient.birthdate || ''}
                          onChange={this.onChangeBirthdate}>
                  </input>
                  <ValidationMessage valid={this.state.isValidBirthdate} message={this.state.errorMsg.birthdate} />
                </div>
              </div>

              <div className="form-group parent">
                <div className="left-child">
                  <label>Address:</label>
                </div>
                <div className="right-child">
                  <input
                    type="text"
                    className="form-control"
                    placeholder='street'
                    value={this.state.patient.street}
                    onChange={this.onChangeStreet}
                  />
                  <ValidationMessage valid={this.state.isValidStreet} message={this.state.errorMsg.street} />
                </div>
              </div>

              <div className="form-group parent">
                <div className="left-child">
                  <label></label>
                </div>
                <div className="right-child">
                  <input
                    type="text"
                    className="form-control"
                    placeholder='city'
                    value={this.state.patient.city}
                    onChange={this.onChangeCity}
                  />
                  <ValidationMessage valid={this.state.isValidCity} message={this.state.errorMsg.city} />
                </div>
              </div>

              <div className="form-group parent">
                <div className="left-child">
                  <label></label>
                </div>
                <div className="right-child">
                  <div className="leftSide">
                    <Select value={this.state.selectedState}      /* value can be {label: '--state--', value: 0} or updating doctor's state {label: 'AK', value: 1} */
                            onChange={this.onChangeState}
                            options={this.state.states}
                    />
                    <ValidationMessage valid={this.state.isValidState} message={this.state.errorMsg.state} />
                  </div>
                  <div className="rightSide">
                    <input
                      type="text"
                      className="form-control"
                      placeholder='zipcode'
                      value={this.state.patient.zipcode}
                      onChange={this.onChangeZipcode}
                    />
                    <ValidationMessage valid={this.state.isValidZipcode} message={this.state.errorMsg.zipcode} />
                  </div>
                </div>
              </div>

              <div className="form-group parent">
                <div className="left-child">
                  <label>Username:</label>
                </div>
                <div className="right-child">
                  <input
                    type="text"
                    className="form-control"
                    placeholder='username'
                    value={this.state.patient.username}
                    onChange={this.onChangeUsername}
                    disabled={this.state.isEdit ? true : false}
                  />
                  <ValidationMessage valid={this.state.isValidUsername} message={this.state.errorMsg.username} />
                </div>
              </div>

              <div className="form-group parent">
                <div className="left-child">
                  <label>Password:</label>
                </div>
                <div className="right-child">
                  <input
                    type="password"
                    className="form-control"
                    placeholder='password'
                    value={this.state.patient.password}
                    onChange={this.onChangePassword}
                    disabled={this.state.isEdit ? true : false}
                  />
                  <ValidationMessage valid={this.state.isValidPassword} message={this.state.errorMsg.password} />
                </div>
              </div>

              <div className="form-group">
                  {this.state.isEdit ? (
                    <input type="submit" value="Update" className="btn btn-primary"/>
                  ) : (
                    <input type="submit" value="Register" className="btn btn-primary"/>
                  )}
              </div>
            </form>

            {/* style={position:'fixed' & top:'75px'}
             *  Even if you scroll the page all the way down or shrink the page height, message will display at the same position.
             *  To position the stacking order of elements place this code below form elements
            */}
            {this.state.successMsg ?
              <div className='container _successMsg'>
                  {this.state.successMsg}
              </div>
              : null
            }

          </div>
        </div>
    );
  }



  // Before submitting form,
  // 1. Specific requirements such as email format is checked when user is inserting form data using onChangeEmail() -> validateEmail()
  // 2. Requirement such as 'required field' is checked using validateRequiredField() method.
  onSubmitForm(e) {
    e.preventDefault();
    this.validateRequiredField();
  }


  // check whether fields are missing
  validateRequiredField() {
    // fetch data from this.state.patient and assign to variables
    let {firstname, lastname, email, phone, gender, birthdate, street, city, state, zipcode, username, password} = this.state.patient;
    // define flag variables and assign values 'true' before checking conditions
    let isValidFirstname, isValidLastname, isValidEmail, isValidPhone, isValidGender, isValidBirthdate, isValidStreet,
        isValidCity, isValidState, isValidZipcode, isValidUsername, isValidPassword;
    isValidFirstname = isValidLastname = isValidEmail = isValidPhone = isValidGender = isValidBirthdate = isValidStreet =
            isValidCity = isValidState = isValidZipcode = isValidUsername = isValidPassword = true;
    // reset errorMsg before checking conditions
    this.setState({
      errorMsg: {}
    })
    // assign variable errorMsg
    let errorMsg = {...this.state.errorMsg};
    console.log('this.state=', this.state);

    // required field
    if (firstname.length === 0) {
      isValidFirstname = false;
      errorMsg.firstname = 'required field';
    }
    // required field
    if (lastname.length === 0) {
      isValidLastname = false;
      errorMsg.lastname = 'required field';
    }
    // required field
    if (email.length === 0) {
      isValidEmail = false;
      errorMsg.email = 'required field';
    }
    if (errorMsg.email === 'invalid email') {      /* if email has error in validateEmail() */
      isValidEmail = false;
      errorMsg.email = 'invalid email';
    }
    // required field
    if (phone.length === 0) {
      isValidPhone = false;
      errorMsg.phone = 'required field';
    }
    // required field
    if (gender.length === 0) {
      isValidGender = false;
      errorMsg.gender = 'required field';
    }
    // required field
    if (birthdate.length === 0) {
      isValidBirthdate = false;
      errorMsg.birthdate = 'required field';
    }
    // required field
    if (street.length === 0) {
      isValidStreet = false;
      errorMsg.street = 'required field';
    }
    // required field
    if (city.length === 0) {
      isValidCity = false;
      errorMsg.city = 'required field';
    }
    // required field
    if (state.length === 0) {
      isValidState = false;
      errorMsg.state = 'required field';
    }
    // required field
    if (zipcode.length === 0) {
      isValidZipcode = false;
      errorMsg.zipcode = 'required field';
    }
    // required field
    if (username.length === 0) {
      isValidUsername = false;
      errorMsg.username = 'required field';
    }
    // required field
    if (password.length === 0) {
      isValidPassword = false;
      errorMsg.password = 'required field';
    }
    this.setState({
      isValidFirstname,
      isValidLastname,
      isValidEmail,
      isValidPhone,
      isValidGender,
      isValidBirthdate,
      isValidStreet,
      isValidCity,
      isValidState,
      isValidZipcode,
      isValidUsername,
      isValidPassword,
      errorMsg,
      isFormValid: isValidFirstname && isValidLastname && isValidEmail && isValidPhone &&
                       isValidGender && isValidBirthdate && isValidStreet && isValidCity &&
                       isValidState && isValidZipcode && isValidUsername && isValidPassword
    },()=>{
      console.log('this.state=', this.state);
      if(this.state.isFormValid) {
        console.log('Posting data');
        this.postFormData();
      }
    })
  }



  // verify email matches specific pattern - called from onChangeEmail()
  validateEmail() {
    let email = this.state.patient.email;
    let isValidEmail = true;
    let errorMsg = {...this.state.errorMsg}
    let isFormSubmitted = true;

    // checks for format _@_._
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
      isValidEmail = false;
      errorMsg.email = 'invalid email';
      isFormSubmitted = false;
    }
    // else remove all flags related to email
    else {
      isValidEmail = true;
      errorMsg.email = '';
      isFormSubmitted = true;
    }

    // set email related flags which will be needed inside validateRequiredField()
    this.setState({
      isValidEmail,
      errorMsg,
      isFormSubmitted
    })
  }


  // verify password matches specific pattern - called fromon ChangePassword()
  validatePassword() {
    console.log('inside validatePassword()');
    let password = this.state.patient.password;
    let isValidPassword = true;
    let errorMsg = {...this.state.errorMsg};
    let isFormValid = true;
    // must be 6 chars
    // must contain a number
    // must contain a special character
    if (password.length < 6) {
      isValidPassword = false;
      errorMsg.password = 'Password must be at least 6 characters long';
      isFormValid = false;
    } else if (!/\d/.test(password)){
      isValidPassword = false;
      errorMsg.password = 'Password must contain a digit';
      isFormValid = false;
    } else if (!/[!@#$%^&*]/.test(password)){
      isValidPassword = false;
      errorMsg.password = 'Password must contain special character: !@#$%^&*';
      isFormValid = false;
    }
    // else remove all flags related to password
    else {
      isValidPassword = true;
      errorMsg.password = '';
      isFormValid = true;
    }

    // set password related flags which will be needed inside validateRequiredField()
    this.setState({
      isValidPassword,
      errorMsg,
      isFormValid
    })
  }



  postFormData() {
    const user = this.state.patient;
    console.log(user);
    this.state.isEdit === true ? (
      // update patient, path uses proxy to become full url
      axios.put('/admin_or_patient/update_patient/' + parseInt(this.props.match.params.id), user)
          .then(response => {
            console.log('response.data=', response.data);
            // display success message
            this.setState({
              successMsg: 'Updated Successfully!'
            },()=>{
              console.log('this.state.successMsg', this.state.successMsg);
              // redirect to url '/home' after update is done inside componentDidUpdate
            })
          })
          .catch(error => {
            console.log('error.response.data=', error.response.data);
          })
    ) : (
      // save patient, use full url to be recognized in interceptors
      axios.post('/save_patient', user, {
              headers: {
                  "Content-Type" : "application/json"
              }
          })
          .then(response => {
            console.log('response.data=', response.data);
            // display success message
            this.setState({
              successMsg: 'Registration is successful!'
            },()=>{
              console.log('this.state.successMsg', this.state.successMsg);
               // redirect to url '/login' is done inside componentDidUpdate
            })
          })
          .catch(error => {
            if(error.response.status === 400 && error.response.data.message === "username already exist") {
              // display errorMsg if username already exist.
              let {errorMsg} = this.state;
              errorMsg.username = error.response.data.message;
              this.setState({
                isValidUsername: false,
                errorMsg: errorMsg,
              })
            }
            console.log('error.response.data=', error.response.data);
          })
    )
  }



  // When tried to update the employee record, the form cannot be altered.
  onChangeFirstname(e) {
    let _firstname = e.target.value;
    this.setState(prevState => ({
      patient: {
        ...prevState.patient,
        firstname: _firstname
      }
    }),()=>{
      //console.log('firstname=', this.state.patient.firstname);
    });
  }


  onChangeLastname(e) {
    let _lastname = e.target.value;
    this.setState(prevState => ({
      patient: {
        ...prevState.patient,
        lastname: _lastname
      }
    }),()=>{
      //console.log('lastname=', this.state.patient.lastname);
    });
  }


  onChangeEmail(e) {
    e.persist();      // if you use e.persist(), you do not have to write let x = e.target.value and setState({ email: x})
    this.setState(prevState => ({
      patient: {
        ...prevState.patient,
        email: e.target.value
      }
    }),()=>{
      //console.log('email=', this.state.patient.email);
      this.validateEmail();
    });
  }


  onChangePhone(e) {
    e.persist();      // if you use e.persist(), you do not have to write let x = e.target.value and setState({ email: x})
    this.setState(prevState => ({
      patient: {
        ...prevState.patient,
        phone: e.target.value
      }
    }),()=>{
      //console.log('phone=', this.state.patient.phone);
    });
  }


  onChangeGender(e) {           // e = {label: "MALE", value: "0"}
    this.setState({
      selectedGender : e
    },()=>{
      this.setState(prevState => ({
        patient: {
          ...prevState.patient,
          gender: this.state.selectedGender.value         // gender = "0"
        }
      }), ()=>{
        console.log('gender=', this.state.patient.gender);
      });
    });
  }


  onChangeBirthdate(e) {
    e.persist();      // if you use e.persist(), you do not have to write let x = e.target.value and setState({ email: x})
    let _date = e.target.value;
    this.setState(prevState => ({
      patient: {
        ...prevState.patient,
        birthdate: _date
      }
    }),()=>{
        console.log('birthdate=', this.state.patient.birthdate);
    });
  }


  onChangeStreet(e) {
    e.persist();      // if you use e.persist(), you do not have to write let x = e.target.value and setState({ email: x})
    let _street = e.target.value;
    this.setState(prevState => ({
      patient: {
        ...prevState.patient,
        street: _street
      }
    }),()=>{
        //console.log('street=', this.state.patient.street);
    });
  }


  onChangeCity(e) {
    e.persist();      // if you use e.persist(), you do not have to write let x = e.target.value and setState({ email: x})
    let _city = e.target.value;
    this.setState(prevState => ({
      patient: {
        ...prevState.patient,
        city: _city
      }
    }),()=>{
        //console.log('city=', this.state.patient.city);
    });
  }


  onChangeState(e) {           // e = {label: "AK", value: "0"}
    this.setState({
      selectedState : e
    },()=>{
      this.setState(prevState => ({
        patient: {
          ...prevState.patient,
          state: this.state.selectedState.value         // state = "0"
        }
      }), ()=>{
        //console.log('state=', this.state.patient.state);
      });
    });
  }



  onChangeZipcode(e) {
    e.persist();      // if you use e.persist(), you do not have to write let x = e.target.value and setState({ email: x})
    let _zipcode = e.target.value;
    this.setState(prevState => ({
      patient: {
        ...prevState.patient,
        zipcode: _zipcode
      }
    }),()=>{
        //console.log('zipcode=', this.state.patient.zipcode);
    });
  }


  onChangeUsername(e) {
    e.persist();      // if you use e.persist(), you do not have to write let x = e.target.value and setState({ email: x})
    this.setState(prevState => ({
      patient: {
        ...prevState.patient,
        username: e.target.value
      }
    }),()=>{
      //console.log('username=', this.state.patient.username);
    });
  }


  onChangePassword(e) {
    e.persist();      // if you use e.persist(), you do not have to write let x = e.target.value and setState({ email: x})
    this.setState(prevState => ({
      patient: {
        ...prevState.patient,
        password: e.target.value
      }
    }),()=>{
      //console.log('password=', this.state.patient.password);
      //this.validatePassword();   // UN_COMMENT IF YOU WANT PASSWORD VALIDATION
    });
  }




}
export default RegisterPatient;     // End of Class
