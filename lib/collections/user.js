import SimpleSchema from 'simpl-schema';

const Schema = {};

Schema.profile = new SimpleSchema({
  firstName: {
    type: String,
    label: 'First name',
    optional: true,
  },
  lastName: {
    type: String,
    label: 'Last name',
    optional: true,
  },
  phoneNumber: {
    label: 'Phone number',
    type: String,
    optional: true,
  },
  address: {
    type: String,
    label: 'Address',
    optional: true,
  },
  avatar: {
    type: String,
    label: 'Avatar',
    optional: true,
  },
  resetSecretKey: {
    label: 'Reset key',
    type: String,
    optional: true,
  },
  deleted: {
    label: 'Deleted',
    type: Boolean,
  }
});

Schema.User = new SimpleSchema({
  emails: {
    type: Array,
    optional: true,
  },
  'emails.$': {
    type: Object,
  },
  'emails.$.address': {
    type: String,
    // regEx: SimpleSchema.RegEx.Email,
  },
  'emails.$.verified': {
    type: Boolean,
  },
  roles: {
    type: Array,
    optional: true,
    blackbox: true
  },
  'roles.$': String,
  profile: {
    type: Schema.profile,
    optional: true,
  },
});

Meteor.users.attachSchema(Schema.User);
