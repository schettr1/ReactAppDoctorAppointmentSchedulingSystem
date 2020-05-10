import React, { Component } from 'react';
import { Button, Container, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select';

import './RegisterPatient.css';
import RegisterNavbar from './RegisterNavbar';
import statesArray from './states';

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
        password: ''
      },
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
    this.convertIntegerGenderToStringGender = this.convertIntegerGenderToStringGender.bind(this);
    this.convertIntegerStateToStringState = this.convertIntegerStateToStringState.bind(this);
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
    var paramId = parseInt(this.props.match.params.id);
    if( paramId !== 0) {      // show update_form when paramId !== 0 or else show register_form
      console.warn('paramId=', paramId);
      axios.get('/get_patient_by_Id/' + paramId)
      .then(response => {
        console.log('response.data=', response.data);   // response.data = { patient: {id: 101, state: "6", username: "young", …}, _links: {} }
        let _patient = response.data.patient;
        let _genderValue = _patient.gender;
        let _genderLabel = this.convertIntegerGenderToStringGender(_genderValue);    // convert integer value of Gender to String value
        let _stateValue = _patient.state;
        let _stateLabel = this.convertIntegerStateToStringState(_stateValue);    // convert integer value of State to String value
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



  render() {
    return(
      <div>
        <RegisterNavbar/>
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
                </div>
              </div>

              <div className="form-group parent">
                <div className="left-child">
                  <label className="control-lable">Gender:</label>
                </div>
                <div className="right-child">
                  <Select value={this.state.selectedGender}            /* value can be {label: '--Select--', value: 0} or updating doctor's gender {label: 'MALE', value: 1} */
                          onChange={this.onChangeGender}
                          options={this.state.genders} />
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
                            options={this.state.states} />
                  </div>
                  <div className="rightSide">
                    <input
                      type="text"
                      className="form-control"
                      placeholder='zipcode'
                      value={this.state.patient.zipcode}
                      onChange={this.onChangeZipcode}
                    />
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
                  />
                </div>
              </div>

              <div className="form-group parent">
                <div className="left-child">
                  <label>Password:</label>
                </div>
                <div className="right-child">
                  <input
                    type="text"
                    className="form-control"
                    placeholder='password'
                    value={this.state.patient.password}
                    onChange={this.onChangePassword}
                  />
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
          </div>
        </div>
    );
  }


  onSubmitForm(e) {
    e.preventDefault();
    const emp = this.state.patient;
    console.log(emp);
    this.state.isEdit === true ? (
      // if isEdit is true, update patient
      axios.put('/update_patient/' + parseInt(this.props.match.params.id), emp)
          .then(response => {
            console.log(response.data);
          })
          .catch(function (error) {
            console.log(error);
          })
    ) : (
      // if isEdit is false, save patient
      axios.post('/save_patient', emp)
          .then(response => {
            console.log(response.data);
          })
          .catch(function (error) {
            console.log(error);
          })
    )
   //this.props.history.push('/admin/view_patient');     // redirect to url '/groups' */
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
      console.log('firstname=', this.state.patient.firstname);
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
      console.log('lastname=', this.state.patient.lastname);
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
      console.log('email=', this.state.patient.email);
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
      console.log('phone=', this.state.patient.phone);
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
        console.log('street=', this.state.patient.street);
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
        console.log('city=', this.state.patient.city);
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
        console.log('state=', this.state.patient.state);
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
        console.log('zipcode=', this.state.patient.zipcode);
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
      console.log('username=', this.state.patient.username);
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
      console.log('password=', this.state.patient.password);
    });
  }


  /*
  * convert integer value from database to String value
  * @param - Integer (ex: 1, 2, etc)
  * @return - String (ex: MALE, FEMALE etc)
  */
  convertIntegerGenderToStringGender(num) {
    switch(num) {
      case 1:
        return 'MALE';
        break;
      case 2:
        return 'FEMALE';
        break;
      case 3:
        return 'OTHER';
        break;
    }
  }


  /*
  * convert integer value of State to String value
  * @param - Integer (ex: 1, 2 etc)
  * @return - String (ex: AK, AR etc)
  */
  convertIntegerStateToStringState(num) {
    let _state = '';
    statesArray.map(x=>{
      let _obj = x;
      if (num === _obj.value) {
        _state = _obj.label;
      }
    });
    return _state;
  }



} // end of Component


export default RegisterPatient;
