import React from 'react';
import { Form, Checkbox } from 'antd';

export default class CustomCheckBox extends React.PureComponent {

  render() {
    const {
      input, label,
      meta: { touched, error },
      ...rest
    } = this.props;
    const propsFormItem = {};
    if (touched) {
      propsFormItem.validateStatus = error ? 'error': 'success';
      if (error) {
        propsFormItem.help = error;
      }
    }

    return (
      <Form.Item
        {...propsFormItem}
        label={label}
      >
        <Checkbox {...input} {...rest} />
      </Form.Item>
    )
  }
}