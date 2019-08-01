import S3 from 'aws-sdk/clients/s3';

const s3Conf = Meteor.settings.s3 || {};

export default class AWSS3 {
  imagesURL = [];

  s3 = null;

  constructor() {
    if (s3Conf && s3Conf.key && s3Conf.secret && s3Conf.bucket && s3Conf.region) {
      // Create a new S3 object
      this.s3 = new S3({
        secretAccessKey: s3Conf.secret,
        accessKeyId: s3Conf.key,
        region: s3Conf.region,
        // sslEnabled: true, // optional
        httpOptions: {
          timeout: 6000,
          agent: false
        }
      });
    }
  }

  /**
   * Upload image to S3 (This function get param is folder path to image file)
   * @param {string} file : file object(Buffer, Typed Array, Blob, String, ReadableStream)
   * @param {string} folderPathImg where the image will be uploaded into
   * @returns {url} the url of uploaded file
  */
  uploadToS3(file, folderPathImg, type) {
    return new Promise((resolve, reject) => {
      const params = {
        Bucket: s3Conf.bucket,
        Key: folderPathImg,
        ContentType: type,
        Body: file,
      };
      this.s3.upload(params, (err, data) => {
        if (err) {
          reject(new Meteor.Error('aws-s3', err));
        } else {
          resolve(data.Location);
        }
      });
    });
  }

  /**
   * Delete image from S3
   * @param {string} array : array object([{key: STRING_VALUE}])
   * @returns {object} the de-serialized data returned from the request
  */
  deleteObjects(array) {
    return new Promise((resolve, reject) => {
      const params = {
        Bucket: s3Conf.bucket,
        Delete: {
          Objects: [...array],
          Quiet: false
        },
      };
      this.s3.deleteObjects(params, (err, data) => {
        if (err) {
          reject(new Meteor.Error('aws-s3', err));
        } else {
          resolve(data);
        }
      });
    });
  }

  /**
   * Copy image from S3
   * @param {string} path : path (/sourcebucket/HappyFacejpg)
   * @param {string} key : key HappyFaceCopyjpg
   * @returns {object} the de-serialized data returned from the request
  */
  copyObject(path, key) {
    return new Promise((resolve, reject) => {
      const params = {
        Bucket: s3Conf.bucket,
        CopySource: `/${s3Conf.bucket}${path}`,
        Key: key
      };
      this.s3.copyObject(params, (err, data) => {
        if (err) {
          reject(new Meteor.Error('aws-s3', err));
        } else {
          resolve(data);
        }
      });
    });
  }
}
