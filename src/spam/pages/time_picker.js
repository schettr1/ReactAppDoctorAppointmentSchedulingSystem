import React, { Component } from 'react';
import axios from 'axios';
//import { Container, Row, Col } from 'reactstrap';
import { Button } from 'reactstrap';
import './TimePicker.css';

class TimePicker extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isTimeAvaiable: [],   // initialize from componentDidMount
      selectedRow: -1       // selectedRow is not from the table
    }

    this.onSelectEvent = this.onSelectEvent.bind(this);
  }

  // sequence of execution - constructor(props), this.state, render(), componentDidMount()
  // when setState() is called, any changes in initial state will call render() again
  componentDidMount(){
    axios.get('/getAppointmentByDay')
    .then(response => {
      let appointment = response.data;
      console.log('response.data=', appointment);
      this.setState({
        isTimeAvaiable: appointment
      }, ()=>{
        console.log('this.state.isTimeAvaiable=', this.state.isTimeAvaiable);
      });
    })
    .catch(function (error) {
      console.log(error);
    })

    console.warn('dateSelected<porp>=', this.props.dateSelected);   // prop='dateSelected' from 'BookAppointment.js'
  }

  onSubmit(e) {
      e.preventDefault();

    }

  render() {
    return(
        <table>
          <tbody>
          {this.state.isTimeAvaiable.map((item, i) => {
            return (
              <tr key={i}>
                <td>
                 <input type='button' value={this.state.isTimeAvaiable[i].starttime + ' - ' + this.state.isTimeAvaiable[i].endtime}
                    className={"buttonStyle " + (this.state.isTimeAvaiable[i].booked ? 'isBooked' : (this.state.selectedRow === i ? 'rowClicked' : 'rowNotClicked'))}
                    disabled={this.state.isTimeAvaiable[i].booked}
                    onClick={this.onSelectEvent(i)} />
               </td>
              </tr>
            );
          })}
          </tbody>
        </table>
    );
  }


  onSelectEvent = selectedRow => e => {
    console.log(selectedRow, e.target.value)
    if (selectedRow !== undefined) {
      this.setState({
       selectedRow: selectedRow
      });
    }
  };


}

export default TimePicker;
