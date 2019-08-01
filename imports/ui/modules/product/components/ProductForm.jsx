import React from 'react';
import {
  Form, Button, Row, notification, Divider, Col, Icon, Upload, message, Modal, Switch, Spin
} from 'antd';
import { compose } from 'recompose';
import { withTracker } from 'meteor/react-meteor-data';
import _get from 'lodash/get';
import {
  func, arrayOf, shape
} from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm, getFormValues } from 'redux-form';
import { bindActionCreators } from 'redux';
import _pick from 'lodash/pick';
import { REDUX_FORM_NAMES } from '../../../../../lib/enums/general';
import ActionCreators from '/imports/ui/actions';
import InputField from '../../common/form/InputField';
import { FORM_TYPES } from '../../../../../lib/enums/form';
import { validation } from '../../../../../lib/utils/validation';
import { Categories } from '../../../../../lib/collections';
import './ProductForm.scss';
import { getBase64String } from '../../../../../lib/utils/image';

const validate = {
  title: [validation.required('Please input product title'), validation.maxLength(100)],
  description: [validation.required('Please input product description')],
  category: [validation.required('Please select product category')],
  size: [validation.required('Please input product size'), validation.gt(0)],
  price: [validation.required('Please input product price'), validation.gt(0)],
  quantity: [validation.required('Please input product quatity'), validation.gt(0)]
};

function beforeUpload(file) {
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isLt2M;
}

function getBase64Images(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

class ProductForm extends React.PureComponent {
  static propTypes = {
    handleSubmit: func.isRequired,
    closeModalWizard: func.isRequired,
    initialize: func.isRequired,
    change: func.isRequired,
    touch: func.isRequired,
    valueForms: shape(),
    categories: arrayOf(shape()).isRequired,
  }

  static defaultProps = {
    valueForms: {}
  }

  state = {
    isLoading: false,
    size: [{ key: 0 }],
    price: [{ key: 0 }],
    quantity: [{ key: 0 }],
    loadingImage: false,
    previewVisible: false,
    previewImage: '',
    fileList: [],
    listImages: [],
    isPublish: true,
    isFeature: true,
    removeImages: []
  }

  componentDidMount() {
    const { initialize } = this.props;
    this.initializeData();

    const productId = _get(this.props, 'options._id');
    if (productId) {
      this.setState({
        isLoading: true
      });
      Meteor.call('product.getProductByCode', productId, (error, product) => {
        this.setState({
          isLoading: false
        });
        if (error) {
          notification.error({
            message: 'Error',
            description: 'Fail when get product',
            duration: 3.0,
          });
        } else {
          initialize(product);
          this.renderAvailables(product.availables);
          this.renderImages(product.rawBgUrl, product.images);
          this.setState({
            isFeature: product.isFeature,
            isPublish: product.isPublish
          });
        }
      });
    }
  }

  initializeData = () => {
    const { initialize } = this.props;
    initialize({
      size0: 0,
      quantity0: 0,
      price0: 0,
    });
  }

  renderAvailables = (availables) => {
    const { change } = this.props;
    const { size, price, quantity } = this.state;
    if (availables.length === 1) {
      change('size0', availables[0].size);
      change('price0', availables[0].price);
      change('quantity0', availables[0].quantity);
    } else {
      for (let i = 0; i < availables.length; i += 1) {
        if (i !== 0) {
          size.push({ key: i });
          price.push({ key: i });
          quantity.push({ key: i });
        }
        change(`size${i}`, availables[i].size);
        change(`price${i}`, availables[i].price);
        change(`quantity${i}`, availables[i].quantity);
      }
      this.setState({
        size: [...size],
        price: [...price],
        quantity: [...quantity]
      });
    }
  }

  renderImages = (featureImage, images) => {
    this.setState({
      imageUrl: {
        image: featureImage
      },
      fileList: [...images]
    });
  }

  onSubmit = (values) => {
    const { closeModalWizard } = this.props;
    this.setState({
      isLoading: true
    });
    const product = this.createProductData(values);
    const productId = _get(this.props, 'options._id');
    if (productId) {
      Meteor.call('product.updateProduct', productId, product, (error) => {
        this.setState({
          isLoading: false
        });
        if (error) {
          notification.error({
            message: 'Error',
            description: 'Fail when update product',
            duration: 3.0,
          });
          return;
        }
        notification.success({
          message: 'Sucessful',
          description: 'Update product Sucessfully',
          duration: 3.0,
        });
        closeModalWizard();
      });
      return;
    }
    Meteor.call('product.addProduct', product, (error) => {
      this.setState({
        isLoading: false
      });
      if (error) {
        notification.error({
          message: 'Error',
          description: 'Fail when create product',
          duration: 3.0,
        });
      } else {
        notification.success({
          message: 'Sucessful',
          description: 'Create product Sucessfully',
          duration: 3.0,
        });
        closeModalWizard();
      }
    });
  }

  createProductData = (values) => {
    const {
      listImages, imageUrl, isFeature, isPublish, removeImages
    } = this.state;
    const productId = _get(this.props, 'options._id');
    const productData = {
      title: values.title,
      availables: this.createAvailablesData(values),
      description: values.description,
      categoryId: values.categoryId,
      images: [...listImages],
      featureImage: imageUrl,
      isFeature,
      isPublish
    };
    if (productId) {
      productData.removeImages = removeImages;
    }
    return productData;
  }

  createAvailablesData = (values) => {
    const size = Object.keys(values).filter(key => key.includes('size'));
    const price = Object.keys(values).filter(key => key.includes('price'));
    const quantity = Object.keys(values).filter(key => key.includes('quantity'));
    const result = [];
    for (let i = 0; i < size.length; i += 1) {
      result.push(
        {
          size: values[size[i]],
          price: values[price[i]],
          quantity: values[quantity[i]],
        }
      );
    }
    return result;
  }

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64Images(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  handleImagesChange = (info) => {
    if (info.fileList.length > 5) {
      return;
    }

    const listImages = [];
    info.fileList.forEach((file) => {
      if (!file.url && !file.preview) {
        getBase64String(file.originFileObj, { width: 1920, height: 1020 }, (image) => {
          listImages.push({ image, type: file.type });
        });
      }
    });

    this.setState({
      fileList: [...info.fileList],
      listImages
    });
  }


  handleChange = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ loadingImage: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64String(info.file.originFileObj, { width: 1920, height: 1020 }, imageUrl => this.setState({
        imageUrl: {
          image: imageUrl,
          type: info.file.type
        },
        loadingImage: false,
      }));
    }
  };

  handleRemove = (info) => {
    const { removeImages } = this.state;
    if (info.url) {
      removeImages.push({ key: info.name });
      this.setState({
        removeImages
      });
    }
  }

  addContent = () => {
    const { size, price, quantity } = this.state;
    const { touch, valueForms } = this.props;

    if (valueForms[`size${size.length - 1}`] !== undefined
    && valueForms[`price${price.length - 1}`] !== undefined
    && valueForms[`quantity${quantity.length - 1}`] !== undefined) {
      size.push({ key: size[size.length - 1].key + 1 });
      price.push({ key: price[price.length - 1].key + 1 });
      quantity.push({ key: quantity[quantity.length - 1].key + 1 });
      this.setState({
        size: [...size],
        price: [...price],
        quantity: [...quantity]
      });
    } else {
      touch(`size${size.length - 1}`, '');
      touch(`price${price.length - 1}`, '');
      touch(`quantity${quantity.length - 1}`, '');
    }
  }

  removeContent = (key) => {
    const { size, price, quantity } = this.state;
    const { change } = this.props;
    size.splice(key, 1);
    price.splice(key, 1);
    quantity.splice(key, 1);
    // Clear redux form value
    change(`size${key}`, '');
    change(`price${key}`, '');
    change(`quantity${key}`, '');
    this.setState({
      size: [...size],
      price: [...price],
      quantity: [...quantity]
    });
  }

  mapCategories = () => {
    const { categories } = this.props;
    const options = [];
    categories.forEach((category) => {
      options.push({
        label: category.categoryName,
        value: category._id
      });
    });
    return options;
  }

  handlePublish = (checked) => {
    this.setState({
      isPublish: checked
    });
  }

  handleFeature = (checked) => {
    this.setState({
      isFeature: checked
    });
  }

  render() {
    const { handleSubmit } = this.props;
    const {
      isLoading, size, price, quantity, loadingImage, imageUrl,
      previewVisible, previewImage, fileList, isPublish, isFeature
    } = this.state;

    const uploadButton = (
      <div>
        <Icon type={loadingImage ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    const uploadMultipleButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    const productId = _get(this.props, 'options._id');

    return (
      <div className="product-form">
        <Spin spinning={isLoading}>
          <Form onSubmit={handleSubmit(this.onSubmit)}>
            <Divider>Product Info</Divider>
            <InputField
              name="title"
              type={FORM_TYPES.INPUT}
              label="Product Title"
              validate={validate.title}
              placeholder="Product Title"
            />
            <InputField
              autoComplete="off"
              name="description"
              type={FORM_TYPES.TEXT_AREA}
              label="Product Description"
              placeholder="Product Description"
              validate={validate.description}
              autosize={{
                minRows: 4,
                maxRows: 4
              }}
            />
            <InputField
              name="categoryId"
              type={FORM_TYPES.SELECT}
              options={this.mapCategories()}
              placeholder="Select Category"
              showSearch
              filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
              validate={validate.category}
            />
            <Divider>Product Availables</Divider>
            <Row>
              <Col xs={24} sm={24} md={8}>
                <Row>
                  <Col>
                    <p>Size: </p>
                  </Col>
                </Row>
                {
                  size.map(item => (
                    <Row key={item.key} align="middle">
                      <Col>
                        <InputField
                          name={`size${item.key}`}
                          type={FORM_TYPES.NUMBER_INPUT}
                          validate={validate.size}
                        />
                      </Col>
                    </Row>
                  ))
                }
              </Col>
              <Col xs={{ span: 24, offset: 0 }} sm={{ span: 24, offset: 0 }} md={{ span: 8, offset: 0 }}>
                <Row>
                  <Col offset={2}>
                    <p>Price: </p>
                  </Col>
                </Row>
                {
                  price.map(item => (
                    <Row key={item.key} align="middle">
                      <Col offset={2}>
                        <InputField
                          name={`price${item.key}`}
                          type={FORM_TYPES.NUMBER_INPUT}
                          validate={validate.price}
                          step={0.01}
                          formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        />
                      </Col>
                    </Row>
                  ))
                }
              </Col>
              <Col xs={24} sm={24} md={8}>
                <Row>
                  <Col offset={2}>
                    <p>Quantity: </p>
                  </Col>
                </Row>
                {
                  quantity.map((item, index) => (
                    <Row key={item.key} align="middle">
                      <Col offset={2} span={index > 0 ? 18 : 22}>
                        <InputField
                          name={`quantity${item.key}`}
                          type={FORM_TYPES.NUMBER_INPUT}
                          validate={validate.quantity}
                        />
                      </Col>
                      {
                        index > 0
                          ? (
                            <Col span={4} style={{ textAlign: 'center', margin: '10px 0px' }}>
                              <Icon
                                type="minus-circle-o"
                                onClick={() => this.removeContent(index)}
                              />
                            </Col>
                          ) : null
                      }
                    </Row>
                  ))
                }
              </Col>
            </Row>
            <Row>
              <Col>
                <Button type="dashed" onClick={this.addContent}>
                  <Icon type="plus" />
                  {'Add'}
                </Button>
              </Col>
            </Row>
            <Divider>Feature Image</Divider>
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              beforeUpload={beforeUpload}
              onChange={e => this.handleChange(e)}
              showUploadList={false}
            >
              {imageUrl ? <img src={imageUrl.image} alt="avatar" width="300" /> : uploadButton}
            </Upload>
            <Divider>Product Images</Divider>
            <Upload
              listType="picture-card"
              fileList={fileList}
              onPreview={this.handlePreview}
              beforeUpload={beforeUpload}
              onChange={this.handleImagesChange}
              multiple
              onRemove={this.handleRemove}
            >
              {fileList.length >= 5 ? null : uploadMultipleButton}
            </Upload>
            <Modal width="400" visible={previewVisible} footer={null} onCancel={this.handleCancel}>
              <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
            <Divider>Product Status</Divider>
            <Row>
              <Col span={12}>
            Is publish Product:
                {' '}
                <Switch checked={isPublish} onChange={this.handlePublish} />
              </Col>
              <Col span={12}>
            Is Feature Product:
                {' '}
                <Switch checked={isFeature} onChange={this.handleFeature} />
              </Col>
            </Row>
            <br />
            <Row type="flex" justify="end" style={{ clear: 'both' }}>
              <Form.Item>
                <Button
                  htmlType="submit"
                  type="primary"
                  disabled={isLoading}
                >
                  {productId ? 'Update' : 'Add new'}
                </Button>
              </Form.Item>
            </Row>
          </Form>
        </Spin>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  valueForms: getFormValues(REDUX_FORM_NAMES.PRODUCT_FORM)(state),
});


const mapDispatchToProps = dispatch => bindActionCreators(
  _pick(ActionCreators, [
    'closeModalWizard',
  ]), dispatch,
);

export default compose(
  reduxForm({
    form: REDUX_FORM_NAMES.PRODUCT_FORM,
  }),
  connect(mapStateToProps, mapDispatchToProps),
  withTracker(() => {
    const handleCategory = Meteor.subscribe('category.getListCategory');
    let categories = [];
    if (handleCategory.ready()) {
      categories = Categories.find({}).fetch();
    }
    return {
      categories,
      isLoading: !handleCategory.ready(),
    };
  }),
)(ProductForm);
