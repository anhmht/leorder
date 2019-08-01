import React from 'react';
import {
  Form, Button, Alert, Row, notification
} from 'antd';
import { compose } from 'recompose';
import _get from 'lodash/get';
import { func, bool } from 'prop-types';
import { connect } from 'react-redux';

import { reduxForm } from 'redux-form';
import { bindActionCreators } from 'redux';
import _pick from 'lodash/pick';
import withSizes from 'react-sizes';
import { REDUX_FORM_NAMES, ROUTER_PATHS } from '../../../../../lib/enums/general';
import ActionCreators from '/imports/ui/actions';

import InputField from '../../common/form/InputField';
import { FORM_TYPES } from '../../../../../lib/enums/form';
import { validation } from '../../../../../lib/utils/validation';
import { FACEBOOK } from '../../../../../lib/enums/facebook';

import { ROLES } from '../../../../../lib/enums/roles';
import './LoginForm.scss';

const validate = {
  email: [validation.required('Please input your E-mail')],
  password: validation.required('Please input your password'),
};

class LoginForm extends React.PureComponent {
  static propTypes = {
    handleSubmit: func.isRequired,
    closeModalWizard: func.isRequired,
    isMobile: bool.isRequired,
    routerPush: func.isRequired
  }

  state = {
    isLogging: false,
    error: '',
  }


  onSubmit = (values) => {
    this.setState({
      isLogging: true,
      error: '',
    });
    Meteor.loginWithPassword({ email: values.email }, values.password, (error) => {
      this.setState({
        isLogging: false,
      });
      if (error) {
        const reason = _get(error, 'reason', 'Invalid credentials');
        this.setState({
          error: reason,
        });
      } else {
        const { closeModalWizard } = this.props;
        const fullName = `${_get(Meteor.user(), 'profile.lastName', '')} ${_get(Meteor.user(), 'profile.firstName', '')}`;
        notification.success({
          message: 'Đăng nhập thành công',
          description: `Chào mừng ${fullName}`,
          duration: 3.0,
        });
        closeModalWizard();
        const role = _get(Meteor.user(), 'roles[0]', '');
        if (role === ROLES.ADMIN) {
          const { routerPush } = this.props;
          routerPush(ROUTER_PATHS.ADMIN_DASHBOARD);
        }
      }
    });
  }

  handleFacebookLogin = () => {
    Meteor.loginWithFacebook({
      requestPermissions: ['public_profile', 'email'],
      loginStyle: 'redirect',
      redirectUrl: FACEBOOK.REDIRECT_URL
    }, (err) => {
      if (err) {
        console.log('Handle errors here: ', err);
      }
    });
  }

  render() {
    const { handleSubmit, isMobile } = this.props;
    const { isLogging, error } = this.state;

    return (
      <div className="login-form">
        <Form className="login-form-container" onSubmit={handleSubmit(this.onSubmit)}>
          {
            error && (
              <Alert message={error} type="error" />
            )
          }
          <InputField
            name="email"
            type={FORM_TYPES.INPUT}
            label="Email"
            validate={validate.email}
            disabled={isLogging}
            placeholder="Email"
          />
          <InputField
            name="password"
            type={FORM_TYPES.PASSWORD}
            label="Password"
            placeholder="Password"
            validate={validate.password}
            disabled={isLogging}
          />
          <br />
          <Row type="flex" justify={isMobile ? 'center' : 'end'}>
            <Form.Item>
              <Button
                block={isMobile}
                className="btn-vx-primary"
                htmlType="submit"
                disabled={isLogging}
              >
                {'Login'}
              </Button>
            </Form.Item>
          </Row>
          <Row>
            <button className="loginBtn loginBtn--facebook" type="button" onClick={() => this.handleFacebookLogin()}>
            Login with Facebook
            </button>
          </Row>
        </Form>
      </div>
    );
  }
}

const mapSizesToProps = ({ width }) => ({
  isMobile: width <= 780,
});

const mapDispatchToProps = dispatch => bindActionCreators(
  _pick(ActionCreators, [
    'openModalWizard',
    'closeModalWizard',
    'routerPush',
  ]), dispatch,
);

export default compose(
  reduxForm({
    form: REDUX_FORM_NAMES.LOGIN_FORM,
  }),
  connect(null, mapDispatchToProps),
  withSizes(mapSizesToProps),
)(LoginForm);
