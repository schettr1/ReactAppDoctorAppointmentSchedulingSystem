import React, { Component } from 'react';
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

import PatientNavbar from '../PatientNavbar/PatientNavbar';
import ListDoctors from './ListDoctors';
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
    this.getRoundOffNumber = this.getRoundOffNumber.bind(this);
    this.getCategory = this.getCategory.bind(this);
    this.getDegrees = this.getDegrees.bind(this);
  }

  async componentDidMount(){
    axios.get('/get_all_doctors')
    .then(response => {
      let _doctors = response.data;   // response.data contains [{doctor: {}, link: {}}, {feedback: {}, link: {}}, {feedback: {}, link: {}}]
      _doctors = _doctors.map(x => x.doctor);   // _doctors contains [{id: 1, date: '', message: ''}, {id: 2, date: '', message: ''}]
      _doctors = _doctors.map(x => {
        let obj = x;
        obj.degrees = this.getDegrees(obj.degrees);         // convert String "0, 8" to "MD, PhD" .....
        obj.rating = this.getRoundOffNumber(obj.rating);    // convert 4.3333 -> 4.3 or 3 -> 3.0 ...
        obj.category = this.getCategory(obj.category);      // convert 0 -> 'General Physician', 1 -> 'Dermatologist' ....
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
        <PatientNavbar/>               {/* patient home page navigation bar */}
        <div className="searchPanel">
          <div className="filter-list">
            <div className="searchBox">
              <input type="text" className="form-control form-control-lg" placeholder='Search'
                      onChange={this.searchTextFunc}/>
            </div>
            <ListDoctors doctors={this.state.updatedList} />
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


  /*
  * rounding value such as 4.33333 or 3 to tenth decimal places such as 4.3 or 3.0
  * If value is 0 (for new registered doctors rating has value of 0), return 'N/A'
  */
  getRoundOffNumber(num) {
    if(num === 0)
        return 'N/A';
    let _num = num.toString().concat('.0');
    return _num.substring(0,3);
  }


  /*
  * @param - Integer
  * @return - toString
  * convert Integer value to its String equivalent
  */
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

}


let imageProperty = {
    width: 200,
    height: 200
};

let icon = {
    width: 18,
    height: 18
};
export default SearchDoctor;
