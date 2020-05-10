import React, { Component } from 'react';
import { Table } from 'reactstrap';
import Pagination from '../Pagination/Pagination';


class Feedback extends Component {
  constructor(props) {
    super(props);
    this.state = {
      feedbacks: '',
      pageOfItems: [],        // list of items in any single page
    };

    this.onChangePage = this.onChangePage.bind(this);
  }


  componentDidMount() {
    // Read props value inside render(). You cannot read its value inside componentDidMount()
  }


  onChangePage(pageOfItems) {
    this.setState({
      pageOfItems: pageOfItems
    });
  }



  render() {

    // Read props value inside render(). You cannot read its value inside componentDidMount()
    let feedbacks = this.props.feedbacks;

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
            {this.state.pageOfItems.map(item => {
              return (
                <tr key={item.id}>
                  <td className="first">{item.id}</td>
                  <td className="middle">{item.date}</td>
                  <td className="last">{item.message}</td>
                </tr>
              )
            })}
          </tbody>
        </Table>
        <Pagination items={feedbacks} onChangePage={this.onChangePage} />
    </div>
    );

  }
}


export default Feedback;


/*
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

*/
