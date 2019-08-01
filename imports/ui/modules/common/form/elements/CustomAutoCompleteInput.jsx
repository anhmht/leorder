import React from 'react';
import { Form, AutoComplete } from 'antd';

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
        <AutoComplete {...input} {...rest} />
      </Form.Item>
    );
  }
}
