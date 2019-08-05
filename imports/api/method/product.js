// import { check } from 'meteor/check';
// import ProductClass from '../../../lib/classes/product/ProductClass';
// import CategoryClass from '../../../lib/classes/category/CategoryClass';
// import AWSS3 from '../classes/awsS3';
// import { convertToBuffer } from '../../../lib/utils/image';
// import { USER_ERROR } from '../../../lib/enums/errorServer';

// const URL = `https://${Meteor.settings.s3.bucket}.s3-ap-southeast-1.amazonaws.com/`;

// const convertImages = (imageDatas, uid) => {
//   const images = [];
//   imageDatas.forEach((item, index) => {
//     const image = {
//       uid: `${Number(uid) + Number(index)}`,
//       name: `${Number(uid) + Number(index)}`,
//       status: 'done',
//       url: item
//     };
//     images.push(image);
//   });
//   return images;
// };

// const uploadFeatureImage = async (awsS3, images, categoryName, code, uid) => {
//   let featureImageURL = '/favicon.png';
//   if (images) {
//     if (!images.type) {
//       return images.url ? images.url : images.image;
//     }
//     // upload featureimage
//     const buffer = convertToBuffer(images.image);
//     featureImageURL = await awsS3.uploadToS3(buffer, `product/${categoryName}/${code}/feature/feature-${Number(uid)}`, images.type);
//   }
//   return featureImageURL;
// };

// const uploadImages = async (awsS3, images, categoryName, code, uid) => {
//   const dataImages = [];
//   if (images.length > 0) {
//     // upload images
//     for (let i = 0; i < images.length; i += 1) {
//       const buffer = convertToBuffer(images[i].image);
//       dataImages.push(awsS3.uploadToS3(buffer, `product/${categoryName}/${code}/${Number(uid) + Number(i)}`, images[i].type));
//     }
//   }
//   let result = [];
//   await Promise.all(dataImages).then((values) => {
//     result = [...values];
//   }).catch((reason) => {
//     throw new Meteor.Error('aws-s3', reason);
//   });
//   return result;
// };

// const deleteS3Object = async (awsS3, images, categoryName, code) => {
//   if (images.length > 0) {
//     const deleteImage = [];
//     images.forEach((image) => {
//       deleteImage.push({ Key: `product/${categoryName}/${code}/${image.key ? image.key : image.name}` });
//     });
//     await awsS3.deleteObjects(deleteImage);
//   }
// };

// const copyProductImages = async (awsS3, images, categoryName, code, oldCate, oldCode) => {
//   const dataImages = [];
//   if (images.length > 0) {
//     for (let i = 0; i < images.length; i += 1) {
//       dataImages.push(awsS3.copyObject(`/product/${oldCate}/${oldCode}/${images[i].name}`, `product/${categoryName}/${code}/${images[i].name}`));
//     }
//   }
//   const result = [];
//   await Promise.all(dataImages).then((values) => {
//     for (let i = 0; i < values.length; i += 1) {
//       const url = `${URL}product/${categoryName}/${code}/${images[i].name}`;
//       result.push(url);
//     }
//   }).catch((reason) => {
//     throw new Meteor.Error('aws-s3', reason);
//   });
//   return result;
// };

// const copyFeatureImage = async (awsS3, categoryName, code, oldCate, oldCode, uid) => {
//   await awsS3.copyObject(`/product/${oldCate}/${oldCode}/feature/feature-${uid}`, `product/${categoryName}/${code}/feature/feature-${uid}`);
//   return `${URL}product/${categoryName}/${code}/feature/feature-${uid}`;
// };

// const removeDeleteImage = (images, removeImages) => images.filter(image => removeImages.findIndex(remove => remove.key === image.name) === -1);

// const findLatestUid = (images) => {
//   let latest = 0;
//   for (let i = 0; i < images.length; i += 1) {
//     if (images[i].uid > latest) {
//       latest = images[i].uid;
//     }
//   }
//   return Number(latest) + 1;
// };

// const findFeatureUid = url => url.split('-').pop();

// Meteor.methods({
//   'product.getProductByCode': (code) => {
//     check(code, String);
//     try {
//       const product = new ProductClass(code);
//       return product.data;
//     } catch (error) {
//       console.log('Error when call method', {
//         error,
//       });
//       throw error;
//     }
//   },
//   'product.addProduct': async (data) => {
//     check(data, Object);
//     try {
//       const userId = Meteor.userId();
//       if (!userId) {
//         throw new Meteor.Error(...USER_ERROR.USER_NOT_FOUND);
//       }
//       const category = new CategoryClass(data.categoryId);
//       const code = category.generateCode();

//       // Create s3 object
//       const aws3 = new AWSS3();

//       // upload feature image to aws-s3
//       const featureImage = await uploadFeatureImage(aws3, data.featureImage, category.data.categoryName, code, 1);

//       // upload product images to aws-s3
//       const images = await uploadImages(aws3, data.images, category.data.categoryName, code, 1);

//       const product = {
//         ...data,
//         bgUrl: `url(${featureImage})`,
//         rawBgUrl: featureImage,
//         images: convertImages(images, 1),
//         code
//       };
//       delete product.featureImage;

//       // insert product
//       const productId = ProductClass.create(product, userId);
//       return productId;
//     } catch (error) {
//       console.log('Error when call method', {
//         error,
//       });
//       throw error;
//     }
//   },
//   'product.updateProduct': async (_id, data) => {
//     check(_id, String);
//     check(data, Object);
//     try {
//       const userId = Meteor.userId();
//       if (!userId) {
//         throw new Meteor.Error(...USER_ERROR.USER_NOT_FOUND);
//       }

//       const product = new ProductClass(_id);

//       // get new Category
//       const category = new CategoryClass(data.categoryId);

//       // get old Category
//       const oldCategory = new CategoryClass(product.data.categoryId);

//       // create s3 object
//       const aws3 = new AWSS3();

//       // remove product image if user remove
//       await deleteS3Object(aws3, data.removeImages, oldCategory.data.categoryName, product.data.code);
//       let images = [];
//       if (product.data.images !== [] && data.removeImages !== []) {
//         images = removeDeleteImage(product.data.images, data.removeImages);
//       }

//       const { categoryName } = category.data;
//       let { code } = product.data;

//       const featureUid = findFeatureUid(product.data.rawBgUrl);

//       // If user change category
//       if (data.categoryId !== product.data.categoryId) {
//         // generate new code
//         code = category.generateCode();

//         let featureImageURL = null;

//         // manage s3 server (copy product image to new folder)
//         // will not copy image if user change feature image
//         if (!data.featureImage.type) {
//           featureImageURL = await copyFeatureImage(aws3, categoryName, code, oldCategory.data.categoryName, product.data.code, featureUid);
//         }
//         const imagesURL = await copyProductImages(aws3, images, categoryName, code, oldCategory.data.categoryName, product.data.code);

//         // delete old image
//         images.push({ key: `feature/feature-${featureUid}` });
//         await deleteS3Object(aws3, images, oldCategory.data.categoryName, product.data.code);
//         images.pop();

//         data.featureImage.url = featureImageURL;
//         images.forEach((image, index) => {
//           image.url = imagesURL[index];
//         });
//       }

//       // get latest uid of image
//       const latestUid = findLatestUid(images);

//       // upload feature image to aws-s3
//       const featureImage = await uploadFeatureImage(aws3, data.featureImage, categoryName, code, Number(featureUid) + 1);

//       // upload product images to aws-s3
//       const newImages = await uploadImages(aws3, data.images, categoryName, code, latestUid);

//       images = images.concat(convertImages(newImages, latestUid));

//       const updateData = {
//         ...data,
//         bgUrl: `url(${featureImage})`,
//         rawBgUrl: featureImage,
//         images,
//         code
//       };

//       delete updateData.featureImage;

//       // update product
//       const result = product.update(updateData, userId);

//       return result;
//     } catch (error) {
//       console.log('Error when call method', {
//         error,
//       });
//       throw error;
//     }
//   },
//   'product.deleteProduct': async (_id) => {
//     check(_id, String);
//     try {
//       const product = new ProductClass(_id);

//       // get Category
//       const category = new CategoryClass(product.data.categoryId);

//       // get feature image uid
//       const featureUid = findFeatureUid(product.data.rawBgUrl);

//       // create s3 object
//       const aws3 = new AWSS3();

//       // delete image in s3 server
//       product.data.images.push({ key: `feature/feature-${featureUid}` });
//       await deleteS3Object(aws3, product.data.images, category.data.categoryName, product.data.code);

//       // remove product
//       const result = product.remove();

//       return result;
//     } catch (error) {
//       console.log('Error when call method', {
//         error,
//       });
//       throw error;
//     }
//   },
// });
