# Starting the Application
Start Web Server (spring-boot application). You can access resources at http://localhost:8080/reactjs_restful/#pathname
Start React application from command line using "npm start". It will run on http://localhost:3000/

This is Doctor's Appointment Scheduling App. Front-end is built using ReactJs, back end is built using Springboot and MySQL database server.
There are 3 users - PATIENT, ADMIN and DOCTOR. Patient can sign-up, schedule appointment, delete appointments and view appointment details.
Admin can add or update doctor info, update patient info, view or delete appointments. Doctors can view appointments, add or update appointment details, view patient's visit history.


Front-end has secured access to paths which means only users with specified user_role can access the path.
Back-end or Server implements JWT token. When user log-in, the client sends base64encode of username & password in Authorization Header. Once Server authorizes the user credentials, it returns access_token, refresh_token & user_role. Client sends access_token with every
request to access the resources from the Server. When access_token is expired, client sends refresh_token to the server to renew access_token.


# Authentication -
Client sends POST request with header[Authorization]="Basic base64encode(username + ':' + password)" to the Server with url
'/authorize'. Because the request originated from different domain, the browser first sends a pre-flight [OPTIONS] request to
the Server. Server has been configured in such a way that it by-passes authentication for pre-flight [OPTIONS] request. It makes
response to that request by attaching CORS to that response. Browser checks whether the Server will accept the POST request
or not by reading the CORS policy, and upon confirmation, browser sends the POST request to authorize the user. If user is authenticated,
server returns JWTResponse = {access_token: '', refresh_token: '', userId: '', role: ''}
Else, server returns response with status '401 Unauthorized' and body
{code: 401, status: 'UNAUTHORIZED', timestamp: '', message: ''}
When client makes requests to access the resources, it must attach header[Authorization]="Bearer access_token" to the requests.
If token has expired, server returns response with status '401 Unauthorized' and body
{code: 401, status: 'UNAUTHORIZED', timestamp: '', message: ''}
Access_token expiration is shorter than Refresh_token. If access_token expires,
client must send request to the server with header[Authorization]="Bearer refresh_token" at url '/renew_access_token'.
Because the request has originated from a different domain, browser again sends a pre-flight [OPTIONS] request to the Server.
Server has been configured in such a way that it does not require authentication for pre-flight [OPTIONS] request. It makes
response to that request by attaching CORS in that response. Browser checks whether the Server will accept the POST request
or not by reading the CORS policy, and if it matches, browser sends the POST request to renew access_token.
Once server receives the request, it checks for expiration of refresh_token and then generates new access_token with same
expiration time as previous access_token and returns JWTResponse =
{access_token: 'new_token', refresh_token: 'old_token', userId: 'old_id', role: 'old_role'}.
Client updates the user object from localStorage and can send requests to the server using this new access_token.
Refresh_token once expired cannot be renewed. Client must send user-credentials again to authorize the user.
Adding header[Authorization]="Bearer access_token" or "Bearer refresh_token" is done inside Interceptors in ReactJs.

# SecuredRoute from "./_ services/SecuredRoute.js"
In App.js, all components except for those that have paths '/login', '/' or '/register_patient/0' are secured
by using <SecuredRoute>.
When users that are not logged in wants to access the paths '/login', '/' or '/register_patient/0'
they can access these paths because we have not secured the components/routes that belong to these paths.
If localStorage.getItem('loggedUser') is null in SecuredRoute, re-direct user to path '/login'
If localStorage.getItem('loggedUser') is not null in SecuredRoute, allow user to access those components.
If path '/view_doctors' requires roles={['ROLE_ADMIN']} but 'currentUser' has role ['ROLE_PATIENT']
then then do not allow 'currentUser' to access path '/view_doctors'. Redirect currentUser to path '/home'.
In App.js, component {RegisterPatient} has 2 routes -
  1. <Route path='/register_patient/:id' component={RegisterPatient} exact={true} />
  2. <SecuredRoute path='/update_patient/:id' roles={['ROLE_ADMIN', 'ROLE_PATIENT']} component={RegisterPatient} exact={true} />
  First route is neither secured nor specified for roles because anybody can sign up as a patient. New user can register as patient.
  Second route is secured and accessible to users with role="ROLE_ADMIN" or "ROLE_PATIENT". Both admin and patient can update patient.
In App.js, component {AddDoctor} has 2 routes -
  1. <SecuredRoute path='/add_doctor/:id' roles={["ROLE_ADMIN"]} component={AddDoctor} exact={true} />
  2. <SecuredRoute path='/update_doctor/:id' roles={["ROLE_ADMIN", 'ROLE_DOCTOR']} component={AddDoctor} exact={true} />
  First route is secured and accessible to user with role="ROLE_ADMIN". Only admin can add doctor.
  Second route is secured and accessible to users with role="ROLE_ADMIN" or "ROLE_DOCTOR". Both admin and doctor can update doctor.

# Interceptors from "./_ services/Interceptors.js"
In index.js, we imported "./_ services/Interceptors.js";
Every outgoing request from the Client can be configured inside axios.interceptors.request.use() method.
Every incoming response from the Server can be configured inside axios.interceptors.response.use() method.
Read more inside Interceptors.js

# Permissions - hasRole(user, roles[])
Navbar items include ['HOME', 'ENTER DETAILS', 'ADD DOCTOR', 'BOOK APPOINTMENT', 'VIEW DOCTORS', 'SEND FEEDBACK', ...]
Because all Users have access to this Navbar, each of these items is visible to the Users based on their roles.
{hasRole(user, ["ROLE_ADMIN"]) && <li><a href="/add_doctor/0">Add Doctor</a></li>}
In this line of code, if user has role ["ROLE_ADMIN"] than that user can only view Navbar item "ADD DOCTOR"
Users without role ["ROLE_ADMIN"] cannot view the Navbar item.
Because User can only have one Role was our requirements. We receive JSON data
  {access_token: '', refresh_token: '', userId: '', role: 'ROLE_ADMIN'}
when user credentials is authenticated. Because our hasRole() method requires roles[] array parameter,
we had to convert String 'ROLE_ADMIN' to array ['ROLE_ADMIN'].

# Proxy -
In front-end applications such as React or Angular, it is convenient to write requests like get('/all_employees') or post('/save_employee'). Proxy helps us to achieve that by acting like a middleware between the client and the server. When get('/all_employees') request is fired by axios, proxy adds prefix "http://localhost:8080" to the request. When that request reaches the browser, it shows pueudo Requested URL get("http://localhost:3000/all_employees") to the browser. This helps React application to avoid cross-origin issues. NOTE: React application is running on 'http://localhost:3000'.
    In react app, we define proxy in 'package.json' like this:
      "proxy": "http://localhost:8080",
So what do we achieve by using PROXY ?
1. Convenient to write requests like get('/all_employees') instead of writing get('http://localhost:8080/all_employees')
2. Avoid CORS issues. Browser can reject client request if it detects that client is making a cross-origin request. If your Server has handled/implemented CORS then there is no problem. You can write full URLs but if you don't use proxy then you can get CORS related errors. You can use proxy in both production and development stages.

# Stacking Order with Elements -
React form element select-options has higher stacking order than text, buttons and any other forms. LogoutModal and SuccessMsg/ErrorMsg that displays
when creating or updating users should display above the form. While other form elements appear below these pop-up message select-options appear above
these messages. This is because of higher stacking order or element select-option. To solve this always position: fixed on LogoutModal and
SuccessMsg/ErrorMsg and place them after the <form/> element. This way, both LogoutModal and SuccessMsg/ErrorMsg will appear above
the rest because in React HTML, elements that appears later in the code have higher stacking order than those appearing earlier.

# Error_ConnectionFailed / Error_PageNotFound
If server is down or internet is disconnected, Interceptors reads the response.status == 500 and re-direct to the path '/connectionError' which
will render message '500 Connection Failed'. Similarly, when user tries to access path '/private' which is no longer available or does not exist,
App.js detects that path and redirect to wildcard path ' * ' which then renders message '404 Page Not Found'.

# Expired Session/refresh_token
When refresh_token expires, we set item 'isRefreshTokenExpired: true' in localStorage and re-direct to '/login' from Interceptors.js
In Login.js, componentDidMount(), we have condition that if 'isRefreshTokenExpired: true' display sessionExpiredMsg for 3 sec. After 3 sec,
remove item 'isRefreshTokenExpired' from localStorage. User who are accessing path '/login' or those who just logged out this message won't
display for them because the condition 'isRefreshTokenExpired: true' will fail for them. Only loggedUsers who are re-directed from Interceptors.js
to '/login' due to expired refresh_token will be affected.

# Navbar Active Item -
An 'activeClassName' attribute of <NavLink> will assign its <a> tag a css class of "active" when the router notices that the user is accessing the path of the Link. Even if we replace <a> with <NavLink>, in .css we assign properties to 'a' as if <Navbar> is equivalent to <a>. This helps us to create active navbar item unique and easy to know which page the user is at.

#IMPORTANT INFORMATION -
Google Chrome and Firefox supports EcmaScript6 but IE11 does not. It supports only ES5. So using => will give Script Error in
Internet Explorer console. There is not much help regarding this error on online community because IE may soon become obsolete.

Use window.location.reload(false); inside .then(response=>{}) to update the data when you fetch data from database again.
When you delete appointment from '/admin_view_appointments' you must refresh the page to update the data. If you reload the
page after .then(response=>{}) and the access_token has expired then reload can prevent the retry of failed request.
window.location.reload(false); statement is executed before the retry failed request. Placing the reload statement inside
.then(response=>{}) will ensure that reload will occurs only when original request is successful.


LogoutModal did not display on top of Patient.BookAppointment.
(This is due to stacking order of the elements. Solved by placing <Navbar/> element after the Router Components in 'App.js'.
Since, <Navbar/> is placed after Router Components in 'App.js', Navbar's stacking order is higher than Router Components and therefore, LogoutModal will display above the elements of Patient.BookAppointment component. Also, <Navbar/> has css 'position: fixed', which allows
it to stay fixed on top of the page).

getDerivedStateFromProps() should replace componentWillReceiveProps() else warning message appears in console.
However, setTimeout() method cannot be used in getDerivedStateFromProps. So, suppress the warning message with 'UNSAFE_' prefix.
