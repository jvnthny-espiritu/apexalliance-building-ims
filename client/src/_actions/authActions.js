import * as ActionTypes from './ActionTypes';
import api from '../services/api';

export const loginSuccess = (token) => ({
  type: ActionTypes.LOGIN_SUCCESS,
  payload: token
});

export const loginFailure = (error) => ({
  type: ActionTypes.LOGIN_FAILURE,
  payload: error
});

export const logout = () => ({
  type: ActionTypes.LOGOUT
});

export const login = (credentials) => async (dispatch) => {
  try {
    const response = await api.post('/login', credentials);
    const { success, message, token } = response.data;
    if (success) {  
      dispatch(loginSuccess(token));
      return { success, message, token };
    } else {
      dispatch(loginFailure(message));
      return { success, message, token };
    }
  } catch (error) {
    dispatch(loginFailure('Login failed'));
    return { success: false, message: 'Login failed' };
  }
};
