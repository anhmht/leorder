import * as types from '../types';

export const openModalWizard = (modalWizard, options) => ({
  type: types.OPEN_MODAL,
  payload: {
    modalWizard,
    options,
  }
});

export const closeModalWizard = () => ({
  type: types.CLOSE_MODAL,
});
