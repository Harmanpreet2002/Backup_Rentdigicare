const router = require("express").Router();
const jwt = require("jsonwebtoken");
const pdf = require("html-pdf");
const QueryString = require("query-string");

// Importing models
const Property = require("../Database/Property");
const Manager = require("../Database/PropertyManager");
const Company = require("../Database/Company");
const Admin = require("../Database/Admin");

// Dependencies for file uploading documents and stream downloading of documents
const multer = require("multer");
const path = require("path");
const admZip = require("adm-zip");
const fs = require("fs");
const Transactions = require("../Database/Transactions");
const ObjectId = require("mongodb").ObjectID;
const { ObjectID } = require("bson");
const Customer = require("../Database/Customer");
const propertyManager = require("../Database/PropertyManager");
const { uploadTicketDocumentsToS3 } = require("../utils/bucket");

const logger = require("../Logger/LoggerFactory").getProductionLogger();

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
router.get("/dashboardfilter", authToken, async (req, res) => {
  try {
    let property = "";
    var searchCriteria = {};
    if (req.query.startDate && req.query.endDate) {
      searchCriteria.createdAt = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate),
      };
    }
    if (req.query.filterBy === "barChart") {
      const propertyManagerID =
        req.query.propertyManagerID !== ""
          ? ObjectID(req.query.propertyManagerID)
          : null;
      const property_id =
        req.query.propertyId !== "" ? ObjectID(req.query.propertyId) : null;

      if (property_id !== null) {
        searchCriteria._id = property_id;
      }
      if (propertyManagerID !== null && req.user.role === "company") {
        searchCriteria.managers = { $in: [propertyManagerID] };
      } else {
        if (req.user.role === "company" && propertyManagerID === null) {
          searchCriteria.companyID = req.user.id;
        }
      }

      if (propertyManagerID !== null && req.user.role === "manager") {
        searchCriteria.managers = { $in: [propertyManagerID] };
      }

      property = await Property.aggregate([
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
      data: property.sort((a, b) => {
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
router.post("/total", async (req, res) => {
  try {
    let role = req.body.role;
    let matchCondition = {};
    if (role === "manager") {
      if (!req.body.managerID || req.body.managerID === "")
        return res.json({
          status: 400,
          message: "Manager ID is required !",
        });
      matchCondition = { managers: { $eq: ObjectID(req.body.managerID) } };
    } else if (role == "company") {
      if (!req.body.domain || req.body.domain === "")
        return res.json({
          status: 400,
          message: "Domain is required !",
        });
      matchCondition = { companyDomain: req.body.domain };
    }

    const total = await Property.find(matchCondition).countDocuments();

    const active = await Property.find(matchCondition).countDocuments({
      status: "Active",
    });
    const inactive = await Property.find(matchCondition).countDocuments({
      status: "Inactive",
    });

    res.json({
      status: 200,
      message: "Total Properties Received !",
      totalProperties: { total, active, inactive },
    });
  } catch (error) {
    logger.error(error);
    res.json({
      status: 500,
      message: error.message,
    });
  }
});

// Uplaod Documents for property
router.post("/upload-documents", upload.array("file", 10), async (req, res) => {
  const zip = new admZip();
  //creating folder for property file uploads
  let dir = "uploads/property";
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    let uploaded = [];
    if (req.files) {
      await Promise.all(
        req.files.map(async (file) => {
          // zip.addLocalFile(file.path);
          const filename = file.filename;
          await uploadTicketDocumentsToS3(
            process.env.DO_SPACES_NAME,
            filename,
            file.path,
            "property"
          );
          const filePath = `${process.env.BUCKET_URL}property/${filename}`;
          uploaded.push(filePath);
        })
      );
      const documentUpdateRes = await Property.updateOne(
        { _id: req.headers.id },
        {
          $set: {
            document: uploaded,
          },
        }
      );
      // if (!fs.existsSync(dir)) {
      //   fs.writeFileSync(
      //     `uploads/property/${req.headers.id}.zip`,
      //     zip.toBuffer()
      //   );
      //   const documentUpdateRes = await Property.updateOne(
      //     { _id: req.headers.id },
      //     {
      //       $set: {
      //         document: "1",
      //       },
      //     }
      //   );
      // } else {
      //   fs.writeFileSync(
      //     `uploads/property/${req.headers.id}.zip`,
      //     zip.toBuffer()
      //   );
      //   const documentUpdateRes = await Property.updateOne(
      //     { _id: req.headers.id },
      //     {
      //       $set: {
      //         document: "1",
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
//GET PROPERTIES For Company
router.get(
  "/getCompanyProperties",
  /*authToken,*/ async (req, res) => {
    try {
      const Properties = await Property.find({ _id: req.query.companyID });
      res.json({
        status: 200,
        message: "Properties Fetched !",
        properties: Properties,
      });
    } catch (error) {
      res.json({
        status: 500,
        message: "Something Went Wrong !",
      });
    }
  }
);

//GET ALL PROPERTIES For Company
router.post(
  "/getAllCompanyProperties",
  /*authToken,*/ async (req, res) => {
    try {
      const Properties = await Property.find({ companyID: req.body.companyID });
      res.json({
        status: 200,
        message: "Properties Fetched !",
        success: true,
        properties: Properties,
      });
    } catch (error) {
      res.json({
        status: 500,
        success: false,
        message: "Something Went Wrong !",
      });
    }
  }
);

//GET MANAGERS OF PROPERTIES
router.post(
  "/getManagersOfProperties",
  /*authToken,*/ async (req, res) => {
    try {
      const Managers = await Manager.find({
        properties: { $in: req.body.propertyID },
      });
      res.json({
        status: 200,
        message: "Properties Fetched !",
        success: true,
        Managers: Managers,
      });
    } catch (error) {
      res.json({
        status: 500,
        success: false,
        message: "Something Went Wrong !",
      });
    }
  }
);

router.post("/getManagersOfPropertiesCalendar", async (req, res) => {
  try {
    const propertyTitle = req.body.propertyTitle;
    const companyID = req.body.companyId;

    const properties = await Property.find({
      title: propertyTitle,
      companyID,
    });

    const managerID = properties[0].managers[0];
    const manager = await propertyManager.findById(new ObjectId(managerID));
    res.json({
      status: 200,
      message: "Properties Managers Fetched!",
      success: true,
      Managers: manager,
    });
  } catch (error) {
    res.json({
      status: 500,
      success: false,
      message: "Something Went Wrong!",
    });
  }
});

router.post("/getManagerOfPropertyRentdigi", async (req, res) => {
  try {
    
  } catch (error) {
    res.json({
      status: 500,
      success: false,
      message: "Something went"
    })
  }
})

//GET PAYMENT STATUS
router.post(
  "/get_payment_status",
  /*authToken,*/ async (req, res) => {
    try {
      const transactions = await Transactions.find({
        property_id: req.body.propertyID,
      }).sort({ createdAt: -1 });
      res.json({
        status: 200,
        message: "transactions Fetched !",
        success: true,
        transactions: transactions,
      });
    } catch (error) {
      res.json({
        status: 500,
        success: false,
        message: "Something Went Wrong !",
      });
    }
  }
);

//UPDATE PAYMENT STATUS
router.post(
  "/update_payment_status",
  /*authToken,*/ async (req, res) => {
    try {
      const transactions = await Transactions.findByIdAndUpdate(
        { _id: req.body.transactionId },
        { payment_status: req.body.payment_status }
      );
      res.json({
        status: 200,
        message: "transactions updated !",
        success: true,
        transactions: transactions,
      });
    } catch (error) {
      res.json({
        status: 500,
        success: false,
        message: "Something Went Wrong !",
      });
    }
  }
);

// Download Documents for Property
router.get("/download-document", (req, res) => {
  // Catching up error untill front end gets form validations
  try {
    let filePath = path.join(
      __dirname,
      `../uploads/property/${req.query.ID}.zip`
    );
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

// To get Total Properties for Company, Manag er and Admin
router.post("/list", PaginatedResults(Property), async (req, res) => {
  const applicationTotal = res.totalFilterResult?.reduce((acc, count) => {
    acc[count._id] = count.count;
    acc["Total"] = (acc["Total"] || 0) + count.count;
    return acc;
  }, {});
  res.json({
    status: 200,
    message: "Resources Fetched !",
    total: applicationTotal,
    totalProperties: res.totalProperties,
    totalActiveProperties: res.totalActiveProperties,
    results: res.paginatedResults,
  });
});

//create Route for property filter data on the basis of available property
router.get("/filter", async (req, res) => {
  const role = req.query.role;
  const domain = req.query.domain;
  if (!role || role === "" || domain === "" || !domain) {
    res.json({
      status: 400,
      message: "Bad Request: role and domain Is Required.",
    });
  } else {
    try {
      if (role === "company") {
        filter = {
          companyDomain: req.query.domain,
        };
      } else if (role === "manager") {
        filter = {
          managers: { $eq: ObjectID(req.query.domain) },
        };
      } else if (role == "admin") filter = {};
      // for look up
      pipeline = [
        {
          $match: filter,
        },
        {
          $facet: {
            category: [
              { $unwind: "$category" },
              {
                $group: {
                  _id: "$category",
                },
              },
              {
                $lookup: {
                  from: "layouts",
                  localField: "_id",
                  foreignField: "_id",
                  as: "layouts",
                },
              },
              { $unwind: "$layouts" },
              {
                $addFields: {
                  layoutName: "$layouts.layoutName",
                  layoutOf: "$layouts.layoutOf",
                },
              },
              {
                $sort: {
                  layoutName: 1,
                },
              },
              {
                $project: {
                  layouts: 0,
                },
              },
            ],
            property_name: [
              {
                $group: {
                  _id: "$title",
                },
              },
              { $addFields: { title: "$_id" } },
              {
                $project: {
                  _id: 0,
                },
              },
            ],
            location: [
              {
                $group: {
                  _id: "$location",
                },
              },
              { $addFields: { location: "$_id" } },
              {
                $project: {
                  _id: 0,
                },
              },
            ],
            company: [
              { $addFields: { companyid: { $toObjectId: "$companyID" } } },
              {
                $group: {
                  _id: "$companyid",
                },
              },
              {
                $lookup: {
                  from: "companies",
                  localField: "_id",
                  foreignField: "_id",
                  as: "company",
                },
              },
              { $unwind: "$company" },
              {
                $addFields: {
                  name: "$company.name",
                  id: "$company._id",
                  domain: "$company.domain",
                },
              },
              {
                $project: {
                  _id: 0,
                  company: 0,
                },
              },
            ],
            manager: [
              { $unwind: "$managers" },
              {
                $group: {
                  _id: "$managers",
                },
              },
              {
                $lookup: {
                  from: "propertymanagers",
                  localField: "_id",
                  foreignField: "_id",
                  as: "Managers",
                },
              },
              { $unwind: "$Managers" },
              {
                $addFields: {
                  firstname: "$Managers.firstname",
                  lastname: "$Managers.lastname",
                  email: "$Managers.email",
                },
              },
              {
                $project: {
                  Managers: 0,
                },
              },
            ],
          },
        },
      ];
      let properties = await Property.aggregate(pipeline);
      res.json({
        status: 200,
        message: "Resources Fetched !",
        properties: properties,
      });
    } catch (error) {
      console.log(error);
      res.json({
        status: 500,
        message: "Something Went Wrong !",
      });
    }
  }
});

router.post("/applicant-option", async (req, res) => {
  const url = req.body.url;
  if (url) {
    const details = QueryString.parseUrl(url, {
      parseFragmentIdentifier: true,
    });
    const filter = getFilters(details.query);

    try {
      const properties = await Property.aggregate([
        {
          $match: filter,
        },
        {
          $lookup: {
            from: "companies",
            let: { companyDomain: "$companyDomain" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$domain", "$$companyDomain"] },
                },
              },
              {
                $project: {
                  logo: 1,
                },
              },
            ],
            as: "companies",
          },
        },
        {
          $unwind: "$companies",
        },
        {
          $lookup: {
            from: "layouts",
            localField: "category",
            foreignField: "_id",
            as: "layouts",
          },
        },
      ]);

      res.json({
        status: 200,
        message: "The resources has been fetched",
        total: properties.length,
        properties: properties,
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
      message: "Bad Request: URL Is Required.",
    });
  }
});

router.post("/add", async (req, res) => {
  try {
    const newProperty = await Property.create({
      title: req.body.title,
      propertySignature: req.body.propertySignature,
      companyID: req.body.companyID,
      company: req.body.company,
      companyDomain: req.body.companyDomain,
      category: req.body.category,
      owner: req.body.owner,
      location: req.body.location,
      status: req.body.status,
      manager: req.body.manager,
      documents: req.body.documents,
      rent_amount: req.body.rent,
      postal_code: req.body.postal,
      address: req.body.address,
    });

    res.json({
      status: 201,
      id: newProperty._id,
      messsage: "Property Added !",
    });
  } catch (error) {
    logger.error(error);
    res.json({
      status: 500,
      message: "Something Went Wrong !",
    });
  }
});

// TO update property by admin and company
router.post("/update/:id", async (req, res) => {
  const userID = req.params.id;
  let updateData = req.body;
  console.log(updateData);
  if (Object.keys(updateData).length === 0) {
    return res.json({
      status: 400,
      message: "Bad Request: No Data To Update.",
    });
  } else {
    updateData.modifiedAt = new Date();
    try {
      const response = await Property.findOneAndUpdate(
        { _id: ObjectID(userID) },
        { $set: req.body },
        {
          new: true,
        }
      );
      if (response.matchedCount === 0) {
        return res.json({
          status: 500,
          message: "Property Not Found !",
        });
      } else if (response.modifiedCount === 0) {
        return res.json({
          status: 200,
          message: "No Changes Made !",
        });
      } else {
        return res.json({
          status: 200,
          id: response._id,
          message: "Property Updated !",
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
});
// TO delete property and its references by admin and company
router.delete("/delete", authToken, async (req, res) => {
  const userID = req.query.userID;
  const propertyID = req.query.propertyID;
  try {
    const validPrivileged = await checkDeletePrivileged(userID);
    if (validPrivileged) {
      const response = await deleteProperty(propertyID);
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
      return res.status(404).json({ message: "Customer not found" });
    }
    res.json({ customer, message: "Updated Successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message, message: "Updatation Failed" });
  }
});

//GET PROPERTIES
router.get(
  "/getproperties",
  /*authToken,*/ async (req, res) => {
    try {
      const Properties = await Property.find();
      res.status(200).send({ success: true, properties: Properties });
    } catch (e) {
      res.status(400).send({ success: false, errorMessage: e });
    }
  }
);

//GET PROPERTIES For Company
router.post(
  "/getCompanyProperties",
  /*authToken,*/ async (req, res) => {
    try {
      const Properties = await Property.find({
        companyDomain: req.body.domain,
      });
      res.json({
        status: 200,
        success: true,
        message: "Properties Fetched !",
        properties: Properties,
      });
    } catch (error) {
      console.log(error);
      res.json({
        status: 500,
        message: "Something Went Wrong !",
      });
    }
  }
);

//GET PROPERTIES For manager
router.post(
  "/getManagerProperties",
  /*authToken,*/ async (req, res) => {
    try {
      const Properties = await Property.find({
        managers: { $in: req.body.managerID },
      });
      res.json({
        status: 200,
        success: true,
        message: "Properties Fetched !",
        properties: Properties,
      });
    } catch (error) {
      console.log(error);
      res.json({
        status: 500,
        message: "Something Went Wrong !",
      });
    }
  }
);

//GET single property
router.get(
  "/:id",
  /*authToken,*/ async (req, res) => {
    console.log(req.params.id, "cno");
    try {
      const Properties = await Property.find({ _id: ObjectId(req.params.id) });
      res.json({
        status: 200,
        success: true,
        message: "Properties Fetched !",
        properties: Properties,
      });
    } catch (error) {
      console.log(error);
      res.json({
        status: 500,
        message: "Something Went Wrong !",
      });
    }
  }
);

router.get(
  "/property/:id",
  /*authToken,*/ async (req, res) => {
    console.log(req.params.id, "cno");
    try {
      const property = await Property.findById(req.params.id);
      console.log(property);

      // Retrieve the manager IDs from the property
      const managerIds = property.managers;

      // Retrieve all the manager details using the manager IDs
      const managers = await Manager.find({ _id: { $in: managerIds } });
      res.json({
        status: 200,
        success: true,
        message: "Properties Fetched !",
        managers: managers,
      });
    } catch (error) {
      console.log(error);
      res.json({
        status: 500,
        message: "Something Went Wrong !",
      });
    }
  }
);

router.get("/getpropertyList/list", async (req, res) => {
  const companyID = req.query.company_id;
  try {
    console.log(req.query, "query");
    const propertyList = await Property.find({
      companyID: companyID,
    });
    if (propertyList.length > 0) {
      res.json({
        status: 200,
        message: "Properties fetched Successfully !",
        data: propertyList,
      });
    } else {
      res.json({
        status: 404,
        message: "No properties found under this company",
      });
    }
  } catch {
    logger.error(error);
    res.json({
      status: 500,
      message: "Something Went Wrong !",
    });
  }
});

// Generate Property PDF
router.get("/pdf", async (req, res) => {
  const propertyID = req.query.id;
  try {
    const property = await Property.find({ _id: propertyID });
    pdf.create(propertyTemplate(property[0])).toStream((err, stream) => {
      stream.pipe(fs.createWriteStream("./property.pdf"));
      stream.pipe(res);
    });
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
// delete property and its references by admin and company
async function deleteProperty(propertyID) {
  try {
    // before deleting getting assigned managers list so property reference in them can be deleted
    const property = await Property.findOne({ _id: propertyID });
    const assignedManagers = property.managers;

    // Deleting properties of company after getting managers list
    const propertyDeleteRes = await Property.deleteOne({ _id: propertyID });
    if (assignedManagers.length !== 0) {
      // remove property reference from manager's collection
      const propertyRefRemoveDetails = await Manager.updateMany(
        { _id: { $in: assignedManagers } },
        {
          $pull: {
            properties: propertyID,
          },
        },
        { multi: true }
      );
    }

    // todo delete applications
    // todo delete tickets
    return {
      status: 200,
      message: "Property has been Deleted !",
    };
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
    (await Admin.exists({ _id: userID })) ||
    (await Company.exists({ _id: userID }))
  );
}

// middlewares
function PaginatedResults(model) {
  return async (req, res, next) => {
    const page = req.query?.page ? parseInt(req.query.page) : 1;
    const limit = req.query?.limit ? parseInt(req.query.limit) : 1000;
    // console.log("page, limit", page, limit);
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
        //for sort
        filter = createPropertyFilter(req.body.filter ? req.body.filter : {});
        sort = req.body.sort ? req.body.sort : { createdAt: -1 }; // for look up
        pipeline = [
          {
            $match: filter,
          },

          {
            $lookup: {
              from: "layouts",
              localField: "category",
              foreignField: "_id",
              as: "layouts",
            },
          },

          {
            $lookup: {
              from: "propertymanagers",
              localField: "managers",
              foreignField: "_id",
              as: "managersList",
            },
          },
        ];
      }

      if (role === "company") {
        filter = {
          companyDomain: req.body.domain,
          ...createPropertyFilter(req.body.filter ? req.body.filter : {}),
        };
        //for sort
        sort = req.body.sort ? req.body.sort : { createdAt: -1 };
        // for look up
        pipeline = [
          {
            $match: filter,
          },
          {
            $lookup: {
              from: "layouts",
              localField: "category",
              foreignField: "_id",
              as: "layouts",
            },
          },
          {
            $lookup: {
              from: "propertymanagers",
              localField: "managers",
              foreignField: "_id",
              as: "managersList",
            },
          },
        ];
      }

      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const results = {};

      await generatePipeline(role, req.body);

      try {
        if (role === "manager") {
          const manager = await Manager.findOne({ _id: req.body.managerID });
          if (manager !== null) {
            const propertyList = manager.properties;
            // for lookup

            filter = {
              managers: { $eq: manager._id },
              ...createPropertyFilter(req.body.filter),
            };
            //for sort
            sort = { createdAt: -1 };
            pipeline = [
              {
                $match: filter,
              },

              {
                $lookup: {
                  from: "layouts",
                  localField: "category",
                  foreignField: "_id",
                  as: "layouts",
                },
              },

              {
                $lookup: {
                  from: "propertymanagers",
                  localField: "managers",
                  foreignField: "_id",
                  as: "managersList",
                },
              },
            ];
          }
        }

        if (endIndex < (await model.countDocuments(filter).exec())) {
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

        if (pipeline.length > 0) {
          results.properties = await Property.aggregate(pipeline)
            .sort(sort)
            .collation({ locale: "en", strength: 2 })
            .skip(startIndex)
            .limit(limit)
            .exec();
          res.paginatedResults = results;
          res.totalFilterResult = await Property.aggregate([
            { $match: filter },
            { $group: { _id: "$status", count: { $sum: 1 } } },
          ]);
          res.totalProperties = await Property.find(filter)
            .countDocuments()
            .exec();
          if (filter.status) delete filter.status;
          res.totalActiveProperties = await Property.find({
            ...filter,
            status: "Active",
          })
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
          message: error.message,
        });
      }
    }
  };
}

async function generatePipeline(role, data, propertyList) {
  const pipeline = [];
  if (role === "admin") {
    // default pipeline
    return pipeline.push(
      {
        $lookup: {
          from: "layouts",
          localField: "category",
          foreignField: "_id",
          as: "layouts",
        },
      },

      {
        $lookup: {
          from: "propertymanagers",
          localField: "managers",
          foreignField: "_id",
          as: "managersList",
        },
      }
    );
  }

  if (role === "company") {
    // default pipeline
    return pipeline.push(
      {
        $match: { companyDomain: data.domain },
      },

      {
        $lookup: {
          from: "layouts",
          localField: "category",
          foreignField: "_id",
          as: "layouts",
        },
      },
      {
        $lookup: {
          from: "propertymanagers",
          localField: "managers",
          foreignField: "_id",
          as: "managersList",
        },
      }
    );
  }

  if (role === "manager") {
    // default pipeline
    return pipeline.push(
      {
        $match: { _id: { $in: propertyList } },
      },

      {
        $lookup: {
          from: "layouts",
          localField: "category",
          foreignField: "_id",
          as: "layouts",
        },
      },

      {
        $lookup: {
          from: "propertymanagers",
          localField: "managers",
          foreignField: "_id",
          as: "managersList",
        },
      }
    );
  }
}

function evaluateFilters(data) {
  let items = {};
  if (data.filter) {
    if (data.propertyName && data.propertyName !== "") {
      filter = {
        ...filter,
        "main.property": new RegExp(data.propertyName, "i"), // Todo ask for regex type
      };
    }

    if (data.companyName && data.companyName !== "") {
      filter = {
        ...filter,
        fullName: new RegExp(data.applicantName, "i"),
      };
    }

    if (data.managerName && data.managerName !== "") {
      filter = {
        ...filter,
        phone: data.applicantPhone,
      };
    }
  }
  return filter;
}

function getFilters(query) {
  let filter = {};

  if (query.name) {
    filter = {
      ...filter,
      companyDomain: query.name,
    };
  }

  if (query.city) {
    filter = {
      ...filter,
      location: new RegExp(query.city, "i"),
    };
  }

  if (query.propertyName) {
    filter = {
      ...filter,
      title: new RegExp(query.propertyName, "i"),
    };
  }

  return filter;
}

// create property filter object on the basis of (property name, city, status, property id, manager, category, date added (date range))
function createPropertyFilter(data) {
  let filter = {};
  if (data?.title && data?.title !== "") {
    filter = {
      ...filter,
      title: data?.title,
    };
  }
  if (data?.company && data?.company !== "") {
    filter = {
      ...filter,
      companyID: data?.company,
    };
  }
  if (data?.location && data?.location !== "") {
    filter = {
      ...filter,
      location: data?.location,
    };
  }

  if (data?.category && data?.category !== "") {
    filter = {
      ...filter,
      category: ObjectID(data?.category),
    };
  }

  if (data?.manager && data?.manager !== "") {
    filter = {
      ...filter,
      managers: ObjectID(data?.manager),
    };
  }

  if (data?.status && data?.status !== "") {
    filter = {
      ...filter,
      status: data?.status,
    };
  }

  if (data?.propertyId && data?.propertyId !== "") {
    filter = {
      ...filter,
      primaryID: new RegExp(data?.propertyId, "i"),
    };
  }

  if (data?.dateRange && data?.dateRange !== "") {
    const dateRange = data?.dateRange?.split("=");
    const startDate = new Date(dateRange[0]);
    const endDate = new Date(dateRange[1]);

    filter = {
      ...filter,
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
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
