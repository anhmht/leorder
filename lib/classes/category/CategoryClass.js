import moment from 'moment';
import { Categories, Products } from '../../collections';

import { autoFillCharacter } from '../../utils';

export default class CategoryClass {
  _id = null;

  data = null;

  constructor(_id) {
    this._id = _id;
    this.fetch();
  }

  fetch = () => {
    const { _id } = this;
    const data = Categories.findOne({ _id });
    if (data) {
      this.data = data;
    }
  }

  update(data) {
    data = Object.assign(data, { modifiedBy: Meteor.userId(), modifiedAt: moment().toDate() });
    const result = Categories.update(this._id, {
      $set: data,
    });
    this.fetch();
    return result;
  }

  generateCode() {
    // find latest product code
    const product = Products.findOne({
      code: { $regex: `^${this.data.code}`, $options: 'i' },
    }, {
      fields: {
        code: 1,
        createdAt: 1,
      },
      sort: {
        code: -1,
        createdAt: -1,
      }
    });
    return product ? `${autoFillCharacter(`${product.code}`, this.data.code, 3)}`
      : `${this.data.code}001`;
  }

  static create(category, userId) {
    const categoryId = Categories.insert({
      ...category,
      createdAt: moment().toDate(),
      createdBy: userId,
      modifiedBy: userId,
      modifiedAt: moment().toDate(),
      isDelete: false,
    });
    return categoryId;
  }
}
