export const hasRole = (user, roles) =>
  roles.some(item => user.role.includes(item));


// user => localStorage.getItem("loggedUser") => {access_token: '', refresh_token: '', userId: '', role: ''}
// roles => ["ROLE_ADMIN", "ROLE_DOCTOR", "ROLE_PATIENT"] any of these role required to access Component in App.js
