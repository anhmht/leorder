import React from 'react';
import { string, shape } from 'prop-types';

import { Field } from 'redux-form';
import { FORM_TYPES } from '../../../../../lib/enums/form';

import CustomInput from './elements/CustomInput';
import CustomPassword from './elements/CustomPassword';
import CustomSelect from './elements/CustomSelect';
import CustomCheckBox from './elements/CustomCheckBox';
import CustomRadioGroup from './elements/CustomRadioGroup';
import CustomSearchInput from './elements/CustomSearchInput';
import CustomInputNumber from './elements/CustomInputNumber';
import CustomDatePicker from './elements/CustomDatePicker';
import CustomAutoCompleteInput from './elements/CustomAutoCompleteInput';
import CustomTextArea from './elements/CustomTextArea';

const typeComponents = {
  [FORM_TYPES.INPUT]: CustomInput,
  [FORM_TYPES.PASSWORD]: CustomPassword,
  [FORM_TYPES.SELECT]: CustomSelect,
  [FORM_TYPES.CHECKBOX]: CustomCheckBox,
  [FORM_TYPES.RADIO_GROUP]: CustomRadioGroup,
  [FORM_TYPES.SEARCH]: CustomSearchInput,
  [FORM_TYPES.NUMBER_INPUT]: CustomInputNumber,
  [FORM_TYPES.DATE_PICKER]: CustomDatePicker,
  [FORM_TYPES.AUTO_COMPLETE]: CustomAutoCompleteInput,
  [FORM_TYPES.TEXT_AREA]: CustomTextArea,
};

export default class InputField extends React.PureComponent {
  static propTypes = {
    type: string.isRequired,
    name: string.isRequired,
    formitemlayout: shape(),
  }

  static defaultProps = {
    formitemlayout: {},
  }

  render() {
    const { type, name, formitemlayout } = this.props;
    const customComponent = typeComponents[type];
    return (
      <Field
        {...(this.props)}
        name={name}
        component={customComponent}
        formitemlayout={formitemlayout}
      />
    );
  }
}
