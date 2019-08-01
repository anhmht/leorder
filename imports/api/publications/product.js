import { Products } from '../../../lib/collections';

Meteor.publish('product.getListProduct', () => Products.find({
  isDelete: false
}, {
  sort: {
    createdAt: -1
  }
}));
