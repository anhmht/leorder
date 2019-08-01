import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { ROLES } from '../../enums/roles';

export default class UserClass {
  _id = null;

  data = null;

  static create(profile, email, password) {
    const userId = Accounts.createUser({
      email,
      profile,
      password,
    });
    Roles.addUsersToRoles(userId, ROLES.CUSTOMER);
    return userId;
  }

  constructor(_userId) {
    this._id = _userId;
    this.fetch();
  }

  fetch = () => {
    const { _id } = this;
    const data = Meteor.users.findOne({ _id }, {
      fields: {
        emails: 1,
        profile: 1,
        roles: 1,
      }
    });
    if (data) {
      this.data = data;
    }
  }
}
