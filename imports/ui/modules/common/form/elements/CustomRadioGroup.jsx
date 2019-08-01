import React from 'react';
import { Form, Input, Radio } from 'antd';
import {
  shape, string, arrayOf, func
} from 'prop-types';

const { Group: RadioGroup } = Radio;

export default class CustomRadioGroup extends React.PureComponent {
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
      input, label, formitemlayout,
      meta: { touched, error },
      options = [],
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
        <RadioGroup {...input} {...rest} value={input.value ? input.value : undefined} onChange={this.handleChange}>
          {
            options.map(option => (
              <Radio key={option.value} value={option.value}>{option.label}</Radio>
            ))
          }
        </RadioGroup>
      </Form.Item>
    );
  }
}
