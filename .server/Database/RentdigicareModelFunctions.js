const { rentdigiblog } = require("./RentdigicareBlogs");
const path = require("path");
const multer = require("multer");
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");

module.exports = {
  findOneData(collectionName, data) {
    return new Promise((resolve, reject) => {
      console.log(collectionName);
      rentdigiblog.findOne(data, (err, result) => {
        if (err) {
          reject(err);
        } else {
          console.log("inside model_function");
          resolve(result);
        }
      });
    });
  },

  insertData(collectionName, data) {
    return new Promise((resolve, reject) => {
      console.log(collectionName);
      console.log(data);
      const document = new rentdigiblog(data);
      document.save((err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },

  findData(collectionName, data = {}) {
    return new Promise((resolve, reject) => {
      console.log(collectionName);

      if (data && Object.keys(data).length > 0) {
        rentdigiblog.find(data, (err, result) => {
          if (err) {
            reject(err);
          } else {
            console.log("inside model_function");
            resolve(result);
          }
        });
      } else {
        rentdigiblog.find((err, result) => {
          if (err) {
            reject(err);
          } else {
            console.log("inside model_function");
            resolve(result);
          }
        });
      }
    });
  },

  updateOneByFind(collectionName, find, update) {
    return new Promise((resolve, reject) => {
      console.log("inside the api of deletefromArray");

      rentdigiblog.findOneAndUpdate(
        find,
        { $set: update },
        { new: false },
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            //console.log(result)
            resolve(result);
          }
        }
      );
    });
  },

  deleteData(collectionName, data) {
    return new Promise((resolve, reject) => {
      console.log("hello");
      rentdigiblog.deleteOne(data, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },

  ImageUpload: function (
    file_attribute_name,
    single_image_flag,
    multiple_image_count = 15,
    folder
  ) {
    console.log("ImageUpload", file_attribute_name, single_image_flag);
    const spacesEndpoint = new aws.Endpoint(process.env.IMAGE_CLOUD__ENDPOINT);

    let folderName;
    if (folder !== undefined) folderName = folder + "/";
    else folderName = "";

    const s3 = new aws.S3({
      endpoint: spacesEndpoint,
      accessKeyId: process.env.IMAGE_CLOUD_ACCESS_ID,
      secretAccessKey: process.env.IMAGE_CLOUD_ACCESS_key,
    });

    console.log("ENDpoint", "nyc3.digitaloceanspaces.com");
    const Storage = multerS3({
      s3: s3,
      bucket: "rdgcdn",
      acl: "public-read",
      key: function (request, file, cb) {
        console.log(file);
        cb(
          null,
          folderName +
            file.fieldname +
            "_" +
            Date.now() +
            path.extname(file.originalname)
        );
      },
    });

    let upload;
    if (single_image_flag) {
      upload = multer({ storage: Storage }).single(file_attribute_name);
    } else {
      upload = multer({ storage: Storage }).array(
        file_attribute_name,
        multiple_image_count
      );
    }

    // const upload = multer({
    //     storage: multerS3({
    //       s3: s3,
    //       bucket: 'rdgcdn',
    //       acl: 'public-read',
    //       key: function (request, file, cb) {
    //         console.log(file);
    //         cb(null, file.originalname);
    //       }
    //     })
    //   }).array('file', 1);
    return upload;
  },
};
