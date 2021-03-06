import React, { Component } from 'react';
import axios from 'axios';
import { convertIntegerGenderToString, convertStringUTCDatetoBirthdate } from '../_services/Converter.js';
import './ViewPatients.css';
import Patient from './Patient';

class ViewPatients extends Component {

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
  }

  // this method gets executed first when this component is called
  async componentDidMount(){
    axios.get('/admin_or_doctor/get_all_patients')
    .then(response => {
      console.log('response.data=', response.data);
      let _patients = response.data;   // response.data contains [{patient: {}, link: {}}, {feedback: {}, link: {}}, {feedback: {}, link: {}}]
      _patients = _patients.map(x => x.patient);   // _patients contains [{id: 1, date: '', message: ''}, {id: 2, date: '', message: ''}]
      _patients = _patients.map(x => {
        let obj = x;
        obj.gender = convertIntegerGenderToString(obj.gender);            // convert 0 -> male, 1 -> female, 2 -> other
        obj.birthdate = convertStringUTCDatetoBirthdate(obj.birthdate);          // convert '1986-02-02T05:00:00.000+0000' -> '1986/02/02'
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
      <div className="container fluid searchPanel">
        <div className="filter-list">
          <div className="searchBox">
            <input type="text" className="form-control form-control-lg" placeholder='Search'
                    onChange={this.filterList}/>
          </div>
          <Patient patients={this.state.updatedList} />
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

}


export default ViewPatients;
