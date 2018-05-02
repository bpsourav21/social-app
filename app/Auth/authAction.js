import React from 'react';
import axios from 'axios';
import moment from 'moment';
import push from 'react-router-redux';
import { cookie } from 'react-cookie';
import Cookies from 'universal-cookie';
import { Route, Redirect, Switch } from 'react-router-dom';

const cookies = new Cookies();

export function login(name, password, props) {
  return (dispatch) => {
    dispatch({
      type: 'CLEAR_MESSAGES'
    });
    return fetch('/login', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name,
        password: password
      })
    }).then((response) => {
      if (response.ok) {
        return response.json().then((json) => {
          dispatch({
            type: 'LOGIN_SUCCESS',
            token: json.token,
            user: json.user,
            messages: Array.isArray(json.msg) ? json.msg : [json.msg]
          });
          cookies.set('token', json.token, { expires: moment().add(1, 'hour').toDate() });
          props.history.push('/content')
        });
      } else {
        return response.json().then((json) => {
          dispatch({
            type: 'LOGIN_FAILURE',
            messages: Array.isArray(json) ? json : [json]
          });
        });
      }
    });
  };
}

export function signup(name, email, password, props) {
  return (dispatch) => {
    dispatch({
      type: 'CLEAR_MESSAGES'
    });
    return fetch('/signup', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name, email: email, password: password })
    }).then((response) => {

      return response.json().then((json) => {
        if (response.ok) {
          dispatch({
            type: 'SIGNUP_SUCCESS',
            // token: json.token,
            // user: json.user,
            messages: Array.isArray(json.msg) ? json.msg : [json.msg]
          });

          // cookies.set('token', json.token, { expires: moment().add(1, 'hour').toDate() });
          props.history.push('/login')

        } else {
          dispatch({
            type: 'SIGNUP_FAILURE',
            messages: Array.isArray(json) ? json : [json]
          });
        }
      });
    });
  };
}

export function logout(props) {
  return (dispatch) => {
    cookies.remove('token');
    dispatch({
      type: 'LOGOUT_SUCCESS'
    })
    props.history.push('/')
  }

}

// export function forgotPassword(email) {
//   return (dispatch) => {
//     dispatch({
//       type: 'CLEAR_MESSAGES'
//     });
//     return fetch('/forgot', {
//       method: 'post',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ email: email })
//     }).then((response) => {
//       if (response.ok) {
//         return response.json().then((json) => {
//           dispatch({
//             type: 'FORGOT_PASSWORD_SUCCESS',
//             messages: [json]
//           });
//         });
//       } else {
//         return response.json().then((json) => {
//           dispatch({
//             type: 'FORGOT_PASSWORD_FAILURE',
//             messages: Array.isArray(json) ? json : [json]
//           });
//         });
//       }
//     });
//   };
// }

// export function resetPassword(password, confirm, pathToken) {
//   return (dispatch) => {
//     dispatch({
//       type: 'CLEAR_MESSAGES'
//     });
//     return fetch(`/reset/${pathToken}`, {
//       method: 'post',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         password: password,
//         confirm: confirm
//       })
//     }).then((response) => {
//       if (response.ok) {
//         return response.json().then((json) => {
//           <Redirect to="/login" />
//           dispatch({
//             type: 'RESET_PASSWORD_SUCCESS',
//             messages: [json]
//           });
//         });
//       } else {
//         return response.json().then((json) => {
//           dispatch({
//             type: 'RESET_PASSWORD_FAILURE',
//             messages: Array.isArray(json) ? json : [json]
//           });
//         });
//       }
//     });
//   };
// }

export function changeProfilePic(picture, token, props) {
  return (dispatch) => {
    dispatch({
      type: 'CLEAR_MESSAGES'
    });
    return fetch('/change-picture', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
       picture: picture
      })
    }).then((response) => {
      if (response.ok) {
        return response.json().then((json) => {
          dispatch({
            type: 'UPDATE_PICTURE_SUCCESS',
            messages: [json]
          });
        });
      } else {
        return response.json().then((json) => {
          dispatch({
            type: 'UPDATE_PICTURE_FAILURE',
            messages: Array.isArray(json) ? json : [json]
          });
        });
      }
    });
  };
}

export function changePassword(old_pass, password, confirm, token, props) {
  return (dispatch) => {
    dispatch({
      type: 'CLEAR_MESSAGES'
    });
    return fetch('/change-password', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        old_pass: old_pass,
        password: password,
        confirm: confirm
      })
    }).then((response) => {
      if (response.ok) {
        return response.json().then((json) => {
          cookies.remove('token');
          dispatch({
            type: 'CHANGE_PASSWORD_SUCCESS',
            messages: [json]
          });
          dispatch({
            type: 'LOGOUT_SUCCESS'
          })
          props.history.push('/login')
        });

      } else {
        return response.json().then((json) => {
          dispatch({
            type: 'CHANGE_PASSWORD_FAILURE',
            messages: Array.isArray(json) ? json : [json]
          });
        });
      }
    });
  };
}

// export function deleteAccount(token) {
//   return (dispatch) => {
//     dispatch({
//       type: 'CLEAR_MESSAGES'
//     });
//     return fetch('/account', {
//       method: 'delete',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`
//       }
//     }).then((response) => {
//       if (response.ok) {
//         return response.json().then((json) => {
//           dispatch(logout());
//           dispatch({
//             type: 'DELETE_ACCOUNT_SUCCESS',
//             messages: [json]
//           });
//         });
//       }
//     });
//   };
// }
