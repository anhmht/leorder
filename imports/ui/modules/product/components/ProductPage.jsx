import React from 'react';
import {
  List, Tooltip, Button, Row, Col, Menu, Dropdown, Icon, Popconfirm, notification, Comment
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
import moment from 'moment';
import { Products, Categories } from '../../../../../lib/collections';
import { MODAL_WIZARDS } from '../../../../../lib/enums/modal';
import './ProductPage.scss';

class ProductPage extends React.PureComponent {
  static propTypes = {
    openModalWizard: func.isRequired,
    products: arrayOf(shape()).isRequired,
    categories: arrayOf(shape()).isRequired,
    listAdmin: arrayOf(shape()).isRequired,
    isLoading: bool.isRequired
  }

  state = {};

  handleUpdate = (_id) => {
    const { openModalWizard } = this.props;
    openModalWizard(MODAL_WIZARDS.PRODUCT, {
      _id,
      modalProps: {
        width: 1050,
      }
    });
  }

  handleAddnew = () => {
    const { openModalWizard } = this.props;
    openModalWizard(MODAL_WIZARDS.PRODUCT, {
      modalProps: {
        width: 1050,
      }
    });
  }

  handleDelete = (_id) => {
    Meteor.call('product.deleteProduct', _id, (error) => {
      if (error) {
        notification.error({
          message: 'Error',
          description: 'Fail when delete product',
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

  mapCategory = (categoryId) => {
    const { categories } = this.props;
    return categories.filter(category => category._id === categoryId).map(category => category.categoryName);
  }

  mapAdmin = (userId) => {
    const { listAdmin } = this.props;
    const admin = listAdmin.filter(user => user._id === userId).map(user => ({
      name: user.profile.lastName + user.profile.firstName,
      avatar: user.profile.avatar
    }));
    return admin;
  }

  render() {
    const { products, isLoading } = this.props;

    const menu = _id => (
      <Menu>
        <Menu.Item>
          <a onClick={() => this.handleUpdate(_id)} href="javascrip:;">
            Update
          </a>
        </Menu.Item>
        <Menu.Item>
          <Popconfirm title="Do you want to delete this category?" onConfirm={() => this.handleDelete(_id)} okText="Confirm" cancelText="Cancel">
            <a target="_blank" rel="noopener noreferrer" href="javascrip:;">
            Delete
            </a>
          </Popconfirm>

        </Menu.Item>
      </Menu>
    );
    return (
      <div className="product-page">
        <Row>
          <Col span={12}><h2>Product</h2></Col>
          <Col span={11} offset={1} style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={this.handleAddnew} htmlType="button" type="primary">Add New</Button>
          </Col>
        </Row>
        <List
          loading={isLoading}
          itemLayout="horizontal"
          dataSource={products}
          pagination={{
            pageSize: 5,
          }}
          renderItem={item => (
            <List.Item
              actions={[
                <Dropdown overlay={menu(item._id)}>
                  <Icon style={{ fontSize: '30px' }} type="more" />
                </Dropdown>]}
            >
              <List.Item.Meta
                avatar={(
                  <React.Fragment>
                    <img
                      style={{ width: 200 }}
                      alt={item.title}
                      src={item.rawBgUrl}
                    />
                  </React.Fragment>
                )}
                title={`${item.code} - ${item.title} - ${this.mapCategory(item.categoryId)}`}
                description={(
                  <div className="product-page__description">

                    {item.description}
                    <Comment
                      avatar={this.mapAdmin(item.createdBy).avatar ? this.mapAdmin(item.createdBy).avatar : '/favicon.png'}
                      author={this.mapAdmin(item.createdBy).name ? `Created By ${this.mapAdmin(item.createdBy).name}` : 'Created By Whammy HypeBeast'}
                      datetime={(
                        <Tooltip title={moment(new Date(item.createdAt)).format('YYYY-MM-DD HH:mm:ss')}>
                          <span>{moment(new Date(item.createdAt)).fromNow()}</span>
                        </Tooltip>
                      )}
                    />
                  </div>
                )}
              />
            </List.Item>
          )}
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
    const handles = [
      Meteor.subscribe('product.getListProduct'),
      Meteor.subscribe('category.getListCategory'),
      Meteor.subscribe('user.getListAdmin')
    ];
    let products = [];
    let categories = [];
    let listAdmin = [];
    if (!handles.some(handle => !handle.ready())) {
      products = Products.find({}, {
        sort: {
          createdAt: -1
        }
      }).fetch();
      categories = Categories.find({}).fetch();
      listAdmin = Meteor.users.find({}).fetch();
    }
    return {
      products,
      categories,
      listAdmin,
      isLoading: handles.some(handle => !handle.ready()),
    };
  }),
)(ProductPage);
