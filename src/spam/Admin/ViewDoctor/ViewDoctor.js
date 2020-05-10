import React, { Component } from 'react';
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

import AdminNavbar from '../AdminNavbar/AdminNavbar';
import ListDoctors from './ListDoctors';
import './ViewDoctor.css';


class ViewDoctor extends Component {

  constructor(props) {
    super(props);
    this.state = {
      doctors: [],
      updatedList: [],        /* we use updatedList[] for the props because if we use doctors[] as props and setState on doctors[] instead of updatedList[],
                                matching list of doctors[] is displayed when we enter 'searchText', but when we remove 'searchText' postState doctors[]
                                will not display the preState doctors[] (initial list) again */
      searchText: ''
    };
    this.filterList = this.filterList.bind(this);
    this.getRoundOffNumber = this.getRoundOffNumber.bind(this);
    this.getCategory = this.getCategory.bind(this);
    this.getDegrees = this.getDegrees.bind(this);
    this.getGender = this.getGender.bind(this);
    this.getFormatBirthDate = this.getFormatBirthDate.bind(this);
  }


  async componentDidMount(){
    axios.get('/get_all_doctors')
    .then(response => {
      console.log('response.data=', response.data);
      let _doctors = response.data;   // response.data contains [{doctor: {}, link: {}}, {feedback: {}, link: {}}, {feedback: {}, link: {}}]
      _doctors = _doctors.map(x => x.doctor);   // _doctors contains [{id: 1, date: '', message: ''}, {id: 2, date: '', message: ''}]
      _doctors = _doctors.map(x => {
        let obj = x;
        obj.degrees = this.getDegrees(obj.degrees);         // convert String "0, 8" to "MD, PhD" .....
        obj.rating = this.getRoundOffNumber(obj.rating);    // convert 4.3333 -> 4.3 or 3 -> 3.0 ...
        obj.category = this.getCategory(obj.category);      // convert 0 -> 'General Physician', 1 -> 'Dermatologist' ....
        obj.gender = this.getGender(obj.gender);            // convert 0 -> male, 1 -> female, 2 -> other
        obj.birthdate = this.getFormatBirthDate(obj.birthdate);   // convert '1986-02-02T05:00:00.000+0000' -> '1986/02/02'
        return obj;
      });
      console.log('_doctors=', this.state.doctors);
      this.setState({
        doctors: _doctors,
        updatedList: _doctors
      }, ()=> {
        console.log('_doctors=', this.state.doctors);
      });
    })
    .catch(function (error) {
      console.log(error);
    })
  }


  render() {
    return(
      <div>
        <AdminNavbar/>               {/* patient home page navigation bar */}
        <div className="container fluid searchPanel">
          <div className="filter-list">
            <div className="searchBox">
              <input type="text" className="form-control form-control-lg" placeholder='Search'
                      onChange={this.filterList}/>
            </div>
            <ListDoctors doctors={this.state.updatedList} />
          </div>
        </div>
      </div>
    );

  }

  filterList(event) {
    const searchText = event.target.value.toLowerCase();
    console.log('searchText=', searchText);
    const _updatedList = this.state.doctors.filter(function(item) {
      return (
        Object.keys(item).some(key =>
                  item[key].toString().toLowerCase().includes(searchText))
      );
    });
    /* we use updatedList[] for the props because if we use doctors[] as props and setState on doctors[] instead of updatedList[],
      matching list of doctors[] is displayed when we enter 'searchText', but when we remove 'searchText' postState doctors[]
      will not display the preState doctors[] (initial list) again */
    this.setState({
      updatedList: _updatedList
    });
  }


  getRoundOffNumber(num) {
    let _num = num.toString().concat('.0');
    return _num.substring(0,3);
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


  getDegrees(arr) {
    let _degrees = '';
    arr.forEach((item, i) => {
      let value = '';
      if(item === 1) {
        value = 'MD';
      }
      if(item === 2) {
        value = 'DO';
      }
      if(item === 3) {
        value = 'MBBS';
      }
      if(item === 4) {
        value = 'MPH';
      }
      if(item === 5) {
        value = 'MHS';
      }
      if(item === 6) {
        value = 'MEd';
      }
      if(item === 7) {
        value = 'MS';
      }
      if(item === 8) {
        value = 'MBA';
      }
      if(item === 9) {
        value = 'PhD';
      }
      _degrees = _degrees + ', ' + value;
    });
    _degrees = _degrees.substring(1, _degrees.length);
    return _degrees;
  }


  getGender(num) {
    switch(num) {
      case 1:
        return 'male';
        break;
      case 2:
        return 'female';
        break;
      default: // case: 3
        return 'other';
    }
  }


  /**
 * converts String date '2014-04-11 14:00' to String '04/11/2014 14:00'
 */
  getFormatBirthDate(timeStamp) {
    var date = new Date(timeStamp);
    var year = date.getFullYear();
    var month = 1 + date.getMonth();	// January = 0 and December = 11
    month = ('0' + month).slice(-2);	// single digit month such as 2 becomes two digit month 02
    var day = date.getDate();
    day = ('0' + day).slice(-2);		// single digit day such as 2 becomes two digit day 02
    return month + '/' + day + '/' + year;
  }

}


export default ViewDoctor;
