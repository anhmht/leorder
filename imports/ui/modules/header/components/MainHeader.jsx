import React from 'react';
import {
  Layout, Button, Avatar
} from 'antd';
import { func, string, shape } from 'prop-types';
import ActionCreators from '/imports/ui/actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _pick from 'lodash/pick';
import _get from 'lodash/get';
import { compose } from 'recompose';
import './MainHeader.scss';
import { MODAL_WIZARDS } from '../../../../../lib/enums/modal';
import { withCurrentUserContext } from '../../common/route/AppWrapper';

const {
  Header
} = Layout;

class MainHeader extends React.PureComponent {
  static propTypes = {
    openModalWizard: func.isRequired,
    userId: string,
    userData: shape(),
  }

  static defaultProps = {
    userId: '',
    userData: {}
  }

  state = {
  };

  render() {
    return (
      <div>
        <Header className="header-container">
          <div className="main-header">
            <div className="header-logo">
              <img alt="leorder-log" src="assets/img/Logo_LeOrder_01.png" />
            </div>
            <div className="header-menu">
              <div className="main-menu">
                <a className="main-menu-link" href="#">Hướng dẫn</a> {/*eslint-disable-line */}
                {' | '}
                <a className="main-menu-link" href="#">Dịch vụ</a> {/*eslint-disable-line */}
                {' | '}
                <a className="main-menu-link" href="#">Đăng nhập / Đăng ký</a> {/*eslint-disable-line */}
              </div>
              <div className="menu-button">
                <Button icon="shopping-cart">
                  Kiểm tra đơn hàng
                </Button>
              </div>
            </div>
          </div>
        </Header>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => bindActionCreators(
  _pick(ActionCreators, [
    'openModalWizard',
  ]), dispatch,
);

export default compose(
  connect(null, mapDispatchToProps),
  withCurrentUserContext
)(MainHeader);
