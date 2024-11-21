import { jwtDecode } from 'jwt-decode';
import api from '../services/api';

export const login = (credentials) => async (dispatch) => {
  try {
    const response = await api.post('/api/users/login', credentials);
    // console.log('Login response:', response.data);
    const { token } = response.data;
    const decodedToken = jwtDecode(token);
    dispatch({ type: 'LOGIN_SUCCESS', payload: token });
    dispatch(fetchUserById(decodedToken.id));
    return { success: true, token };
  } catch (error) {
      const errorMessage = error.response ? error.response.data : 'Network error';
    dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
    return { success: false, error: errorMessage };
  }
};

export const fetchUserById = (id) => async (dispatch) => {
  try {
    const response = await api.get(`/api/users/${id}`);
    dispatch({ type: 'FETCH_USER_SUCCESS', payload: response.data });
    return { success: true, user: response.data };
  } catch (error) {
    const errorMessage = error.response ? error.response.data : 'Network error';
    dispatch({ type: 'FETCH_USER_FAILURE', payload: errorMessage });
    return { success: false, error: errorMessage };
  }
};

export const rehydrateAuth = () => async (dispatch) => {
  const token = localStorage.getItem('token');
  if (token) {
    const decodedToken = jwtDecode(token);
    dispatch({ type: 'LOGIN_SUCCESS', payload: token });
    dispatch(fetchUserById(decodedToken.id));
    setLogoutTimer(dispatch, decodedToken.exp);
  }
};

const setLogoutTimer = (dispatch, exp) => {
  const currentTime = Date.now() / 1000;
  const timeout = (exp - currentTime) * 1000;
  setTimeout(() => {
    dispatch(logout());
  }, timeout);
};

export const logout = () => (dispatch) => {
  localStorage.removeItem('token');
  dispatch({ type: 'LOGOUT' });
  window.location.href = '/login';
};