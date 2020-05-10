import React, { Component } from 'react';
import axios from 'axios';
import Select from 'react-select';

import './AddDoctor.css';
import Checkbox from './Checkbox';
import degreesArray from './Degrees';
import statesArray from './States';
import {convertIntegerStateToString, convertIntegerCategoryToString, convertIntegerGenderToString} from '../_services/Converter.js';
import ValidationMessage from '../_services/FormValidationMessage';

class AddDoctor extends Component {

  constructor(props) {
    super(props);
    this.state = {
      doctor: {
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
        category: '',
        degrees: [],
        username: '',
        password: ''
      },
      isValidId: '',
      isValidFirstname: '',
      isValidLastname: '',
      isValidEmail: '',
      isValidPhone: '',
      isValidGender: '',
      isValidBirthdate: '',
      isValidStreet: '',
      isValidCity: '',
      isValidState: '',
      isValidZipcode: '',
      isValidCategory: '',
      isValidDegrees: '',
      isValidUsername: '',
      isValidPassword: '',
      isFormValid: '',
      errorMsg: {},     // errorMsg: {firstname: 'required field', username: 'try different username', password: 'must be 5 characters'}
      successMsg: '',

      genders: [],                                         // initialize values in componentDidMount()
      selectedGender: {label: '--Select--', value: '0'},   // default-value of Gender to be displayed in the <Select>
      states: [],                                          // initialize values in componentDidMount()
      selectedState: {label: '--state--', value: '0'},    // default-value of State to be displayed in the <Select>
      categories: [],                                      // initialize values in componentDidMount()
      selectedCategory: {label: '--Select--', value: '0'}, // default-value of Category to be displayed in the <Select>
      degrees: [],                                         // initialize values in componentDidMount()
      checkedItems: new Map(),                              // stores object as {String, bool} in Map() {1, true} where 1 means 'MD' and true means 'checked'
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
    this.onChangeCategory = this.onChangeCategory.bind(this);
    this.onChangeDegrees = this.onChangeDegrees.bind(this);
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.setDegrees = this.setDegrees.bind(this);
    this.onSubmitForm = this.onSubmitForm.bind(this);
  }

  // this method is executed after state variables are initialized
  async componentDidMount(){
    let _genders = [
      {label: 'MALE', value: '1'},
      {label: 'FEMALE', value: '2'},
      {label: 'OTHER', value: '3'}
    ];
    this.setState({
      genders: _genders
    });
    let _categories = [
      {value: '1', label: 'GENERAL_PHYSICIAN'},
      {value: '2', label: 'DERMATOLOGIST'},
      {value: '3', label: 'ORTHOPEDIC'},
      {value: '4', label: 'PEDIATRIC'},
      {value: '5', label: 'NEUROLOGIST'}
    ];
    this.setState({
      categories: _categories
    });
    this.setState({
      degrees: degreesArray           /* 'degreesArray' contains JSON data with 'label' and 'value' parameters */
    });
    this.setState({
      states: statesArray           /* 'statesArray' contains JSON data with 'label' and 'value' parameters */
    });

    /*
    * paramId send from "/admin/ViewDoctor/ListDoctors.js"
    * creating new doctor has url "/admin/add_doctor/0" whereas,
    * updating existing doctor has url "/admin/add_doctor/doctorId", where
    * paramId = doctorId;
    * Convert Integer values of Gender, State, Category to String equivalent.
    * Convert Degrees Array [1, 9] to checkedItems Map(2) => {{1, true}, {9, true}}
    * Convert UTC Date 'yyyy-mm-ddThh:mm:ss.000+0000' String to 'yyyy-mm-dd' String using substring()
    */
    var paramId = parseInt(this.props.match.params.id);
    if( paramId !== 0) {      // show update_form when paramId !== 0 or else show register_form
      console.warn('paramId=', paramId);
      axios.get('/admin_or_doctor/get_doctor_by_Id/' + paramId)
      .then(response => {
        console.log('response.data=', response.data);   // response.data = { doctor: {id: 101, state: "6", username: "young", …}, _links: {} }
        let _doctor = response.data.doctor;
        let _genderValue = _doctor.gender;
        let _genderLabel = convertIntegerGenderToString(_genderValue);    // convert integer value of Gender to String value
        let _stateValue = _doctor.state;
        let _stateLabel = convertIntegerStateToString(_stateValue);    // convert integer value of State to String value
        let _categoryValue = _doctor.category;
        let _categoryLabel = convertIntegerCategoryToString(_categoryValue);    // convert integer value of Category to String value
        _doctor.birthdate = _doctor.birthdate.substring(0, 10);
        this.setDegrees(_doctor.degrees);
        this.setState({
          isEdit: true,                                       // Change button "Register" to "Update" and replace '--Select--' with update Doctor data
          doctor: _doctor,                                            // {id: 101, firstname: "Surya", lastname: "Chettri", ...}
          selectedGender: {label: _genderLabel, value: _genderValue},       // {value: '0', label: 'MALE'}, set Gender value in <Select>
          selectedState: {label: _stateLabel, value: _stateValue},          // {value: '0', label: 'AK'}, set State value in <Select>
          selectedCategory: {label: _categoryLabel, value: _categoryValue}, // {value: '0', label: 'GENERAL_PHYSICIAN'}, set Category value in <Select>
        },()=>{
          console.log('this.state.doctor.gender=', this.state.doctor.gender);
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
          this.props.history.push('/view_doctors');  // If isEdit == true, Admin will be able to access path '/view_patients', If Edit == false, Doctor will re-directed from '/view_doctors' to '/home' due to <SecuredRoute/>
          window.location.reload(false);    // update the page
        })
      }, 2000);       // setState of successMsg:'' after 2 seconds of having state.successMsg:'Thankyou for the feedabck!'
    }
  }



  render() {
    return(
      <div className='container'>
        <div className='d-flex justify-content-center'>
          {this.state.isEdit ? <h2>Update Information</h2> : <h2>Register Doctor</h2>}
        </div>
        <form onSubmit={this.onSubmitForm}>
            <div className="form-group _parent">
              <div className="left-child">
                <label>Firstname:</label>
              </div>
              <div className="right-child">
                <input
                  type="text"
                  className="form-control"
                  placeholder='firstname'
                  value={this.state.doctor.firstname}
                  onChange={this.onChangeFirstname}
                />
                <ValidationMessage valid={this.state.isValidFirstname} message={this.state.errorMsg.firstname} />
              </div>
            </div>

            <div className="form-group _parent">
              <div className="left-child">
                <label>Lastname:</label>
              </div>
              <div className="right-child">
                <input
                  type="text"
                  className="form-control"
                  placeholder='lastname'
                  value={this.state.doctor.lastname}
                  onChange={this.onChangeLastname}
                />
                <ValidationMessage valid={this.state.isValidLastname} message={this.state.errorMsg.lastname} />
              </div>
            </div>

            <div className="form-group _parent">
              <div className="left-child">
                <label>Email:</label>
              </div>
              <div className="right-child">
                <input
                  type="text"
                  className="form-control"
                  placeholder='email'
                  value={this.state.doctor.email}
                  onChange={this.onChangeEmail}
                />
                <ValidationMessage valid={this.state.isValidEmail} message={this.state.errorMsg.email} />
              </div>
            </div>

            <div className="form-group _parent">
              <div className="left-child">
                <label>Phone:</label>
              </div>
              <div className="right-child">
                <input
                  type="text"
                  className="form-control"
                  placeholder='phone'
                  value={this.state.doctor.phone}
                  onChange={this.onChangePhone}
                />
                <ValidationMessage valid={this.state.isValidPhone} message={this.state.errorMsg.phone} />
              </div>
            </div>

            <div className="form-group _parent">
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

            <div className="form-group _parent">
              <div className="left-child">
                <label>Birthdate:</label>
              </div>
              <div className="right-child">
                <input type="date"
                        className="form-control"
                        value={this.state.doctor.birthdate || ''}
                        onChange={this.onChangeBirthdate}
                />
                <ValidationMessage valid={this.state.isValidBirthdate} message={this.state.errorMsg.birthdate} />
              </div>
            </div>

            <div className="form-group _parent">
              <div className="left-child">
                <label>Address:</label>
              </div>
              <div className="right-child">
                <input
                  type="text"
                  className="form-control"
                  placeholder='street'
                  value={this.state.doctor.street}
                  onChange={this.onChangeStreet}
                />
                <ValidationMessage valid={this.state.isValidStreet} message={this.state.errorMsg.street} />
              </div>
            </div>

            <div className="form-group _parent">
              <div className="left-child">
                <label></label>
              </div>
              <div className="right-child">
                <input
                  type="text"
                  className="form-control"
                  placeholder='city'
                  value={this.state.doctor.city}
                  onChange={this.onChangeCity}
                />
                <ValidationMessage valid={this.state.isValidCity} message={this.state.errorMsg.city} />
              </div>
            </div>

            <div className="form-group _parent">
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
                    value={this.state.doctor.zipcode}
                    onChange={this.onChangeZipcode}
                  />
                  <ValidationMessage valid={this.state.isValidZipcode} message={this.state.errorMsg.zipcode} />
                </div>
              </div>
            </div>

            <div className="form-group _parent">
              <div className="left-child">
                <label className="control-lable">Category:</label>
              </div>
              <div className="right-child">
              <Select value={this.state.selectedCategory}         /* value can be {label: '--Select--', value: 0} or updating doctor's category {label: 'NEUROLOGIST', value: 5} */
                      onChange={this.onChangeCategory}
                      options={this.state.categories}
              />
              <ValidationMessage valid={this.state.isValidCategory} message={this.state.errorMsg.category} />
              </div>
            </div>

            <div className="form-group _parent">
              <div className="left-child">
                <label>Degrees:</label>
              </div>
              <div className="right-child floatleft">
                    {this.state.degrees.map((item) => (
                        <label key={item.value}>
                          {item.label}
                          {/* 'Checkbox' is a child-component that contains props {name, checked, value, onChange}
                            * 'name' - number data type declared in <Checkbox/>
                            * 'checked' - bool data type declared in <Checkbox/>
                            * 'value' - used in setState()
                            * 'onChange' - used in setState() and <Checkbox/>
                            */}
                          <Checkbox name={item.value}
                                    checked={this.state.checkedItems.get(item.value)}
                                    value={this.state._isChecked}
                                    onChange={this.onChangeDegrees} />
                        </label>
                    ))}
                    <ValidationMessage valid={this.state.isValidDegrees} message={this.state.errorMsg.degrees} />
              </div>
            </div>

            <div className="form-group _parent">
              <div className="left-child">
                <label>Username:</label>
              </div>
              <div className="right-child">
                <input
                  type="text"
                  className="form-control"
                  placeholder='username'
                  value={this.state.doctor.username}
                  onChange={this.onChangeUsername}
                  disabled={this.state.isEdit ? true : false}
                />
                <ValidationMessage valid={this.state.isValidUsername} message={this.state.errorMsg.username} />
              </div>
            </div>

            <div className="form-group _parent">
              <div className="left-child">
                <label>Password:</label>
              </div>
              <div className="right-child">
                <input
                  type="password"
                  className="form-control"
                  placeholder='password'
                  value={this.state.doctor.password}
                  onChange={this.onChangePassword}
                  disabled={this.state.isEdit ? true : false}
                />
                <ValidationMessage valid={this.state.isValidPassword} message={this.state.errorMsg.password} />
              </div>
            </div>

            <div className="form-group d-flex justify-content-center">
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
            <div className='container _successMsg_'>
                {this.state.successMsg}
            </div>
            : null
          }

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



  validateRequiredField() {
    // fetch data from this.state.patient and assign to variables
    let {firstname, lastname, email, phone, gender, birthdate, street, city, state, zipcode, category, degrees, username, password} = this.state.doctor;
    // define flag variables and assign values 'true' before checking conditions
    let isValidFirstname, isValidLastname, isValidEmail, isValidPhone, isValidGender, isValidBirthdate, isValidStreet,
        isValidCity, isValidState, isValidZipcode, isValidCategory, isValidDegrees, isValidUsername, isValidPassword;

    isValidFirstname = isValidLastname = isValidEmail = isValidPhone = isValidGender = isValidBirthdate = isValidStreet =
            isValidCity = isValidState = isValidZipcode = isValidCategory = isValidDegrees = isValidUsername = isValidPassword = true;

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
    if (errorMsg.email === 'invalid email') {    /* if email has error in validateEmail() */
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
    if (category.length === 0) {
      isValidCategory = false;
      errorMsg.category = 'required field';
    }
    // required field
    if (degrees.length === 0) {
      isValidDegrees = false;
      errorMsg.degrees = 'required field';
    }
    // required field
    if (username.length === 0) {
      isValidUsername = false;                        // set username as invalid
      errorMsg.username = 'required field';           // set error message
    }
    // required field
    if (password.length === 0) {
      isValidPassword = false;                      // set password as invalid
      errorMsg.password = 'required field';         // set error message
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
      isValidCategory,
      isValidDegrees,
      isValidUsername,
      isValidPassword,
      errorMsg,
      isFormValid: isValidFirstname && isValidLastname && isValidEmail && isValidPhone && isValidGender &&
                       isValidBirthdate && isValidStreet && isValidCity && isValidState && isValidZipcode &&
                       isValidCategory && isValidDegrees && isValidUsername && isValidPassword
    },()=>{
      // post form data
      console.log('this.state=', this.state);
      if(this.state.isFormValid) {
        console.log('Posting data');
        this.postFormData();
      }
    })
  }



  // verify email matches specific pattern - called from onChangeEmail()
  validateEmail() {
    let email = this.state.doctor.email;
    let isValidEmail = true;
    let errorMsg = {...this.state.errorMsg}
    let isFormValid = true;

    // checks for format _@_._
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
      isValidEmail = false;
      errorMsg.email = 'invalid email';
      isFormValid = false;
    }
    // else remove all flags related to email
    else {
      isValidEmail = true;
      errorMsg.email = '';
      isFormValid = true;
    }
    // set email related flags which will be needed inside validateRequiredField()
    this.setState({
      isValidEmail,
      errorMsg,
      isFormValid
    })
  }


  // verify password matches specific pattern - called fromon ChangePassword()
  validatePassword() {
    console.log('inside validatePassword()');
    let password = this.state.doctor.password;
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



  // POST form data to database
  postFormData() {
    const user = this.state.doctor;
    console.log(user);
    this.state.isEdit === true ? (
      // if isEdit is true, update doctor
      axios.put('/admin_or_doctor/update_doctor/' + parseInt(this.props.match.params.id), user)
          .then(response => {
            console.log(response.data);
            // display success message
            this.setState({
              successMsg: 'Updated Successfully!!'
            },()=>{
              console.log('this.state.successMsg', this.state.successMsg);
               // redirect to url '/home' is done inside componentDidUpdate
            })
          })
          .catch(function (error) {
            console.log(error);
          })
    ) : (
      // if isEdit is false, save doctor
      axios.post('/admin/save_doctor', user)
          .then(response => {
            console.log(response.data);
            // display success message
            this.setState({
              successMsg: 'Registration is successful!'
            },()=>{
              console.log('this.state.successMsg', this.state.successMsg);
               // redirect to url '/home' is done inside componentDidUpdate
            })
          })
          .catch(error=> {
            console.log('error.response=', error.response);
            if(error.response.status === 400 && error.response.data.message === "username already exist") {
              // display errorMsg if username already exist.
              let {errorMsg} = this.state;
              errorMsg.username = error.response.data.message;
              this.setState({
                isValidUsername: false,
                errorMsg: errorMsg,
              })
            }
          })
    )
  }



  // When tried to update the employee record, the form cannot be altered.
  onChangeFirstname(e) {
    let _firstname = e.target.value;
    this.setState(prevState => ({
      doctor: {
        ...prevState.doctor,
        firstname: _firstname
      }
    }));
  }


  onChangeLastname(e) {
    let _lastname = e.target.value;
    this.setState(prevState => ({
      doctor: {
        ...prevState.doctor,
        lastname: _lastname
      }
    }));
  }


  onChangeEmail(e) {
    e.persist();      // if you use e.persist(), you do not have to write let x = e.target.value and setState({ email: x})
    this.setState(prevState => ({
      doctor: {
        ...prevState.doctor,
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
      doctor: {
        ...prevState.doctor,
        phone: e.target.value
      }
    }));
  }


  onChangeGender(e) {           // e = {label: "MALE", value: "0"}
    this.setState({
      selectedGender : e
    },()=>{
      this.setState(prevState => ({
        doctor: {
          ...prevState.doctor,
          gender: this.state.selectedGender.value         // gender = "0"
        }
      }), ()=>{
        console.log('gender=', this.state.doctor.gender);
      });
    });
  }


  onChangeBirthdate(e) {
    e.persist();      // if you use e.persist(), you do not have to write let x = e.target.value and setState({ email: x})
    let _date = e.target.value;
    this.setState(prevState => ({
      doctor: {
        ...prevState.doctor,
        birthdate: _date
      }
    }),()=>{
        console.log('birthdate=', this.state.doctor.birthdate);
    });
  }


  onChangeStreet(e) {
    e.persist();      // if you use e.persist(), you do not have to write let x = e.target.value and setState({ email: x})
    let _street = e.target.value;
    this.setState(prevState => ({
      doctor: {
        ...prevState.doctor,
        street: _street
      }
    }),()=>{
        console.log('street=', this.state.doctor.street);
    });
  }


  onChangeCity(e) {
    e.persist();      // if you use e.persist(), you do not have to write let x = e.target.value and setState({ email: x})
    let _city = e.target.value;
    this.setState(prevState => ({
      doctor: {
        ...prevState.doctor,
        city: _city
      }
    }),()=>{
        console.log('city=', this.state.doctor.city);
    });
  }


  onChangeState(e) {           // e = {label: "AK", value: "0"}
    this.setState({
      selectedState : e
    },()=>{
      this.setState(prevState => ({
        doctor: {
          ...prevState.doctor,
          state: this.state.selectedState.value         // state = "0"
        }
      }), ()=>{
        console.log('state=', this.state.doctor.state);
      });
    });
  }



  onChangeZipcode(e) {
    e.persist();      // if you use e.persist(), you do not have to write let x = e.target.value and setState({ email: x})
    let _zipcode = e.target.value;
    this.setState(prevState => ({
      doctor: {
        ...prevState.doctor,
        zipcode: _zipcode
      }
    }),()=>{
        console.log('zipcode=', this.state.doctor.zipcode);
    });
  }


  onChangeCategory(e) {           // e = {label: "GENERAL_PHYSICIAN", value: "0"}
    this.setState({
      selectedCategory : e
    },()=>{
      this.setState(prevState => ({
        doctor: {
          ...prevState.doctor,
          category: this.state.selectedCategory.value         // category = "0"
        }
      }), ()=>{
        console.log('category=', this.state.doctor.category);
      });
    });
  }


  onChangeDegrees(e) {
    e.persist();      // if you use e.persist(), you do not have to write let x = e.target.value and setState({ email: x})
    const _label = parseInt(e.target.name);      // e.target.name = "1", "2", "3" ... where 'name' is prop in <Checkbox/>
    console.log('_label=', _label);
    const _isChecked = e.target.checked;    // e.target.checked = true, false where 'checked' is prop in <Checkbox/>
    console.log('_isChecked=', _isChecked);
    this.setState({
      checkedItems: this.state.checkedItems.set(_label, _isChecked)  // checkedItems is a Map() contains {1, true}, {2, false}, {9, true} where 1-> MD, 2->DO ...
    });

    let _myMap = this.state.checkedItems;       // _myMap contains {1, true}, {2, false}, {9, true}
    console.log(_myMap);
    for (let entry of _myMap.entries()) {      // entry = {1, true}
      console.log('entry.value=', entry[1]);      // entry.label = entry[0] and entry.value = entry[1]
      if (entry[1] === false)
          _myMap.delete(entry[0]);             // remove entry that contains entry.value = false
    }
    let arr = Array.from(_myMap.keys());       // create an Array of entry.key from _myMap separated by comma i.e. [1, 9]
    console.log(arr);                         // [1, 9]
    this.setState(prevState => ({
      doctor: {
        ...prevState.doctor,                  // setState 'degrees' = [1, 9]
        degrees: arr
      }
    }));

  }


  onChangeUsername(e) {
    e.persist();      // if you use e.persist(), you do not have to write let x = e.target.value and setState({ email: x})
    this.setState(prevState => ({
      doctor: {
        ...prevState.doctor,
        username: e.target.value
      }
    }));
  }


  onChangePassword(e) {
    e.persist();      // if you use e.persist(), you do not have to write let x = e.target.value and setState({ email: x})
    this.setState(prevState => ({
      doctor: {
        ...prevState.doctor,
        password: e.target.value
      }
    }),()=>{
      //console.log('email=', this.state.patient.email);
      //this.validatePassword();
    });
  }



  /*
  * @param - [1, 9]
  * @return - this.state.checkedItems = Map(3) {"MD" => true, "PhD" => true}
  * compares arrArray with degreesArray. If '_item' in arrArray matches with
  * '_obj.value' of degreesArray, then set ("MD", true) and ("PhD", true) to
  * checkedItems.
  */
  setDegrees(arrArray) {
    arrArray.map(x => {
      let _item = x;
      //console.log('_item=', _item);
      degreesArray.map(y => {
        let _obj = y;
        if (_item === _obj.value) {
          //console.log('matching degrees : _item=', _item, ' & _obj.value=', _obj.value);
          this.setState({
            checkedItems: this.state.checkedItems.set(_obj.value, true)  // checkedItems is a Map() that contains {1, true}, {2, false} where 1->MD ..
          },()=>{
            //console.log('checkedItems=', this.state.checkedItems);
          });
        }
        return null;   // map function requires a return or else warning shows up in console.
      });
      return null;    // map function requires a return or else warning shows up in console.
    });

  }



} // end of Component

export default AddDoctor;
