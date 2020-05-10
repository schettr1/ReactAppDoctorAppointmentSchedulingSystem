import React, { Component } from 'react';
import { Button, Container, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

import './ViewFeedback.css';
import AdminNavbar from '../AdminNavbar/AdminNavbar';
import ListFeedback from './ListFeedback';

class ViewFeedback extends Component {

  constructor(props) {
    super(props);
    this.state = {
      feedbacks: [],
      updatedList: [],        /* we use updatedList[] for the props because if we use doctors[] as props and setState on doctors[] instead of updatedList[],
                                matching list of doctors[] is displayed when we enter 'searchText', but when we remove 'searchText' postState doctors[]
                                will not display the preState doctors[] (initial list) again */
      searchText: '',
      criteria: []
    };

    this.onChangeCriteria = this.onChangeCriteria.bind(this);
    this.convert_UNIX_to_String = this.convert_UNIX_to_String.bind(this);
  }

  async componentDidMount(){
    axios.get('/get_all_feedbacks')    // proxy used is 'http://localhost:8080'
    .then(response => {
      let _feedbacks = response.data;   // response.data contains [{feedback: {}, link: {}}, {feedback: {}, link: {}}, {feedback: {}, link: {}}]
      _feedbacks = _feedbacks.map(x => x.feedback);   // _feedbacks contains [{id: 1, date: '', message: ''}, {id: 2, date: '', message: ''}]
      _feedbacks = _feedbacks.map(x => {              // convert date: '2020-03-02T16:00:00.000+0000' to date: '2020-03-15 14:00'
        let obj = x;
        obj.date = this.convert_UNIX_to_String(obj.date);
        return obj;
      });
      this.setState({
        feedbacks: _feedbacks,
        updatedList: _feedbacks,
        isEdit: true
      }, ()=> {
        console.log('feedbacks=', this.state.feedbacks);
      });
    })
    .catch(function (error) {
      console.log(error);
    })

    let _criteria = [
      {id: '0', name: 'All'},
      {id: '1', name: 'Last 7 days'},
      {id: '2', name: 'Last Month'}
    ];
    this.setState({
      criteria: _criteria
    });

  }


  render() {
    return(
      <div>
        <AdminNavbar/>               {/* patient home page navigation bar */}
        <div className="container fluid searchPanel">
          <div className="float-right">
            <select className="form-control space"
                    onChange={this.onChangeCriteria}>
              {
                this.state.criteria.map((x) => {
                  return (<option key={x.id} value={x.id}>{x.name}</option>)
                })
              }
            </select>
            <input type="submit" value="Search" className="btn btn-primary"/>
          </div>
          <ListFeedback feedbacks={this.state.updatedList} />
        </div>
      </div>
    );

  }

  onChangeCriteria(e) {
    let criteriaValue = e.target.value;
    console.log('criteria.value=', criteriaValue);

    if (criteriaValue==0) {   // 'ALL' is selected
      this.setState({
        updatedList: this.state.feedbacks
      });
    }

    if (criteriaValue==1) {   // 'Last 7 days' is selected
      let filteredList = this.state.feedbacks;    // get all feedbacks
      filteredList = filteredList.filter(x => {   // filter out those feedbacks whose date is < 7 days
        let obj = x;
        let today = new Date();
        let feedback_date = new Date(obj.date);
        let difference = today - feedback_date;
        let diff_days = Math.floor(difference/(1000*3600*24));
        if(diff_days < 7) {
          return obj;
        }
      });
      console.log('filteredList=', filteredList);
      this.setState({
        updatedList: filteredList
      });
    }

    if (criteriaValue==2) {     // 'Last Month' is selected
      let filteredList = this.state.feedbacks;    // get all feedbacks
      filteredList = filteredList.filter(x => {   // filter out those feedbacks whose date is < 30 days
        let obj = x;
        let today = new Date();
        let feedback_date = new Date(obj.date);
        let difference = today - feedback_date;
        let diff_days = Math.floor(difference/(1000*3600*24));
        if(diff_days < 30) {
          return obj;
        }
      });
      console.log('filteredList=', filteredList);
      this.setState({
        updatedList: filteredList
      });
    }
  }


  /**
 * converts UNIX timestamp (111844800000) to Date object
 * which is compatible to HTML form element type 'datetime-local'
 */
  convert_UNIX_to_String(timeStamp) {
    var date = new Date(timeStamp);
    var year = date.getFullYear();
    var month = 1 + date.getMonth();	// January = 0 and December = 11
    month = ('0' + month).slice(-2);	// single digit month such as 2 becomes two digit month 02
    var day = date.getDate();
    day = ('0' + day).slice(-2);		// single digit day such as 2 becomes two digit day 02
    var hours = date.getHours();
    var mins = date.getMinutes();
    mins = ('0' + mins).slice(-2);		// single digit mins such as 2 becomes two digit mins 02
    return month + '-' + day + '-' + year  + ' ' +  hours + ':' +  mins;
  }

}

export default ViewFeedback;
