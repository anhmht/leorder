import { reducer as formReducer } from 'redux-form';
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import modalReducer from './modal';

export default function createRootReducer(history) {
  return combineReducers({
    router: connectRouter(history),
    form: formReducer,
    modal: modalReducer,
  });
}
