import jwtDecode from 'jwt-decode';

const initialState = {
  token: null,
  user: null,
  error: null,
  isLoggedIn: false,
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        token: action.payload,
        error: null,
        isLoggedIn: true,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        token: null,
        user: null,
        error: action.payload,
        isLoggedIn: false,
      };
    case 'FETCH_USER_SUCCESS':
      return {
        ...state,
        user: action.payload,
      };
    case 'FETCH_USER_FAILURE':
      return {
        ...state,
        user: null,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        token: null,
        user: null,
        error: null,
        isLoggedIn: false,
      };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
}