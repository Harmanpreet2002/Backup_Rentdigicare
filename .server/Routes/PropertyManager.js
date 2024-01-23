const router = require("express").Router();
const jwt = require("jsonwebtoken");
const logger = require("../Logger/LoggerFactory").getProductionLogger();
require("dotenv").config();
// Importing Database model
const PropertyManager = require("../Database/PropertyManager");
const Property = require("../Database/Property");

// Dependencies for file uploading documents and stream downloading of documents
const multer = require("multer");
const path = require("path");
const admZip = require("adm-zip");
const fs = require("fs");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const Company = require("../Database/Company");
const Customer = require("../Database/Customer");
const Manager = require("../Database/PropertyManager");
const ManagerAvailability = require("../Database/calender_availability");
const Admin = require("../Database/Admin");
const Email = require("../utils/Email");
const Conversion = require("../Database/Conversation");
const Ticket = require("../Database/Ticket");
const Vendor = require("../Database/vendor");
const CompanyRequestType = require("../Database/CompanyRequestType");
const { uploadTicketDocumentsToS3 } = require("../utils/bucket");

const ObjectId = require("mongodb").ObjectID;
// multer for file uploading
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/tmp");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

// get all property managers for company
router.get("/dashboardfilter", authToken, async (req, res) => {
  try {
    let manager = [];
    var searchCriteria = {};
    if (req.query.startDate && req.query.endDate) {
      searchCriteria.createdAt = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate),
      };
    }
    if (req.query.filterBy === "barChart") {
      const propertyManagerID = req.query.propertyManagerID
        ? ObjectId(req.query.propertyManagerID)
        : null;
      if (propertyManagerID !== null && req.user.role === "company") {
        searchCriteria._id = ObjectId(req.query.propertyManagerID)
      } else {
        if (req.user.role === "company" && propertyManagerID === null) {
          searchCriteria.companyID = req.user.id;
        }
      }
      if (propertyManagerID !== null && req.user.role === "manager") {
        searchCriteria.managers = { $in: [propertyManagerID] };
      }
      manager = await Manager.aggregate([
        {
          $match: searchCriteria,
        },
        {
          $group: {
            _id: {
              month: {
                $dateToString: { format: "%Y-%m", date: "$createdAt" },
              },
            },
            active: {
              $sum: {
                $cond: [{ $eq: ["$status", "Active"] }, 1, 0],
              },
            },
            inactive: {
              $sum: {
                $cond: [{ $eq: ["$status", "Inactive"] }, 1, 0],
              },
            },
          },
        },
        {
          $sort: { "_id.month": 1 },
        },
      ]);
    }
    res.json({
      status: 201,
      data: manager.sort((a, b) => {
        let monthA = a._id.month;
        let monthB = b._id.month;
        if (monthA < monthB) {
          return -1;
        }
        if (monthA > monthB) {
          return 1;
        }
        return 0;
      }),
    });
  } catch (error) {
    logger.error(error);
    res.json({
      status: 500,
      message: error?.message,
    });
  }
});
router.post("/", authToken, async (req, res) => {
  if (req.body.domain !== undefined) {
    try {
      const managers = await PropertyManager.aggregate([
        {
          $match: { companyAssigned: req.body.domain },
        },
        {
          $lookup: {
            from: "properties",
            localField: "properties",
            foreignField: "_id",
            as: "propertyList",
          },
        },
      ]);

      res.json({
        status: 200,
        message: "The resources has been fetched",
        total: managers.length,
        managers: managers,
      });
    } catch (error) {
      logger.error(error);
      res.json({
        status: 500,
        message: "Something Went Wrong !",
      });
    }
  } else {
    res.json({
      status: 400,
      message: "Bad Request",
    });
  }
});

// get property managers for admin
router.post("/admin", authToken, async (req, res) => {
  try {
    let company = req.body.company
    let managers = await PropertyManager.aggregate([
      {
        $lookup: {
          from: "properties",
          localField: "properties",
          foreignField: "_id",
          as: "propertyList",
        },
      },
    ]);
    managers = await PropertyManager.find({ companyID: company })
    res.json({
      status: 200,
      message: "The resources has been fetched ",
      total: managers.length,
      managers: managers,
    });
  } catch (error) {
    logger.error(error);
    res.json({
      status: 500,
      message: "Something Went Wrong !",
    });
  }
});

// get property managers for vendor
// router.post("/vendor", authToken, async (req, res) => {
//   try {
//     const { vendorId } = req.body;
//     let vendor = await Vendor.findById(vendorId).populate("approvedCompanies");
//     let approvedCompanyIds = vendor.approvedCompanies.map(company => company._id);

//     let propertyManagers = await PropertyManager.find({ companyID: { $in: approvedCompanyIds } })
//     let requestTypes = await CompanyRequestType.find({ company_id: { $in: approvedCompanyIds } });

    
//     res.json({
//       status: 200,
//       message: "The resources has been fetched ",
//       total: propertyManagers.length,
//       managers: propertyManagers,
//       types: requestTypes,
//     });
//   } catch (error) {
//     logger.error(error);
//     res.json({
//       status: 500,
//       message: "Something Went Wrong !",
//     });
//   }
// });

router.post("/list", PaginatedResults(Manager), async (req, res) => {
  res.json({
    status: 200,
    message: "Fetched Resources",
    totalManagers: res.totalManagers,
    results: res.paginatedResults,
  });
});

//create Route for manager filter data on the basis of available managers
router.get("/filter", async (req, res) => {
  const role = req.query.role;
  if (!role || role === "") {
    res.json({
      status: 400,
      message: "Bad Request: role Is Required.",
    });
  } else {
    try {
      if (role === "company") {
        if (req.query.domain) {
          filter = {
            companyAssigned: req.query.domain,
          };
        } else {
          res.json({
            status: 400,
            message: "Bad Request: domain Is Required.",
          });
        }
      } else if (role === "admin") {
        filter = {};
      }
      // for look up
      pipeline = [
        {
          $match: filter,
        },
        {
          $group: {
            _id: "$firstname",
          },
        },

        {
          $addFields: {
            Name: "$_id",
          },
        },
        {
          $project: {
            _id: 0,
          },
        },
      ];
      let managers = await Manager.aggregate(pipeline);
      res.json({
        status: 200,
        message: "Resources Fetched !",
        properties: managers,
      });
    } catch (error) {
      console.log(error);
      logger.error(error);
      res.json({
        status: 500,
        message: "Something Went Wrong !",
      });
    }
  }
});

// Add property manager
router.post("/add", async (req, res) => {
  const email = req.body.email;
  const properties = req.body.properties;

  const emailAlreadyExists = await isEmailExits(email);
  if (!emailAlreadyExists) {
    try {
      const newManager = await PropertyManager.create({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        mobile: req.body.mobile,
        status: req.body.status,
        timezone: req.body.timezone,
        companyAssigned: req.body.companyAssigned,
        companyID: req.body.companyID,
        documents: req.body.documents,
        ticketPrivilege: req.body.ticketPrivilege,
        applicationPrivilege: req.body.applicationPrivilege,
        calendarPrivilege: req.body.calendarPrivilege,
      });

      const objectIdArray = properties.map((x) => ObjectId(x));
      const prop = await Property.aggregate([
        {
          $match: {
            _id: { $in: objectIdArray },
          },
        },
        { $project: { title: 1 } },
      ]);

      const privileges = {
        ticketPrivilege: newManager.ticketPrivilege,
        applicationPrivilege: newManager.applicationPrivilege,
        calendarPrivilege: newManager.calendarPrivilege,
      };

      // Setting manager for Property
      await assignManagerToProperties(properties, newManager);
      console.log("manager");
      // creating property manager account
      await createPropertyManagerAccount(
        newManager._id,
        req.body.email,
        newManager.firstname,
        newManager.companyID,
        privileges,
        prop
      );
      console.log("Account");
      // setting assigned property for manager
      let type = "new";
      await assignPropertiesToManager(properties, newManager, type);
      console.log("properties");

      //creating manager calender availability
      await ManagerAvailability.findOneAndUpdate(
        { manager_id: newManager._id },
        {
          daysOfWeekAvailability: req.body.daysOfWeekAvailability,
        },
        { new: true }
      );

      console.log("availity");
      //CREATING MESSAGE CONVERSATION
      await CreateConversation(newManager._id, newManager.companyID);

      console.log("create conversation");

      res.json({
        status: 201,
        id: newManager._id,
        message: "Manager Added !",
      });
    } catch (error) {
      logger.error(error);
      res.json({
        status: 500,
        message: error.message,
      });
    }
  } else {
    res.json({
      status: 400,
      message: "Email Already Associated To another account!",
    });
  }
});

// update property manager
router.put("/update/:managerID", async (req, res) => {
  const managerID = req.params.managerID;
  const properties = req.body.properties;
  console.log(managerID, "managerID");

  try {
    const isManagerExists = await PropertyManager.findOne({ _id: managerID });
    if (!isManagerExists) {
      return throwError(400, "Property Manager not found");
    }
    const oldManger = await PropertyManager.findOne({ _id: managerID });
    const newManager = await PropertyManager.findOneAndUpdate(
      { _id: managerID },
      {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        mobile: req.body.mobile,
        status: req.body.status,
        timezone: req.body.timezone,
        companyAssigned: req.body.companyAssigned,
        companyID: req.body.companyID,
        documents: req.body.documents,
        ticketPrivilege: req.body.ticketPrivilege,
        applicationPrivilege: req.body.applicationPrivilege,
        calendarPrivilege: req.body.calendarPrivilege,
      },
      {
        new: true,
      }
    );
    const oldPrivileges = {
      ticketPrivilege: oldManger.ticketPrivilege,
      applicationPrivilege: oldManger.applicationPrivilege,
      calendarPrivilege: oldManger.calendarPrivilege,
    };
    const newPrivileges = {
      ticketPrivilege: req.body.ticketPrivilege,
      applicationPrivilege: req.body.applicationPrivilege,
      calendarPrivilege: req.body.calendarPrivilege,
    };

    const privileges = { oldPrivileges, newPrivileges };
    console.log(properties, newManager,'mloggg');
    await assignManagerToProperties(properties, newManager);
    // setting assigned property for manager
    let type = "update";
    await assignPropertiesToManager(properties, newManager, type);

    function compareObjects(obj1, obj2) {
      // Get the keys of both objects
      const keys1 = Object.keys(obj1);
      const keys2 = Object.keys(obj2);

      // Check if the length of the keys arrays is the same
      if (keys1.length !== keys2.length) {
        return false;
      }

      // Check if each key in obj1 has the same value in obj2
      for (let key of keys1) {
        if (obj1[key] !== obj2[key]) {
          return false;
        }
      }

      // If all the keys have the same value, return true
      return true;
    }

    if (!compareObjects(oldPrivileges, newPrivileges)) {
      await updatePropertyManagerAccount(
        req.body.email,
        req.body.firstname,
        req.body.companyID,
        privileges
      );
    }

    res.json({
      status: 201,
      id: newManager._id,
      message: "Manager updated",
    });

  } catch (error) {
    logger.error(error);
    res.json({
      status: 500,
      message: error.message,
    });
  }
});
// TODO assign manager another property or first property if he doesn't have one
router.post("/assign_property", async (req, res) => {
  // TODO
});

// Upload Documents for Property Manager
router.post("/upload-documents", upload.array("file", 10), async (req, res) => {
  // const zip = new admZip();
  //creating folder for applicants file uploads
  let dir = "uploads/manager";
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    let uploaded = []
    if (req.files) {
      await Promise.all(
        req.files.map(async (file) => {
      // zip.addLocalFile(file.path);
          const filename = file.filename;
          await uploadTicketDocumentsToS3(process.env.DO_SPACES_NAME, filename, file.path, 'manager');
          const filePath = `${process.env.BUCKET_URL}manager/${filename}`;
          uploaded.push(filePath);
        })
      );
      console.log(uploaded,'ddddd');
      const documentUpdateRes = await PropertyManager.updateOne(
          { _id: req.headers.id },
          {
            $set: {
              documents: uploaded,
            },
          }
        );
      // if (!fs.existsSync(dir)) {
      //   fs.writeFileSync(
      //     `uploads/manager/${req.headers.id}.zip`,
      //     zip.toBuffer()
      //   );
      //   const documentUpdateRes = await PropertyManager.updateOne(
      //     { _id: req.headers.id },
      //     {
      //       $set: {
      //         totalDocuments: 1,
      //       },
      //     }
      //   );
      // } else {
      //   fs.writeFileSync(
      //     `uploads/manager/${req.headers.id}.zip`,
      //     zip.toBuffer()
      //   );
      //   const documentUpdateRes = await PropertyManager.updateOne(
      //     { _id: req.headers.id },
      //     {
      //       $set: {
      //         totalDocuments: 2,
      //       },
      //     }
      //   );
      // }
    }
    res.json({
      status: 201,
      message: "Successfully uploaded !",
    });
  } catch (error) {
    logger.error(error);
    res.json({
      status: 500,
      message: error.message,
    });
  }
});

// Download Documents for Property Manager
router.get("/download-document", (req, res) => {
  // Catching up error untill front end gets form validations
  try {
    let filePath = path.join(
      __dirname,
      `../uploads/manager/${req.query.ID}.zip`
    );
    let stat = fs.statSync(filePath);
    res.download(filePath);
  } catch (error) {
    logger.error(error);
    res.json({
      status: 500,
      message: "Something Went Wrong !",
    });
  }
});

// TO delete property and its references by admin and company
router.delete("/delete", authToken, async (req, res) => {
  
  const userID = req.query.userID;
  const managerID = req.query.managerID;
  try {
    const validPrivileged = await checkDeletePrivileged(userID);
    if (validPrivileged) {
      const response = await deleteManager(managerID);
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

module.exports = router;

// Delete Router functions
async function deleteManager(managerID) {
  try {
    // Getting references of properties assigned before deleting manager
    const manager = await Manager.findOne({ _id: managerID });
    const assignedProperties = manager.properties;

    const managerDeleteRes = await Manager.deleteOne({ _id: managerID });
    if (assignedProperties.length !== 0) {
      // Deleting properties of company
      // remove property from managers reference
      const propertyManagerRemoveRes = await Property.updateMany(
        { _id: { $in: assignedProperties } },
        {
          $pull: {
            managers: managerID,
          },
        },
        { multi: true }
      );
    }

    return {
      status: 200,
      message: "Property Manager has been Deleted !",
    };
    // todo delete applications
    // todo delete tickets
  } catch (error) {
    logger.error(error);
    return {
      status: 500,
      message: "Something Went Wrong !",
    };
  }
}

async function checkDeletePrivileged(userID) {
  return (
    (await Admin.exists({ _id: userID })) || Company.exists({ _id: userID })
  );
}

// creating property manager account
async function createPropertyManagerAccount(
  managerID,
  managerEmail,
  managerName,
  companyID,
  privileges,
  prop
) {
  const randomPassword = generatePassword();
  const hashPassword = generateHashPassword(randomPassword);
  console.log("Update");
  try {
    const company = await Company.findOne({ _id: companyID });
    const res = await PropertyManager.updateOne(
      { _id: managerID },
      {
        $set: {
          password: hashPassword,
        },
      },
      {
        new: true,
      }
    );

    try {
      // send Email
      const data = {
        privileges: privileges,
        managerName: managerName,
        email: managerEmail,
        companyEmail: company?.email,
        password: randomPassword,
        companyName: company.name,
        properties: prop?.map((p) => p?.title),
        logo:company?.logo
      };

      const options = Email.generateOptions(
        data.email,
        "ADD_PROPERTY_MANAGER",
        data
      );
      const isEmailSent = await Email.send(options);

      const data1 = {
        privileges: privileges,
        managerName: managerName,
        email: managerEmail,
        companyEmail: company?.email,
        companyName: company.name,
        logo:company?.logo
      };
      console.log(data);

      const options1 = Email.generateOptions(
        data1.email,
        "UPDATE_PROPERTY_MANAGER",
        data
      );
      await Email.send(options1);
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}
// creating property manager account
async function updatePropertyManagerAccount(
  managerEmail,
  managerName,
  companyID,
  privileges
) {
  try {
    const company = await Company.findOne({ _id: companyID });

    try {
      // send Email
      const data = {
        privileges: privileges,
        managerName: managerName,
        email: managerEmail,
        companyEmail: company?.email,
        companyName: company.name,
        logo:company?.logo
      };
      console.log(data);

      const options = Email.generateOptions(
        data.email,
        "UPDATE_PROPERTY_MANAGER",
        data
      );
      const isEmailSent = await Email.send(options);
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}
// assigning manager to a properties
async function assignManagerToProperties(propertyID, manager) {
  try {
    const pro = await Property.updateMany(
      { _id: { $in: manager.properties } },
      {
        $pull: {
          managers: manager._id
        }
      }
    )

    const res = await Property.updateMany(
      { _id: { $in: propertyID } },
      {
        $push: {
          managers: manager._id,
        },
      },
      { multi: true }
    );
  } catch (error) {
    logger.error(error);
    throw error;
  }
}
// setting properties to manager
async function assignPropertiesToManager(properties, manager, type) {
  try {
    const removedProperties = [];

    const previousProperties = await Manager.aggregate([
      { $match: { _id: manager._id } },
      {
        $lookup: {
          from: "properties",
          localField: "properties",
          foreignField: "_id",
          as: "propertyList",
        },
      },
    ]);

    let i = 0;
    previousProperties[0].propertyList.forEach((prop) => {
      if (i !== 0) {
        removedProperties.push(prop.title);
      } else {
        removedProperties.push(prop.title);
        i++;
      }
    });
    // UPDATE_PROPERTY_MANAGER_PROPERTY

    const res = await Manager.updateOne(
      { _id: manager._id },
      {
        $set: {
          properties: properties,
        },
      }
    );

    try {
      const propertyNames = [];
      const updatedManager = await Manager.aggregate([
        {
          $match: { _id: manager._id },
        },
        {
          $lookup: {
            from: "properties",
            localField: "properties",
            foreignField: "_id",
            as: "propertyList",
          },
        },
      ]);

      let i = 0;
      updatedManager[0].propertyList.forEach((prop) => {
        if (i !== 0) {
          propertyNames.push(prop.title);
        } else {
          propertyNames.push(prop.title);
          i++;
        }
      });

      const company = await Company.findOne({
        domain: manager.companyAssigned,
      });

      const data = {
        managerName: manager.firstname,
        propertyName: propertyNames,
        companyName: company.name,
        logo:company?.logo
      };
      const options = Email.generateOptions(
        manager.email,
        "PROPERTY_ASSIGNED_TO_MANAGER",
        data
      );
      if (type === "new") {
        await Email.send(options);
      }
      const removedPropertiesName = removedProperties?.filter(
        (p) => !propertyNames.includes(p)
      );
      const newProperties = propertyNames?.filter(
        (p) => !removedProperties.includes(p)
      );

      if (removedPropertiesName?.length > 0) {
        const data1 = {
          managerName: manager.firstname,
          propertyName: removedPropertiesName,
          companyName: company.name,
          logo:company?.logo
        };
        const options1 = Email.generateOptions(
          manager.email,
          "UPDATE_PROPERTY_MANAGER_PROPERTY",
          data1
        );
        await Email.send(options1);
      }

      if (newProperties?.length > 0) {
        const data2 = {
          managerName: manager.firstname,
          propertyName: newProperties,
          companyName: company.name,
          logo:company?.logo
        };
        const options2 = Email.generateOptions(
          manager.email,
          "PROPERTY_ASSIGNED_TO_MANAGER",
          data2
        );
        await Email.send(options2);
      }
    } catch (error) {
      logger.error(error);
    }
  } catch (error) {
    logger.error(error);
    throw error;
  }
}

// TO Generate random password
function generatePassword() {
  return (
    Math.random().toString(36).slice(2) +
    Math.random().toString(36).toUpperCase().slice(2)
  );
}

// Generate HashPassword
function generateHashPassword(plainPassword) {
  return bcrypt.hashSync(plainPassword, 10);
}

// Checking if email is associated to another account
async function isEmailExits(email) {
  const companyExits = await Company.exists({ email: email });
  const customerExits = await Customer.exists({ email: email });
  const managerExits = await Manager.exists({ email: email });

  if (companyExits) return true;
  if (managerExits) return true;
  return !!customerExits;
}

//Creating Conversations
async function CreateConversation(managerID, companyID) {
  return await Conversion.create({
    members: [managerID, companyID],
  });
}

// middlewares
// middlewares
function PaginatedResults(model) {
  return async (req, res, next) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const role = req.body.role;

    if (isNaN(page) || isNaN(limit) || !(page > 0) || !(limit > 0) || !role) {
      res.json({
        status: 400,
        message: "Bad Request !",
      });
    } else {
      let pipeline = [];
      let filter = {};
      let sort = {};
      if (role === "admin") {
        filter = req.body.filter
          ? createPropertyMangerFilter(req.body.filter)
          : {};
        pipeline = [
          {
            $match: filter,
          },
          {
            $lookup: {
              from: "properties",
              localField: "properties",
              foreignField: "_id",
              as: "propertyList",
            },
          },
        ];
        sort = req.body.sort
          ? req.body.sort
          : {
              createdAt: -1,
            };
      }

      if (role === "company") {
        filter = {
          companyAssigned: req.body.domain,
          ...createPropertyMangerFilter(req.body.filter ? req.body.filter : {}),
        };

        sort = req.body.sort ? req.body.sort : { createdAt: -1 };
        // for look up
        pipeline = [
          {
            $match: filter,
          },
          {
            $lookup: {
              from: "properties",
              localField: "properties",
              foreignField: "_id",
              as: "propertyList",
            },
          },
        ];
      }

      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const results = {};

      if (endIndex < (await model.find(filter).countDocuments().exec())) {
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
        if (pipeline.length > 0) {
          results.managers = await Manager.aggregate(pipeline)
            .sort(sort)
            .collation({ locale: "en", strength: 2 })
            .skip(startIndex)
            .limit(limit)
            .exec();
          res.paginatedResults = results;
          res.totalManagers = await Manager.find(filter)
            .countDocuments()
            .exec();
          next();
        } else {
          res.json({
            status: 400,
            message: "Bad Request",
          });
        }
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

function createPropertyMangerFilter(data) {
  let filter = {};
  if (data.firstname && data.firstname !== "") {
    filter = {
      ...filter,
      firstname: data.firstname,
    };
  }

  if (data.email && data.email !== "") {
    filter = {
      ...filter,
      email: new RegExp(data.email, "i"),
    };
  }

  if (data.phone && data.phone !== "") {
    filter = {
      ...filter,
      mobile: new RegExp(data.phone, "i"),
    };
  }

  if (data.status && data.status !== "") {
    filter = {
      ...filter,
      status: data.status,
    };
  }

  if (data.ID && data.ID !== "") {
    filter = {
      ...filter,
      primaryID: new RegExp(data.ID, "i"),
    };
  }
  return filter;
}
