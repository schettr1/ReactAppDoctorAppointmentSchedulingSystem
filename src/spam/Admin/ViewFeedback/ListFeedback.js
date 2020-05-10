import React, { Component } from 'react';
import { Button, Table } from 'reactstrap';
import { Link } from 'react-router-dom';



class ListFeedback extends Component {

  constructor(props) {
    super(props);
    this.state = {

    };
  }


  render() {
    return(
      <div>
        <Table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            {this.props.feedbacks.map((item, i) =>{
              return (
                <tr key={i}>
                  <td className="first">{this.props.feedbacks[i].id}</td>
                  <td className="middle">{this.props.feedbacks[i].date}</td>
                  <td className="last">{this.props.feedbacks[i].message}</td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      </div>
    );

  }
}


export default ListFeedback;
