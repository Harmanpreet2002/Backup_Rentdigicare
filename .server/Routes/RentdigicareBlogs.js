const router = require("express").Router();
const functions = require("../Database/RentdigicareModelFunctions");
const ObjectID = require("bson").ObjectID;
const { rentdigiblog } = require("../Database/RentdigicareBlogs");

router.post("/rentdigi/createBlog", async (req, res, next) => {
  console.log("inside createBlog");
  try {
    if (req.body) {
      const findBlog = await functions.findOneData("rentdigiblog", {
        slug: req.body.slug,
      });

      if (findBlog) {
        console.log(`Blog find : ${findBlog}`);
        return res
          .status(201)
          .send({ msg: "Blog already exist", status: false });
      }
      const result = await functions.insertData("rentdigiblog", req.body);
      if (result) {
        res.status(200).send({
          msg: "Data Created Successfully",
          data: result,
          status: true,
        });
      } else {
        res.status(201).send({
          msg: "Something Went Wrong ! Please try again",
          status: false,
        });
      }
    } else {
      res.status(201).send({ msg: "Data Not Found", status: false });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({ msg: error.message, status: false });
  }
});

router.get("/rentdigi/fetch_blog/:slug", async (req, res, next) => {
  console.log("inside fetch blog by slug");
  try {
    const blog = await functions.findOneData("rentdigiblog", {
      slug: req.params.slug,
    });
    if (blog) {
      console.info("Fetched blog successfully", { blogsCount: blog.length });
      res.status(200).json({ data: blog, status: true });
    } else {
      console.warn("No blog found");
      res.status(404).json({ msg: "No blog found", status: false });
    }
  } catch (error) {
    console.error("Error while fetching blog", { error });
    res.status(500).json({ msg: "Internal Server Error", status: false });
  }
});

router.post("/rentdigi/update_blog/:id", async (req, res, next) => {
  console.log("inside updateBlog");
  try {
    if (req.body) {
      // req.body["modifiedDate"] = Math.round(new Date() / 1000);
      // req.body["updatedAt"] = Math.round(new Date() / 1000);
      const result = await functions.updateOneByFind(
        "rentdigiblog",
        { _id: ObjectID(req.params.id) },
        req.body
      );
      if (result) {
        res
          .status(200)
          .send({ msg: "Data Updated Successfully", result, status: true });
      } else {
        res.status(201).send({ msg: "Error : blog not Exist", status: false });
      }
    } else {
      res.status(201).send({ msg: "Data Not Found", status: false });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({ msg: error.message, status: false });
  }
});

router.get("/rentdigi/fetch_all_blog", async (req, res, next) => {
  console.log("inside fetchBlog");
  try {
    const blogs = await functions.findData("rentdigiblog");
    if (blogs && blogs.length > 0) {
      console.info("Fetched blogs successfully", { blogsCount: blogs.length });
      res.status(200).json({ data: blogs, status: true });
    } else {
      console.warn("No blogs found");
      res.status(404).json({ msg: "No blogs found", status: false });
    }
  } catch (error) {
    console.error("Error while fetching blogs", { error });
    res.status(500).json({ msg: "Internal Server Error", status: false });
  }
});

router.post("/rentdigi/delete_blog/:id", async (req, res, next) => {
  console.log("inside deleteBlog");
  try {
    const result = await functions.deleteData("rentdigiblog", {
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

router.post("/rentdigi/blog/upload_image/:name", async (req, res, next) => {
  console.log("inside uploadImage", req.params);
  try {
    const uploadObj = await functions.ImageUpload(
      req.params.name,
      false,
      4,
      "rentdigiblogs"
    );
    uploadObj(req, res, async function (err) {
      if (err) {
        return res.status(400).send({ msg: err.message, status: false });
      }
      if (req.files && req.files.length > 0) {
        let imageArray = req.files.map((element) => {
          console.log(element);
          // return element.key;
          // return `https://${process.env.IMAGE_CLOUD__ENDPOINT}/rdgcdn/${element.key}`;
          return `https://nyc3.digitaloceanspaces.com/rdgcdn/${element.key}`;
        });
        res.status(200).send({
          msg: "image uploaded Successfully",
          image: imageArray,
          status: true,
        });
      } else {
        res.status(201).send({ msg: "Error Occured", status: false });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({ msg: error.message, status: false });
  }
});

module.exports = router;
