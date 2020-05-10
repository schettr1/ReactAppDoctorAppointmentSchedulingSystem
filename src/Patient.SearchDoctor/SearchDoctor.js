import React, { Component } from 'react';
import axios from 'axios';
import { convertIntegerDegreesToString, convertIntegerCategoryToString, roundNumberToTenthPlace } from '../_services/Converter.js';
import Navbar from '../Navbar/Navbar';
import Doctor from './Doctor';
import './SearchDoctor.css';


class SearchDoctor extends Component {

  constructor(props) {
    super(props);
    this.state = {
      doctors: [],
      updatedList: [],        /* we use updatedList[] for the props because if we use doctors[] as props and setState on doctors[] instead of updatedList[],
                                matching list of doctors[] is displayed when we enter 'searchText', but when we remove 'searchText' postState doctors[]
                                will not display the preState doctors[] (initial list) again */
      searchText: ''
    };

    this.searchTextFunc = this.searchTextFunc.bind(this);
  }

  async componentDidMount(){
    axios.get('/admin_or_patient/get_all_doctors')
    .then(response => {
      let _doctors = response.data;   // response.data contains [{doctor: {}, link: {}}, {feedback: {}, link: {}}, {feedback: {}, link: {}}]
      _doctors = _doctors.map(x => x.doctor);   // _doctors contains [{id: 1, date: '', message: ''}, {id: 2, date: '', message: ''}]
      _doctors = _doctors.map(x => {
        let obj = x;
        obj.degrees = convertIntegerDegreesToString(obj.degrees);         // convert String "0, 8" to "MD, PhD" .....
        obj.rating = roundNumberToTenthPlace(obj.rating);    // convert 4.3333 -> 4.3 or 3 -> 3.0 ...
        obj.category = convertIntegerCategoryToString(obj.category);      // convert 0 -> 'General Physician', 1 -> 'Dermatologist' ....
        return obj;
      });
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
        <Navbar/>               {/* patient home page navigation bar */}
        <div className="container searchPanel">
          <div className="filter-list">
            <div className="searchBox">
              <input type="text" className="form-control form-control-lg" placeholder='Search'
                      onChange={this.searchTextFunc}/>
            </div>
            <Doctor doctors={this.state.updatedList} />
          </div>
        </div>
      </div>
    );
  }


  searchTextFunc(event) {
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


}

export default SearchDoctor;
