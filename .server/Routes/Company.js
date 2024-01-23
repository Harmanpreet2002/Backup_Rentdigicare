const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const genScript = require("../utils/ScriptUtils");

const scriptGenerator = require("../utils/GenerateScript");
const logger = require("../Logger/LoggerFactory").getProductionLogger();
const multer = require("multer");

const fs = require("fs");
const unzipper = require('unzipper');
const slugify = require('slugify')


// for mailing password
const nodemailer = require("nodemailer");

// importing database models
const Company = require("../Database/Company");
const Property = require("../Database/Property");
const Manager = require("../Database/PropertyManager");
const Admin = require("../Database/Admin");

// for emails
const Email = require("../utils/Email");
const Customer = require("../Database/Customer");
const AdmZip = require("adm-zip");
const {uploadFileToS3} = require("../utils/bucket");


// multer for file uploading
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/tmp");
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });
// const upload = multer({ storage: storage });

const storage = multer.diskStorage({
  // destination: "uploads/", // Set the destination folder where the uploaded file will be stored
  filename: (req, file, cb) => {
    // Generate the filename using the value from req.headers.id
    const filename = `${req.headers.id}.${file.originalname.split('.').pop()}`;
    cb(null, filename);
  },
});


// const upload = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: 'your-space-here',
//     acl: 'public-read',
//     key: function (request, file, cb) {
//       console.log(file);
//       cb(null, file.originalname);
//     }
//   })
// }).array('upload', 1);


const upload = multer({ storage });

// Get all the Companies
router.get(
  "/",
  /*authToken,*/ async (req, res) => {
    try {
      const companies = await Company.find(
        {},
        { __v: 0, createdAt: 0, password: 0 }
      );
      res.json({
        status: 200,
        message: "The resources has been fetched",
        companies: companies,
      });
    } catch (error) {
      logger.error(error);
      res.json({
        status: 500,
        message: "Something Went Wrong !",
      });
    }
  }
);

// Get Total Companies
router.get("/total", authToken, async (req, res) => {
  try {
    const total = await Company.countDocuments().exec();
    res.json({
      status: 200,
      message: "Total No Of Companies Received !",
      totalCompanies: total,
    });
  } catch (error) {
    logger.error(error);
    res.json({
      status: 500,
      message: "Something Went Wrong !",
    });
  }
});

// Activate Or Inactivate Customer
router.put("/customerActive", authToken, async (req, res) => {
  const customerId = req.body.customerId || "";
  const active = Boolean(parseInt(req.body.active));
  try {
    const customer = await Customer.findByIdAndUpdate(
      customerId,
      { isActive: active },
      { new: true }
    );
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json({ customer, message: "Updated Successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message, message: "Updatation Failed" });
  }
})

// Paginated Results
router.post("/list", PaginatedResults(Company), (req, res) => {
  res.json({
    status: 200,
    message: "The resources has been fetched",
    results: res.paginatedResults,
  });
});

// Get all company names for company filter
router.get("/filter/company_list", async (req, res) => {
  try {
    const companyNames = await Company.find({}).select({ name: 1, _id: 0 });
    res.json({
      status: 200,
      message: "Resource Fetched !",
      companies: companyNames,
      total: companyNames.length,
    });
  } catch (error) {
    logger.error(error);
    console.log(error);
    res.json({
      status: 500,
      message: "Something Went Wrong !",
    });
  }
});

router.post("/add", authToken, async (req, res) => {

  const companyName = req.body.name
  const slugurl = await Slugify(companyName)

  const emailExits = await Company.exists({ email: req.body.email });
  const domainExits = await Company.exists({ domain: req.body.domain });

  if (emailExits && domainExits) {
    res.json({
      status: 400,
      message: "Email And Domain is Already Registered !",
    });
  } else if (emailExits || domainExits) {
    if (emailExits) {
      res.json({
        status: 400,
        message: "Email is Already Registered !",
      });
    } else {
      res.json({
        status: 400,
        message: "Domain is Already Registered !",
      });
    }
  } else {
    try {
      const scriptNameHash = generateScriptName(req.body.domain);
      const scriptContent = scriptGenerator.generateScript(scriptNameHash);
      const scriptURL = `${process.env.RENTDIGICARE_DOMAIN}:${process.env.PORT}/company/script?q=${scriptNameHash}`;
      // checking owner have last name or not
      const haveLastName = !!req.body.ownerLastName;

      const ownerFullName = haveLastName
        ? req.body.ownerFirstName + " " + req.body.ownerLastName
        : req.body.ownerFirstName;
      const newCompany = await Company.create({
        name: req.body.name,
        phone: req.body.phone,
        ownerFirstName: req.body.ownerFirstName,
        ownerLastName: req.body.ownerLastName ? req.body.ownerLastName : "",
        ownerName: ownerFullName,
        city: req.body.city,
        state: req.body.state,
        address: req.body.address,
        zip: req.body.zip,
        email: req.body.email,
        domain: req.body.domain,
        scriptURL: scriptURL,
        scriptName: scriptNameHash,
        scriptContent: scriptContent,
        slug:slugurl,
        logo:""
      });

      const randomPassword = generatePassword();
      const hash = hashPassword(randomPassword);
      newCompany.password = hash;
      await newCompany.save();

      // generate unique URI ENDPOINT
      const uniqueURL = generateUrl(newCompany.domain);
      await updateUniqueURL(newCompany._id, uniqueURL);

      // Sending Random generated Password to the entered Company mail
      const data = {
        email: newCompany.email,
        owner: newCompany.ownerFirstName,
        password: randomPassword,
      };
      const options = Email.generateOptions(data.email, "ADD_COMPANY", data);
      const isEmailSent = Email.send(options);


      res.json({
        status: 201,
        email: newCompany.email,
        password: randomPassword,
        message: "Company Added !",
        id: newCompany._id
      });
    } catch (error) {
      logger.error(error);
      res.json({
        status: 409,
        message: "Something Went Wrong !",
      });
    }
  }
});


router.post("/upload-documents",upload.array("file", 1), async (req, res) => {

  // console.log(req.files,'filessss')
  const { id } = req.headers; // Access the "id" header

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const file = req.files.file; 

  const filename = req.files[0].filename;

  try {
    await uploadFileToS3(process.env.DO_SPACES_NAME, filename, req.files[0].path);
    console.log("successs")

    const imagePath = `${process.env.BUCKET_URL}${filename}`;
    
    const documentUpdateRes = await Company.updateOne(
                { _id: req.headers.id },
                {
                  $set: {
                    logo: imagePath,
                  },
                }
    )

    
    res.json({ message: "File uploaded successfully" });
  } catch (error) {
    console.log("errrroror")
    console.error("File upload failed:", error);
    res.status(500).json({ message: "Failed to upload file" });
  }
});





//uploading the logo of the company
// router.post("/upload-documents", upload.array("file", 10), async (req, res) => {
//   const zip = new AdmZip();
//   //creating folder for property file uploads
//   let dir = "uploads/company";
//   try {
//     if (!fs.existsSync(dir)) {
//       fs.mkdirSync(dir);
//     }
//     if (req.files) {
//       req.files.forEach((file) => {
//         zip.addLocalFile(file.path);
//       });
//       if (!fs.existsSync(dir)) {
//         fs.writeFileSync(
//           `uploads/company/${req.headers.id}.zip`,
//           zip.toBuffer()
//         );
//         const documentUpdateRes = await Company.updateOne(
//           { _id: req.headers.id },
//           {
//             $set: {
//               logo: "1",
//             },
//           }
//         );
//       } else {
//         fs.writeFileSync(
//           `uploads/company/${req.headers.id}.zip`,
//           zip.toBuffer()
//         );
//         const documentUpdateRes = await Company.updateOne(
//           { _id: req.headers.id },
//           {
//             $set: {
//               logo: "1",
//             },
//           }
//         );
//       }
//     }
//     res.json({
//       status: 201,
//       message: "Successfully uploaded !",
//     });
//   } catch (error) {
//     logger.error(error);
//     res.json({
//       status: 500,
//       message: error.message,
//     });
//   }
// });

// Set Script Settings
router.post("/set-script", authToken, async (req, res) => {
  const domain = req.body.domain;
  const color = req.body.color;
  const position = req.body.position;
  const applicantButtonName = req.body.applicantButtonName;
  const isApplicantButtonEnabled = req.body.applicationButtonEnabled;

  // change script according to script-settings from req.body
  const script = scriptGenerator.generateScript(
    domain,
    color,
    applicantButtonName,
    position,
    isApplicantButtonEnabled
  );

  // replace script in db for that company
  try {
    const updateInfo = await Company.updateOne(
      { domain: domain },
      {
        $set: {
          scriptContent: script,
        },
      }
    );
    res.json({
      status: 201,
      messageL: "Widget Settings Updated !",
    });
  } catch (error) {
    logger.error(error);
    res.json({
      status: 500,
      message: "Something Went Wrong !",
    });
  }
});

// UNDER TEST
router.get("/script", async (req, res) => {
  const scriptName = req.query.q;
  try {
    const company = await Company.find({ scriptName: scriptName });
    if (company.length !== 0) {
      res.send(company[0].scriptContent);
    } else {
      res.send("Null");
    }
  } catch (error) {
    logger.error(error);
    res.json({
      status: 500,
      message: "Something Went Wrong !",
    });
  }
});

// Todo Edit ()
router.put("/edit", authToken, async (req, res) => {

  
  const adminID = req.body.adminID;
  const companyID = req.body.companyID;

  // const emailExits = isEditEmailAlreadyExists(req.body.email, companyID);
  // const domainExits = isEditDomainAlreadyExists(req.body.domain, companyID);

  // only admin can edit company
  const validAdmin = isValidAdmin(adminID);
  if (validAdmin) {

    // TODO check if company exits
    try {
      const oldCompanyDetails = await Company.findOne({ _id: companyID });
      const newCompany = await Company.updateOne(
        { _id: companyID },
        {
          $set: {
            ownerFirstName: req.body.ownerFirstName,
            ownerLastName: req.body.ownerLastName,
            name: req.body.name,
            city: req.body.city,
            phone: req.body.phone,
            state: req.body.state,
            address: req.body.address,
            zip: req.body.zip,
            email: req.body.email,
            domain: req.body.domain,
          },
        }
      );
      // only generating new script if domain is changed
      if (isAddedNewDomain(req.body.domain, oldCompanyDetails)) {
        console.log('new domain changed')
        // TODO generate new script with new domain
        const scriptNameHash = generateScriptName(req.body.domain);
        const scriptContent = genScript(scriptNameHash, "#0e578e", "");
        const scriptURL = `${process.env.RENTDIGICARE_DOMAIN}:${process.env.PORT}/company/script?q=${scriptNameHash}`;
        const res = await Company.updateOne(
          { _id: companyID },
          {
            $set: {
              scriptURL: scriptURL,
              scriptName: scriptNameHash,
              scriptContent: scriptContent,
            },
          }
        );
      }
      else {
        console.log('domain is not changed ')
      }

      res.json({
        status: 201,
        message: "Successfully Edited Company Details !",
        id: companyID
      });
    } catch (error) {
      logger.error(error);
      console.log(error)
      res.json({
        status: 409,
        message: "Something Went Wrong !",

      });
    }

  } else {
    res.json({
      status: 400,
      message: "Bad Request only admin can add company !",
    });
  }
});

router.post("/change_ticket_email_days", async (req, res) => {
  try {
    let changedCompany = await Company.findByIdAndUpdate(
      { _id: req.body.companyId },
      { ticketEmailDays: req.body.days }
    );
    res.json({
      sucess: true,
      message: "Successfully Edited Company email sending days !",
    });
  } catch (e) {
    res.json({
      status: 400,
      message: "Bad Request only admin can add company !",
    });
  }
});

router.post("/get_ticket_email_days", async (req, res) => {
  try {
    let getEmailDays = await Company.findOne({ _id: req.body.companyId });
    res.json({
      sucess: true,
      days: getEmailDays.ticketEmailDays,
    });
  } catch (e) {
    res.json({
      status: 400,
      message: "Bad Request only admin can add company !",
    });
  }
});

router.post("/get_managers", authToken, async (req, res) => {
  try {
    let query = {};
    if (req.user.role === "company") {
      query = { companyID: req.body.company_id };
    }
    let managers = await Manager.find(query);
    res.json({
      status: 200,
      message: "The resources has been fetched",
      managers: managers,
    });
  } catch (e) {
    logger.error(e);
    res.json({
      status: 500,
      message: "Something Went Wrong !",
    });
  }
});

// TO Complete remove company and its references
router.delete("/delete", authToken, async (req, res) => {
  const adminID = req.query.adminID;
  const companyID = req.query.companyID;
  try {
    const validAdmin = await isValidAdmin(adminID);
    if (validAdmin) {
      const response = await deleteCompany(companyID);
      res.json(response);
    } else {
      res.json({
        status: 401,
        message: "Forbidden !",
      });
    }
  } catch (error) {
    logger.error(error);
    res.json({
      status: 500,
      message: "Something Went Wrong !",
    });
  }
});
router.get('/companydetails', async (req, res) => {
  const slugUrl = req.query.slug
  const companyID = req.query.company_id
  console.log(slugUrl);
  try {
    const companyDetails = await Company.findOne({slug:slugUrl});

    if (!companyDetails) {
      return res.status(404).json({ status: 'error', message: 'Company not found' });
    }

    const properties = await Property.find({companyID:companyDetails._id})


    // If you want to send the company details as a response
    res.json({ status: 200, data: companyDetails });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});
router.get("/download-document", (req, res) => {

  // Catching up error untill front end gets form validations
  console.log(req.query)
});

router.get('/get-url', async (req, res) => {
  console.log('hittted')
  try {
    const companyId = req.query.company_id;
    const role = req.query.role;

    const company = await Company.findById(companyId)

    if(company){
      res.json({
        status: 200,
        message: "Url fetched successfully !",
        data:company.slug
      });
    }
    else{
      res.json({
        status:404,
        message:"Url not found for this company"
      })
    }
  } catch (error) {
    console.log(error); // Log the error for debugging
    res.status(500).json({ error: 'Internal server error' }); // Return a generic error message
  }
});



module.exports = router;

// edit router functions
async function isValidAdmin(adminID) {
  return await Admin.exists({ _id: adminID });
}

function isAddedNewDomain(newDomain, oldCompany) {
  return !(newDomain === oldCompany.domain);
}

async function isEditEmailAlreadyExists(email, companyID) {
  const company = await Company.findOne({ email: email });
  return !(companyID === company._id);
}

async function isEditDomainAlreadyExists(domain, companyID) {
  const company = await Company.findOne({ domain: domain });
  return !(companyID === company._id);
}

// delete company and its references
async function deleteCompany(companyID) {
  try {
    // Deleting company
    const companyDeleteRes = await Company.deleteOne({ _id: companyID });

    // Deleting properties of company
    const propertyDeleteRes = await Property.deleteMany({
      companyID: companyID,
    });

    // Deleting Managers of properties that is associated to company
    const managerDeleteRes = await Manager.deleteMany({ companyID: companyID });

    // todo delete applications
    // todo delete tickets

    return {
      status: 200,
      message: "Company has been Deleted !",
    };
  } catch (error) {
    logger.error(error);
    return {
      status: 409,
      message: "Unable to delete company",
    };
  }
}

// Helpers

function generatePassword() {
  return (
    Math.random().toString(36).slice(2) +
    Math.random().toString(36).toUpperCase().slice(2)
  );
}

function hashPassword(plainPassword) {
  return bcrypt.hashSync(plainPassword, 10);
}

//  TODO One Company with one domain
async function domainAlreadyExists(domain) {
  const domainExits = await Company.exists({ domain: domain });
  return domainExits != null;
}

// Generate Url
function generateUrl(domainName) {
  const mainURL = "https://www.rentdigicare.com/company/";
  const domainParts = domainName.split(".");
  return mainURL + domainParts[1] + "_" + domainParts[2];
}

async function updateUniqueURL(companyID, url) {
  await Company.updateOne({ _id: companyID }, { uniqueURL: url });
}

// generating script information
function generateScriptName(domain) {
  const saltRounds = 10;
  const scriptNameHash = domain; // TODO: bcrypt.hashSync(domain, saltRounds);
  return scriptNameHash;
}

function generateScriptUrl(scriptNameHash) {
  const mainURL = "https://www.rentdigicare.com/company/scripts/";
  return mainURL + scriptNameHash;
}

async function insertScript(domain, name, URL) {
  // TODO: Designing part of the widget
  // TODO: Add Ticket etc to the widget
  await IntegrationScripts.create({
    domain: domain,
    scriptName: name,
    scriptURL: URL,
    scriptContent: content,
  });
}

// middlewares
function PaginatedResults(model) {
  return async (req, res, next) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    if (isNaN(page) || isNaN(limit) || !(page > 0) || !(limit > 0)) {
      res.json({
        status: 400,
        message: "Bad Request !",
      });
    } else {
      let filter = {};

      if (req.body.filter === true) {
        filter = generateFilter(req.body);
      }

      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;

      const results = {};

      if (endIndex < (await model.countDocuments().exec())) {
        results.next = {
          page: page + 1,
          limit: limit,
        };
      }

      if (startIndex > 0) {
        results.previous = {
          page: page - 1,
          limit: limit,
        };
      }
      try {
        results.companies = await model
          .find(filter, { __v: 0, password: 0 })
          .sort({ createdAt: -1 })
          .limit(limit)
          .skip(startIndex)
          .exec();
        res.paginatedResults = results;
        next();
      } catch (error) {
        logger.error(error);
        res.json({
          status: 500,
          message: "Something Went Wrong !",
        });
      }
    }
  };
}

function generateFilter(data) {
  let filter = {};
  if (data.filterCompanyName) {
    filter = {
      name: data.filterCompanyName,
    };
  }

  if (data.filterOwnerName && data.filterOwnerName !== "") {
    filter = {
      ...filter,
      ownerName: new RegExp(data.filterOwnerName, "i"),
    };
  }

  if (data.filterCity && data.filterCity !== "") {
    filter = {
      ...filter,
      city: new RegExp(data.filterCity, "i"),
    };
  }

  return filter;
}

function authToken(req, res, next) {

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_KEY, (err, user) => {
    if (err) return res.sendStatus(403); // token is no longer valid so have no longer access
    req.user = user;
    next();
  });
}

async function Slugify(slugname) {
  const slugurl = slugify(slugname, {
    replacement: '-',  // replace spaces with replacement character, defaults to `-`
    remove: undefined, // remove characters that match regex, defaults to `undefined`
    lower: true,      // convert to lower case, defaults to `false`
  });

  let newSlug = slugurl;
  let counter = 1;

  while (true) {
    const slugexist = await Company.findOne({ slug: newSlug });
    if (!slugexist) {
      break;
    }
    newSlug = `${slugurl}-${counter}`;
    counter++;
  }
  return newSlug
}
