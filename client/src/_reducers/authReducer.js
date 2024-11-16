const initialState = {
  user: null,
  error: null,
  isLoggedIn: !!localStorage.getItem('token'),
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        error: null,
        isLoggedIn: true,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
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