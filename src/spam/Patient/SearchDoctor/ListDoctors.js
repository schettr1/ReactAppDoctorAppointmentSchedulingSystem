import React, { Component } from 'react';
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';



class ListDoctors extends Component {

  constructor(props) {
    super(props);
    this.state = {

    };
  }


  render() {
    return(
      <div>
        {this.props.doctors.map((item, i) =>{
          return (
            <div key={i} className='horizontalDivider divStyle'>
              <div>
                <img style={imageProperty} src='/images/person.png' alt="" />
              </div>
              <div>
                <div>{this.props.doctors[i].firstname + ' ' + this.props.doctors[i].lastname + ' ' + this.props.doctors[i].degrees}</div>
                <div>{this.props.doctors[i].category}</div>
                <div>{this.props.doctors[i].degree}</div>
                <div>
                  <div><img style={icon} src='/images/email.jpg' alt=""/> {this.props.doctors[i].email}</div>
                  <div><img style={icon} src='/images/phone.png' alt=""/> {this.props.doctors[i].phone}</div>
                </div>
              </div>
              <div>
                <div>
                  {'Rating: ' + this.props.doctors[i].rating} <img style={icon} src='/images/star.png' alt=""/>
                </div>
                <br/>
                <div>
                  <Button tag={Link} to={"/patient/book_appointment/"+this.props.doctors[i].id} className="btn btn-info">Make Appointment</Button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    );

  }
}

let imageProperty = {
    width: 150,
    height: 150
};

let icon = {
    width: 18,
    height: 18
};


export default ListDoctors;
