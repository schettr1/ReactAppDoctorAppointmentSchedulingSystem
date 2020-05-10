import React, { Component } from 'react';
import { Button, Container, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

import './ViewPatient.css';
import AdminNavbar from '../AdminNavbar/AdminNavbar';
import ListPatient from './ListPatient';

class ViewPatient extends Component {

  constructor(props) {
    super(props);
    this.state = {
      patients: [],
      updatedList: [],        /* we use updatedList[] for the props because if we use doctors[] as props and setState on doctors[] instead of updatedList[],
                                matching list of doctors[] is displayed when we enter 'searchText', but when we remove 'searchText' postState doctors[]
                                will not display the preState doctors[] (initial list) again */
      searchText: ''
    };
    this.filterList = this.filterList.bind(this);
    this.getGender = this.getGender.bind(this);
    this.getFormatBirthDate = this.getFormatBirthDate.bind(this);
  }

  // this method gets executed first when this component is called
  async componentDidMount(){
    axios.get('/get_all_patients')
    .then(response => {
      console.log('response.data=', response.data);
      let _patients = response.data;   // response.data contains [{patient: {}, link: {}}, {feedback: {}, link: {}}, {feedback: {}, link: {}}]
      _patients = _patients.map(x => x.patient);   // _patients contains [{id: 1, date: '', message: ''}, {id: 2, date: '', message: ''}]
      _patients = _patients.map(x => {
        let obj = x;
        obj.gender = this.getGender(obj.gender);            // convert 0 -> male, 1 -> female, 2 -> other
        obj.birthdate = this.getFormatBirthDate(obj.birthdate);   // convert '1986-02-02T05:00:00.000+0000' -> '1986/02/02'
        return obj;
      });
      console.log('_patients=', this.state.patients);
      this.setState({
        patients: _patients,
        updatedList: _patients
      }, ()=> {
        console.log('_patients=', this.state.patients);
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
            <ListPatient patients={this.state.updatedList} />
          </div>
        </div>
      </div>
    );
  }


  filterList(event) {
    const searchText = event.target.value.toLowerCase();
    console.log('searchText=', searchText);
    const _updatedList = this.state.patients.filter(function(item) {
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


  /*
  * convert (int) 0, 1, 2 -> (String) male, female, other
  */
  getGender(int) {
    switch(int) {
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


export default ViewPatient;
