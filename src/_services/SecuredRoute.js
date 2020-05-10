import React from 'react';
import { Redirect, Route } from 'react-router-dom';

/*
* In App.js all components except for one that has path '/login' and '/' are
* secured. This is because we do not want unauthorized user to access those components/routes.
* If localStorage.getItem('loggedUser') is null, re-direct to login page.
* If path '/view_doctors' requires roles={['ROLE_ADMIN']} but currentUser has role ['ROLE_PATIENT']
* then then do not allow currentUser to access path '/view_doctors'
* Path '/home' is common for all users. If you specify roles={['ROLE_DOCTOR', 'ROLE_PATIENT', 'ROLE_ADMIN']}
* for path '/home', you may need to modify this code. Better not to specify any roles for path '/home'.
* Read more on https://jasonwatmore.com/post/2019/02/01/react-role-based-authorization-tutorial-with-example
*/
const SecuredRoute = ({ component: Component, roles, ...rest }) => (
    <Route {...rest} render = {props => {
        const currentUser = JSON.parse(localStorage.getItem('loggedUser'));  // {access_token: " ", refresh_token: " ", useId: " ", role: ['ROLE_ADMIN']}
        console.log('currentUser=', currentUser);

        if (!currentUser) {
            // not logged in so redirect to login page with the return url
            return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        }

        // check if route is restricted by role
        if (roles && !roles.includes(currentUser.role.toString())) {
            console.log('CurrentUser does not have permission to access this page');
            // role not authorised so redirect to home page
            return <Redirect to={{ pathname: '/home' }} />
        }

        // authorised so return component
        return <Component {...props} />
    }} />
)


export default SecuredRoute;





/*
* This code allows only logged in users to access the paths/components
* but it does not prevent currentUser with role ['ROLE_PATIENT'] from accessing paths/components
* that requires roles={['ROLE_ADMIN']}

const SecuredRoute = ({ component: Component, ...rest }) => {
  var isLoggedIn = localStorage.getItem('loggedUser') !== null ? true : false;
  return (
    <Route {...rest}
      render = {props =>
            isLoggedIn ? <Component {...props} /> : <Redirect to={{ pathname: '/login', state: { from: props.location } }}/>
      }
    />
  )
}
*/
