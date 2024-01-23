const AWS = require("aws-sdk");
const fs = require("fs");
const dotenv = require("dotenv");

// dotenv.configure();
const spacesEndpoint = new AWS.Endpoint(process.env.DO_SPACES_ENDPOINT);
const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: process.env.DO_SPACES_KEY,
  secretAccessKey: process.env.DO_SPACES_SECRET
});

function uploadFileToS3(bucketName, key, filePath) {
  const file = fs.readFileSync(filePath);

  s3.putObject(
    {
      Bucket: bucketName,
      Key: key,
      Body: file,
      ACL: "public-read",
      ContentType: "image/jpeg",
      ContentDisposition: "inline"
    },
    (err, data) => {
      if (err) return console.log(err);
      console.log("Your file has been uploaded successfully!", data);
    }
  );
}

function uploadTicketDocumentsToS3(bucketName, key, filePath, type) {
  const file = fs.readFileSync(filePath);

  s3.putObject(
    {
      Bucket: bucketName,
      Key: type+'/'+key,
      Body: file,
      ACL: "public-read",
      ContentType: "application/octet-stream",
      ContentDisposition: "inline"
    },
    (err, data) => {
      if (err) return console.log(err);
      console.log("Your file has been uploaded successfully!", data);
      fs.unlinkSync(filePath);
    }
  );
}

module.exports = {uploadFileToS3, uploadTicketDocumentsToS3}
