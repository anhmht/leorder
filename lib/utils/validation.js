import _isEmpty from 'lodash/isEmpty';
import _isNumber from 'lodash/isNumber';
import moment from 'moment';

export const VALIDATE_PATTERN = {
  EMAIL: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
};

export const validation = {
  required: (message = 'Required') => value => (_isEmpty(value) && !_isNumber(value)) && message,
  email: (message = 'The input is not valid E-mail!') => (value) => {
    if (value) return ((!VALIDATE_PATTERN.EMAIL.test(value)) ? message : undefined);
    return undefined;
  },
  hasSpecialChar: (message = 'Data should not include special character') => value => ((/\W|_/g).test(value)) && message,
  password: (message = 'Password must contains at least 6 letters') => value => ((value || '').length < 6 ? message : undefined),
  phone: (message = 'Incorect phone number') => (value) => {
    if (!value) {
      return undefined;
    }
    if (value.includes(' ')) {
      value = value.split(' ').join('');
    }
    if ((!/^\d{9,15}$/i.test(value))) {
      return message;
    }
    return undefined;
  },
  categoryCode: (message = 'Code must begin with 2 upper case letter') => (value) => {
    if (value) return ((!/^[A-Z]{2}/.test(value)) ? message : undefined);
    return undefined;
  },
  minLength: (length = 0, message) => (value) => {
    if (value === undefined || value === null) return undefined;
    return value.length >= length ? undefined : message || `The input must contains at least ${length} characters`;
  },
  maxLength: (length = 10, message) => (value) => {
    if (value === undefined || value === null) return undefined;
    return value.length <= length ? undefined : message || `The input only contains maximum ${length} characters`;
  },
  gte: (gteNumber = 0, message) => (value) => {
    if (value === undefined || value === null) return undefined;
    return value >= gteNumber ? undefined : message || `Giá trị phải lớn hơn hoặc bằng ${gteNumber}`;
  },
  gt: (gtNumber = 0) => (value) => {
    if (value === undefined || value === null) return undefined;
    return value > gtNumber ? undefined : `Giá trị phải lớn hơn ${gtNumber}`;
  },
  date: (message = 'Ngày không hợp lệ') => value => !moment(value).isValid() && message,
  isNumber: (message = 'Không phải số') => (value) => {
    if (value === undefined || value === null) return undefined;
    const number = Number(value);
    if (Number.isNaN(number)) {
      return message;
    } return undefined;
  },
  trim: () => (value) => {
    if (value === undefined || value === null) return undefined;
    if (_isNumber(value)) return undefined;
    return value.charAt(value.length - 1) !== ' ' && value.charAt(0) !== ' ' ? undefined : 'Please delete space from at the begining or at the end of the input';
  },
  isInterger: (message = 'Hãy nhập số nguyên') => (value) => {
    if (value === undefined || value === null) return undefined;
    if (Number.isInteger(Number(value))) {
      return undefined;
    } return message;
  }
};
