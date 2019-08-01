import { check } from 'meteor/check';
import CategoryClass from '../../../lib/classes/category/CategoryClass';
import { USER_ERROR } from '../../../lib/enums/errorServer';

Meteor.methods({
  'category.addNewCategory': (category) => {
    check(category, Object);
    check(category.categoryName, String);
    check(category.code, String);
    try {
      const userId = Meteor.userId();
      if (!userId) {
        throw new Meteor.Error(...USER_ERROR.USER_NOT_FOUND);
      }
      const categoryId = CategoryClass.create(category, userId);
      return categoryId;
    } catch (error) {
      console.log('Error when call method', {
        error,
      });
      throw error;
    }
  },
  'category.getCategoryById': (_id) => {
    check(_id, String);
    try {
      const userId = Meteor.userId();
      if (!userId) {
        throw new Meteor.Error(...USER_ERROR.USER_NOT_FOUND);
      }
      const category = new CategoryClass(_id);
      return category.data;
    } catch (error) {
      console.log('Error when call method', {
        error,
      });
      throw error;
    }
  },
  'category.updateCategory': (_id, data) => {
    check(_id, String);
    check(data, Object);
    check(data.categoryName, String);
    try {
      const userId = Meteor.userId();
      if (!userId) {
        throw new Meteor.Error(...USER_ERROR.USER_NOT_FOUND);
      }
      const category = new CategoryClass(_id);
      const updatedCategory = category.update(data);
      return updatedCategory;
    } catch (error) {
      console.log('Error when call method', {
        error,
      });
      throw error;
    }
  },
  'category.deleteCategory': (_id) => {
    check(_id, String);
    try {
      const userId = Meteor.userId();
      if (!userId) {
        throw new Meteor.Error(...USER_ERROR.USER_NOT_FOUND);
      }
      const category = new CategoryClass(_id);
      category.data.isDelete = true;
      const updatedCategory = category.update(category.data);
      return updatedCategory;
    } catch (error) {
      console.log('Error when call method', {
        error,
      });
      throw error;
    }
  },
});
