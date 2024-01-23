const router = require("express").Router();
const Ticket = require("./Database/Ticket");
const Applicant = require("./Database/Applicant");

// checking email services
router.post("/", async (req, res) => {
  console.log(process.env.DOMAIN, "is server Address");
  res.send("ok");
});

router.post("/maintenancerequests", async (req, res) => {
  if (req.body.companyDomain !== undefined) {
    try {
      let query = {};
      query.companyDomain = req.body.companyDomain;
      if (req.body.propertyManagerID) {
        query.propertyManagerId = {
          $in: [ObjectId(req.body.propertyManagerID)],
        };
      }
      query.status = "Open";
      const openTicketsCount = await Ticket.aggregate([
        { $match: query },
        { $group: { _id: null, count: { $sum: 1 } } },
      ]);
      const openTicketsCountValue = openTicketsCount[0]?.count || 0;

      res.json({
        status: 200,
        message: "The resources has been fetched",
        openTicketsCount: openTicketsCountValue, // Add the count to the response
      });
    } catch (error) {
      // ... (existing error handling)
    }
  } else {
    res.json({
      status: 500,
      message: "Please provide Company Domain",
      tickets: [],
    });
  }
});

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

router.post(
  "/residentapplications",
  PaginatedResults(Applicant),
  async (req, res) => {
    const applicationTotal = res.totalFilterResult.reduce((acc, count) => {
      acc[count._id] = count.count;
      acc["Total"] = (acc["Total"] || 0) + count.count;
      return acc;
    }, {});
    const filteredTotal = {
      Denied: applicationTotal["Denied"] || 0,
      Total: applicationTotal["Total"] || 0,
      Approved: applicationTotal["Approved"] || 0,
      Pending: applicationTotal["Pending"] || 0,
    };
    res.json({
      status: 200,
      total: filteredTotal,
      message: "The resources have been fetched",
    });
  }
);

module.exports = router;
