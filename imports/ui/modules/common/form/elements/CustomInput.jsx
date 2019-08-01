import React from 'react';
import { Form, Input } from 'antd';

export default class CustomInput extends React.PureComponent {
  render() {
    const {
      input, label, formitemlayout,
      meta: { touched, error },
      ...rest
    } = this.props;
    const propsFormItem = {};
    if (touched) {
      propsFormItem.validateStatus = error ? 'error' : 'success';
      if (error) {
        propsFormItem.help = error;
      }
    }

    return (
      <Form.Item
        {...propsFormItem}
        label={label}
        {...formitemlayout}
      >
        <Input {...input} {...rest} />
      </Form.Item>
    );
  }
}
