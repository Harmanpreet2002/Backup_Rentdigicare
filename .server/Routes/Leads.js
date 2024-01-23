require("dotenv").config();
const router = require("express").Router();
const logger = require("../Logger/LoggerFactory").getProductionLogger();
const jwt = require("jsonwebtoken");

// Importing Database model
const Leads = require("../Database/Leads");
const Property = require("../Database/Property");
const RentdigiLeads = require("../Database/RentdigiLeads");
const Email = require("../utils/Email")

const ObjectId = require("mongodb").ObjectId;

router.get("/getLeads", authToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const {
      interestedBedroomType,
      interestedApartment,
      startDate,
      endDate,
      propertyName,
    } = req.query;

    const start = (page - 1) * limit;
    const endIndex = page * limit;
    const results = {};
    const query = {};
    const sort = req.query.sort
      ? JSON.parse(req.query.sort)
      : { createdAt: -1 };

    if (req.user.domain) {
      query.propertyUrl = { $regex: req.user.domain, $options: "i" };
    }

    if (interestedBedroomType) {
      query.interestedBedroomType = interestedBedroomType;
    }
    if (interestedApartment) {
      query.interestedApartment = interestedApartment;
    }
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }
    if (propertyName) {
      query.propertyName = { $regex: propertyName, $options: "i" };
    }
    if (req.query.name) {
      query.name = { $regex: req.query.name, $options: "i" };
    }
    if (req.query.phone) {
      query.phone = { $regex: req.query.phone, $options: "i" };
    }
    if (req.query.email) {
      query.email = { $regex: req.query.email, $options: "i" };
    }

    if (req.query.status) {
      query.status = req.query.status;
    }
    const leads = await Leads.aggregate([
      {
        $match: query,
      },
      {
        $sort: sort,
      },
      {
        $facet: {
          data: [{ $skip: start }, { $limit: limit }],
          count: [
            { $group: { _id: null, myCount: { $sum: 1 } } },
            { $project: { _id: 0 } },
          ],
        },
      },
    ]);

    if (endIndex < (await Leads.find(query).countDocuments().exec())) {
      results.next = {
        page: page + 1,
        limit: limit,
      };
    }

    if (start > 0) {
      results.previous = {
        page: page - 1,
        limit: limit,
      };
    }
    const totalFilterResult = await Leads.aggregate([
      { $match: query },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const applicationTotal = totalFilterResult?.reduce((acc, count) => {
      acc[count._id] = count.count;
      acc["Total"] = (acc["Total"] || 0) + count.count;
      return acc;
    }, {});

    const uniqueApartments = await Leads.find(query).distinct(
      "interestedApartment"
    );
    const uniqueBedroomType = await Leads.find(query).distinct(
      "interestedBedroomType"
    );
    const uniqueProperty = await Leads.find(query).distinct(
      "propertyName"
    );
    res.json({
      status: 200,
      message: "Resources Fetched !",
      results: results,
      start: start,
      limit: limit,
      apartmentTypes:
        uniqueApartments.filter((a) => !["N/A", "NA"].includes(a)) || [],
      bedroomType:
        uniqueBedroomType.filter((a) => !["N/A", "NA"].includes(a)) || [],
      total: applicationTotal,
      leads: leads[0]?.data,
      property: uniqueProperty,
      success: true,
    });
  } catch (error) {
    res.json({
      status: 500,
      message: error.message,
    });
  }
});

router.get("/getLeadsManager", authToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const sort = req.query.sort
      ? JSON.parse(req.query.sort)
      : { createdAt: -1 };
    const {
      interestedBedroomType,
      interestedApartment,
      startDate,
      endDate,
      propertyName,
      name,
      email,
      phone,
      status,
    } = req.query;

    const start = (page - 1) * limit;
    const endIndex = page * limit;
    const results = {};
    const query = {};
    let filteredResults;

    if (req.user.role === "manager") {
      query.managers = { $eq: ObjectId(req.user.id) };
    }

    //filter by property manger
    const leads = await Property.aggregate([
      {
        $match: query,
      },
      {
        $lookup: {
          from: "leads",
          let: {
            firstWord: { $arrayElemAt: [{ $split: ["$title", " "] }, 0] },
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: [
                    { $arrayElemAt: [{ $split: ["$propertyName", "-"] }, 0] },
                    "$$firstWord",
                  ],
                },
              },
            },
          ],
          as: "leads",
        },
      },
      { $unwind: "$leads" },
      {
        $group: {
          _id: null,
          leads: { $push: "$leads" },
        },
      },
    ]);

    var total;

    var filterQuery = {};
    if (name) {
      filterQuery.name = name;
    }
    if (phone) {
      filterQuery.phone = phone;
    }
    if (email) {
      filterQuery.email = email;
    }
    if (propertyName) {
      filterQuery.propertyName = propertyName;
    }
    if (interestedApartment) {
      filterQuery.interestedApartment = interestedApartment;
    }
    if (interestedBedroomType) {
      filterQuery.interestedBedroomType = interestedBedroomType;
    }

    if (startDate && endDate) {
      filterQuery.startDate = startDate;
      filterQuery.endDate = endDate;
    } else if (startDate) {
      filterQuery.startDate = startDate;
    } else if (endDate) {
      filterQuery.endDate = endDate;
    }
    if (status) {
      filterQuery.status = status;
    }

    var paginatedResults =
      leads[0]?.leads?.length > 0
        ? leads[0]?.leads.sort((a, b) => {
            if (sort.name > 0) {
              return a.name.localeCompare(b.name);
            }
            if (sort.name < 0) {
              return b.name.localeCompare(a.name);
            }
            if (sort.createdAt > 0) {
              return a.createdAt - b.createdAt;
            }
            if (sort.createdAt < 0) {
              return b.createdAt - a.createdAt;
            }
            return 0;
          })
        : [];
    if (Object.keys(filterQuery).length === 0) {
      filteredResults = paginate(paginatedResults, page, limit);
      total = paginatedResults;
    } else {
      //Date range filters
      var filteredDate = [...paginatedResults];

      //check for both start and end dates
      if (filterQuery.startDate && filterQuery.endDate) {
        filteredDate = leads[0]?.leads?.filter(
          (i) =>
            i.createdAt.toISOString().substring(0, 10) >=
              filterQuery.startDate &&
            i.createdAt.toISOString().substring(0, 10) <= filterQuery.endDate
        );
      } else if (filterQuery.startDate) {
        //start date
        filteredDate = leads[0]?.leads?.filter(
          (i) =>
            i.createdAt.toISOString().substring(0, 10) >= filterQuery.startDate
        );
      } else if (filterQuery.endDate) {
        // end date
        filteredDate = leads[0]?.leads?.filter(
          (i) =>
            i.createdAt.toISOString().substring(0, 10) <= filterQuery.endDate
        );
      }

      //remove dates before passing to filterByValue
      delete filterQuery.startDate;
      delete filterQuery.endDate;

      //filter by value results
      paginatedResults = filterByValue(filteredDate, filterQuery);
      //adding then into pagination
      filteredResults = paginate(paginatedResults, page, limit);
      //total filter results
      total = paginatedResults;
    }

    if (endIndex < paginatedResults?.length) {
      results.next = {
        page: page + 1,
        limit: limit,
      };
    }

    if (start > 0) {
      results.previous = {
        page: page - 1,
        limit: limit,
      };
    }
    const uniqueProperty = [...new Set(filteredResults.map(obj => obj.propertyName))];
    //unique bedroom type
    const uniqueApartments = filteredResults
      .map((v) => v.interestedApartment)
      .filter((p) => !["N/A", "NA"].includes(p));

    //unique apartment type
    const uniqueBedroomType = filteredResults
      .map((v) => v.interestedBedroomType)
      .filter((p) => !["N/A", "NA"].includes(p));

    const uniqueStatus = total.map((v) => v.status);

    let uniqueStatusResult = uniqueStatus.reduce((acc, curr) => {
      let existingItem = acc.find((item) => item._id === curr);
      if (existingItem) {
        existingItem.count++;
      } else {
        acc.push({ _id: curr, count: 1 });
      }
      return acc;
    }, []);

    //Total status wise
    const applicationTotal = uniqueStatusResult.reduce((acc, count) => {
      acc[count._id] = count.count;
      acc["Total"] = (acc["Total"] || 0) + count.count;
      return acc;
    }, {});

    res.json({
      status: 200,
      message: "Resources Fetched !",
      results: results,
      start: start,
      limit: limit,
      apartmentTypes: [...new Set(uniqueApartments.map((p) => p))],
      bedroomType: [...new Set(uniqueBedroomType.map((p) => p))],
      total: applicationTotal,
      leads: filteredResults,
      property:uniqueProperty,
      success: true,
    });
  } catch (error) {
    res.json({
      status: 500,
      message: error.message,
    });
  }
});


router.get("/getAdminLeads", authToken, async (req, res) => {
  console.log(req.query,)
  try {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const {
      interestedBedroomType,
      interestedApartment,
      startDate,
      endDate,
      propertyName,
    } = req.query;

    console.log(req.query)


    const start = (page - 1) * limit;
    const endIndex = page * limit;
    const results = {};
    const query = {};
    const sort = req.query.sort
      ? JSON.parse(req.query.sort)
      : { createdAt: -1 };

    if (req.user.domain) {
      query.propertyUrl = { $regex: req.user.domain, $options: "i" };
    }

    if (interestedBedroomType) {
      query.interestedBedroomType = interestedBedroomType;
    }
    if (interestedApartment) {
      query.interestedApartment = interestedApartment;
    }
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }
    if (propertyName) {
      query.propertyName = { $regex: propertyName, $options: "i" };
    }
    if (req.query.name) {
      query.name = { $regex: req.query.name, $options: "i" };
    }
    if (req.query.phone) {
      query.phone = { $regex: req.query.phone, $options: "i" };
    }
    if (req.query.email) {
      query.email = { $regex: req.query.email, $options: "i" };
    }

    if (req.query.status) {
      query.status = req.query.status;
    }
    console.log(query,'hitted')
    const leads = await RentdigiLeads.aggregate([
      {
        $match: query,
      },
      {
        $sort: sort,
      },
      {
        $facet: {
          data: [{ $skip: start }, { $limit: limit }],
          count: [
            { $group: { _id: null, myCount: { $sum: 1 } } },
            { $project: { _id: 0 } },
          ],
        },
      },
    ]);

    if (endIndex < (await RentdigiLeads.find(query).countDocuments().exec())) {
      results.next = {
        page: page + 1,
        limit: limit,
      };
    }

    if (start > 0) {
      results.previous = {
        page: page - 1,
        limit: limit,
      };
    }
    const totalFilterResult = await RentdigiLeads.aggregate([
      { $match: query },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    console.log(totalFilterResult,'hello---- ')

    const applicationTotal = totalFilterResult?.reduce((acc, count) => {
      acc[count._id] = count.count;
      acc["Total"] = (acc["Total"] || 0) + count.count;
      return acc;
    }, {});

    // const uniqueApartments = await Leads.find(query).distinct(
    //   "interestedApartment"
    // );
    // const uniqueBedroomType = await Leads.find(query).distinct(
    //   "interestedBedroomType"
    // );
    res.json({
      status: 200,
      message: "Resources Fetched !",
      results: results,
      start: start,
      limit: limit,
      // apartmentTypes:
      //   uniqueApartments.filter((a) => !["N/A", "NA"].includes(a)) || [],
      // bedroomType:
      //   uniqueBedroomType.filter((a) => !["N/A", "NA"].includes(a)) || [],
      total: applicationTotal,
      leads: leads[0]?.data,
      success: true,
    });
  } catch (error) {
    res.json({
      status: 500,
      message: error.message,
    });
  }
})

router.post("/addLead", async (req, res) => {
  try {
    const lead = await Leads.create({
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      status: "Pending",
      propertyName: req.body.propertyName,
      propertyUrl: req.body.propertyUrl,
      interestedApartment: req.body.interestedApartment,
      interestedBedroomType: req.body.interestedBedroomType,
      websiteURL: req.body.website,
    });
    res.json({
      status: 201,
      message: "Added Lead Successfully",
    });
  } catch (error) {
    res.json({
      status: 500,
      message: "Something Went wrong !",
    });
  }
});

router.post("/admin/addLead", async (req, res) => {
  try {
    // const isExist = await RentdigiLeads.findOne({name:req.body.name,phone:req.body.phone,email: req.body.email,company: req.body.company});
    // if(isExist){
    //   return res.status(409).json({
    //     status: 409,
    //     message: "Application Already Submitted !",
    //   });
    // }
    const lead = await RentdigiLeads.create({
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      company: req.body.company,
    });


    const data = {
      applicantName: req.body.name,
      phone: req.body.phone,
      email:  req.body.email,
      company: req.body.company,
      
    };
    const options = Email.generateOptions(data.email, "LEADS_FOR_SUPER_ADMIN", data);
    const isEmailSent = Email.send(options);

    return res.status(201).json({
      status: 201,
      data:lead,
      message: "Form Submitted Successfully",
    });

    
   
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Something Went wrong !",
    });
  }
});


router.put("/updateStatus/:leadId", async (req, res) => {
  try {
    const leadId = req.params.leadId;
    const status = req.body.status;
    const lead = await Leads.findOne({ _id: ObjectId(leadId) });
    if (!lead) throw new Error("No lead found");
    await Leads.findOneAndUpdate(
      { _id: ObjectId(leadId) },
      { status: status },
      { new: true }
    );
    res.json({
      status: 201,
      success: true,
      message: "Lead status update successfully",
    });
  } catch (error) {
    res.json({
      status: 500,
      message: error.message,
    });
  }
});

router.put("/admin/updateStatus/:leadId", async (req, res) => {
  try {
    const leadId = req.params.leadId;
    const status = req.body.status;
    const lead = await RentdigiLeads.findOne({ _id: ObjectId(leadId) });
    if (!lead) throw new Error("No lead found");
    await RentdigiLeads.findOneAndUpdate(
      { _id: ObjectId(leadId) },
      { status: status },
      { new: true }
    );
    res.json({
      status: 201,
      success: true,
      message: "Lead status update successfully",
    });
  } catch (error) {
    res.json({
      status: 500,
      message: error.message,
    });
  }
});
router.get("/dashboardfilter", authToken, async (req, res) => {
  try {
    let leads = "";
    var searchCriteria = {};

    if (req.query.filterBy === "barChart") {
      const propertyManagerID = req.query.propertyManagerID
        ? ObjectId(req.query.propertyManagerID)
        : null;

      const propertyID = req.query.propertyId ? req.query.propertyId : null;

      if (propertyManagerID !== null && req.user.role === "company") {
        searchCriteria.managers = { $in: [propertyManagerID] };
        leadsByManger = await Property.aggregate([
          {
            $match: searchCriteria,
          },
          {
            $lookup: {
              from: "leads",
              let: {
                firstWord: { $arrayElemAt: [{ $split: ["$title", " "] }, 0] },
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: [
                        {
                          $arrayElemAt: [{ $split: ["$propertyName", "-"] }, 0],
                        },
                        "$$firstWord",
                      ],
                    },
                  },
                },
              ],
              as: "leads",
            },
          },
          { $unwind: "$leads" },
          {
            $group: {
              _id: null,
              leads: { $push: "$leads" },
            },
          },
        ]);
        var filteredDate = leadsByManger[0].leads;
        if (propertyID) {
          const propertyName = await Property.findOne({ _id: propertyID });

          filteredDate = filteredDate.filter(
            (v) => v.propertyName === propertyName.title.replaceAll(" ", "-")
          );
        }
        if (req.query.startDate && req.query.startDate) {
          filteredDate = leadsByManger[0].leads?.filter(
            (i) =>
              i.createdAt.toISOString().substring(0, 10) >=
                req.query.startDate &&
              i.createdAt.toISOString().substring(0, 10) <= req.query.endDate
          );
        } else if (req.query.startDate) {
          //start date
          filteredDate = leadsByManger[0].leads?.filter(
            (i) =>
              i.createdAt.toISOString().substring(0, 10) >= req.query.startDate
          );
        } else if (req.query.startDate) {
          // end date
          filteredDate = leadsByManger[0].leads?.filter(
            (i) =>
              i.createdAt.toISOString().substring(0, 10) <= req.query.startDate
          );
        }

        const result =
          filteredDate.length > 0
            ? filteredDate.reduce((acc, obj) => {
                const date = obj.createdAt.toISOString().slice(0, 7);
                const status = obj.status.toLowerCase();
                if (!acc[date]) {
                  acc[date] = { _id: { month: date } };
                }
                if (!acc[date][status]) {
                  acc[date][status] = 0;
                }
                acc[date][status]++;
                return acc;
              }, {})
            : [];

        leads = Object.values(result);
      } else if (req.user.role === "company" && propertyManagerID === null) {
        if (req.query.startDate && req.query.endDate) {
          searchCriteria.createdAt = {
            $gte: new Date(req.query.startDate),
            $lte: new Date(req.query.endDate),
          };
        }

        if (req.user.domain) {
          searchCriteria.propertyUrl = {
            $regex: req.user.domain,
            $options: "i",
          };
        }
        if (propertyID) {
          const propertyName = await Property.findOne({ _id: propertyID });
          searchCriteria.propertyName = propertyName.title.replaceAll(" ", "-");
        }
        leads = await Leads.aggregate([
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
              pending: {
                $sum: {
                  $cond: [{ $eq: ["$status", "Pending"] }, 1, 0],
                },
              },
              closed: {
                $sum: {
                  $cond: [{ $eq: ["$status", "Closed"] }, 1, 0],
                },
              },
              cancelled: {
                $sum: {
                  $cond: [{ $eq: ["$status", "Cancelled"] }, 1, 0],
                },
              },
              follow_up: {
                $sum: {
                  $cond: [{ $eq: ["$status", "Follow Up"] }, 1, 0],
                },
              },
            },
          },
          {
            $sort: { "_id.month": 1 },
          },
        ]);
        console.log(leads, ":SD");
      }

      if (propertyManagerID !== null && req.user.role === "manager") {
        searchCriteria.managers = { $in: [propertyManagerID] };

        leadsByManger = await Property.aggregate([
          {
            $match: searchCriteria,
          },
          {
            $lookup: {
              from: "leads",
              let: {
                firstWord: { $arrayElemAt: [{ $split: ["$title", " "] }, 0] },
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: [
                        {
                          $arrayElemAt: [{ $split: ["$propertyName", "-"] }, 0],
                        },
                        "$$firstWord",
                      ],
                    },
                  },
                },
              ],
              as: "leads",
            },
          },
          { $unwind: "$leads" },
          {
            $group: {
              _id: null,
              leads: { $push: "$leads" },
            },
          },
        ]);

        let filteredDate = leadsByManger[0].leads;
        if (propertyID) {
          const propertyName = await Property.findOne({ _id: propertyID });

          filteredDate = filteredDate.filter(
            (v) => v.propertyName === propertyName.title.replaceAll(" ", "-")
          );
        }

        if (req.query.startDate && req.query.startDate) {
          filteredDate = leadsByManger[0].leads?.filter(
            (i) =>
              i.createdAt.toISOString().substring(0, 10) >=
                req.query.startDate &&
              i.createdAt.toISOString().substring(0, 10) <= req.query.endDate
          );
        } else if (req.query.startDate) {
          //start date
          filteredDate = leadsByManger[0].leads?.filter(
            (i) =>
              i.createdAt.toISOString().substring(0, 10) >= req.query.startDate
          );
        } else if (req.query.startDate) {
          // end date
          filteredDate = leadsByManger[0].leads?.filter(
            (i) =>
              i.createdAt.toISOString().substring(0, 10) <= req.query.startDate
          );
        }

        const result =
          filteredDate.length > 0
            ? filteredDate.reduce((acc, obj) => {
                const date = obj.createdAt.toISOString().slice(0, 7);
                const status = obj.status.toLowerCase();
                if (!acc[date]) {
                  acc[date] = { _id: { month: date } };
                }
                if (!acc[date][status]) {
                  acc[date][status] = 0;
                }
                acc[date][status]++;
                return acc;
              }, {})
            : [];

        leads = Object.values(result);
      }
    }

    res.json({
      status: 201,
      data: leads.sort((a, b) => {
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
//custom array pagination function
function paginate(a, pageIndex, pageSize) {
  return a.slice((pageIndex - 1) * pageSize, pageIndex * pageSize);
}
//custom array filter function
function filterByValue(array, query) {
  return array.filter((i) =>
    Object.entries(query).every(([k, v]) =>
      typeof i[k] === "string"
        ? i[k].toLowerCase().includes(v.toLowerCase())
        : i[k] === v
    )
  );
}
