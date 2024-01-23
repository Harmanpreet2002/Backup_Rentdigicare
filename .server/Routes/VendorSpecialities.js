const router = require("express").Router();
const jwt = require("jsonwebtoken");
const async = require("async");
const Vendor_specialties = require("../Database/vendor_specialties");
const logger = require("../Logger/LoggerFactory").getProductionLogger();

const ObjectId = require("mongodb").ObjectId;

// Add Speciality
router.post(
  "/add_speciality",
  /*authToken,*/ async (req, res) => {
    try {
      const specialityExist = await Vendor_specialties.findOne({
        createdBy: ObjectId(req.body.createdBy),
        specialty: req.body.specialty,
      });
      if (specialityExist !== null) {
        return res
          .status(202)
          .send({ success: false, errorMessage: "Specialty already Exists" });
      }
      if (specialityExist === null) {
        const newSpeciality = new Vendor_specialties(req.body);
        const addedSpeciality = await newSpeciality.save();
        res.status(200).send({ status: 201, success: true, addedSpeciality });
      }
    } catch (e) {
      res
        .status(400)
        .send({ status: 500, success: false, errorMessage: e?.message });
    }
  }
);

// Get Speciality
router.get(
  "/get_speciality",
  // authToken,
  async (req, res) => {
    try {
      const searchSpeciality = req.query.searchVendor;
      const company = req.query.companyId;
      console.log("Searching", req.user);
      if (!searchSpeciality) {
        const specialties = await Vendor_specialties.find({
          createdBy: ObjectId(company),
        });
        return res.status(200).send({ success: true, specialties });
      }
      if (searchSpeciality && company) {
        const specialties = await Vendor_specialties.find({
          specialty: { $regex: searchSpeciality, $options: "i" },
          createdBy: ObjectId(company),
        });
        res.status(200).send({ success: true, specialties });
      }
    } catch (e) {
      res.status(400).send({ success: false, errorMessage: e.message });
    }
  }
);

// edit Speciality
router.post(
  "/edit_speciality",
  /*authToken,*/ async (req, res) => {
    try {
      const speciality = req.body.speciality;
      const specialties = await Vendor_specialties.findOne({
        _id: ObjectId(req.body.id),
      });
      if (!specialties) {
        throw new Error("Speciality not found");
      }

      await Vendor_specialties.findOneAndUpdate(
        { _id: ObjectId(req.body.id) },
        { specialty: speciality },
        { new: true }
      );

      res.status(200).send({ success: true, message: "Updated success" });
    } catch (e) {
      res.status(400).send({ success: false, errorMessage: e?.message });
    }
  }
);

// edit Speciality
router.delete(
  "/delete_speciality",
  /*authToken,*/ async (req, res) => {
    try {
      const specialties = await Vendor_specialties.findOne({
        _id: ObjectId(req.query.id),
      });
      if (!specialties) {
        throw new Error("Speciality not found");
      }
      await Vendor_specialties.deleteOne({
        _id: ObjectId(req.query.id),
      });

      res.status(200).send({ success: true, message: "Delete success" });
    } catch (e) {
      res.status(400).send({ success: false, errorMessage: e?.message });
    }
  }
);
module.exports = router;

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
