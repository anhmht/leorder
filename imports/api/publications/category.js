import { Categories } from '../../../lib/collections';

Meteor.publish('category.getListCategory', () => Categories.find({
  isDelete: false,
}, {
  sort: {
    createdAt: -1
  }
}));
