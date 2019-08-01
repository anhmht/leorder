import { Accounts } from 'meteor/accounts-base';
import { FACEBOOK } from '../../../lib/enums/facebook';
import { ROLES } from '../../../lib/enums/roles';

ServiceConfiguration.configurations.remove({
  service: 'facebook'
});

ServiceConfiguration.configurations.insert({
  service: 'facebook',
  appId: FACEBOOK.APP_ID,
  secret: FACEBOOK.APP_SECRET
});

Accounts.onCreateUser((options, user) => {
  if (!user.services.facebook) {
    user.profile = options.profile;
    return user;
  }
  user.profile = {};
  user.profile.firstName = user.services.facebook.first_name;
  user.profile.lastName = user.services.facebook.last_name;
  user.profile.avatar = `https://graph.facebook.com/v3.3/${user.services.facebook.id}/picture?type=large`;
  user.roles = [ROLES.CUSTOMER];
  Roles.addUsersToRoles(user._id, ROLES.CUSTOMER);
  return user;
});
