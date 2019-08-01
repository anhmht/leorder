import SimpleSchema from 'simpl-schema';
import { SCHEMA_COLLECTION_TEXT } from '../enums/general';

const Products = new Mongo.Collection(SCHEMA_COLLECTION_TEXT.PRODUCT);

const Schemas = {};

Schemas.Product = new SimpleSchema({
  bgUrl: {
    type: String,
    label: 'Back ground url',
    optional: true
  },
  rawBgUrl: {
    type: String,
    label: 'Raw back ground url',
    optional: true
  },
  title: {
    type: String,
    label: 'Product title',
  },
  availables: {
    type: Array,
    label: 'Product infos',
  },
  'availables.$': {
    type: Object,
    label: 'Info'
  },
  'availables.$.size': {
    type: Number,
    label: 'Size of product'
  },
  'availables.$.price': {
    type: Number,
    label: 'price of product'
  },
  'availables.$.quantity': {
    type: Number,
    label: 'quanity of product'
  },
  code: {
    type: String,
    label: 'Product code',
  },
  description: {
    type: String,
    label: 'Product description',
  },
  categoryId: {
    type: String,
    label: 'Product category',
  },
  images: {
    type: Array,
    label: 'Product images',
  },
  'images.$': {
    type: Object,
    label: 'Image',
    optional: true,
  },
  'images.$.uid': {
    type: String,
    label: 'Image uid'
  },
  'images.$.name': {
    type: String,
    label: 'Image name'
  },
  'images.$.status': {
    type: String,
    label: 'Image status'
  },
  'images.$.url': {
    type: String,
    label: 'Image url'
  },
  isFeature: {
    type: Boolean,
    label: 'Is feature product',
    optional: true
  },
  isPublish: {
    type: Boolean,
    label: 'Is publish product',
    optional: true
  },
  isDelete: {
    type: Boolean,
    label: 'Is delete product',
    optional: true
  },
  createdAt: Date,
  createdBy: String,
  modifiedAt: Date,
  modifiedBy: String,
});

Products.attachSchema(Schemas.Product);

export default Products;
