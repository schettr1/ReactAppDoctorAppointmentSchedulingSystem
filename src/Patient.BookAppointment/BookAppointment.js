import React, { Component } from 'react';
import Navbar from '../Navbar/Navbar';
import TimePicker from './TimePicker';
import axios from 'axios';
import './BookAppointment.css';
import { convertIntegerCategoryToString, getDatePickerCompatibleDate } from '../_services/Converter.js';
//import moment from 'moment';

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
      minDate: ''
    }

    this.onChangeCategory = this.onChangeCategory.bind(this);
    this.onChangeDoctor = this.onChangeDoctor.bind(this);
    this.onChangeDate = this.onChangeDate.bind(this);
  }


  async componentDidMount(){
    /* WHEN THE PAGE LOADS, CHECK WHETHER paramId IS EMPTY OR NOT. IF IT'S EMPTY, SKIP THIS CODE.
    * ELSE FIND CATEGORY AND DOCTOR NAME USING paramId AND DISPLAY IT ON THE PAGE AND ALLOW USER TO
    * SELECT APPOINTMENT DATE.
    * USER DO NOT GET OPTION TO CHOOSE A DIFFERENT CATEGORY OR DOCTOR.
    * PARAM 'paramId' WAS SENT FROM 'SearchDoctor.js' */
    let today = new Date()
    let tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    this.setState({
      minDate: getDatePickerCompatibleDate(tomorrow),
    },()=>{
      console.log('minDate=', this.state.minDate);
    });

    /* EXECUTE THIS CODE ONLY WHEN PARAM ID EXISTS IN URL PATH */
    let paramId = parseInt(this.props.match.params.id);
    console.log('paramId=', paramId);       // values are 101, 102, 103 ...
    if( paramId !== '' && paramId !== 0 && paramId !== null) {
      // get category type and doctor name using doctorId and set the state for selectedCategory and selectedDoctor
      axios.get('/admin_or_patient/get_category_and_name_by_doctorId/' + paramId)
      .then(response => {
        let _doctor = response.data;   // response.data contains { doctor: {category: 0, firstname: '', lastname: ''}, link: {} }
        console.log('response.data=', response.data);
        _doctor = _doctor.doctor;     // _doctors contains {category: 0, firstname: '', lastname: ''}
        _doctor.category = convertIntegerCategoryToString(_doctor.category);      // convert 0 -> 'General Physician', 1 -> 'Dermatologist' ....

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
          selectedDoctor: paramId,                     // this state is passed as prop to child component <TimePicker />
        },()=>{
          console.log('categories=', this.state.categories);
          console.log('doctors=', this.state.doctors);
          console.log('selectedDoctor=', this.state.selectedDoctor);
          //console.log('currenttime=', this.state.currenttime);
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
        <Navbar/>
        <div className="container">
          <div className="block">
            <h3>Book Appointment</h3><br/>
            <form onSubmit={this.onSubmit} >
                <div className="form-group">
                    <label className="control-lable">Category:</label>
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
                            min={this.state.minDate}
                            onChange={this.onChangeDate}>
                    </input>
                </div>
              </form>
            </div>
          </div>

          {/* show <TimePicker/> only if selectedCategory !== '999' i.e. '--Select--' AND selectedDoctor !== '0'
              i.e. '--Select--' AND selectedDate !== '' */}
          <div className="timetable">
              { this.state.selectedCategory !== '0' && this.state.selectedDoctor !== '0' && this.state.selectedDate !== '' ?
                      <TimePicker myprop={[this.state.selectedDoctor, this.state.selectedDate]}/> : null }
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

    axios.get('/admin_or_patient/get_doctors_by_category/' + _selectedCategory)    // proxy used is 'http://localhost:8080'
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
    // make sure all 3 props (doctorId, dateSelected and categoryId) have been selected before <TimePicker/> is called
    let _selectedDate = e.target.value;       // e.target.value = '2020-05-01'
    this.setState({
      selectedDate: _selectedDate
    }, ()=>{
      console.log('selectedDate=', this.state.selectedDate);
    });
  }

}

export default BookAppointment;
