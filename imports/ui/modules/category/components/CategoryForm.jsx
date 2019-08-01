import React from 'react';
import {
  Form, Button, Row, notification
} from 'antd';
import { compose } from 'recompose';
import _get from 'lodash/get';
import { func } from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { bindActionCreators } from 'redux';
import _pick from 'lodash/pick';
import { REDUX_FORM_NAMES } from '../../../../../lib/enums/general';
import ActionCreators from '/imports/ui/actions';
import InputField from '../../common/form/InputField';
import { FORM_TYPES } from '../../../../../lib/enums/form';
import { validation } from '../../../../../lib/utils/validation';

const validate = {
  categoryName: [validation.required('Please input category name')],
  categoryCode: [validation.required('Please input category code'), validation.categoryCode(), validation.minLength(2), validation.maxLength(2)]
};

class CategoryForm extends React.PureComponent {
  static propTypes = {
    handleSubmit: func.isRequired,
    closeModalWizard: func.isRequired,
    initialize: func.isRequired
  }

  state = {
    isLoading: false,
  }

  componentDidMount() {
    const categoryId = _get(this.props, 'options._id');
    if (categoryId) {
      this.setState({
        isLoading: true,
      });
      Meteor.call('category.getCategoryById', categoryId, (error, category) => {
        this.setState({
          isLoading: false
        });
        if (error) {
          notification.error({
            message: 'Error',
            description: 'Fail when get category',
            duration: 3.0,
          });
        } else {
          const { initialize } = this.props;
          initialize(category);
        }
      });
    }
  }

  onSubmit = (values) => {
    const categoryId = _get(this.props, 'options._id');
    this.setState({
      isLoading: true,
    });
    if (categoryId) {
      Meteor.call('category.updateCategory', categoryId, values, (error) => {
        this.setState({
          isLoading: false
        });
        if (error) {
          notification.error({
            message: 'Error',
            description: 'Fail when update category',
            duration: 3.0,
          });
        } else {
          const { closeModalWizard } = this.props;
          notification.success({
            message: 'Sucessful',
            description: `Update ${values.categoryName} Sucessfully`,
            duration: 3.0,
          });
          closeModalWizard();
        }
      });
      return;
    }
    Meteor.call('category.addNewCategory', values, (error) => {
      this.setState({
        isLoading: false
      });
      if (error) {
        notification.error({
          message: 'Error',
          description: 'Fail when insert category',
          duration: 3.0,
        });
      } else {
        const { closeModalWizard } = this.props;
        notification.success({
          message: 'Sucessful',
          description: `Create ${values.categoryName} Sucessfully`,
          duration: 3.0,
        });
        closeModalWizard();
      }
    });
  }

  render() {
    const { handleSubmit } = this.props;
    const { isLoading } = this.state;
    const categoryId = _get(this.props, 'options._id');
    return (
      <div className="category-form">
        <Form onSubmit={handleSubmit(this.onSubmit)}>
          <InputField
            name="categoryName"
            type={FORM_TYPES.INPUT}
            label="Category Name"
            validate={validate.categoryName}
            disabled={isLoading}
            placeholder="Category Name"
          />
          <InputField
            name="code"
            type={FORM_TYPES.INPUT}
            label="Category Code"
            validate={validate.categoryCode}
            disabled={isLoading}
            placeholder="Category Code: SN, PO, PR"
          />
          <br />
          <Row type="flex" justify="end">
            <Form.Item>
              <Button
                htmlType="submit"
                type="primary"
                disabled={isLoading}
              >
                {categoryId ? 'Update' : 'Add new'}
              </Button>
            </Form.Item>
          </Row>
        </Form>
      </div>
    );
  }
}


const mapDispatchToProps = dispatch => bindActionCreators(
  _pick(ActionCreators, [
    'closeModalWizard',
  ]), dispatch,
);

export default compose(
  reduxForm({
    form: REDUX_FORM_NAMES.CATEGORY_FORM,
  }),
  connect(null, mapDispatchToProps),
)(CategoryForm);
