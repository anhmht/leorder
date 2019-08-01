import addDefaultProducts from './addDefaultProducts';

Migrations.add({
  version: 1,
  name: 'Add default products',
  up() {
    addDefaultProducts();
  },
  down() {
    // code to migrate down to version 0
  }
});
