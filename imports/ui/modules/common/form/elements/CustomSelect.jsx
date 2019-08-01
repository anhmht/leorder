import React from 'react';
import {
  shape, string, arrayOf, func
} from 'prop-types';
import { Form, Select } from 'antd';

const { Option } = Select;

export default class CustomSelect extends React.PureComponent {
  static propTypes = {
    input: shape().isRequired,
    label: string,
    meta: shape().isRequired,
    options: arrayOf(shape()).isRequired,
    handleChange: func,
    formitemlayout: shape()
  }

  static defaultProps = {
    label: '',
    handleChange: () => {},
    formitemlayout: {}
  }

  handleChange = (value) => {
    const { input, handleChange } = this.props;
    input.onChange(value);
    handleChange();
  };

  render() {
    const {
      input, label,
      meta: { touched, error },
      options = [],
      formitemlayout,
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
        <Select
          style={{ width: '100%' }}
          {...input}
          {...rest}
          value={input.value ? input.value : undefined}
          onChange={this.handleChange}
        >
          {
            options.map(option => (
              <Option key={option.value} value={option.value}>{option.label}</Option>
            ))
          }

        </Select>
      </Form.Item>
    );
  }
}
