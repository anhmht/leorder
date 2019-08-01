import * as types from '../../types';

const inititalState = {
  visible: false,
  modalWizard: null,
  options: null,
};
export default function modalReducer(state = inititalState, action) {
  switch (action.type) {
    case types.OPEN_MODAL: {
      return {
        ...state,
        visible: true,
        modalWizard: action.payload.modalWizard,
        options: action.payload.options,
      };
    }
    case types.CLOSE_MODAL: {
      return {
        ...state,
        visible: false,
        modalWizard: null,
        options: null,
      };
    }
    default: return state;
  }
}
