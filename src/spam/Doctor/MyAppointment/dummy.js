import React, { Component } from 'react';
import { Button, Container, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

import './MyAppointment.css';
import DoctorNavbar from '../DoctorNavbar/DoctorNavbar';
import ListAppointment from './ListAppointment';

class MyAppointment extends Component {

  constructor(props) {
    super(props);
    this.state = {
      patients: [],
      updatedList: [],        /* we use updatedList[] for the props because if we use doctors[] as props and setState on doctors[] instead of updatedList[],
                                matching list of doctors[] is displayed when we enter 'searchText', but when we remove 'searchText' postState doctors[]
                                will not display the preState doctors[] (initial list) again */
      searchText: '',
      todayDate: new Date()
    };

    this.filterList = this.filterList.bind(this);
    this.onChangeDate = this.onChangeDate.bind(this);
    this.modifyDate = this.modifyDate.bind(this);
  }

  // this method gets executed first when this component is called
  async componentDidMount(){
    let response_data = [
      {id: 1, date: '04/01/2020', time: '08:00-08:30', firstname: 'Rajesh', lastname: 'Khanna', gender: 'male', email: 'rkhanna@gmail.com', phone: '2547841477', birthdate: '03/04/1974'},
      {id: 2, date: '04/01/2020', time: '08:30-09:00', firstname: 'Amisha', lastname: 'Patel', gender: 'female', email: 'rkhanna@gmail.com', phone: '2547841477', birthdate: '08/11/1979'},
      {id: 3, date: '04/01/2020', time: '09:00-09:30', firstname: 'Hrithik', lastname: 'Roshan', gender: 'male', email: 'rkhanna@gmail.com', phone: '2547841477', birthdate: '01/26/1988'},
      {id: 4, date: '04/01/2020', time: '11:00-11:30', firstname: 'Sashi', lastname: 'Kapoor', gender: 'male', email: 'rkhanna@gmail.com', phone: '2547841477', birthdate: '07/01/1976'},
      {id: 5, date: '04/01/2020', time: '11:30-12:00', firstname: 'Rajnish', lastname: 'Khanna', gender: 'male', email: 'rkhanna@gmail.com', phone: '2547841477', birthdate: '11/14/1969'},
      {id: 6, date: '04/01/2020', time: '01:30-02:00', firstname: 'Amrita', lastname: 'Arora', gender: 'female', email: 'rkhanna@gmail.com', phone: '2547841477', birthdate: '06/06/1978'},
      {id: 7, date: '04/01/2020', time: '02:00-02:30', firstname: 'Madhuri', lastname: 'Dixit', gender: 'female', email: 'rkhanna@gmail.com', phone: '2547841477', birthdate: '05/02/1977'},
      {id: 8, date: '04/01/2020', time: '04:00-04:30', firstname: 'Ajay', lastname: 'Devgan', gender: 'male', email: 'rkhanna@gmail.com', phone: '2547841477', birthdate: '03/14/1988'},
      {id: 9, date: '04/01/2020', time: '04:30-05:00', firstname: 'Sunil', lastname: 'Shetty', gender: 'male', email: 'rkhanna@gmail.com', phone: '2547841477', birthdate: '02/11/1980'}
    ];
    this.setState({
      patients: response_data
    }, ()=> {
        /*
        * notice how we are keeping these statements inside the setState callback function. This is because if we do not put it
        * inside the callback function, we cannot get the value of this.state.patients inside componentDidMount().
        */
        let _patients  = this.state.patients;
        console.log('patients=', _patients);
        console.log('this.state.patients=', this.state.patients);
        let timeTable = [ '08:00-08:30', '08:30-09:00', '09:00-09:30', '09:30-10:00', '10:00-10:30', '10:30-11:00', '11:00-11:30', '11:30-12:00',
                          '01:00-01:30', '01:30-02:00', '02:00-02:30', '02:30-03:00', '03:00-03:30', '03:30-04:00', '04:00-04:30', '04:30-05:00' ];

        let _updatedList = [];

        for(let i of timeTable) {       // loop through each data from the database so that we can fill the appointment time-table with matching time
            let isPresent = false;
            for(let p of _patients) {
              if(i === p.time) {
                _updatedList.push(p);
                isPresent = true;
              }
            }
            if(!isPresent) {
              let emptyJSON = {id: '', date: '', time: '', firstname: '', lastname: '', gender: '', email: '', phone: '', birthdate: ''};
              emptyJSON.time = i;
              _updatedList.push(emptyJSON);     // fill non-scheduled appointment time with emptyJSON data
            }
        }
        this.setState({
          updatedList: _updatedList
        }, ()=> {
          console.log('this.state.updatedList=', this.state.updatedList);
        })

        let today = new Date();   // display today's date when doctor checks his appointments
        this.setState({
          todayDate: this.modifyDate()      // call this function that returns date in format '2014-02-11'
        }, ()=> {
          console.log('this.state.updatedList=', this.state.updatedList);
        })
    });
  }


  render() {
    return(
      <div>
        <DoctorNavbar/>               {/* patient home page navigation bar */}
        <div className="container fluid">
          <div className="filter-list">
            <div className="leftFloat">
              <input type="text" className="form-control form-control-lg" placeholder='Search'
                      onChange={this.filterList}/>
            </div>
            <div className="rightFloat">
              <div className="form-group parent">
                <div className="left-child">
                  <label>Date: </label>
                </div>
                <div className="right-child">
                  <input type="date"
                          className="form-control"
                          value={this.state.todayDate}
                          onChange={this.onChangeDate}>
                  </input>
                </div>
              </div>
            </div>
            <ListAppointment patients={this.state.updatedList} />
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
    /*
    * we use updatedList[] for the props because if we use doctors[] as props and setState on doctors[] instead of updatedList[],
    * matching list of doctors[] is displayed when we enter 'searchText', but when we remove 'searchText' postState doctors[]
    * will not display the preState doctors[] (initial list) again
    */
    this.setState({
      updatedList: _updatedList
    });
  }

  onChangeDate(e) {
    this.setState({
      todayDate: e.target.value
    });
  }

  /*
  * returns date in format '2014-02-11' because <input type='date' value=''> only accepts value
  * in this format.
  */
  modifyDate() {
    //var date = new Date(timeStamp);
    var date = new Date();
    var year = date.getFullYear();
    var month = 1 + date.getMonth();	// adding 1 makes month accurate January = 1 + 0 = 1 and December = 1 + 11 = 12
    month = ('0' + month).slice(-2);	// adding 0 makes single digit months 2 digit so that you get last 2 digits i.e. 2 -> 02 and 11 -> 11
    var day = date.getDate();
    day = ('0' + day).slice(-2);		// single digit day such as 2 becomes two digit day 02
    return year + '-' + month + '-' +  day;
  }

}

export default MyAppointment;
