import React from 'react';
import {
  Table, Button, Row, Col, Menu, Dropdown, Icon, Popconfirm, notification
} from 'antd';
import {
  func, arrayOf, shape, bool
} from 'prop-types';
import ActionCreators from '/imports/ui/actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withTracker } from 'meteor/react-meteor-data';
import _pick from 'lodash/pick';
import { compose } from 'recompose';
import { Categories } from '../../../../../lib/collections';
import { MODAL_WIZARDS } from '../../../../../lib/enums/modal';

class CategoryPage extends React.PureComponent {
  static propTypes = {
    openModalWizard: func.isRequired,
    categories: arrayOf(shape()).isRequired,
    isLoading: bool.isRequired
  }

  state = {};

  handleUpdate = (_id) => {
    const { openModalWizard } = this.props;
    openModalWizard(MODAL_WIZARDS.CATEGORY, {
      _id,
      modalProps: {
        width: 650,
      }
    });
  }

  handleAddnew = () => {
    const { openModalWizard } = this.props;
    openModalWizard(MODAL_WIZARDS.CATEGORY, {
      modalProps: {
        width: 650,
      }
    });
  }

  handleDelete = (_id) => {
    Meteor.call('category.deleteCategory', _id, (error) => {
      if (error) {
        notification.error({
          message: 'Error',
          description: 'Fail when delete category',
          duration: 3.0,
        });
      } else {
        notification.success({
          message: 'Sucessful',
          description: 'Delete Sucessfully',
          duration: 3.0,
        });
      }
    });
  }

  render() {
    const { categories, isLoading } = this.props;

    const menu = _id => (
      <Menu>
        <Menu.Item>
          <a onClick={() => this.handleUpdate(_id)} href="javascrip:;">
            Update
          </a>
        </Menu.Item>
        <Menu.Item>
          <Popconfirm title="Do you want to delete this category?" onConfirm={() => this.handleDelete(_id)} okText="Confirm" cancelText="Cancel">
            <a href="javascrip:;">
            Delete
            </a>
          </Popconfirm>

        </Menu.Item>
      </Menu>
    );

    const columns = [
      {
        title: 'Category Name',
        dataIndex: 'categoryName',
        key: 'categoryName',
      }, {
        title: 'Category Code',
        dataIndex: 'code',
        key: 'code',
      }, {
        title: 'Action',
        dataIndex: '_id',
        key: 'actions',
        render: _id => (
          <Dropdown overlay={menu(_id)}>
            <Icon style={{ fontSize: '30px' }} type="more" />
          </Dropdown>
        )
      },
    ];
    return (
      <div>
        <Row>
          <Col span={12}><h2>Category</h2></Col>
          <Col span={11} offset={1} style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={this.handleAddnew} htmlType="button" type="primary">Add New</Button>
          </Col>
        </Row>
        <Table
          rowKey={record => record._id}
          pagination={{
            defaultCurrent: 1,
            defaultPageSize: 20,
            total: categories.length,
          }}
          loading={isLoading}
          columns={columns}
          dataSource={categories}
        />
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => bindActionCreators(
  _pick(ActionCreators, [
    'openModalWizard',
  ]), dispatch,
);

export default compose(
  connect(null, mapDispatchToProps),
  withTracker(() => {
    const handleSub = Meteor.subscribe('category.getListCategory');
    let categories = [];
    if (handleSub.ready()) {
      categories = Categories.find({}, {
        sort: {
          createdAt: -1
        }
      }).fetch();
    }
    return {
      categories,
      isLoading: !handleSub.ready(),
    };
  }),
)(CategoryPage);
