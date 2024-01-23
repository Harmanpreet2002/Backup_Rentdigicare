const { rentdiginewsletter } = require("../Database/RentdigicareNewsletters");

module.exports = {
  findOneData(data, field) {
    return new Promise((resolve, reject) => {
      rentdiginewsletter.findOne(data, field, (err, result) => {
        if (err) {
          reject(err);
        } else {
          console.log("inside model_function");
          resolve(result);
        }
      });
    });
  },
  insertData(data) {
    return new Promise((resolve, reject) => {
      const document = new rentdiginewsletter(data);
      document.save((err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },
  fetch(data) {
    return new Promise((resolve, reject) => {
      rentdiginewsletter.find(data, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },
  delete(data) {
    return new Promise((resolve, reject) => {
      rentdiginewsletter.deleteOne(data, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },
};
