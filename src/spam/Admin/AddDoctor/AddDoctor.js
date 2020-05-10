import React, { Component } from 'react';
import { Button, Container, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select';

import './AddDoctor.css';
import AdminNavbar from '../AdminNavbar/AdminNavbar';
import Checkbox from './Checkbox';
import degreesArray from './degrees';
import statesArray from './states';

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
    this.convertIntegerGenderToStringGender = this.convertIntegerGenderToStringGender.bind(this);
    this.convertIntegerStateToStringState = this.convertIntegerStateToStringState.bind(this);
    this.convertIntegerCategoryToStringCategory = this.convertIntegerCategoryToStringCategory.bind(this);
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
      axios.get('/get_doctor_by_Id/' + paramId)
      .then(response => {
        console.log('response.data=', response.data);   // response.data = { doctor: {id: 101, state: "6", username: "young", …}, _links: {} }
        let _doctor = response.data.doctor;
        let _genderValue = _doctor.gender;
        let _genderLabel = this.convertIntegerGenderToStringGender(_genderValue);    // convert integer value of Gender to String value
        let _stateValue = _doctor.state;
        let _stateLabel = this.convertIntegerStateToStringState(_stateValue);    // convert integer value of State to String value
        let _categoryValue = _doctor.category;
        let _categoryLabel = this.convertIntegerCategoryToStringCategory(_categoryValue);    // convert integer value of Category to String value
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



  render() {
    return(
      <div>
        <AdminNavbar/>
        <div className='container'>
          <h2>Add New Doctor</h2>
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
                    value={this.state.doctor.firstname}
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
                    value={this.state.doctor.lastname}
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
                    value={this.state.doctor.email}
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
                    value={this.state.doctor.phone}
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
                          value={this.state.doctor.birthdate || ''}
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
                    value={this.state.doctor.street}
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
                    value={this.state.doctor.city}
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
                      value={this.state.doctor.zipcode}
                      onChange={this.onChangeZipcode}
                    />
                  </div>
                </div>
              </div>

              <div className="form-group parent">
                <div className="left-child">
                  <label className="control-lable">Category:</label>
                </div>
                <div className="right-child">
                <Select value={this.state.selectedCategory}         /* value can be {label: '--Select--', value: 0} or updating doctor's category {label: 'NEUROLOGIST', value: 5} */
                        onChange={this.onChangeCategory}
                        options={this.state.categories} />
                </div>
              </div>

              <div className="form-group parent">
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
                    value={this.state.doctor.username}
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
                    value={this.state.doctor.password}
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
    const emp = this.state.doctor;
    console.log(emp);
    this.state.isEdit === true ? (
      // if isEdit is true, update doctor
      axios.put('/update_doctor/' + parseInt(this.props.match.params.id), emp)
          .then(response => {
            console.log(response.data);
          })
          .catch(function (error) {
            console.log(error);
          })
    ) : (
      // if isEdit is false, save doctor
      axios.post('/save_doctor', emp)
          .then(response => {
            console.log(response.data);
          })
          .catch(function (error) {
            console.log(error);
          })
    )
   //this.props.history.push('/admin/view_doctor');     // redirect to url '/groups' */
  }


  cancelOrRevoke(e, id, fn, ln, startdate, status) {                        // parameters = (event, 12, 'YOUNG', 'LEE', '06/02/2020 08:00', 'BOOKED')
    let now = new Date();                                                   // now = Sun May 03 2020 20:43:12 GMT-0400 (Eastern Daylight Time)
    let offset = now.getTimezoneOffset();                                   // EST = GMT-0400, therefore giving offset value of 240 mins
    let nowUTC = now.getTime() + now.getTimezoneOffset() * 60 * 1000;       // convert offset value to milliseconds and add to UNIX to get UTC
    // we add 'z' to String value so that the _startdate is in UTC.
    let _startdate = new Date(startdate.concat('z'));
    console.log('_startdate.toUTCString()=', _startdate.toUTCString());      // displays in UTC and not in localtime
    _startdate = _startdate.getTime();
    let diffTime = Math.abs(_startdate - now);
    let MILLISECONDS_PER_SECOND = 1000 * 1;        // 1 sec = 1000 ms
    let diffSeconds = Math.ceil(diffTime / MILLISECONDS_PER_SECOND);
    console.log('diffSeconds=', diffSeconds);
    if (status === 'BOOKED' && diffSeconds > 172800) {         // 48 hours = 2880 minutes = 172800 seconds
      this.openModalConfirmation(e, id, fn, ln, startdate, status);
    }
    // if status !== BOOKED or diffHours < 48
    else {
      this.openModalRevoked();
    }
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
    }));
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
    }));
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
  * convert integer value from database to String value
  * @param - Integer (ex: 1, 2 etc)
  * @return - String (ex: MALE, FEMALE etc)
  */
  convertIntegerCategoryToStringCategory(num) {
    switch(num) {
      case 1:
        return 'GENERAL_PHYSICIAN';
        break;
      case 2:
        return 'DERMATOLOGIST';
        break;
      case 3:
        return 'ORTHOPEDIC';
        break;
      case 4:
        return 'PEDIATRIC';
        break;
      case 5:
        return 'NEUROLOGIST';
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
      console.log('_item=', _item);
      degreesArray.map(y => {
        let _obj = y;
        if (_item === _obj.value) {
          console.log('matching degrees : _item=', _item, ' & _obj.value=', _obj.value);
          this.setState({
            checkedItems: this.state.checkedItems.set(_obj.value, true)  // checkedItems is a Map() that contains {1, true}, {2, false} where 1->MD ..
          },()=>{
            console.log('checkedItems=', this.state.checkedItems);
          });
        }
      });
    });

  }

} // end of Component


let imageProperty = {
    width: 200,
    height: 200
};

export default AddDoctor;
