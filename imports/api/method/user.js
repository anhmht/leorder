import { check, Match } from 'meteor/check';
import UserClass from '../../../lib/classes/user/UserClass';

Meteor.methods({
  'user.register': (userData) => {
    check(userData, Object);
    try {
      check(userData.email, String);
      check(userData.password, String);
      const { profile } = userData;
      check(profile, Object);
      check(profile.firstName, String);
      check(profile.lastName, String);
      check(profile.phoneNumber, String);
      check(profile.address, String);

      const userId = UserClass.create(userData.profile, userData.email, userData.password);
      return userId;
    } catch (error) {
      console.log('Error when call method', {
        error,
      });
      throw error;
    }
  },
});
