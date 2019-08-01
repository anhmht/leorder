import moment from 'moment';
import { Products } from '../../collections';

export default class ProductClass {
  _id = null;

  data = null;

  constructor(_id) {
    this._id = _id;
    this.fetch();
  }

  fetch = () => {
    const { _id } = this;
    let data = Products.findOne({ _id });
    if (data) {
      this.data = data;
    } else {
      data = Products.findOne({ code: _id });
      if (data) {
        this.data = data;
      }
    }
  }

  static create(product, userId) {
    const productId = Products.insert({
      ...product,
      createdAt: moment().toDate(),
      createdBy: userId,
      modifiedBy: userId,
      modifiedAt: moment().toDate(),
      isDelete: false,
    });
    return productId;
  }

  update(product, userId) {
    product = Object.assign(product, { modifiedBy: userId, modifiedAt: moment().toDate() });
    const result = Products.update({
      _id: this._id
    }, {
      $set: product,
    });
    this.fetch();
    return result;
  }

  remove() {
    const result = Products.update({
      _id: this._id
    }, {
      $set: {
        isDelete: true
      },
    });
    return result;
  }
}
