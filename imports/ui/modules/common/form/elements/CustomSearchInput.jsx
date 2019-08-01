import React from 'react';
import { Form, Input } from 'antd';

export default class CustomSearchInput extends React.PureComponent {
  render() {
    const {
      input, label,
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
      >
        <Input.Search {...input} {...rest} />
      </Form.Item>
    );
  }
}
