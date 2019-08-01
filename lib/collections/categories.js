import SimpleSchema from 'simpl-schema';
import { SCHEMA_COLLECTION_TEXT } from '../enums/general';

const Categories = new Mongo.Collection(SCHEMA_COLLECTION_TEXT.CATEGORY);

const Schemas = {};

Schemas.Category = new SimpleSchema({
  categoryName: {
    type: String,
    label: 'Category Name',
  },
  code: {
    type: String,
    label: 'Category Code',
    optional: true
  },
  isDelete: {
    type: Boolean,
    label: 'Delete Flag',
    optional: true
  },
  createdAt: Date,
  createdBy: String,
  modifiedAt: Date,
  modifiedBy: String,
});

Categories.attachSchema(Schemas.Category);

export default Categories;
