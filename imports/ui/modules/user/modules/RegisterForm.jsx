import React from 'react';
import {
  Form, Button, Row, notification, Icon, Alert
} from 'antd';
import { reduxForm } from 'redux-form';
import { compose } from 'recompose';
import { Meteor } from 'meteor/meteor';
import { func } from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _pick from 'lodash/pick';
import _set from 'lodash/set';
import _get from 'lodash/get';
import { FORM_TYPES } from '../../../../../lib/enums/form';
import { validation } from '../../../../../lib/utils/validation';
import { REDUX_FORM_NAMES } from '../../../../../lib/enums/general';
import ActionCreators from '/imports/ui/actions';
import InputField from '../../common/form/InputField';


const fieldsName = {
  FIRST_NAME: 'profile.firstName',
  LAST_NAME: 'profile.lastName',
  EMAIL: 'email',
  PASSWORD: 'password',
  CONFIRM_PASSWORD: 'confirmPassword',
  PHONE: 'profile.phoneNumber',
  ADDRESS: 'profile.address'
};

const validate = {
  [fieldsName.EMAIL]: [validation.required('Please input your email'), validation.email()],
  [fieldsName.FIRST_NAME]: [validation.required('Please input your first name'), validation.trim()],
  [fieldsName.LAST_NAME]: [validation.required('Please input your last name'), validation.trim()],
  [fieldsName.PASSWORD]: [validation.required('Please input your password'), validation.password()],
  [fieldsName.PHONE]: [validation.required('Please input your phone number'), validation.phone()],
  [fieldsName.ADDRESS]: [validation.required('Please input your address'), validation.trim()],
  [fieldsName.CONFIRM_PASSWORD]: [validation.required('Please confirm your password')],
};

const validator = (values) => {
  const { confirmPassword, password } = values;
  const validateForm = {
    ...validate,
  };
  const errors = {};
  Object.keys(validateForm).forEach((field) => {
    const validations = validateForm[field] || [];
    validations.forEach((validateFunc) => {
      if (!_get(errors, field)) {
        const value = _get(values, field);
        const error = validateFunc(value);
        if (error) {
          _set(errors, field, error);
        }
      }
    });
  });
  if (!errors.confirmPassword) {
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Password is not match';
    }
  }
  return errors;
};

class RegisterForm extends React.PureComponent {
  static propTypes = {
    handleSubmit: func.isRequired,
    closeModalWizard: func.isRequired,
  }

  state = {
    isLoading: false,
    error: '',
  }

  onSubmit = (values) => {
    this.setState({
      isLoading: true,
      error: '',
    });
    Meteor.call('user.register', values, (error) => {
      if (error) {
        const reason = _get(error, 'reason', 'Invalid credentials');
        this.setState({
          isLoading: false,
          error: reason,
        });
        notification.error({
          message: 'Error',
          description: 'Fail when create user',
          duration: 3,
        });
      } else {
        Meteor.loginWithPassword({ email: values.email }, values.password, (err) => {
          this.setState({
            isLoading: false,
          });
          if (err) {
            notification.error({
              message: 'Error',
              description: 'Fail when login user',
              duration: 3,
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
          }
        });
      }
    });
  }

  render() {
    const { handleSubmit } = this.props;
    const { isLoading, error } = this.state;
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
    };
    return (
      <div>
        {
            error && (
              <Alert message={error} type="error" />
            )
          }
        <Form className="register-form" onSubmit={handleSubmit(this.onSubmit)}>
          <InputField
            autoComplete="off"
            name={fieldsName.EMAIL}
            type={FORM_TYPES.INPUT}
            label="Email"
            placeholder="example@mail.com"
            formitemlayout={formItemLayout}
          />
          <InputField
            autoComplete="off"
            name={fieldsName.PASSWORD}
            type={FORM_TYPES.PASSWORD}
            label="Password"
            placeholder="Password"
            formitemlayout={formItemLayout}
          />
          <InputField
            autoComplete="off"
            name={fieldsName.CONFIRM_PASSWORD}
            type={FORM_TYPES.PASSWORD}
            label="Confirm Password"
            placeholder="Confirm Password"
            formitemlayout={formItemLayout}
          />
          <InputField
            autoComplete="off"
            name={fieldsName.FIRST_NAME}
            type={FORM_TYPES.INPUT}
            label="First Name"
            placeholder="First Name"
            formitemlayout={formItemLayout}
          />
          <InputField
            autoComplete="off"
            name={fieldsName.LAST_NAME}
            type={FORM_TYPES.INPUT}
            label="Last Name"
            placeholder="Last Name"
            formitemlayout={formItemLayout}
          />
          <InputField
            autoComplete="off"
            name={fieldsName.PHONE}
            type={FORM_TYPES.INPUT}
            label="Phone Number"
            placeholder="Phone Number"
            formitemlayout={formItemLayout}
          />
          <InputField
            autoComplete="off"
            name={fieldsName.ADDRESS}
            type={FORM_TYPES.INPUT}
            label="Address"
            placeholder="Address"
            formitemlayout={formItemLayout}
          />
          <Row type="flex" justify="end">
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                disabled={isLoading}
              >
                {isLoading ? (<Icon type="loading" />) : 'Register'}
              </Button>
            </Form.Item>
          </Row>
        </Form>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => bindActionCreators(
  _pick(ActionCreators, [
    'closeModalWizard',
  ]), dispatch,
);

export default compose(
  reduxForm({
    form: REDUX_FORM_NAMES.REGISTER_FORM,
    validate: validator,
  }),
  connect(null, mapDispatchToProps),
)(RegisterForm);
