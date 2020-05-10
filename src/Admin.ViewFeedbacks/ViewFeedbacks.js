import React, { Component } from 'react';
import axios from 'axios';
import { convertStringUTCDateToLocalTimeFormat } from '../_services/Converter.js';
import './ViewFeedbacks.css';
import Feedback from './Feedback';

class ViewFeedbacks extends Component {

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
  }

  async componentDidMount(){
    axios.get('/admin/get_all_feedbacks')    // proxy used is 'http://localhost:8080'
    .then(response => {
      console.log('response.data=', response.data);
      let _feedbacks = response.data;   // response.data contains [{feedback: {}, link: {}}, {feedback: {}, link: {}}, {feedback: {}, link: {}}]
      _feedbacks = _feedbacks.map(x => x.feedback);   // _feedbacks contains [{id: 1, date: '', message: ''}, {id: 2, date: '', message: ''}]
      _feedbacks = _feedbacks.map(x => {
        let obj = x;
        obj.date = convertStringUTCDateToLocalTimeFormat(obj.date);   // convert date: '2020-03-02T16:00:00.000+0000' to String: '2020-03-02 12:00'
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
      {id: 0, name: 'All'},
      {id: 1, name: 'Last 7 days'},
      {id: 2, name: 'Last Month'}
    ];
    this.setState({
      criteria: _criteria
    });

  }


  render() {
    return(
      <div className="container fluid searchPanel">
        <div className="float-right">
          <select className="form-control"
                  onChange={this.onChangeCriteria}>
            {
              this.state.criteria.map((x) => {
                return (<option key={x.id} value={x.id}>{x.name}</option>)
              })
            }
          </select>
        </div>
        <Feedback feedbacks={this.state.updatedList} />
      </div>
    );

  }

  onChangeCriteria(e) {
    let criteriaValue = parseInt(e.target.value);     // e.target.value = "1"
    console.log('criteria.value=', criteriaValue);

    if (criteriaValue === 0) {   // 'ALL' is selected
      this.setState({
        updatedList: this.state.feedbacks
      });
    }

    if (criteriaValue === 1) {   // 'Last 7 days' is selected
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
        return null;
      });
      console.log('filteredList=', filteredList);
      this.setState({
        updatedList: filteredList
      });
    }

    if (criteriaValue === 2) {     // 'Last Month' is selected
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
        return null;
      });
      console.log('filteredList=', filteredList);
      this.setState({
        updatedList: filteredList
      });
    }
  }

}

export default ViewFeedbacks;
