const router = require("express").Router();
const { ObjectID } = require("bson");
const { rentdiginewsletter } = require("../Database/RentdigicareNewsletters");
const functions = require("../Database/NewslettersModalFunctions");

router.post("/rentdigi/newsletter/add", async (req, res) => {
  console.log("inside rentdiginewsletter");
  try {
    const data = req.body;
    if (!data.email) {
      return res.status(400).send({ msg: "Email is required", status: false });
    }
    let result = await functions.findOneData({
      email: data.email,
    });
    if (result) {
      return res
        .status(400)
        .send({ msg: "Email already exist", status: false });
    }
    result = await functions.insertData(data);
    if (!result) {
      return res.status(400).send({ msg: "Error occured", status: false });
    }

    res.status(200).send({ msg: "User subscribed successfully", status: true });
  } catch (error) {
    console.log("err: ", error);
    res.status(400).send({ msg: err.message, status: false });
  }
});

router.get("/rentdigi/newsletter/get", async (req, res, next) => {
  console.log("inside fetchNewsletter");
  try {
    const result = await functions.fetch({});
    if (result.length > 0) {
      res
        .status(200)
        .send({ msg: "Data Fetched Successfully", result, status: true });
    } else {
      res.status(404).send({ msg: "Not found", status: false });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({ msg: error.message, status: false });
  }
});

router.post("/rentdigi/newsletter/delete/:id", async (req, res, next) => {
  console.log("inside deleteNewsletter");
  try {
    const result = await functions.delete({
      _id: ObjectID(req.params.id),
    });
    if (result.deletedCount > 0) {
      res
        .status(200)
        .send({ msg: "Data Deleted Successfully", result, status: true });
    } else {
      res.status(201).send({ msg: "Blog not Exist", status: false });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({ msg: error.message, status: false });
  }
});

module.exports = router;
