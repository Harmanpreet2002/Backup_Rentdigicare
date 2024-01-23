const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const logger = require("../Logger/LoggerFactory").getProductionLogger();
const { uploadTicketDocumentsToS3 } = require('../utils/bucket');

// PDF Generation
var htmlToPdf = require("pdf-creator-node");

// Dependencies for file uploading documents and stream downloading of documents
const multer = require("multer");
const admZip = require("adm-zip");

// Importing template
const applicantTemplate = require("../Documents/ApplicantTemplate");

// imporing database models
const Applicant = require("../Database/Applicant");
const Property = require("../Database/Property");
const Customer = require("../Database/Customer");
const { base } = require("../Database/Applicant");
const Manager = require("../Database/PropertyManager");
const Admin = require("../Database/Admin");
const Company = require("../Database/Company");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const Email = require("../utils/Email");
const ObjectId = require("mongodb").ObjectID;
const axios = require("axios");

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

// Upload Documents for property
router.post("/upload-documents", upload.array("file", 10), async (req, res) => {
  // const zip = new admZip();
  // creating folder for applicants file uploads
  // let dir = `uploads/applicant/${req.headers.id}`;
  try {
    // if (!fs.existsSync(dir)) {
    //   fs.mkdirSync(dir);
    // }
   
    if (req.files) {
      // req.files.forEach((file) => {
      //   zip.addLocalFile(file.path);
      // });
      // if (!fs.existsSync(dir + "/applicant-one.zip")) {
      //   fs.writeFileSync(
      //     `uploads/applicant/${req.headers.id}/applicant-one.zip`,
      //     zip.toBuffer()
      //   );
      //   const documentUpdateRes = await Applicant.updateOne(
      //     { _id: req.headers.id },
      //     {
      //       $set: {
      //         totalDocuments: 1,
      //       },
      //     }
      //   );
      // } else {
      //   fs.writeFileSync(
      //     `uploads/applicant/${req.headers.id}/applicant-two.zip`,
      //     zip.toBuffer()
      //   );
      //   const documentUpdateRes = await Applicant.updateOne(
      //     { _id: req.headers.id },
      //     {
      //       $set: {
      //         totalDocuments: 2,
      //       },
      //     }
      //   );
      // }
      await Promise.all(
        req.files.map(async (file) => {
          const filename = `${req.headers.id}_${Date.now()}_${file.filename}`;
          await uploadTicketDocumentsToS3(process.env.DO_SPACES_NAME, filename, file.path, 'applicant');
          const filePath = `${process.env.BUCKET_URL}applicant/${filename}`;
          let applicant = await Applicant.updateOne({ _id: req.headers.id }, { $push: { documents: filePath } })
          if (req.headers.applicant1) {
            let applicant1 = await Applicant.updateOne({ _id: req.headers.id },
              {
              $push: { 'applicants.0.documents': filePath },
              }
            )
          } else if (req.headers.applicant2) {
            let applicant2 = await Applicant.updateOne({ _id: req.headers.id },
              {
                $push: { 'applicants.1.documents': filePath },
              }
            )
          }
        })
      );
    }
    res.json({
      status: 201,
      message: "Successfully uploaded !",
    });
  } catch (error) {
    console.log(error);
    logger.error(error);
    res.json({
      status: 500,
      message: "Something went wrong !",
    });
  }
});

// Getting Applications for Admin, company, manager
router.post("/list", PaginatedResults(Applicant), async (req, res) => {
  console.log(res.totalFilterResult, "SDDDD");
  const applicationTotal = res.totalFilterResult.reduce((acc, count) => {
    acc[count._id] = count.count;
    acc["Total"] = (acc["Total"] || 0) + count.count;
    return acc;
  }, {});
  res.json({
    status: 200,
    total: applicationTotal,
    message: "The resources has been fetched",
    results: res.paginatedResults,
    filterPropertyNames: res.filterPropertyNames,
  });
});

router.get("/updatemany", async (req, res) => {
  try {
    const applicants = await Manager.find({});
    let update;
    let result;
    if (applicants.length > 0) {
      update = Promise.all(
        applicants.map((applicant, index) => {
          return new Promise(async function (resolve, reject) {
            const updates = await Manager.updateOne({ _id: applicant._id }, [
              {
                $set: {
                  primaryID:
                    "MNG" +
                    Math.random().toString().slice(-4) +
                    Date.now().toString().slice(-4),
                },
              },
            ]);
            resolve(updates);
          });
        })
      );

      update.then((data) => {
        //console.log(data, "data")
        result = data;
        res.json({
          status: 200,
          length: data.length,
          data,
          message: "The resources has been fetched",
        });
      });
    }
  } catch (error) {
    console.log("error: ", error);
    res.json({
      status: 500,
      message: "Something went wrong !",
    });
  }
});

router.post("/total", async (req, res) => {
  try {
    const role = req.body.role;
    let domain = req.body.domain;
    if (!role) {
      return res.json({
        status: 201,
        message: "role and domain is required",
        success: false,
      });
    }
    let matchConditions = {};
    if (role == "manager") {
      const propertyManagerID = req.body.managerID
        ? ObjectId(req.body.managerID)
        : null;

      let manager = "";
      if (propertyManagerID !== null) {
        manager = await Manager.findOne({ _id: propertyManagerID }).select({
          properties: 1,
        });
      }

      if (manager !== "") {
        matchConditions = { "main.propertyID": { $in: manager.properties } };
      }
    } else if (role == "company") {
      matchConditions = { companyDomain: domain };
    } else if (role == "admin") matchConditions = {};
    const total = await Applicant.find(matchConditions).countDocuments();

    const pending = await Applicant.find(matchConditions).countDocuments({
      status: "Pending",
    });
    const approved = await Applicant.find(matchConditions).countDocuments({
      status: "Approved",
    });
    const denied = await Applicant.find(matchConditions).countDocuments({
      status: "Denied",
    });

    res.json({
      status: 200,
      message: "Total Application Received !",
      totalApplications: { total, pending, approved, denied },
    });
  } catch (error) {
    logger.error(error);
    res.json({
      status: 500,
      message: error.message,
    });
  }
});

// get single applicant
router.post("/getOne", authToken, async (req, res) => {
  try {
    const applicant = await Applicant.findOne({ _id: req.body.id }, { __v: 0 });
    res.json({
      status: 200,
      message: "The resources has been fetched",
      applicant: applicant,
    });
  } catch (error) {
    logger.error(error);
    res.json({
      status: 500,
      message: "Something Went Wrong !",
    });
  }
});

// first entry of application
router.get("/first-application-date", async (req, res) => {
  try {
    const firstApplication = await Applicant.findOne().select({ createdAt: 1 });
    res.json({
      status: 200,
      message: "Resource fetched !",
      fromDate: firstApplication.createdAt,
    });
  } catch (error) {
    logger.error(error);
    res.json({
      status: "500",
      message: "Something went wrong !",
    });
  }
});

// get all property names
router.post("/getPropertyNameFilterValue", async (req, res) => {
  try {
    const filter = await generatePropertyFilter(req.body.role, req.body);
    console.log("filter is", filter);
    const propertyNames = await Applicant.find(filter);
    if (!propertyNames.length > 0)
      return res.json({
        status: 200,
        message: "data fetched !",
      });
    let properties = [
      ...new Set(propertyNames.map((v) => v.main?.property)),
    ].map((item, element) => {
      return { title: item };
    });
    res.json({
      status: 200,
      message: "Fetched Property Names",
      propertyNameList: properties,
    });
  } catch (error) {
    console.log(error);
    logger.error(error);
    res.json({
      status: "500",
      message: "Something went wrong !",
    });
  }
});

// applicant application status updater
router.post("/status-update", authToken, async (req, res) => {
  const applicationID = req.body.applicationID;
  const applicationStatus = req.body.applicationStatus;
  try {
    if (applicationID && applicationStatus) {
      const application = await Applicant.updateOne(
        { _id: applicationID },
        {
          $set: {
            status: applicationStatus,
          },
        }
      );

      try {
        const application = await Applicant.findOne({ _id: applicationID });
        const company = await Company.findOne({
          domain: application.companyDomain,
        });
        const data = {
          owner: company.ownerFirstName,
          applicantName: application.applicants[0].firstname,
          applicantEmail: application.applicants[0].email,
          propertyName: application.main.property,
          propertyLayout: application.main.layout,
          companyName: company.name,
          applicationStatus: application.status,
          logo:company?.logo
        };
        // const options = Email.generateOptions(company.email, "APPLICATION_STATUS_CHANGE_EMAIL_TO_COMPANY", data);
        // const isEmailSent = await Email.send(options)
      } catch (error) {
        console.log(error);
      }
      res.json({
        status: 201,
        message: "Application Status Updated.",
        application: application,
      });
    } else {
      res.json({
        status: 400,
        message: "Post Data Required",
      });
    }
  } catch (error) {
    logger.error(error);
    res.json({
      status: 500,
      message: "Something went wrong !",
    });
  }
});

//  Adding new Applicant
router.post("/add", async (req, res) => {
  try {
    console.log('new');
    const oldApplicant = false;
    if (!oldApplicant) {
      let totalApplicant = 1;
      const applicantList = [req.body.applicants[0]];

      // if we have two application field
      if (req.body.applicants.length === 2) {
        totalApplicant = 2;
        applicantList.push(req.body.applicants[1]);
      }

      // top level application information
      const applicantPhone = req.body.applicants[0].phone;
      const haveLastName = !!req.body.applicants[0].lastname;
      const applicantFullName = haveLastName
        ? req.body.applicants[0].firstname +
        " " +
        req.body.applicants[0].lastname
        : req.body.applicants[0].firstname;

      const newApplicant = await Applicant.create({
        status: "Pending",
        main: req.body.main,
        fullName: applicantFullName,
        phone: applicantPhone,
        totalApplicants: totalApplicant,
        applicants: applicantList,
        residePersons: req.body.residePersons,
        emergencyContacts: req.body.emergencyContacts,
        pets: req.body.petsInformation,
        signatures: req.body.signatures,
        companyDomain: req.body.companyDomain,
      });

      const secondApplicantData =
        totalApplicant === 2
          ? {
            email: req.body.applicants[1].email,
            firstname: req.body.applicants[1].firstname,
            companyDomain: req.body.companyDomain,
          }
          : {};

      try {
        const emailSent = sendEmails(
          {
            propertyID: req.body.main.propertyID,
            property: req.body.main.property,
            propertyLayout: req.body.main.layout,
            companyDomain: req.body.companyDomain,
          },
          {
            email: req.body.applicants[0].email,
            firstname: req.body.applicants[0].firstname,
            companyDomain: req.body.companyDomain,
          },
          secondApplicantData
        );
      } catch (error) {
        logger.error(error);
      }

      res.json({
        status: 201,
        id: newApplicant._id,
        message: "Application Registered !",
      });
    } else {
      res.json({
        status: 400,
        message: "Already Applicant",
      });
    }
  } catch (error) {
    console.log(error);
    logger.error(error);
    res.json({
      status: 500,
      message: "Something Went Wrong !",
    });
  }
});

router.get("/signatures/", (req, res) => {
  const data = req.body.url;
  var base64Data = data.replace(/^data:image\/png;base64,/, "");
  var img = Buffer.from(base64Data, "base64");
  res.writeHead(200, {
    "Content-Type": "image/png",
    "Content-Length": img.length,
  });
  res.end(img);
  res.send("ok");
});

// generate nice pdf
router.get("/pdf", async (req, res) => {
  const applicantId = req.query.id;
  if (!applicantId) {
    res.json({
      status: 400,
      message: "Bad Request !",
    });
  } else {
    let options = {
      format: "A4",
      orientation: "portrait",
    };
    try {
      const applicant = await Applicant.findOne({ _id: applicantId });
      // checking for total applicant
      if (applicant.totalApplicants === 2) {
        console.log("two is working");
        // getting signature of both applicants
        let signatureOne = applicant.signatures[0].signature.replace(
          /^data:image\/png;base64,/,
          ""
        );
        let signatureTwo = null;
        if (applicant.signatures[1].signature) {
          signatureTwo = applicant.signatures[1].signature.replace(
            /^data:image\/png;base64,/,
            ""
          );
        }
        const content = await applicantTemplate(
          applicant,
          signatureOne,
          signatureTwo,
          2
        );
        let document = {
          html: content,
          data: {
            test: "test",
          },
          path: "Documents/applicant.pdf",
          type: "",
        };

        htmlToPdf
          .create(document, options)
          .then((info) => {
            let filePath = path.join(__dirname, `../Documents/applicant.pdf`);
            let stat = fs.statSync(filePath);
            res.download(filePath);
          })
          .catch((error) => {
            logger.error(error);
            res.json({
              status: 400,
              message: "Can't Download Requested Resource",
            });
          });
      } else {
        // getting signature of single applicant only
        let signatureOne = applicant.signatures[0].signature.replace(
          /^data:image\/png;base64,/,
          ""
        );
        const content = await applicantTemplate(
          applicant,
          signatureOne,
          null,
          1
        );
        let document = {
          html: content,
          data: {
            test: "test",
          },
          path: "Documents/applicant.pdf",
          type: "",
        };

        htmlToPdf
          .create(document, options)
          .then((info) => {
            let filePath = path.join(__dirname, `../Documents/applicant.pdf`);
            let stat = fs.statSync(filePath);
            console.log("working fine");
            res.download(filePath);
          })
          .catch((error) => {
            console.log(error);
            logger.error(error);
            res.json({
              status: 400,
              message: "Can't Download Requested Resource1111",
            });
          });
      }
    } catch (error) {
      logger.error(error);
      res.json({
        status: 500,
        message: "Unable to fetch Resource",
      });
    }
  }
});

// Download Documents for Applicant
router.get("/download-document", (req, res) => {
  try {
    let dir = `uploads/applicant/${req.query.id}`;
    if (req.query.documents === "1") {
      if (fs.existsSync(dir + "/applicant-one.zip")) {
        let filePath = path.join(
          __dirname,
          `../uploads/applicant/${req.query.id}/applicant-one.zip`
        );
        res.download(filePath);
      } else {
        res.json({
          status: 404,
          message: "No Documents Found",
        });
      }
    } else if (req.query.documents === "2") {
      if (fs.existsSync(dir + "/applicant-two.zip")) {
        let filePath = path.join(
          __dirname,
          `../uploads/applicant/${req.query.id}/applicant-two.zip`
        );
        let stat = fs.statSync(filePath);
        res.download(filePath);
      } else {
        res.json({
          status: 404,
          message: "No Documents Found",
        });
      }
    } else {
      res.json({
        status: 400,
        message: "Bad Request !",
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

router.post('/download-zip', async (req, res) => {
  const { urls } = req.body;
  try {
    const zip = new admZip();

    for (const url of urls) {
      const response = await axios.get(url.url, { responseType: 'arraybuffer' });
      if (response.status === 200) {
        const buffer = Buffer.from(response.data);
        const fileName = url.name;
        zip.addFile(fileName, buffer);
      }
    }

    const zipBuffer = zip.toBuffer();
    res.set('Content-Type', 'application/zip');
    res.set('Content-Disposition', 'attachment; filename=documents.zip');
    res.send(zipBuffer);
  } catch (error) {
    console.error('Error creating zip:', error);
    res.status(500).send('Error creating zip');
  }
});



// TO delete Applicants Application
router.delete("/delete", authToken, async (req, res) => {
  const userID = req.query.userID;
  const applicationID = req.query.applicationID;

  try {
    const validPrivileged = await checkDeletePrivileged(userID);
    if (validPrivileged) {
      const response = await deleteApplication(applicationID);
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
      message: "Something Went Wrong",
    });
  }
});
//application filter for graph
router.get("/dashboardfilter", async (req, res) => {
  console.log(req.query, '----------------')
  try {
    let applicant = "";
    var searchCriteria = {};

    const role = req.query.role;
    let domain = req.query.domain;
    if (!role) {
      return res.json({
        status: 201,
        message: "role and domain is required",
        success: false,
      });
    }
    if (req.query.startDate && req.query.endDate) {
      searchCriteria.createdAt = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate),
      };
    }

    if (req.query.filterBy === "barChart") {
      let matchConditions = {};
      const propertyManagerID = req.query.propertyManagerID !== ''
        ? ObjectId(req.query.propertyManagerID)
        : null;
      const propertyID = req.query.propertyId !== ''
        ? req.query.propertyId
        : null;
      // if (role == "manager") {

      //   if (propertyManagerID !== null) {
      //     matchConditions = {
      //       managers: { $in: [propertyManagerID] },
      //     };
      //   }
      // } else if (role == "company") {
      //   searchCriteria.companyDomain = domain;
      // }

   

      if (propertyManagerID !== null && role === "company") {
        matchConditions = {
          managers: { $in: [propertyManagerID] },
        };
      } else {
        if (role === "company" && propertyManagerID === null) {
          searchCriteria.companyDomain = domain;
        }
      }

      if (propertyManagerID !== null && role === "manager") {
        matchConditions = {
          managers: { $in: [propertyManagerID] },
        };
      }
      if (propertyID !== null) {
        matchConditions = {
          "_id": ObjectId(propertyID),
        };
      }
      const applicant2 = await Applicant.aggregate([
        {
          $match: matchConditions,
        }])
      console.log(matchConditions,'matchConditions')
      console.log(searchCriteria,'searchCriteria')
      console.log(applicant2.length,'---applicant2------')



        // if (propertyID !== null) {
        //   applicant = await Applicant.aggregate([
        //     {
        //       $match: matchConditions,
        //     },
        //     {
        //       $addFields: {
        //         propertyId: { $toString: "$_id" },
        //       },
        //     },
        //     // {
        //     //   $lookup: {
        //     //     from: "applicants",
        //     //     localField: "propertyId",
        //     //     foreignField: "main.propertyID",
        //     //     as: "applicant",
        //     //     pipeline: [
        //     //       {
        //     //         $match: searchCriteria,
        //     //       },
        //     //       {
        //     //         $group: {
        //     //           _id: {
        //     //             month: {
        //     //               $dateToString: { format: "%Y-%m", date: "$createdAt" },
        //     //             },
        //     //             year: {
        //     //               $dateToString: { format: "%Y", date: "$createdAt" },
        //     //             },
        //     //           },
        //     //           total: { $sum: 1 },
        //     //           pending: {
        //     //             $sum: {
        //     //               $cond: {
        //     //                 if: { $eq: ["$status", "Pending"] },
        //     //                 then: 1,
        //     //                 else: 0,
        //     //               },
        //     //             },
        //     //           },
        //     //           approved: {
        //     //             $sum: {
        //     //               $cond: {
        //     //                 if: { $eq: ["$status", "Approved"] },
        //     //                 then: 1,
        //     //                 else: 0,
        //     //               },
        //     //             },
        //     //           },
        //     //           denied: {
        //     //             $sum: {
        //     //               $cond: {
        //     //                 if: { $eq: ["$status", "Denied"] },
        //     //                 then: 1,
        //     //                 else: 0,
        //     //               },
        //     //             },
        //     //           },
        //     //         },
        //     //       },
        //     //       {
        //     //         $sort: { "_id.year": 1, "_id.month": 1 },
        //     //       },
        //     //     ],
        //     //   },
        //     // },
        //     // {
        //     //   $unwind: "$applicant",
        //     // },
        //     // {
        //     //   $project: {
        //     //     applicant: 1,
        //     //     _id: 0,
        //     //   },
        //     // },
        //   ]);
        //   console.log(applicant,'-------------')
        // }  
      applicant = await Property.aggregate([
        {
          $match: matchConditions,
        },
        {
          $addFields: {
            propertyId: { $toString: "$_id" },
          },
        },
        {
          $lookup: {
            from: "applicants",
            localField: "propertyId",
            foreignField: "main.propertyID",
            as: "applicant",
            pipeline: [
              {
                $match: searchCriteria,
              },
              {
                $group: {
                  _id: {
                    month: {
                      $dateToString: { format: "%Y-%m", date: "$createdAt" },
                    },
                    year: {
                      $dateToString: { format: "%Y", date: "$createdAt" },
                    },
                  },
                  total: { $sum: 1 },
                  pending: {
                    $sum: {
                      $cond: {
                        if: { $eq: ["$status", "Pending"] },
                        then: 1,
                        else: 0,
                      },
                    },
                  },
                  approved: {
                    $sum: {
                      $cond: {
                        if: { $eq: ["$status", "Approved"] },
                        then: 1,
                        else: 0,
                      },
                    },
                  },
                  denied: {
                    $sum: {
                      $cond: {
                        if: { $eq: ["$status", "Denied"] },
                        then: 1,
                        else: 0,
                      },
                    },
                  },
                },
              },
              {
                $sort: { "_id.year": 1, "_id.month": 1 },
              },
            ],
          },
        },
        {
          $unwind: "$applicant",
        },
        {
          $project: {
            applicant: 1,
            _id: 0,
          },
        },
      ]);

      console.log(applicant.length,"applicant-----------------")  
    }
    const actual = applicant.map((v) => v.applicant);
    const expected = actual.reduce((acc, cur, index) => {
      const month = cur._id.month;
      if (!acc[month]) {
        acc[month] = {
          _id: { month },
          pending: 0,
          total: 0,
          approved: 0,
          denied: 0,
        };
      }
      acc[month].pending += cur.pending;
      acc[month].total += cur.total;
      acc[month].approved += cur.approved;
      acc[month].denied += cur.denied;
      return acc;
    }, {});
    const results = Object.entries(expected).map(([month, value]) => {
      value.month = month;
      return value;
    });
    // console.log("applicant",applicant[0].applicant)
    // console.log(results,'-results')
    
    res.json({
      status: 201,
      data: results.sort((a, b) => {
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

module.exports = router;

// To successful application email
async function sendEmails(propertyData, applicantOneData, applicantTwoData) {
  try {
    const company = await Company.findOne({
      domain: propertyData.companyDomain,
    });
    const applicantsList = [applicantOneData];
    if (applicantTwoData.email) {
      applicantsList.push(applicantTwoData);
    }

    // sending  confirmation email to applicant
    const managersList = await getManagersList(propertyData.propertyID);
    const managerPhoneNumbers = [];
    managersList.forEach((manager) => {
      managerPhoneNumbers.push(manager.phone + " ");
    });
    for (const applicant of applicantsList) {
      const data = {
        applicantName: applicant.firstname,
        propertyName: propertyData.property,
        propertyLayout: propertyData.propertyLayout,
        companyName: company.name,
        managersNumbers: managerPhoneNumbers,
        companyDomain: applicant.companyDomain,
        logo:company?.logo
      };
      const options = Email.generateOptions(
        applicant.email,
        "APPLICATION_REGISTERED_EMAIL_TO_APPLICANT",
        data
      );
      const isEmailSent = await Email.send(options);
    }

    // Sending email to property manager
    const managerList = await getManagersList(propertyData.propertyID);
    console.log('propertyData: ', propertyData);
    console.log('managerList: ', managerList);
    for (const manager of managerList) {
      const data = {
        propertyManager: manager.firstname,
        propertyName: propertyData.property,
        propertyLayout: propertyData.propertyLayout,
        companyName: company.name,
        applicantEmail: applicantsList[0].email,
        applicantName: applicantsList[0].firstname,
        companyName: company.name,
        logo:company?.logo
      };
      const options = Email.generateOptions(
        manager.email,
        "NEW_APPLICATION_MAIL_TO_MANAGER",
        data
      );
      const isEmailSent = await Email.send(options);
      console.log(isEmailSent);
    }
  } catch (error) {
    logger.error(error);
  }
}

// To fetch admins email addresses
async function getAdminsData() {
  const admins = await Admin.find({}).select({
    _id: 0,
    email: 1,
    firstname: 1,
  });
  if (admins != null) {
    return admins;
  }
  return [];
}
// TO fetch emails of assigned managers
async function getManagersList(propertyID) {
  const managerDataList = [];
  try {
    const property = await Property.aggregate([
      {
        $match: { _id: mongoose.Types.ObjectId(propertyID) },
      },
      {
        $lookup: {
          from: "propertymanagers",
          localField: "managers",
          foreignField: "_id",
          as: "managerList",
        },
      },
    ]);
    if (property.length !== 0) {
      if (property[0].managerList.length !== 0) {
        property[0].managerList.forEach((manager) => {
          managerDataList.push({
            firstname: manager.firstname,
            email: manager.email,
            phone: manager.mobile,
          });
        });
      }
    }
  } catch (error) {
    logger.error(error);
  }

  return managerDataList;
}

// Delete Router functions
async function deleteApplication(applicationID) {
  try {
    // Deleting properties of company
    const applicationDeleteRes = await Applicant.deleteOne({
      _id: applicationID,
    });
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
// to check deleting privilege for user
async function checkDeletePrivileged(userID) {
  return (
    (await Admin.exists({ _id: userID })) ||
    (await Company.exists({ _id: userID })) ||
    (await Manager.exists({ _id: userID }))
  );
}

// Add customer to the database when when accepted
// Add Customer
async function addCustomer(email) {
  const password = generatePassword();
  await create(email, password, Customer);
  return password;
}

async function create(email, password, database) {
  const emailExits = await database.exists({ email: email });
  if (!emailExits) {
    const hash = hashPassword(password);
    const user = await database.create({ email: email, password: hash });
  } else {
    console.log("User Already Exists in Specified DB");
  }
}

async function deleteServingFiles(dirPath) {
  fs.readdir(dirPath, (err, files) => {
    if (err) {
      console.log("Empty Dir");
    } else {
      for (const file of files) {
        fs.unlinkSync(path.join(dirPath, file), (err) => {
          if (err) console.log(error);
        });
      }
    }
  });
}

async function serveSignature(base64Raw) {
  var base64Data1 = base64Raw[0].signature.replace(
    /^data:image\/png;base64,/,
    ""
  );
  var base64Data2 = base64Raw[1].signature.replace(
    /^data:image\/png;base64,/,
    ""
  );

  fs.writeFile(
    __dirname + "/../Static/signatures/signature1.png",
    base64Data1,
    "base64",
    function (err) {
      if (err) {
        return false;
      }
    }
  );

  fs.writeFile(
    __dirname + "/../Static/signatures/signature2.png",
    base64Data2,
    "base64",
    function (err) {
      if (err) return false;
    }
  );

  return true;
}

// uploading Documents and sending them to s3 bucket or digital ocean spaces
function errorFunction(err) {
  if (err instanceof multer.MulterError) {
    // A Multer error occurred when uploading.
    res
      .status(500)
      .send({ error: { message: `Server uploading error: ${err.message}` } })
      .end();
    return;
  } else if (err) {
    // An unknown error occurred when uploading.
    if (err.name == "ExtensionError") {
      res
        .status(413)
        .send({ error: { message: err.message } })
        .end();
    } else {
      res
        .status(500)
        .send({ error: { message: `unknown uploading error: ${err.message}` } })
        .end();
    }
    return;
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
  const saltRounds = 10;
  const hash = bcrypt.hashSync(plainPassword, saltRounds);
  return hash;
}

function PaginatedResults(model) {
  return async (req, res, next) => {
    try {
      const page = parseInt(req.query.page);
      const limit = parseInt(req.query.limit);
      const role = req.body.role;

      if (isNaN(page) || isNaN(limit) || !(page > 0) || !(limit > 0) || !role) {
        res.json({
          status: 400,
          message: "Bad Request !",
        });
      } else {
        let filter = {};
        let sort = req.body.sort ? req.body.sort : { createdAt: -1 };
        filter = await generateFilter(role, req.body);

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const results = {};

        try {
          filter = await generateFilter(role, req.body);
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
          results.applications = await model
            .find(filter, { __v: 0 })
            .sort(sort)
            .limit(limit)
            .skip(startIndex)
            .exec();
          res.paginatedResults = results;
          console.log(filter, "filter");
          res.totalFilterResult = await model.aggregate([
            { $match: filter },
            { $group: { _id: "$status", count: { $sum: 1 } } },
          ]);

          res.filterPropertyNames = await model
            .find(filter)
            .select({ "main.property": 1, _id: 0 });
          next();
        } catch (error) {
          logger.error(error);
          res.json({
            status: 500,
            message: error.message,
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
}

async function generateFilter(role, data) {
  if (role === "admin") {
    // Custom Search filters
    return {
      ...evaluateFilters(data),
    };
  }

  if (role === "company") {
    // default company filter
    return {
      companyDomain: data.domain,
      ...evaluateFilters(data),
    };
  }

  if (role === "manager") {
    // default manager filters

    const manager = await Manager.findOne({ _id: data.managerID }).select({
      properties: 1,
    });
    const stringProperties = manager.properties.map((property) =>
      property.toString()
    );
    return {
      "main.propertyID": { $in: stringProperties },
      ...evaluateFilters(data),
    };
  }
}

async function generatePropertyFilter(role, data) {
  if (role === "admin") {
    // Custom Search filters
    return {};
  }

  if (role === "company") {
    // default company filter
    return {
      companyDomain: data.domain,
    };
  }

  if (role === "manager") {
    // default manager filters
    const manager = await Manager.findOne({ _id: data.managerID }).select({
      properties: 1,
    });
    return {
      "main.propertyID": { $in: manager.properties },
    };
  }
}

function evaluateFilters(data) {
  let filter = {};
  if (data.filter) {
    if (data.propertyName && data.propertyName !== "") {
      filter = {
        ...filter,
        "main.property": { $regex: data.propertyName, $options: "i" }, // Todo ask for regex type
      };
    }

    if (data.applicantName && data.applicantName !== "") {
      filter = {
        ...filter,
        "applicants.firstname": { $regex: data.applicantName, $options: "i" },
      };
    }

    if (data.source && data.source !== "") {
      filter = {
        ...filter,
        "main.source": { $eq: data.source },
      };
    }
    if (data.applicantPhone && data.applicantPhone !== "") {
      filter = {
        ...filter,
        "applicants.phone": { $regex: data.applicantPhone, $options: "i" },
      };
    }

    if (data.applicationStatus && data.applicationStatus !== "") {
      filter = {
        ...filter,
        status: new RegExp("^" + data.applicationStatus + "$", "i"),
      };
    }

    if (data.fromDate) {
      if (data.toDate) {
        let fromDate = new Date(data.fromDate);
        let toDate = new Date(data.toDate);
        filter = {
          ...filter,
          createdAt: { $gte: fromDate, $lte: toDate }, // include custom to date
        };
      } else {
        let todayDate = new Date();
        let fromDate = new Date(data.fromDate);
        filter = {
          ...filter,
          createdAt: { $gte: fromDate, $lte: todayDate },
        };
      }
    }
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
