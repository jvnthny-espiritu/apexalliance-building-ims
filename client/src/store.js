import { createStore, applyMiddleware, combineReducers } from 'redux';
import { thunk } from 'redux-thunk';
import authReducer from './_reducers/authReducer';
import { rehydrateAuth } from './_actions/authActions';

const rootReducer = combineReducers({
  auth: authReducer
});

const store = createStore(rootReducer, applyMiddleware(thunk));

// Rehydrate auth state from local storage
store.dispatch(rehydrateAuth());

export default store;
