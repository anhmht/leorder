import React from 'react';
import { Form, InputNumber } from 'antd';

export default class CustomInputNumber extends React.PureComponent {
  handleBlur = () => {
    const { input } = this.props;
    input.onBlur();
  };

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
        <InputNumber style={{ width: '100%' }} {...input} {...rest} onBlur={this.handleBlur} />
      </Form.Item>
    );
  }
}
