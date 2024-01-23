const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const logger = require("../Logger/LoggerFactory").getProductionLogger();

// importing database models
const Company = require("../Database/Company");
const Layout = require("../Database/Layout");

// Get all the Layouts for company
router.post("/all", authToken, async (req, res) => {
  const companyID = req.body.companyID;
  const page = req.query.page;
  const limit = req.query.limit;
  const skip = (page - 1) * limit;
  const endIndex = page * limit;
  const results = {};
  if (!companyID) {
    res.json({
      status: 400,
      message: "Bad Request !",
    });
  } else {
    try {
      const layoutList = await Layout.find({ layoutOf: companyID })
        .skip(skip)
        .limit(limit);
      const total = await Layout.find({ layoutOf: companyID }).countDocuments();
      if (
        endIndex <
        (await Layout.find({ layoutOf: companyID }).countDocuments().exec())
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
      res.json({
        status: 200,
        message: "Resources has been fetched !",
        layouts: layoutList,
        total: total,
        results,
      });
    } catch (error) {
      logger.error(error);
      res.json({
        status: 500,
        message:error.message,
      });
    }
  }
});

// Adding Layout for company
router.post("/add", authToken, async (req, res) => {
  const companyID = req.body.layoutOf;
  const layout = req.body.layoutName;
  if (!companyID || !layout) {
    res.json({
      status: 400,
      message: "Bad Request !",
    });
  } else {
    const isCompanyExits = companyExits(companyID);
    if (isCompanyExits) {
      try {
        const newLayout = await Layout.create({
          layoutOf: companyID,
          layoutName: layout,
        });
        res.json({
          status: 201,
          layout: newLayout,
          message: "layout Created !",
        });
      } catch (error) {
        logger.error(error);
        res.json({
          status: 500,
          message: "Interval Server Error",
        });
      }
    } else {
      res.json({
        status: 401,
        message: "Forbiden !",
      });
    }
  }
});

// TO Complete remove company and its references
router.delete("/delete", authToken, async (req, res) => {
  const companyID = req.query.layoutOf;
  const layoutID = req.query.layoutID;

  if (!companyID || !layoutID) {
    res.json({
      status: 400,
      message: "Bad Request !",
    });
  } else {
    try {
      const isCompanyExits = companyExits(companyID);
      if (isCompanyExits) {
        const isLayoutExits = await companyLayoutExits(companyID, layoutID);
        if (isLayoutExits) {
          const response = await deleteLayout(companyID, layoutID);
          res.json(response);
        } else {
          res.json({
            status: 409,
            message: "Unable to find layout",
          });
        }
      } else {
        res.json({
          status: 401,
          message: "Forbiden !",
        });
      }
    } catch (error) {
      logger.error(error);
      res.json({
        status: 500,
        message: "Something went wrong",
      });
    }
  }
});

module.exports = router;

// delete router functions
async function deleteLayout(companyID, layoutID) {
  try {
    const deleteRes = await Layout.deleteOne({
      _id: layoutID,
      layoutOf: companyID,
    });
    return {
      status: 200,
      message: "Successfully Deleted Layout !",
    };
  } catch (error) {
    logger.error(error);
    return {
      status: 500,
      message: "Something went wrong !",
    };
  }
}

async function companyExits(companyID) {
  return await Company.exists({ _id: companyID });
}

async function layoutExits(companyID) {
  return await Layout.exists({ layoutOf: companyID });
}

async function companyLayoutExits(companyID, layoutID) {
  return await Layout.exists({ _id: layoutID, layoutOf: companyID });
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
