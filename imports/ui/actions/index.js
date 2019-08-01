import * as routerActions from './router';
import * as modalActions from './modal';

export const ActionCreators = Object.assign({},
  modalActions,
  routerActions);

export default ActionCreators;
