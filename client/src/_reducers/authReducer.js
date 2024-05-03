import * as ActionTypes from '../_actions/ActionTypes';
import { jwtDecode } from 'jwt-decode';

const initialState = {
  token: localStorage.getItem('token') || null,
  isLoggedIn: !!localStorage.getItem('token'),
  user: null,
  error: null
};

const decodeToken = (token) => {
  try {
    return jwtDecode(token);
  } catch (error) {
    return null;
  }
};

initialState.user = initialState.token ? decodeToken(initialState.token) : null;

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.LOGIN_SUCCESS:
      const user = decodeToken(action.payload); 
      return {
        ...state,
        isLoggedIn: true,
        token: action.payload,
        user,
        error: null
      };
    case ActionTypes.LOGIN_FAILURE:
      return {
        ...state,
        isLoggedIn: false,
        token: null,
        user: null,
        error: action.payload
      };
    case ActionTypes.LOGOUT:
      return {
        ...state,
        isLoggedIn: false,
        token: null,
        user: null,
        error: null
      };
    default:
      return state;
  }
};

export default authReducer;