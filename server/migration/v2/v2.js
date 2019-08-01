import addSuperUser from './addSuperUser';

Migrations.add({
  version: 2,
  name: 'Add Super User',
  up() {
    addSuperUser();
  },
  down() {
    // code to migrate down to version 0
  }
});
