const router = require("express").Router();
const TechnicalStaff = require("../Database/Technical_Staff");
const Email = require("../utils/Email");
const bcrypt = require("bcrypt");
const TechnicalStaffSpeciality = require("./companyTechnicalStaffSpeciality");
const Property = require("../Database/Property");
const Company = require('../Database/Company')
const ObjectId = require("mongodb").ObjectId;
const jwt = require("jsonwebtoken");
const Ticket = require("../Database/Ticket");
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

// // Register Vendor
// router.post(
//   "/register",
//   /*authToken,*/ async (req, res) => {
//     console.log(req.body,'body is here..');
//     try {
//       await TechnicalStaff.findOneAndDelete({
//         email: req.body.email,
//         status: "Rejected",
//       });

//       const exist = await TechnicalStaff.findOne({
//         email: req.body.email,
//         status: { $in: ["Verified", "Suspended"] },
//       });
//       if (exist) {
//         return res.status(201).send({
//           success: false,
//           status: 201,
//           errorMessage: "Email already exists",
//         });
//       }
//       const newTechnicalStaff = new TechnicalStaff(req.body);

//       const addedTechnicalStaff = await newTechnicalStaff.save();

//       const randomPassword = generatePassword();
//       const hashPassword = generateHashPassword(randomPassword);

//       const result = await TechnicalStaff.findOneAndUpdate(
//         { _id: addedTechnicalStaff._id },
//         {
//           $set: {
//             password: hashPassword,
//           },
//         },
//         {
//           new: true,
//         }
//       );
//        res.status(200).send({ success: true, status: 200, addedTechnicalStaff });
//       const company = await Company.findOne({_id:addedTechnicalStaff.assigned_companies[0]})
//       const data = {
//         managerName: addedTechnicalStaff.first_name,
//         email: addedTechnicalStaff.email,
//         password: randomPassword,
//         companyName: "Rentdigicare",
//         logo:company?.logo
//       };
//       const options = Email.generateOptions(
//         data.email,
//         "ADD_TECHNICAL_STAFF",
//         data
//       );
//       const isEmailSent = await Email.send(options);
//     } catch (e) {
//       console.log(e);
//       res.status(201).send({
//         success: false,
//         status: 201,
//         errorMessage: e.detail || "Something went wrong",
//       });
//     }
//   }
// );

router.post("/register", /*authToken,*/ async (req, res) => {
  console.log(req.body, 'body is here..');
  try {
    await TechnicalStaff.findOneAndDelete({
      email: req.body.email,
      status: "Rejected",
    });

    const exist = await TechnicalStaff.findOne({
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
    const newTechnicalStaff = new TechnicalStaff(req.body);

    const addedTechnicalStaff = await newTechnicalStaff.save();

    const randomPassword = generatePassword();
    const hashPassword = generateHashPassword(randomPassword);

    const result = await TechnicalStaff.findOneAndUpdate(
      { _id: addedTechnicalStaff._id },
      {
        $set: {
          password: hashPassword,
        },
      },
      {
        new: true,
      }
    );

    const company = await Company.findOne({ _id: addedTechnicalStaff.assigned_companies[0] });
    const data = {
      managerName: addedTechnicalStaff.first_name,
      email: addedTechnicalStaff.email,
      password: randomPassword,
      companyName: "Rentdigicare",
      logo: company?.logo
    };
    const options = Email.generateOptions(data.email, "ADD_TECHNICAL_STAFF", data);
    const isEmailSent = await Email.send(options);

    res.status(200).send({ success: true, status: 200, addedTechnicalStaff });
  } catch (e) {
    console.log(e);
    res.status(201).send({
      success: false,
      status: 201,
      errorMessage: e.detail || "Something went wrong",
    });
  }
});


router.put("/update", /*authToken,*/ async (req, res) => {
  try {
    const { first_name, last_name, email, contact_no, assigned_properties, specialties, companyAssigned, assigned_companies, skills } = req.body;

    const existingStaff = await TechnicalStaff.findOne({ email });
    if (!existingStaff) {
      return res.status(404).send({
        success: false,
        status: 404,
        errorMessage: "Staff not found",
      });
    }

    // Update the staff data
    existingStaff.first_name = first_name;
    existingStaff.last_name = last_name;
    existingStaff.contact_no = contact_no;
    existingStaff.assigned_properties = assigned_properties;
    existingStaff.specialties = specialties;
    existingStaff.companyAssigned = companyAssigned;
    existingStaff.assigned_companies = assigned_companies;
    existingStaff.skills = skills;
    
    const updatedStaff = await existingStaff.save();

    res.status(200).send({
      success: true,
      status: 200,
      updatedTechnicalStaff: updatedStaff,
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


// technicalStaff status updater
router.post("/status-update", async (req, res) => {
  const staffID = req.body.staffID ? ObjectId(req.body.staffID) : null;
  const staffStatus = req.body.staffStatus;
  try {
    const techStaff = await TechnicalStaff.findOne({ id: staffID });
    if (!techStaff) throw new Error(400, "No technical staff found");
    await TechnicalStaff.findOneAndUpdate(
      { _id: staffID },
      {
        status: staffStatus,
      },
      {
        new: true,
      }
    );
    res.json({
      status: 201,
      message: "TechnicalStaff status updated!",
    });
  } catch (error) {
    logger.error(error);
    res.json({
      status: 500,
      message: error.message,
    });
  }
});
router.post("/get_technical_staff", authToken, async (req, res) => {
  try {
  
    const { first_name, contact, rating, specialties, property, primaryID } =
      req.query;
    let query = {};
    let statsFilter = {};
    const page = +req.query.page;
    const limit = +req.query.limit;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;
    const results = {};
    let companyId = ObjectId(req.user.companyId || req.user.id);

    if (req.body.body?.from == 'vendor') {
      companyId = ObjectId(req.body.body.companyId)
    }
    
    if (companyId) {
      query.assigned_companies = companyId;
      statsFilter.assigned_companies = companyId;
    }
    
    if (primaryID) {
      query.primaryID = primaryID;
      statsFilter.primaryID = primaryID;
    }

    if (first_name) {
      const [firstName, lastName] = first_name.split(' ');
      if (firstName && lastName) {
        query.$or = [
          { first_name: { $regex: firstName, $options: "i" } },
          { last_name: { $regex: lastName, $options: "i" } }
        ];
        statsFilter.$or = [
          { first_name: { $regex: firstName, $options: "i" } },
          { last_name: { $regex: lastName, $options: "i" } }
        ];
      } else if (firstName) {
        query.$or = [
          { first_name: { $regex: firstName, $options: "i" } },
          { last_name: { $regex: firstName, $options: "i" } }
        ];
        statsFilter.$or = [
          { first_name: { $regex: firstName, $options: "i" } },
          { last_name: { $regex: firstName, $options: "i" } }
        ];
      } else if (lastName) {
        query.$or = [
          { first_name: { $regex: lastName, $options: "i" } },
          { last_name: { $regex: lastName, $options: "i" } }
        ];
        statsFilter.$or = [
          { first_name: { $regex: lastName, $options: "i" } },
          { last_name: { $regex: lastName, $options: "i" } }
        ];
      }
    }

    if (contact) {
      query.contact_no = { $regex: contact, $options: "i" };
      statsFilter.contact_no = { $regex: contact, $options: "i" };
    }
    if (rating) {
      query.rating = { $in: [Number(rating)] };
      statsFilter.rating = { $in: [Number(rating)] };
    }
    if (property !== 'undefined' && property) {
      query['properties._id'] = { $in: [ObjectId(property)] };
      statsFilter['assigned_properties'] = { $in: [ObjectId(property)] };
    }
    const specialtiesId = specialties ? ObjectId(specialties) : null;

    if (specialtiesId) {
      query.specialties = {
        $elemMatch: { _id: specialtiesId }
      }
;
    }

    const stats = await TechnicalStaff.aggregate([
      {
        $match: statsFilter,
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


    const technicalStaff = await TechnicalStaff.aggregate([
      {
        $lookup: {
          from: "tickets",
          localField: "_id",
          foreignField: "assignedTo",
          as: "tickets",
          pipeline: [
            {
              $group: {
                _id: null,
                total: { $sum: 1 },
                totalRating: {
                  $avg: {
                    $convert: {
                      input: "$ratings",
                      to: "int",
                    },
                  },
                },
                open: {
                  $sum: {
                    $cond: {
                      if: { $eq: ["$status", "Open"] },
                      then: 1,
                      else: 0,
                    },
                  },
                },
                closed: {
                  $sum: {
                    $cond: {
                      if: { $eq: ["$status", "Closed"] },
                      then: 1,
                      else: 0,
                    },
                  },
                },
                completed: {
                  $sum: {
                    $cond: {
                      if: { $eq: ["$status", "Completed"] },
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
          from: "technicalstaffspecialties",
          localField: "specialties",
          foreignField: "_id",
          as: "specialties",
        },
      },
      {
        $lookup: {
          from: "properties",
          localField: "assigned_properties",
          foreignField: "_id",
          as: "assigned_properties",
        },
      },
      {
        $addFields: {
          properties: {
            $map: {
              input: "$assigned_properties",
              as: "property",
              in: { title: "$$property.title", _id: "$$property._id" }
            }
          },
          propertiesTitle: "$assigned_properties.title",
        },
      },
      {
        $match: query,
      },
      { $skip: skip },
      { $limit: limit },
    ]);
    console.log(query);
    
    const uniqueProperty = [...new Set(technicalStaff.flatMap(obj => obj.propertiesTitle))]; 
    const uniqueProperties = [...new Set(technicalStaff.flatMap(obj => obj.properties.map(property => ({ title: property.title, _id: property._id }))))];


    if (
      endIndex <
      (await TechnicalStaff.find({ assigned_companies: companyId })
        .countDocuments()
        .exec())
    ) {
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
    res
      .status(200)
      .send({ success: true, technicalStaff, uniqueProperty, uniqueProperties, stats: stats?.[0], results });
  } catch (e) {
    res.status(201).send({
      success: false,
      errorMessage: e.message || "Something went wrong",
    });
  }
});

router.post(
  "/delete_technical_staff",
  /*authToken,*/ async (req, res) => {
    try {
      const technicalStaff = await TechnicalStaff.findOneAndDelete({
        _id: req.body.technicalStaff,
      });

      res.status(200).send({ success: true, technicalStaff });
    } catch (e) {
      res.status(201).send({
        success: false,
        errorMessage: e.detail || "Something went wrong",
      });
    }
  }
);

// Add Speciality
router.post(
  "/add_speciality",
  /*authToken,*/ async (req, res) => {
    try {
      const specialityExist = await TechnicalStaffSpeciality.findOne({
        createdByCompany: ObjectId(req.body.createdByCompany),
        speciality: req.body.speciality,
      });
      if (specialityExist !== null) {
        return res
          .status(202)
          .send({ success: false, errorMessage: "Specialty already Exists" });
      }
      if (specialityExist === null) {
        const newSpeciality = new TechnicalStaffSpeciality(req.body);
        const addedSpeciality = await newSpeciality.save();
        res.status(200).send({ success: true, addedSpeciality });
      }
    } catch (e) {
      console.log(e);
      res.status(400).send({ success: false, errorMessage: e });
    }
  }
);

// Get Speciality
router.post("/get_speciality", authToken, async (req, res) => {
  try {
    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;
    const results = {};
    const companyID = ObjectId(req.user.companyId || req.user.id);
    const specialties = await TechnicalStaffSpeciality.find({
      createdByCompany: companyID,
    })
      .skip(skip)
      .limit(limit);
    const total = await TechnicalStaffSpeciality.find({
      createdByCompany: companyID,
    }).countDocuments();
    if (
      endIndex <
      (await TechnicalStaffSpeciality.find({
        createdByCompany: companyID,
      })
        .countDocuments()
        .exec())
    ) {
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

    res.status(200).send({ success: true, specialties, total: total, results });
  } catch (e) {
    console.log(e);
    res.status(400).send({ success: false, errorMessage: e });
  }
});

// Get Speciality
router.post(
  "/edit_speciality",
  /*authToken,*/ async (req, res) => {
    try {
      const specialties = await TechnicalStaffSpeciality.findByIdAndUpdate(
        { _id: req.body.id },
        { speciality: req.body.speciality }
      );

      res.status(200).send({ success: true, specialties });
    } catch (e) {
      console.log(e);
      res.status(400).send({ success: false, errorMessage: e });
    }
  }
);

router.post(
  "/delete_speciality",
  /*authToken,*/ async (req, res) => {
    try {
      const specialties = await TechnicalStaffSpeciality.findByIdAndDelete({
        _id: req.body.id,
      });

      res.status(200).send({ success: true, specialties });
    } catch (e) {
      console.log(e);
      res.status(400).send({ success: false, errorMessage: e });
    }
  }
);

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

module.exports = router;
