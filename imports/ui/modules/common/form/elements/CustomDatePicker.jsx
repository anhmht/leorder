import React from 'react';
import moment from 'moment';
import { Form, DatePicker } from 'antd';
import _set from 'lodash/set';
import viVN from 'antd/lib/date-picker/locale/vi_VN';

const datePickerText = _set(viVN, 'lang.ok', 'Chọn');

export default class CustomDatePicker extends React.PureComponent {
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
        <DatePicker
          style={{ width: '100%' }}
          {...input}
          {...rest}
          value={moment(input.value).isValid() ? moment(input.value) : null}
          locale={datePickerText}
        />
      </Form.Item>
    );
  }
}
