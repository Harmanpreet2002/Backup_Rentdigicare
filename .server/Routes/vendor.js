const router = require("express").Router();
const jwt = require("jsonwebtoken");
const async = require("async");
const Vendor = require("../Database/vendor");


const Email = require("../utils/Email");
const bcrypt = require("bcrypt");
const { query } = require("express");
const multer = require("multer");
const admZip = require("adm-zip");
const fs = require("fs");
const Ticket = require("../Database/Ticket");
const Company = require("../Database/Company");
const { uploadTicketDocumentsToS3 } = require("../utils/bucket");
const logger = require("../Logger/LoggerFactory").getProductionLogger();
const ObjectId = require("mongodb").ObjectId;

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

// Register Vendor
router.post(
  "/register",
  /*authToken,*/ async (req, res) => {
    try {
    await  Vendor.collection.dropIndex("agency_name_1", (error) => {
        if (error) {
          console.error("Error dropping index:", error);
        } else {
          console.log("Index dropped successfully.");
        }
      });
      await Vendor.findOneAndDelete({
        email: req.body.email,
        status: "Rejected",
      });

      const exist = await Vendor.findOne({
        email: req.body.email,
        status: { $in: ["Verified", "Suspended"] },
      });
      
      if (exist) {
        return res.status(201).send({
          success: false,
          status: 201,
          errorMessage: "Email already exists",
        });
      }
      const newVendor = new Vendor(req.body);

      const addedVendor = await newVendor.save();

      res.status(200).send({ success: true, addedVendor });
    } catch (e) {
      console.log(e);
      res.status(201).send({ success: false, errorMessage: e });
    }
  }
);

// vendor status updater
router.post("/status-update", async (req, res) => {
  const vendorID = req.body.vendorID ? ObjectId(req.body.vendorID) : null;
  const vendorStatus = req.body.vendorStatus;
  try {
    const vendor = await Vendor.findOne({ id: vendorID });
    if (!vendor) throw new Error(400, "No vendor found");
    await Vendor.findOneAndUpdate(
      { _id: vendorID },
      {
        status: vendorStatus,
      },
      {
        new: true,
      }
    );
    res.json({
      status: 201,
      message: "Vendor status updated!",
    });
  } catch (error) {
    logger.error(error);
    res.json({
      status: 500,
      message: error.message,
    });
  }
});

router.get(
  "/get_vendors",
  /*authToken,*/ async (req, res) => {

    try {
      const {
        first_name,
        city,
        contact,
        specialties,
        rating,
        status,
        primaryID,
        companyID
      } = req.query;
      let query = {};
      if (first_name) {
        query.first_name = { $regex: first_name, $options: "i" };
      }
      if (city) {
        query.address = { $regex: city, $options: "i" };
      }
      if (contact) {
        query.contact_no = { $eq: contact };
      }
      if (rating) {
        query.rating = { $in: [parseInt(rating)] };
      }

      if (primaryID) {
        query.primaryID = primaryID;
      }
      if (status) {
        query.status = { $regex: status, $options: "i" };
      }
      const specialtiesId = specialties ? ObjectId(specialties) : null;

      if (specialtiesId) {
        query.specialties = { $in: [specialtiesId] };
      }
      if (companyID) {
        query.approvedCompanies = ObjectId(companyID);
      }
      const vendors = await Vendor.aggregate([
        {
          $lookup: {
            from: "tickets",
            localField: "_id",
            foreignField: "assignSpecificVendors",
            as: "tickets",
            pipeline: [
              {
                $group: {
                  _id: null,
                  totalRating: {
                    $avg: {
                      $convert: {
                        input: "$ratings",
                        to: "int",
                      },
                    },
                  },
                  total: { $sum: 1 },
                  open: {
                    $sum: {
                      $cond: {
                        if: { $eq: ["$status", "open"] },
                        then: 1,
                        else: 0,
                      },
                    },
                  },
                  closed: {
                    $sum: {
                      $cond: {
                        if: { $eq: ["$status", "closed"] },
                        then: 1,
                        else: 0,
                      },
                    },
                  },
                  completed: {
                    $sum: {
                      $cond: {
                        if: { $eq: ["$status", "completed"] },
                        then: 1,
                        else: 0,
                      },
                    },
                  },
                },
              },
            ],
          },
        },
        {
          $set: { rating: "$tickets.totalRating" },
        },
        {
          $lookup: {
            from: "vendorspecialties",
            localField: "specialties",
            foreignField: "_id",
            as: "specialties",
          },
        },
        { $match: query },
      ]);

      const stats = await Vendor.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            pending: {
              $sum: {
                $cond: [{ $eq: ["$status", "Pending"] }, 1, 0],
              },
            },
            verified: {
              $sum: {
                $cond: [{ $eq: ["$status", "Verified"] }, 1, 0],
              },
            },
            rejected: {
              $sum: {
                $cond: [{ $eq: ["$status", "Rejected"] }, 1, 0],
              },
            },
            suspended: {
              $sum: {
                $cond: [{ $eq: ["$status", "Suspended"] }, 1, 0],
              },
            },
          },
        },
        {
          $project: {
            total: 1,
            verified: 1,
            pending: 1,
            rejected: 1,
            suspended: 1,
            _id: 0,
          },
        },
      ]);
      res.status(200).send({ success: true, vendors, stats: stats?.[0] });
    } catch (e) {
      res.status(201).send({ success: false, errorMessage: e });
    }
  }
);

//GET COMPANY REQUESTED VENDORS
router.get(
  "/get_requested_vendors/:companyID",
  /*authToken,*/ async (req, res) => {
    try {
      const vendors = await Vendor.find({
        interestedCompanies: { $in: [req.params.companyID] },
        rejectetedCompaines: { $nin: [req.params.companyID] },
        approvedCompanies: { $nin: [req.params.companyID] },
      }).populate("specialties", "specialty");

      res.status(200).send({ success: true, vendors });
    } catch (e) {
      res.status(201).send({ success: false, errorMessage: e });
    }
  }
);

router.post(
  "/view_documents",
  /*authToken,*/ async (req, res) => {
    try {
      const vendors = await Vendor.findOne({ _id: req.body.vendor_id });

      var zipId_proof = new admZip(vendors.Id_proof);
      var zipEntrieszipId_proof = zipId_proof.getEntries(); // an array of ZipEntry records


      zipId_proof.extractAllTo("uploads/tmp", true);

      let Id_proofs = [];
      zipEntrieszipId_proof.forEach(function (zipEntry) {
        let proof_path = `/tmp/${zipEntry.entryName}`;

        Id_proofs.push(proof_path);
      });

      var zipProfile = new admZip(vendors.profile);
      var zipEntriesProfile = zipProfile.getEntries(); // an array of ZipEntry records

      // console.log(zipEntries)

      zipProfile.extractAllTo("uploads/tmp", true);

      let Profiles = [];
      zipEntriesProfile.forEach(function (zipEntry) {
        let profile_path = `/tmp/${zipEntry.entryName}`;

        Profiles.push(profile_path);
      });

      res.status(200).send({ success: true, Id_proofs, Profiles });
    } catch (e) { }
  }
);

router.post(
  "/add_company_vendor",
  /*authToken,*/ async (req, res) => {
    try {
      const { vendor_id, companyID } = req.body;

      const randomPassword = generatePassword();
      const hashPassword = generateHashPassword(randomPassword);
      const company = await Company.findById(companyID)

      const result = await Vendor.findOneAndUpdate(
        { _id: vendor_id },
        {
          password: hashPassword,
          verified: true,
          status: "Verified",
          $push: { approvedCompanies: companyID },
        },
        {
          new: true,
        }
      );
      if (result?.approvedCompanies?.length <= 1) {
        const data = {
          managerName: result.first_name,
          email: result.email,
          password: randomPassword,
          companyName: company.name,
        };
        const options = Email.generateOptions(
          data.email,
          "ADD_PROPERTY_VENDOR",
          data
        );
        const isEmailSent = await Email.send(options);
      }

      res.status(200).send({ success: true, result });
    } catch (e) {
      console.log(e);
      res.status(201).send({ success: false, errorMessage: e });
    }
  }
);

//GET COMAPNY VENDORS
router.get(
  "/get_vendors/:companyID",
  /*authToken,*/ async (req, res) => {
    console.log("hitted ")
    console.log(req.query)
    try {
      const {
        first_name,
        city,
        contact,
        specialties,
        rating,
        status,
        primaryID,
      } = req.query;
      let query = {};
      const page = req.query.page;
      const limit = req.query.limit;
      const skip = (page - 1) * limit;
      const endIndex = page * limit;
      const results = {};
      const ratings = {}
      const companyId = req.params.companyID
        ? ObjectId(req.params.companyID)
        : null;
      if (companyId) {
        query.approvedCompanies = { $in: [companyId] };
      }

      if (first_name) {
        query.first_name = { $regex: first_name, $options: "i" };
      }
      if (city) {
        query.address = { $regex: city, $options: "i" };
      }
      if (contact) {
        query.contact_no = { $eq: contact };
      }
      if (rating) {
        ratings.rating = { $in: [parseInt(rating)] };
      }

      if (primaryID) {
        query.primaryID = primaryID;
      }
      if (status) {
        query.status = { $regex: status, $options: "i" };
      }
      const specialtiesId = specialties ? ObjectId(specialties) : null;

      if (specialtiesId) {
        query.specialties = { $in: [specialtiesId] };
      }
      const vendors = await Vendor.aggregate([
        { $match: query },
        {
          $lookup: {
            from: "tickets",
            localField: "_id",
            foreignField: "assignSpecificVendors",
            as: "tickets",
            pipeline: [
              {
                $group: {
                  _id: null,
                  totalRating: {
                    $avg: {
                      $convert: {
                        input: "$ratings",
                        to: "int",
                      },
                    },
                  },
                  total: { $sum: 1 },
                  open: {
                    $sum: {
                      $cond: {
                        if: { $eq: ["$status", "open"] },
                        then: 1,
                        else: 0,
                      },
                    },
                  },
                  closed: {
                    $sum: {
                      $cond: {
                        if: { $eq: ["$status", "closed"] },
                        then: 1,
                        else: 0,
                      },
                    },
                  },
                  completed: {
                    $sum: {
                      $cond: {
                        if: { $eq: ["$status", "completed"] },
                        then: 1,
                        else: 0,
                      },
                    },
                  },
                  avgRating: { $avg: "$ratings" },
                },
              },
            ],
          },
        },
        {
          $set: { rating: "$tickets.totalRating" },
        },
        {
          $lookup: {
            from: "vendorspecialties",
            localField: "specialties",
            foreignField: "_id",
            as: "specialties",
          },
        },
        { $match: ratings },
      ]);


      const stats = await Vendor.aggregate([
        {
          $match: query
        },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            pending: {
              $sum: {
                $cond: [{ $eq: ["$status", "Pending"] }, 1, 0],
              },
            },
            verified: {
              $sum: {
                $cond: [{ $eq: ["$status", "Verified"] }, 1, 0],
              },
            },
            rejected: {
              $sum: {
                $cond: [{ $eq: ["$status", "Rejected"] }, 1, 0],
              },
            },
            suspended: {
              $sum: {
                $cond: [{ $eq: ["$status", "Suspended"] }, 1, 0],
              },
            },
          },
        },
        {
          $project: {
            total: 1,
            verified: 1,
            pending: 1,
            rejected: 1,
            suspended: 1,
            _id: 0,
          },
        },
      ]);

      if (endIndex < stats.total) {
        results.next = {
          page: page + 1,
          limit: limit,
        };
      }

      if (skip > 0) {
        results.previous = {
          page: page - 1,
          limit: limit,
        };
      }
      res.status(200).send({ success: true, vendors, stats: stats?.[0], results: results });
    } catch (e) {
      res.status(201).send({ success: false, errorMessage: e.message });
    }
  }
);

//DELETE VENDOR REQUEST
router.post(
  "/remove_company_vendor",
  /*authToken,*/ async (req, res) => {
    try {
      const { vendor_id, companyID } = req.body;

      const result = await Vendor.findOneAndUpdate(
        { _id: vendor_id },
        {
          $push: { rejectetedCompaines: companyID },
        }
      );

      res.status(200).send({ success: true, result });
    } catch (e) {
      console.log(e);
      res.status(201).send({ success: false, errorMessage: e });
    }
  }
);

router.post(
  "/comfirm_register",
  /*authToken,*/ async (req, res) => {
    try {
      const { vendor_id } = req.body;

      const randomPassword = generatePassword();
      const hashPassword = generateHashPassword(randomPassword);

      const result = await Vendor.findOneAndUpdate(
        { _id: vendor_id },
        {
          $set: {
            password: hashPassword,
            verified: true,
          },
        },
        {
          new: true,
        }
      );

      const data = {
        managerName: result.first_name,
        email: result.email,
        password: randomPassword,
        companyName: "Rent Company",
      };
      const options = Email.generateOptions(
        data.email,
        "ADD_PROPERTY_VENDOR",
        data
      );
      const isEmailSent = await Email.send(options);

      res.status(200).send({ success: true, result });
    } catch (e) {
      console.log(e);
      res.status(201).send({ success: false, errorMessage: e });
    }
  }
);

// filter vendor
router.post(
  "/filter",
  /*authToken,*/ async (req, res) => {
    try {
      const { first_name, city, contact, specialties, rating, status } =
        req.body;

      let query = {};
      if (first_name) {
        query.first_name = { $regex: first_name, $options: "i" };
      }
      if (city) {
        query.address = { $regex: city, $options: "i" };
      }
      if (contact) {
        query.contact_no = { $eq: contact };
      }
      if (rating) {
        query.rating = { $eq: rating };
      }
      if (status) {
        query.status = { $regex: status, $options: "i" };
      }
      const specialtiesId = specialties ? ObjectId(specialties) : null;

      if (specialtiesId) {
        query.specialties = { $in: [specialtiesId] };
      }

      const filteredVendors = await Vendor.find(query);

      res.status(200).send({ success: true, filteredVendors });
    } catch (e) {
      res.status(201).send({ success: false, errorMessage: e?.message });
    }
  }
);

// Uplaod Documents for vendor
router.post("/upload-documents", upload.array("file", 10), async (req, res) => {
  try {
    // const zip = new admZip();
    if (req.files) {
      // req.files.forEach((file) => {
      //   console.log("Files", file.path);
      //   zip.addLocalFile(file.path);
      // });

      if (req.headers.type == "profile") {
        // fs.writeFileSync(
        //   `uploads/vendors/profile/${req.headers.id}.zip`,
        //   zip.toBuffer()
        // );
        const filename = req.files[0].filename;
        let pathTO = req.files[0].path
        await uploadTicketDocumentsToS3(process.env.DO_SPACES_NAME, filename, pathTO, 'vendors/profile');
        const filePath = `${process.env.BUCKET_URL}vendors/profile/${filename}`;
        const result = await Vendor.findOneAndUpdate(
          { _id: req.headers.id },
          {
            profile: filePath,
          }
        );
      } else {
        // fs.writeFileSync(
        //   `uploads/vendors/id_proof/${req.headers.id}.zip`,
        //   zip.toBuffer()
        // );
    let uploaded = []

        await Promise.all(
          req.files.map(async (file) => {
            const filename = file.filename;
            await uploadTicketDocumentsToS3(process.env.DO_SPACES_NAME, filename, file.path, 'vendors/id_proof');
            const filePath = `${process.env.BUCKET_URL}vendors/id_proof/${filename}`;
            uploaded.push(filePath);
          })
        );
        const result = await Vendor.findOneAndUpdate(
          { _id: req.headers.id },
          {
            Id_proof: uploaded,
          }
        );
      }
    }
    res.json({
      status: 200,
      message: "Successfully uploaded !",
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: 500,
      message: "Something Went Wrong",
    });
  }
});

// Update vendor Details
router.put("/update-vendor", /*authToken,*/ async (req, res) => {
  console.log(req.body,'myApi');
  try {
    const { first_name, last_name, email, contact_no, specialties, agency_name, address } = req.body;

    const existingVendor = await Vendor.findOne({ email });
    if (!existingVendor) {
      return res.status(404).send({
        success: false,
        status: 404,
        errorMessage: "Staff not found",
      });
    }

    // Update the staff data
    existingVendor.first_name = first_name;
    existingVendor.last_name = last_name;
    existingVendor.contact_no = contact_no;
    existingVendor.specialties = specialties;
    existingVendor.agency_name = agency_name;
    existingVendor.address = address;
    

    const updatedVendor = await existingVendor.save();

    res.status(200).send({
      success: true,
      status: 200,
      updatedVendor: updatedVendor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      status: 500,
      errorMessage: error.message || "Something went wrong",
    });
  }
});

router.post('/delete_vendor', async (req, res) => {
  try {
    const VendorStaff = await Vendor.findOneAndDelete({
      _id: req.body.vendor,
    });

    res.status(200).send({ success: true, VendorStaff });
  } catch (e) {
    res.status(201).send({
      success: false,
      errorMessage: e.detail || "Something went wrong",
    });
  }
})


module.exports = router;

module.exports.generatePassword = generatePassword;
module.exports.generateHashPassword = generateHashPassword;
