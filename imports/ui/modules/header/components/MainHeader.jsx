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

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = () => {
    const scrollTop = window.pageYOffset;

    this.setState({
      headerBg: !scrollTop ? '' : 'header-bg'
    });
  };

  handleRegister = () => {
    const { openModalWizard } = this.props;

    openModalWizard(MODAL_WIZARDS.ADD_USER, {
      modalProps: {
        width: 650,
      }
    });
  }

  handleLogin = () => {
    const { openModalWizard, role } = this.props;

    openModalWizard(MODAL_WIZARDS.LOGIN, {
      role,
      modalProps: {
        width: 500,
      }
    });
  }

  handleLogout =() => {
    Meteor.logout();
  }

  render() {
    const { userId, userData } = this.props;
    const { headerBg } = this.state;
    const fullName = `${_get(userData, 'profile.firstName', '')} ${_get(userData, 'profile.lastName', '')}`;
    return (
      <div>
        <Header className="header-container">
          <div className={`header-title ${headerBg}`}>rich-kid.club</div>
          {
            userId
              ? (
                <React.Fragment>
                  <Avatar src={userData.profile.avatar ? userData.profile.avatar : null} shape="square" size={64} icon="user" />
                  {fullName}
                  <Button onClick={() => this.handleLogout()}>
                    {'Logout'}
                  </Button>
                </React.Fragment>
              )
              : (
                <React.Fragment>
                  <Button onClick={() => this.handleLogin()}>
                    {'Login'}
                  </Button>
                  <Button onClick={() => this.handleRegister()}>
                    {'Register'}
                  </Button>
                </React.Fragment>
              )
          }
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
