import React from 'react';
import { Modal, Icon, Button } from 'antd';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ActionCreators from '/imports/ui/actions';
import _pick from 'lodash/pick';
import _get from 'lodash/get';
import withSizes from 'react-sizes';
import {
  bool, string, shape, func
} from 'prop-types';
import { withCurrentUserContext } from '../route/AppWrapper';


import { MODAL_WIZARDS, MODAL_WIZARDS_DEFAULT_TITLE, MODAL_WIZARDS_DEFAULT_ICON } from '../../../../../lib/enums/modal';

import RegisterForm from '../../user/modules/RegisterForm';
import LoginForm from '../../user/modules/LoginForm';
import CategoryForm from '../../category/components/CategoryForm';
import ProductForm from '../../product/components/ProductForm';

const ListWizard = {
  [MODAL_WIZARDS.ADD_USER]: RegisterForm,
  [MODAL_WIZARDS.LOGIN]: LoginForm,
  [MODAL_WIZARDS.CATEGORY]: CategoryForm,
  [MODAL_WIZARDS.PRODUCT]: ProductForm,
};

class GeneralModal extends React.PureComponent {
  static propTypes = {
    visible: bool.isRequired,
    modalWizard: string,
    options: shape(),
    closeModalWizard: func.isRequired,
    isMobile: bool.isRequired,
  }

  static defaultProps = {
    modalWizard: null,
    options: null,
  }

  closeModal = () => {
    const { closeModalWizard } = this.props;
    closeModalWizard();
  }

  onOkButtonClickHandler = () => {
    const { options } = this.props;
    const modalPropsFromOption = _get(options, 'modalProps');
    modalPropsFromOption.onOkHandler();
    this.closeModal();
  }


  render() {
    const {
      visible, modalWizard, options, isMobile
    } = this.props;
    const title = _get(options, 'title') || MODAL_WIZARDS_DEFAULT_TITLE[modalWizard];
    const icon = _get(options, 'icon') || MODAL_WIZARDS_DEFAULT_ICON[modalWizard];
    const isFullScreen = _get(options, 'isFullscreen', true);
    const defaultPropsModal = {
      width: 520,
    };
    const modalPropsFromOption = _get(options, 'modalProps', defaultPropsModal);
    const ModalComponent = ListWizard[modalWizard];

    const showFooterModal = _get(modalPropsFromOption, 'showFooterModal');
    const okText = _get(modalPropsFromOption, 'okText');
    const cancelText = _get(modalPropsFromOption, 'cancelText');
    const centered = _get(modalPropsFromOption, 'centered');

    const maskClosable = _get(options, 'maskClosable', true);

    const modalProps = {
      ...defaultPropsModal,
      ...(modalPropsFromOption || {})
    };

    return (
      <div className="general-modal">
        <Modal
          wrapClassName={(isFullScreen && visible) ? 'modal-fullscreen' : ''}
          maskClosable={!maskClosable ? maskClosable : (isFullScreen !== true)}
          centered={centered || false}
          style={isMobile && ({ top: '0px' })}
          visible={visible}
          onCancel={this.closeModal}
          footer={showFooterModal ? [
            <div key="footer">
              <Button key="back" onClick={this.closeModal}>{cancelText || 'No'}</Button>
              <Button key="submit" onClick={this.onOkButtonClickHandler}>{okText || 'Yes'}</Button>
            </div>
          ] : null}
          title={(
            <span>
              {
                icon && (
                  <Icon type={icon} />
                )
              }
              <span className="general-modal__title">{title}</span>
            </span>
          )}
          {...modalProps}
        >
          <div className="general-modal__body">
            {
            ModalComponent && (
              <ModalComponent
                {...this.props}
                inModal
                closeModal={this.closeModal}
              />
            )
          }
          </div>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const modalState = state.modal;
  return {
    visible: modalState.visible,
    modalWizard: modalState.modalWizard,
    options: modalState.options,
  };
};

const mapDispatchToProps = dispatch => bindActionCreators(_pick(ActionCreators, ['closeModalWizard']), dispatch);

const mapSizesToProps = ({ width }) => ({
  isMobile: width <= 780,
});


export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withSizes(mapSizesToProps),
  withCurrentUserContext
)(GeneralModal);
