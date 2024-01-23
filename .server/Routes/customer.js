const Customer = require("../Database/Customer");

const router = require("express").Router();
const logger = require("../Logger/LoggerFactory").getProductionLogger();
const mongoose = require("mongoose");
const Email = require("../utils/Email");
const { generatePassword, generateHashPassword } = require("./vendor");
const admZip = require("adm-zip");
const fs = require("fs");
const path = require("path");

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `uploads/document/${req.headers.role}`);
  },
  filename: function (req, file, cb) {
    cb(null, `${file.originalname.split(" ").join("_")}`);
  },
});

const storage2 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/tmp");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const upload2 = multer({ storage: storage2 });

async function checkIfMobileOrEmailExists(mobile, email) {
  const customer = await mongoose
    .model("Customer")
    .findOne({ $or: [{ mobile }, { email }] });
  if (customer) {
    const errorFields = [];
    if (customer.mobile === mobile) {
      errorFields.push("mobile");
    }
    if (customer.email === email) {
      errorFields.push("email");
    }
    return {
      error: `The following field(s) already exist in the database: ${errorFields.join(
        ", "
      )}.`,
    };
  }
  return null;
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePhoneNumber(phoneNumber) {
  phoneNumber = String(phoneNumber).replace(/\D/g, "");
  const valid = /^(1)?(\d{10})$/.test(phoneNumber);
  return valid;
}

router.post("/addCustomer", upload.array("file", 10), async (req, res) => {
  const {
    mobile,
    email,
    firstname,
    lastname,
    properties: properties1,
    due_date,
    username,
    suite,
    applicantId,
  } = req.body;
  let properties = [];
  if (typeof properties1 === "string") {
    properties = properties1.split(",");
    console.log("properties", properties1);
  }
  const tempEmail = email.toLowerCase().trim();
  if (!firstname || !lastname) {
    return res
      .status(400)
      .json({ error: "Firstname and Lastname are required" });
  }
  if (!validateEmail(tempEmail)) {
    return res.status(400).json({ error: "Invalid email address" });
  }
  if (!validatePhoneNumber(mobile)) {
    return res.status(400).json({ error: "Invalid mobile number" });
  }
  const existingCustomer = await checkIfMobileOrEmailExists(mobile, tempEmail);
  if (existingCustomer) {
    return res.status(409).json({ error: existingCustomer.error });
  }
  const randomPassword = generatePassword();
  const hashPassword = generateHashPassword(randomPassword);
  const file = [];
  if (req.files.length > 0) {
    req.files.forEach((element) => {
      file.push(
        `document/${req.headers.role}/${element.originalname
          .split(" ")
          .join("_")}`
      );
    });
  }
  const customer = new Customer({
    mobile,
    email: tempEmail,
    lastname,
    password: hashPassword,
    properties,
    due_date,
    username: firstname,
    suite,
    applicantId,
    document: file,
  });
  try {
    const savedCustomer = await customer.save();
    const options = Email.generateOptions(tempEmail, "ADD_CUSTOMER", {
      password: randomPassword,
      companyName: "Rentdigi Care",
      email: tempEmail,
    });
    const isEmailSent = await Email.send(options);
    res.status(201).json({
      id: savedCustomer._id,
      messsage: "Customer Account Created !",
      data: savedCustomer,
    });
  } catch (err) {
    res.status(400).json({ status: 400, error: err.message });
  }
});

router.post(
  "/upload-documents",
  upload2.array("file", 10),
  async (req, res) => {
    const zip = new admZip();
    //creating folder for customer file uploads
    let dir = "uploads/customer";
    let resp;
    try {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      if (req.files) {
        req.files.forEach((file) => {
          zip.addLocalFile(file.path);
        });
        if (!fs.existsSync(dir)) {
          fs.writeFileSync(
            `uploads/customer/${req.headers.id}.zip`,
            zip.toBuffer()
          );
          const documentUpdateRes = await Property.updateOne(
            { _id: req.headers.id },
            {
              $set: {
                totalDocuments: 1,
              },
            }
          );
        } else {
          fs.writeFileSync(
            `uploads/customer/${req.headers.id}.zip`,
            zip.toBuffer()
          );
          resp = await Customer.findOne({ _id: req.headers.id });
          resp.document = [`${req.headers.id}.zip`];
          const documentUpdateRes = await Customer.updateOne(
            { _id: req.headers.id },
            {
              $set: {
                document: resp.document,
              },
            }
          );
          // resp = documentUpdateRes;
        }
      }
      res.json({
        status: 201,
        message: "Successfully uploaded !",
        resp,
      });
    } catch (error) {
      logger.error(error);
      res.json({
        status: 500,
        message: error.message,
      });
    }
  }
);

router.get("/download-document", (req, res) => {
  // Catching up error untill front end gets form validations
  try {
    console.log(req.query.ID);
    let filePath = path.join(__dirname, `../uploads/customer/${req.query.ID}`);
    let stat = fs.statSync(filePath);
    res.download(filePath);
  } catch (error) {
    logger.error(error);
    res.json({
      status: 500,
      message: error.message,
    });
  }
});


router.get("/", async (req, res) => {
  //customer side customers listing
  let match = {};
  let paging = {
    page: 1,
    skip: 0,
    limit: 10,
  };
  if (req.query?.isActive) match.isActive = req.query.isActive == "true";
  if (req.query?.applicantId) match.applicantId = req.query.applicantId;
  if (req.query?.id) match._id = mongoose.Types.ObjectId(req.query.id);
  if (req.query.page && req.query.limit) {
    paging.page =
      parseInt(req.query?.page) != NaN && parseInt(req.query?.page) > 1
        ? parseInt(req.query?.page)
        : 1;
    paging.limit =
      parseInt(req.query?.limit) != NaN ? parseInt(req.query.limit) : 10;
    paging.skip = paging.limit * (paging.page - 1);
  }
  const agg = [
    {
      $match: match,
    },
    {
      $lookup: {
        from: "properties",
        localField: "properties",
        foreignField: "_id",
        as: "propertiesInfo",
      },
    },
    {
      $unwind: {
        path: "$propertiesInfo",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "companies",
        localField: "propertiesInfo.companyID",
        foreignField: "_id",
        as: "propertiesInfo.companyInfo",
      },
    },
    {
      $unwind: {
        path: "$propertiesInfo.companyInfo",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $group: {
        _id: "$_id",
        email: {
          $first: "$email",
        },
        firstname: {
          $first: "$firstname",
        },
        lastname: {
          $first: "$lastname",
        },
        mobile: {
          $first: "$mobile",
        },
        properties: {
          $push: {
            propertyId: "$propertiesInfo._id",
            propertyName: "$propertiesInfo.title",
            company: "$propertiesInfo.companyInfo.name",
          },
        },
        username: {
          $first: "$username",
        },
        suite: {
          $first: "$suite",
        },
        isActive: {
          $first: "$isActive",
        },
        document: {
          $first: "$document",
        },
      },
    },
  ];
  let agg1 = [...agg];
  agg1.push(
    {
      $sort: {
        _id: 1,
      },
    },
    {
      $skip: paging.skip,
    },
    {
      $limit: paging.limit,
    }
  );
  let agg2 = [...agg];
  agg2.push({
    $count: "totalCount",
  });
  try {
    res.json({
      message: "Retrieved Successfully",
      data: await Customer.aggregate(agg1),
      totalCount: await Customer.aggregate(agg2),
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: err.message, message: "Retrieved Unsuccessfully" });
  }
});

module.exports = router;
