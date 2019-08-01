import { ROLES } from '../../../lib/enums/roles';

export default function insertSuperUser() {
  const adminUser = {
    email: 'admin@mail.com',
    password: 'admin123',
    profile: {
      firstName: 'HypeBeast',
      lastName: 'Whammy',
      avatar: '/favicon.png'
    },
  };
  const userId = Accounts.createUser(adminUser);
  Roles.addUsersToRoles(userId, ROLES.ADMIN);
}
