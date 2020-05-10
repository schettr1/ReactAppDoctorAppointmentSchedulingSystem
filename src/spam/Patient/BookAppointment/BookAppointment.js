import React, { Component } from 'react';
import PatientNavbar from '../PatientNavbar/PatientNavbar';
import TimePicker from './TimePicker';
import axios from 'axios';
import './BookAppointment.css';
import moment from 'moment';

class BookAppointment extends Component {

  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      preStateCategory: '', // if user changes category after <TimePicker /> is displayed, _preStateCategory is compared to selectedCategory to hide previous <TimePicker />
      selectedCategory: '',
      doctors: [],
      preStateDoctor: '', // if user changes doctor after <TimePicker /> is displayed, _preStateDoctor is compared to selectedDoctor to hide previous <TimePicker />
      selectedDoctor: '',
      selectedDate: '',
      selectedTime: '',
      currenttime: ''
    }

    this.onChangeCategory = this.onChangeCategory.bind(this);
    this.onChangeDoctor = this.onChangeDoctor.bind(this);
    this.onChangeDate = this.onChangeDate.bind(this);
    this.getCategory = this.getCategory.bind(this);
  }


  async componentDidMount(){
    /* WHEN THE PAGE LOADS, CHECK WHETHER paramId IS EMPTY OR NOT. IF IT'S EMPTY, SKIP THIS CODE.
    * ELSE FIND CATEGORY AND DOCTOR NAME USING paramId AND DISPLAY IT ON THE PAGE AND ALLOW USER TO
    * SELECT APPOINTMENT DATE.
    * USER DO NOT GET OPTION TO CHOOSE A DIFFERENT CATEGORY OR DOCTOR.
    * PARAM 'paramId' WAS SENT FROM 'SearchDoctor.js' */

    let paramId = this.props.match.params.id;
    paramId = parseInt(paramId);
    console.log('paramId=', paramId);       // values are 101, 102, 103 ...
    if( paramId !== '' && paramId !== 0 && paramId !== null) {
      console.log("fetching doctor's name and category from the database.");
      // get category and doctor name using doctorId and set the state for selectedCategory and selectedDoctor
      axios.get('/get_category_and_name_by_doctorId/' + paramId)
      .then(response => {
        let _doctor = response.data;   // response.data contains { doctor: {category: 0, firstname: '', lastname: ''}, link: {} }
        console.log('response.data=', response.data);
        _doctor = _doctor.doctor;     // _doctors contains {category: 0, firstname: '', lastname: ''}
        _doctor.category = this.getCategory(_doctor.category);      // convert 0 -> 'General Physician', 1 -> 'Dermatologist' ....

        /* In order to have category and doctor name on select-option, you must setState -> categories and doctors with single data.
        * Both categories and doctors must be an array of single object then only it will be displayed on the
        * select-option. However, you won't have options to change neither category nor doctor.
        */
        let _categories = [
          {id: '', name: _doctor.category}
        ];
        let _doctors = [
          {id: '', fullname: _doctor.firstname + ' ' + _doctor.lastname}
        ];

        this.setState({
          categories: _categories,                    // [ {id: 0, name: this.getCategory(_doctor.category)} ]
          doctors: _doctors,                          // [ {id: paramId, fullname: _doctor.firstname + ' ' + _doctor.lastname} ]
          selectedDoctor: paramId                     // this state is passed as prop to child component <TimePicker />
        },()=>{
          console.log('categories=', this.state.categories);
          console.log('doctors=', this.state.doctors);
          console.log('selectedDoctor=', this.state.selectedDoctor);
        });
      })
      .catch(function (error) {
        console.log(error);
      })
    }

    // IF user is booking a new appointment, then allow user to select DIFFERENT categories
    let _categories = [
      {id:0, name:'--Select--'},
      {id:1, name:'GENERAL_PHYSICIAN'},
      {id:2, name:'DERMATOLOGIST'},
      {id:3, name:'ORTHOPEDIC'},
      {id:4, name:'PEDIATRIC'},
      {id:5, name:'NEUROLOGIST'}
    ];
    this.setState({
      categories: _categories
    });

  }



  render() {
    return(
      <div>
        <PatientNavbar/>
        <div className="container">
          <div className="block">
            <h3>Book Appointment</h3><br/>
            <form onSubmit={this.onSubmit} style={{zIndex: 1, position: 'relative'}} >    {/* An element with greater zIndex value is always in front of an element with a zIndex value */}
                <div className="form-group">                                              {/* position of 'relative/absolute' must be accompanied. It is done to ensure ModalLogout window */}
                    <label className="control-lable">Category:</label>           {/* is not displayed underneath the <form> element */}
                    <select className="form-control"
                            onChange={this.onChangeCategory} >
                      {
                        this.state.categories.map((x) => {
                                  return (
                                    <option key={x.id}
                                            value={x.id}
                                    >{x.name}</option>
                                  );
                                })
                      }
                    </select>
                </div>

                <div className="form-group">
                    <label className="control-lable">Doctor:</label>
                    <select className="form-control"
                            onChange={this.onChangeDoctor} >
                      {
                        this.state.doctors.map((x) => {
                                  return (
                                    <option key={x.id}
                                            value={x.id}
                                    >{x.fullname}</option>
                                  );
                                })
                      }
                    </select>
                </div>

                <div className="form-group">
                    <label className="control-lable">Date:</label>
                    <input type="date"
                            className="form-control"
                            value={this.state.selectedDate}
                            min={this.state.currenttime}
                            onChange={this.onChangeDate}>
                    </input>      {/* min={} is used to not allow users to select past dates */}
                </div>

                {/* show <TimePicker/> only if selectedCategory !== '999' i.e. '--Select--' AND selectedDoctor !== '0' i.e. '--Select--' AND selectedDate !== '' */}
                <div className="form-group timetable">
                    { this.state.selectedCategory !== '0' &&this.state.selectedDoctor !== '0' && this.state.selectedDate !== '' ?
                            <TimePicker myprop={[this.state.selectedDoctor, this.state.selectedDate]}/> : null }
                </div>

              </form>
            </div>
          </div>
        </div>
    );
  }


  /*
  * LIST DOCTORS BASED ON CATEGORY AND THEN FIND APPOINTMENT OF THAT DOCTOR FOR SELECTED DATE
  * CREATE CONTROLLER IN JAVA PROJECT TO DO THE FOLLOWINGS -
  */
  onChangeCategory(e) {
    let _selectedCategory = e.target.value;

    /* this code hides the <TimePicker/> if user selects different category */
    if(this.state.preStateCategory !== _selectedCategory) {
      this.setState({
        selectedCategory: '',   // ex: 999, 0, 1, 2, 3 ...
        selectedDoctor: '',     // ex: 0, 101, 102, 103 ...
        selectedDate: '',       // ex: 2020-05-01, 2020-11-24, ...
      },()=>{
        //console.log('selectedCategory=', this.state.selectedCategory);
        //console.log('selectedDoctor=', this.state.selectedDoctor);
        //console.log('selectedDate=', this.state.selectedDate);
      });
    }

    axios.get('/get_doctors_by_category/' + _selectedCategory)    // proxy used is 'http://localhost:8080'
    .then(response => {
      let _doctors = response.data;   // response.data contains [ { doctor: {id: 101, firstname: 'Amit', lastname: 'Baral'}, link: {} }, {}, ...]
      _doctors = _doctors.map(x => x.doctor);   // _doctors contains [ {id: 101, firstname: 'Amit', lastname: 'Baral'}, {}, {}, ...]
      _doctors = _doctors.map(x => ({           // merge firstname and lastname to get fullname inside the Array
        id: x.id,
        fullname: x.firstname + ' ' + x.lastname
      }));
      _doctors.unshift({id: 0, fullname: '--Select--'});      // add object {id: 0, fullname: '--Select--'} to the start of Array[]
      this.setState({
        doctors: _doctors
      }, ()=> {
        console.log('doctors[]=', this.state.doctors);
      });
    })
    .catch(function (error) {
      console.log(error);
    })
  }


  onChangeDoctor(e) {
    let _selectedDoctor = e.target.value;      // values are 0, 101, 102, 103 ...
    console.log('_selectedDoctor=', _selectedDoctor);
    /* this code hides the <TimePicker/> if user selects different doctor */
    if(this.state._preStateDoctor !== _selectedDoctor) {
      this.setState({
        selectedCategory: '',   // ex: 999, 0, 1, 2, 3 ...
        selectedDoctor: '',     // ex: 0, 101, 102, 103 ...
        selectedDate: '',       // ex: 2020-05-01, 2020-11-24, ...
      },()=>{
        console.log('selectedDate=', this.state.selectedDate);
      });
    }

    this.setState({
      selectedDoctor: _selectedDoctor   // values are 0, 101, 102, 103 ...
    },()=>{
      //console.log('selectedDoctor=', this.state.selectedDoctor);
    });

  }


  onChangeDate(e) {
    // make sure all 3 props (doctorId, dateSelected and categoryId) have values before <TimePicker /> is called
    let _selectedDate = e.target.value;
    //console.log('_selectedDate=', _selectedDate.getFullYear());
    // type='date' has value attribute which store only date and no time.
    // when Date object is created from this value the result is an EST or local time
    // which may be different from the date selected from type='date'.
    this.setState({
      selectedDate: e.target.value
    }, ()=>{
      console.log('selectedDate=', this.state.selectedDate);
    });
  }


  /**
  * converts UNIX time (111844800000) or Date object to String value
  * Only allow user to select appointment dates from tomorrow only
  */
  convert_UNIX_to_String(time) {
    var date = new Date(time);
    var year = date.getFullYear();
    var month = 1 + date.getMonth();	// January = 0 and December = 11
    month = ('0' + month).slice(-2);	// single digit month such as 2 becomes two digit month 02
    var day = 1 + date.getDate();     // add 1 so that user is able to select dates from tomorrow onwards only
    day = ('0' + day).slice(-2);		// single digit day such as 2 becomes two digit day 02
    return year + '-' + month + '-' + day;
  }

  /**
  * converts UNIX timestamp (111844800000) to Date object
  * which is compatible to HTML form element type 'datetime-local'
  */
  convert_UNIX_to_StringDateTime(timeStamp) {
    var date = new Date(timeStamp);
    var year = date.getFullYear();
    var month = 1 + date.getMonth();	// January = 0 and December = 11
    month = ('0' + month).slice(-2);	// single digit month such as 2 becomes two digit month 02
    var day = date.getDate();
    day = ('0' + day).slice(-2);		// single digit day such as 2 becomes two digit day 02
    var hours = date.getHours();
    var mins = date.getMinutes();
    mins = ('0' + mins).slice(-2);		// single digit mins such as 2 becomes two digit mins 02
    return year + '-' + month + '-' + day + ' ' + hours + ':' + mins;
  }


  getCategory(num) {
    switch(num) {
      case 1:
        return 'General Physician';
        break;
      case 2:
        return 'Dermatologist';
        break;
      case 3:
        return 'Orthopedic';
        break;
      case 4:
        return 'Pediatric';
        break;
      default: // case: 5
        return 'Neurologist';
    }
  }

}

export default BookAppointment;
