import { ROLES } from '../../../lib/enums/roles';

Meteor.publish('user.currentUserData', () => Meteor.users.find({ _id: Meteor.userId() }, {
  fields: {
    emails: 1,
    profile: 1,
    roles: 1,
  },
}));

Meteor.publish('user.getListAdmin', () => Meteor.users.find({
  roles: ROLES.ADMIN,
}, {
  sort: {
    createdAt: -1
  }
}));
