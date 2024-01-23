const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const async = require("async");
const logger = require("../Logger/LoggerFactory").getProductionLogger();
const moment = require("moment");
const schedule = require("node-schedule");
const mongoose = require("mongoose");
const axios = require("axios");
// mongoose.set('debug', true);
// PDF Generation
var htmlToPdf = require("pdf-creator-node");
const ObjectId = require("mongodb").ObjectId;
const Vendor = require("../Database/vendor");
const ExcelJS = require("exceljs");
// imporing database models
const Ticket = require("../Database/Ticket");
const Manager = require("../Database/PropertyManager");
const TechnicalStaff = require("../Database/Technical_Staff");

// importing ticket template
const ticketTemplate = require("../Documents/TicketTemplate");

// Dependencies for file uploading documents and stream downloading of documents
const multer = require("multer");
const path = require("path");
const admZip = require("adm-zip");
const Applicant = require("../Database/Applicant");
const Property = require("../Database/Property");

const Email = require("../utils/Email");
const Quoted_vendor_tickets = require("../Database/quoted_vendor_tickets");
const Conversation = require("../Database/Conversation");
const vendor = require("../Database/vendor");
const Company = require("../Database/Company");
const quoted_vendor_tickets = require("../Database/quoted_vendor_tickets");
const Customer = require("../Database/Customer");
const { log } = require("console");
const Ticket_note = require("../Database/Ticket_note");

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
const { uploadTicketDocumentsToS3 } = require("../utils/bucket");

function generatePropertySignature(name) {
  // Split the name into words
  console.log(name);
  const words = name.split(" ");
  // Extract the first letter of each word and join with dots
  const initials = words.map((word) => word[0].toUpperCase()).join(". ");
  return initials;
}

//Ticket filter for graph
router.get("/dashboardfilter", async (req, res) => {
  try {
    let ticket = "";
    var searchCriteria = {};
    const role = req.query.role;
    let domain = req.query.domain;
    if (req.query.startDate && req.query.endDate) {
      searchCriteria.createdAt = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate),
      };
    }
    if (req.query.filterBy === "barChart") {
      const propertyManagerID = req.query.propertyManagerID
        ? ObjectId(req.query.propertyManagerID)
        : null;
      const propertyID = req.query.propertyId
        ? ObjectId(req.query.propertyId)
        : null;
      // if (role == "manager") {

      //   if (propertyManagerID !== null) {
      //     searchCriteria.propertyManagerId = { $in: [propertyManagerID] };
      //   }
      // } else if (role == "company") {
      //   searchCriteria.companyDomain = domain;
      // }

      if (propertyManagerID !== null && role === "company") {
        searchCriteria.propertyManagerId = { $in: [propertyManagerID] };
      } else {
        if (role === "company" && propertyManagerID === null) {
          searchCriteria.companyDomain = domain;
        }
      }
      if (propertyManagerID !== null && role === "manager") {
        searchCriteria.propertyManagerId = { $in: [propertyManagerID] };
      }

      if (propertyID) {
        searchCriteria.propertyID = propertyID;
      }

      const pipeline = await createDynamicAggregationPipeline(
        Ticket,
        searchCriteria
      );
      ticket = await Ticket.aggregate(pipeline, function (error, result) {
        if (error) {
          console.error(error);
        } else {
          console.log(result);
        }
      });

      if (ticket) {
        res.json({
          status: 201,
          data: ticket.sort((a, b) => {
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
      } else {
        res.json({
          status: 404,
          message: "No data found",
        });
      }
    }
  } catch (error) {
    logger.error(error);
    res.json({
      status: 500,
      message: error?.message,
    });
  }
});

// Getting all the Maintenance Request for company
router.post("/ticket_list", authToken, async (req, res) => {
  if (req.body.domain !== undefined) {
    try {
      const ticketList = await Ticket.find(
        { companyDomain: req.body.domain },
        { __v: 0 }
      );
      res.json({
        status: 200,
        message: "The resources has been fetched",
        tickets: ticketList,
        total: ticketList.length,
      });
    } catch (error) {
      logger.error(error);
      res.json({
        status: 500,
        message: "Something Went Wrong",
      });
    }
  } else {
    res.json({
      status: 400,
      message: "Bad Request",
    });
  }
});

// Getting all the Maintenance Request for admin
router.post("/admin", authToken, async (req, res) => {
  console.log("hit");
  try {
    const ticketList = await Ticket.find({}, { __v: 0 });
    res.json({
      status: 200,
      message: "The resources has been fetched",
      tickets: ticketList,
      total: ticketList.length,
    });
  } catch (error) {
    logger.error(error);
    res.json({
      status: 500,
      message: "Something Went Wrong",
    });
  }
});

// Ticket list for property manager for his associated properties
router.post("/property-manager", authToken, async (req, res) => {
  if (req.body.managerID !== undefined) {
    try {
      const manager = await Manager.findOne({ _id: req.body.managerID }).select(
        { properties: 1 }
      );
      const ticketList = await Ticket.find(
        { propertyID: manager.properties[0]._id },
        { __v: 0 }
      ); // TODO issue scalability
      res.json({
        status: 200,
        message: "The resources has been fetched",
        tickets: ticketList,
        total: ticketList.length,
      });
    } catch (error) {
      logger.error(error);
      res.json({
        status: 500,
        message: "Something Went Wrong",
      });
    }
  }
});

router.post("/customer", authToken, async (req, res) => {
  if (req.body.customerID !== undefined) {
    try {
      const ticketList = await Ticket.find(
        { id: req.body.customerID },
        { __v: 0 }
      ); // TODO issue scalability
      res.json({
        status: 200,
        message: "The resources has been fetched",
        tickets: ticketList,
        total: ticketList.length,
      });
    } catch (error) {
      logger.error(error);
      res.json({
        status: 500,
        message: "Something Went Wrong",
      });
    }
  }
});

router.post("/filter_tickets_customer", authToken, async (req, res) => {
  let query = {};
  const page = parseInt(req.body.pageNumber) || 1;
  const PAGE_LIMIT = 10;
  const startIndex = (page - 1) * PAGE_LIMIT;
  const endIndex = page * PAGE_LIMIT;
  const paginatedResults = {};
  if (req.body.customerID !== undefined) {
    query.createdByid = ObjectId(req.body.customerID);

    if (req.body.ticketID) {
      query._id = req.body.ticketID;
    }
    if (req.body.suite) {
      query.suite = { $regex: req.body.suite, $options: "i" };
    }
    if (req.body.propertyID && req.body.propertyID != "Select") {
      query.propertyID = { $eq: ObjectId(req.body.propertyID) };
    }

    if (req.body.requestType) {
      query.requestType = { $eq: req.body.requestType };
    }

    if (req.body.status && req.body.status != "Select") {
      query.status = { $regex: req.body.status };
    }

    if (req.body.startDate && req.body.endDate) {
      query.createdAt = {
        $gte: moment(req.body.startDate),
        $lt: moment(req.body.endDate),
      };
    }
    try {
      // const ticketList = await Ticket.find(query, { __v: 0 }).limit(limitValue).skip(skipValue)
      // res.json({
      //     status: 200,
      //     message: "The resources has been fetched",
      //     tickets: ticketList,
      //     total: ticketList.length
      // })

      const countQuery = function (callback) {
        Ticket.find(query, { __v: 0 })
          .sort({ _id: -1 })
          .count({}, function (err, count) {
            if (err) {
              callback(err, null);
            } else {
              callback(null, count);
            }
          });
      };

      if (endIndex < (await Ticket.find(query).countDocuments().exec())) {
        paginatedResults.next = {
          page: page + 1,
          limit: PAGE_LIMIT,
        };
      }

      if (startIndex > 0) {
        paginatedResults.previous = {
          page: page - 1,
          limit: PAGE_LIMIT,
        };
      }

      const distPropertyID = await Ticket.find({
        createdByid: ObjectId(req.body.customerID),
      })
        .sort({ _id: -1 })
        .distinct("propertyID");

      const properties = await Property.find({
        _id: { $in: distPropertyID },
      }).select({ _id: 1, title: 1, propertySignature: 1 });

      const distinctRequestType = await Ticket.distinct("requestType");
      const totalFilterResult = await Ticket.aggregate([
        { $sort: { _id: -1 } },
        { $match: query },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]);
      const applicationTotal = totalFilterResult?.reduce((acc, count) => {
        acc[count._id] = count.count;
        acc["Total"] = (acc["Total"] || 0) + count.count;
        return acc;
      }, {});

      const retrieveQuery = function (callback) {
        Ticket.find(query, { __v: 0 })
          .sort({ _id: -1 })
          .skip((page - 1) * PAGE_LIMIT)
          .limit(PAGE_LIMIT)
          .populate("assignedTo")
          .populate("assignVendor")
          .populate("confirmedQuote")
          .populate("propertyManagerId")
          .exec(async function (err, tickets, doc) {
            if (err) {
              callback(err, null);
            } else {
              try {
                const ticketWithPropertySignature = await Promise.all(
                  tickets.map(async (ticket) => {
                    const propertySignatures = await Property.find({
                      _id: { $in: ticket.propertyID },
                    }).select({ title: 1, propertySignature: 1 });

                    const propertySignature =
                      propertySignatures[0]?.propertySignature ??
                      generatePropertySignature(propertySignatures[0].title);

                    return {
                      ...ticket.toObject(),
                      propertySignature,
                    };
                  })
                );

                callback(null, ticketWithPropertySignature);
              } catch (error) {
                callback(null, doc);
              }
            }
          });
      };

      async.parallel(
        [countQuery, retrieveQuery],
        async function (err, results) {
          if (err) {
            console.log(err);
            res.json({
              status: 500,
              message: "Something Went Wrong",
              tickets: [],
            });
            return;
          }
          const ticketIds = results[1].map((note) => note._id);
          console.log(ticketIds);
          const notesCount = await Ticket_note.aggregate([
            {
              $match: {
                ticketID: { $in: ticketIds },
                visited: { $nin: [ObjectId(req.body.customerID)] },
              },
            }, // Match the documents based on ticketIDs
            { $group: { _id: "$ticketID", count: { $sum: 1 } } }, // Group by ticketID and calculate the count
          ]);
          const notesCountFormatted = notesCount.reduce(
            (acc, { _id, count }) => {
              acc[_id] = count;
              return acc;
            },
            {}
          );
          res.json({
            status: 200,
            message: "The resources has been fetched",
            tickets: results[1],
            requestTypes: distinctRequestType,
            total: applicationTotal,
            propertyList: properties,
            totalCount: results[0],
            results: paginatedResults,
            notesCount: notesCountFormatted,
          });
        }
      );
    } catch (error) {
      logger.error(error);
      console.log(error);
      res.json({
        status: 500,
        message: "Something Went Wrong",
        tickets: [],
      });
    }
  } else {
    res.json({
      status: 500,
      message: "Please provide customer ID",
      tickets: [],
    });
  }
});

router.post("/filter_tickets_manager", authToken, async (req, res) => {
  const page = parseInt(req.body.pageNumber) || 1;

  const PAGE_LIMIT = 10;

  let query = {};
  const startIndex = (page - 1) * PAGE_LIMIT;
  const endIndex = page * PAGE_LIMIT;
  const paginatedResults = {};

  if (req.body.managerID !== undefined) {
    try {
      if (req.body.propertyID && req.body.propertyID != "Select") {
        query.propertyID = ObjectId(req.body.propertyID);
      } else {
        const manager = await Manager.findOne(
          { _id: req.body.managerID },
          "properties"
        );
        query.propertyID = { $in: manager.properties };
      }

      if (req.body.suite) {
        query.suite = { $regex: req.body.suite, $options: "i" };
      }
      if (req.body.requestType) {
        query.requestType = { $eq: req.body.requestType };
      }
      if (req.body.status && req.body.status != "Select") {
        query.status = { $regex: req.body.status };
      }

      if (req.body.startDate && req.body.endDate) {
        query.createdAt = {
          $gte: moment(req.body.startDate),
          $lt: moment(req.body.endDate),
        };
      }
      if (req.body.ticketID) {
        query._id = req.body.ticketID;
      }
      console.log(req.body);

      // if (req.body.createdByid) {
      //     query.createdByid = req.body.createdByid
      // }

      const countQuery = function (callback) {
        Ticket.find(query, { __v: 0 }).count({}, function (err, count) {
          if (err) {
            callback(err, null);
          } else {
            callback(null, count);
          }
        });
      };
      const manager = await Manager.findOne(
        { _id: req.body.managerID },
        "properties"
      );
      const distPropertyID = await Ticket.find({
        propertyID: { $in: manager.properties },
      }).distinct("propertyID");

      const properties = await Property.find({
        _id: { $in: distPropertyID },
      }).select({ _id: 1, title: 1, propertySignature: 1 });
      const distinctRequestType = await Ticket.distinct("requestType");

      const totalFilterResult = await Ticket.aggregate([
        { $match: query },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]);
      const applicationTotal = totalFilterResult?.reduce((acc, count) => {
        acc[count._id] = count.count;
        acc["Total"] = (acc["Total"] || 0) + count.count;
        return acc;
      }, {});

      const retrieveQuery = function (callback) {
        Ticket.find(query, { __v: 0 })
          .sort({ createdAt: -1 })
          .skip((page - 1) * PAGE_LIMIT)
          .limit(PAGE_LIMIT)
          .populate("assignedTo")
          .populate("assignVendor")
          .populate("confirmedQuote")
          .populate("assignSpecificVendors")
          .populate("propertyManagerId")
          .populate({
            path: "quotedVendorTickets",
            populate: {
              path: "vendorID",
              model: "vendor",
              select: {
                _id: 1,
                agency_name: 1,
                first_name: 1,
                last_name: 1,
                role: 1,
                primaryID: 1,
              },
            },
          })
          .exec(async function (err, tickets, doc) {
            if (err) {
              callback(err, null);
            } else {
              try {
                const ticketWithPropertySignature = await Promise.all(
                  tickets.map(async (ticket) => {
                    const propertySignatures = await Property.find({
                      _id: { $in: ticket.propertyID },
                    }).select({ title: 1, propertySignature: 1 });

                    const propertySignature =
                      propertySignatures[0]?.propertySignature ??
                      generatePropertySignature(propertySignatures[0].title);

                    return {
                      ...ticket.toObject(),
                      propertySignature,
                    };
                  })
                );

                callback(null, ticketWithPropertySignature);
              } catch (error) {
                callback(null, doc);
              }
            }
          });
      };

      if (endIndex < (await Ticket.find(query).countDocuments().exec())) {
        paginatedResults.next = {
          page: page + 1,
          limit: PAGE_LIMIT,
        };
      }

      if (startIndex > 0) {
        paginatedResults.previous = {
          page: page - 1,
          limit: PAGE_LIMIT,
        };
      }

      async.parallel(
        [countQuery, retrieveQuery],
        async function (err, results) {
          if (err) {
            console.log(err);
            res.json({
              status: 500,
              message: "Something Went Wrong",
              tickets: [],
            });
            return;
          }
          const ticketIds = results[1].map((note) => note._id);
          console.log(ticketIds);
          const notesCount = await Ticket_note.aggregate([
            {
              $match: {
                ticketID: { $in: ticketIds },
                visited: { $nin: [ObjectId(req.body.managerID)] },
              },
            }, // Match the documents based on ticketIDs
            { $group: { _id: "$ticketID", count: { $sum: 1 } } }, // Group by ticketID and calculate the count
          ]);
          const notesCountFormatted = notesCount.reduce(
            (acc, { _id, count }) => {
              acc[_id] = count;
              return acc;
            },
            {}
          );
          res.json({
            status: 200,
            message: "The resources has been fetched",
            tickets: results[1],
            requestTypes: distinctRequestType,
            total: applicationTotal,
            totalCount: results[0],
            results: paginatedResults,
            propertyList: properties,
            notesCount: notesCountFormatted,
          });
        }
      );

      // const ticketList = await Ticket.find(query, { __v: 0 }).populate("assignVendor").populate("confirmedQuote")
      // res.json({
      //     status: 200,
      //     message: "The resources has been fetched",
      //     tickets: ticketList,
      //     total: ticketList.length
      // })
    } catch (error) {
      logger.error(error);
      console.log(error);
      res.json({
        status: 500,
        message: "Something Went Wrong",
        tickets: [],
      });
    }
  } else {
    res.json({
      status: 500,
      message: "Please provide manager ID",
      tickets: [],
    });
  }
});

router.post("/total", authToken, async (req, res) => {
  try {
    console.log("req.user.role: ", req.user.role);
    const role = req.user.role;
    let domain = req.body.domain;
    const customerID = req.body.customerId
      ? ObjectId(req.body.customerId)
      : null;
    if (!role) {
      return res.json({
        status: 201,
        message: "role and domain is required",
        success: false,
      });
    }
    let matchConditions = {};
    if (role == "manager") {
      let manager = "";
      manager = await Manager.findOne({ _id: customerID }).select({
        properties: 1,
      });
      if (manager !== "") {
        matchConditions = { propertyID: { $in: manager.properties } };
      }
    } else if (role === "company") {
      matchConditions = { companyDomain: domain };
    } else if (role === "customer") {
      matchConditions = { createdByid: customerID };
    } else if (role === "vendor" || role === "technical staff") {
      matchConditions = { assignedTo: customerID };
    }
    const total = await Ticket.find(matchConditions).countDocuments();

    const open = await Ticket.find(matchConditions).countDocuments({
      status: "Open",
    });
    const inprogress = await Ticket.find(matchConditions).countDocuments({
      status: "Inprogress",
    });
    const completed = await Ticket.find(matchConditions).countDocuments({
      status: "Completed",
    });

    res.json({
      status: 200,
      message: "Total Application Received !",
      totalTickets: { total, open, inprogress, completed },
    });
  } catch (error) {
    logger.error(error);
    res.json({
      status: 500,
      message: error.message,
    });
  }
});

router.post("/filter_tickets_company", authToken, async (req, res) => {
  if (req.body.companyDomain !== undefined) {
    try {
      const page = parseInt(req.body.pageNumber) || 1;
      const PAGE_LIMIT = 10;
      const startIndex = (page - 1) * PAGE_LIMIT;
      const endIndex = page * PAGE_LIMIT;
      const paginatedResults = {};
      let query = {};
      query.companyDomain = req.body.companyDomain;
      let company = await Company.findOne({ domain: req.body.companyDomain });
      if (req.body.propertyManagerID) {
        query.propertyManagerId = {
          $in: [ObjectId(req.body.propertyManagerID)],
        };
      }
      if (req.body.suite) {
        query.suite = { $regex: req.body.suite, $options: "i" };
      }
      if (req.body.requestType) {
        query.requestType = { $eq: req.body.requestType };
      }

      if (req.body.status && req.body.status != "Select") {
        query.status = { $regex: req.body.status };
      }
      if (req.body.startDate && req.body.endDate) {
        query.createdAt = {
          $gte: moment(req.body.startDate).toDate(),
          $lte: moment(req.body.endDate).endOf("day").toDate(),
        };
      }
      if (req.body.ticketID) {
        query._id = req.body.ticketID;
      }

      if (req.body.propertyID) {
        query.propertyID = req.body.propertyID;
      }

      const countQuery = function (callback) {
        Ticket.find(query, { __v: 0 })
          .sort({ _id: -1 })
          .count({}, function (err, count) {
            if (err) {
              callback(err, null);
            } else {
              callback(null, count);
            }
          });
      };

      if (endIndex < (await Ticket.find(query).countDocuments().exec())) {
        paginatedResults.next = {
          page: page + 1,
          limit: PAGE_LIMIT,
        };
      }

      if (startIndex > 0) {
        paginatedResults.previous = {
          page: page - 1,
          limit: PAGE_LIMIT,
        };
      }

      const retrieveQuery = function (callback) {
        Ticket.find(query, { __v: 0 })
          .sort({ createdAt: -1 })
          .skip((page - 1) * PAGE_LIMIT)
          .limit(PAGE_LIMIT)
          .populate("assignedTo")
          .populate("assignVendor")
          .populate("confirmedQuote")
          .populate("assignSpecificVendors")
          .populate("propertyManagerId")
          .exec(async function (err, tickets, doc) {
            if (err) {
              callback(err, null);
            } else {
              try {
                const ticketWithPropertySignature = await Promise.all(
                  tickets.map(async (ticket) => {
                    const propertySignatures = await Property.find({
                      _id: { $in: ticket.propertyID },
                    }).select({ title: 1, propertySignature: 1 });

                    const propertySignature =
                      propertySignatures[0]?.propertySignature ??
                      generatePropertySignature(propertySignatures[0].title);

                    return {
                      ...ticket.toObject(),
                      propertySignature,
                    };
                  })
                );

                callback(null, ticketWithPropertySignature);
              } catch (error) {
                callback(null, doc);
              }
            }
          });
      };

      const distPropertyID = await Ticket.find({
        companyDomain: req.body.companyDomain,
      }).distinct("propertyID");
      const properties = await Property.find({
        _id: { $in: distPropertyID },
      }).select({ _id: 1, title: 1, propertySignature: 1 });

      const distinctRequestType = await Ticket.distinct("requestType");
      const totalFilterResult = await Ticket.aggregate([
        { $match: query },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]);
      const applicationTotal = totalFilterResult?.reduce((acc, count) => {
        acc[count._id] = count.count;
        acc["Total"] = (acc["Total"] || 0) + count.count;
        return acc;
      }, {});

      async.parallel(
        [countQuery, retrieveQuery],
        async function (err, results) {
          console.log("Results.property: " + results);

          if (err) {
            console.log(err);
            res.json({
              status: 500,
              message: "Something Went Wrong",
              tickets: [],
            });
            return;
          }
          const ticketIds = results[1].map((note) => note._id);
          const notesCount = await Ticket_note.aggregate([
            {
              $match: {
                ticketID: { $in: ticketIds },
                visited: { $nin: [company._id] },
              },
            }, // Match the documents based on ticketIDs
            { $group: { _id: "$ticketID", count: { $sum: 1 } } }, // Group by ticketID and calculate the count
          ]);
          const notesCountFormatted = notesCount.reduce(
            (acc, { _id, count }) => {
              acc[_id] = count;
              return acc;
            },
            {}
          );
          res.json({
            status: 200,
            message: "The resources has been fetched",
            tickets: results[1],
            requestTypes: distinctRequestType,
            totalCount: results[0],
            propertyList: properties,
            total: applicationTotal,
            results: paginatedResults,
            notesCount: notesCountFormatted,
          });
        }
      );
    } catch (error) {
      logger.error(error);
      console.log(error);
      res.json({
        status: 500,
        message: "Something Went Wrong",
        tickets: [],
      });
    }
  } else {
    res.json({
      status: 500,
      message: "Please provide Company Domain",
      tickets: [],
    });
  }
});

router.post("/filter_tickets_vendor", async (req, res) => {
  if (req.body.vendorId !== undefined) {
    try {
      const page = parseInt(req.body.pageNumber) || 1;
      const PAGE_LIMIT = 10;
      const startIndex = (page - 1) * PAGE_LIMIT;
      const endIndex = page * PAGE_LIMIT;
      const paginatedResults = {};
      let vendor = await Vendor.findById(req.body.vendorId);

      let query = {
        companyID: { $in: vendor.approvedCompanies },
      };

      // if (req.body.propertyManagerID) {
      //   query.propertyManagerId = {
      //     $in: [ObjectId(req.body.propertyManagerID)],
      //   };
      // }
      // if (req.body.suite) {
      //   query.suite = { $regex: req.body.suite, $options: "i" };
      // }
      if (req.body.requestType) {
        query.requestType = { $eq: req.body.requestType };
      }

      if (req.body.status) {
        query.status = { $eq: req.body.status };
      }
      if (req.body.startDate && req.body.endDate) {
        query.createdAt = {
          $gte: moment(req.body.startDate),
          $lt: moment(req.body.endDate),
        };
      }
      if (req.body.filterID) {
        query._id = req.body.filterID;
      }
      if (req.body.propertyID) {
        query.propertyID = req.body.propertyID;
      }

      if (req.body.suite) {
        query.suite = req.body.suite;
      }

      console.log(query);
      const countQuery = function (callback) {
        Ticket.find(query, { __v: 0 })
          .sort({ _id: -1 })
          .count({}, function (err, count) {
            if (err) {
              callback(err, null);
            } else {
              callback(null, count);
            }
          });
      };

      if (endIndex < (await Ticket.find(query).countDocuments().exec())) {
        paginatedResults.next = {
          page: page + 1,
          limit: PAGE_LIMIT,
        };
      }

      if (startIndex > 0) {
        paginatedResults.previous = {
          page: page - 1,
          limit: PAGE_LIMIT,
        };
      }

      const retrieveQuery = function (callback) {
        Ticket.find(query, { __v: 0 })
          .sort({ _id: -1 })
          .skip((page - 1) * PAGE_LIMIT)
          .limit(PAGE_LIMIT)
          .populate("assignedTo")
          .populate("assignVendor")
          .populate("confirmedQuote")
          .populate("assignSpecificVendors")
          .populate("propertyManagerId")
          .exec(async function (err, tickets, doc) {
            if (err) {
              callback(err, null);
            } else {
              try {
                const ticketWithPropertySignature = await Promise.all(
                  tickets.map(async (ticket) => {
                    const propertySignatures = await Property.find({
                      _id: { $in: ticket.propertyID },
                    }).select({ title: 1, propertySignature: 1 });

                    const propertySignature =
                      propertySignatures[0]?.propertySignature ??
                      generatePropertySignature(propertySignatures[0].title);

                    return {
                      ...ticket.toObject(),
                      propertySignature,
                    };
                  })
                );

                callback(null, ticketWithPropertySignature);
              } catch (error) {
                callback(null, doc);
              }
            }
          });
      };

      const distPropertyID = await Ticket.find({
        companyID: { $in: vendor.approvedCompanies },
      }).distinct("propertyID");

      const properties = await Property.find({
        _id: { $in: distPropertyID },
      }).select({ _id: 1, title: 1, propertySignature: 1 });

      const distinctRequestType = await Ticket.distinct("requestType");

      const totalFilterResult = await Ticket.aggregate([
        { $match: query },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]);
      const applicationTotal = totalFilterResult?.reduce((acc, count) => {
        acc[count._id] = count.count;
        acc["Total"] = (acc["Total"] || 0) + count.count;
        return acc;
      }, {});

      async.parallel([countQuery, retrieveQuery], function (err, results) {
        if (err) {
          console.log(err);
          res.json({
            status: 500,
            message: "Something Went Wrong",
            tickets: [],
          });
          return;
        }
        res.json({
          status: 200,
          message: "The resources has been fetched",
          tickets: results[1],
          requestTypes: distinctRequestType,
          totalCount: results[0],
          propertyList: properties,
          total: applicationTotal,
          results: paginatedResults,
        });
      });
    } catch (error) {
      console.log(error);
      res.json({
        status: 500,
        message: "Something Went Wrong",
        tickets: [],
      });
    }
  } else {
    res.json({
      status: 500,
      message: "Please provide Company Domain",
      tickets: [],
    });
  }
});

router.post("/update_rating", authToken, async (req, res) => {
  if (req.body.ticketID !== undefined) {
    const historyValue = {
      actionBy: req.user.role,
      userId: req.user.id,
      userName: `${req.user.firstname} ${req.user.lastname}`,
      action: `mark as ${
        req.body.customerSatisfaction ? "Completed" : "Unresolved"
      }`,
      createdAt: new Date(Date.now()),
    };
    const ticketList = await Ticket.findOneAndUpdate(
      { _id: req.body.ticketID },
      {
        $set: {
          ratings: parseInt(req.body.ratings) ? parseInt(req.body.ratings) : 0,
          reviews: req.body.reviews,
          customerSatisfaction: req.body.customerSatisfaction,
          internalStatus: req.body.customerSatisfaction ? "Done" : "Unresolved",
          status: req.body.customerSatisfaction ? "Completed" : "Unresolved",
        },
        $push: {
          history: historyValue,
        },
      },
      { new: true }
    );
    let staff;
    if (ticketList?.assignedToType == "technicalStaff") {
      staff = await TechnicalStaff.findOne({ _id: ticketList?.assignedTo });

      let existingRating =
        parseInt(staff.rating) == 0
          ? parseInt(req.body.ratings)
          : parseInt(staff.rating);
      let newRating = parseInt(req.body.ratings);

      console.log(existingRating, newRating);

      let calc = (existingRating + newRating) / 2;

      console.log(calc);

      await TechnicalStaff.updateOne(
        { _id: ticketList?.assignedTo },
        { rating: calc }
      );
    } else if (ticketList?.assignedToType == "vendor") {
      staff = await vendor.findOne({ _id: ticketList?.assignedTo });

      let existingRating =
        parseInt(staff.rating) == 0
          ? parseInt(req.body.ratings)
          : parseInt(staff.rating);
      let newRating = parseInt(req.body.ratings);

      console.log(existingRating, newRating);

      let calc = (existingRating + newRating) / 2;

      console.log(calc, "SDDDDDDDDD");

      await vendor.updateOne({ _id: ticketList?.assignedTo }, { rating: calc });

      // return res
      //   .status(200)
      //   .send({ success: true, message: "Successfully Updated", status: 200 });
    }
    const managerEmail = await Manager.findOne({
      _id: ticketList.propertyManagerId[0],
    });
    console.log(managerEmail, "s");
    const companyName = await Company.findOne(
      { domain: ticketList.companyDomain },
      "name"
    );
    const data = {
      customerName: ticketList.name,
      customerEmail: ticketList.email,
      customerPhone: ticketList.phone,
      // property: ticketList.property,
      suite: ticketList.suite,
      reviews: req.body.reviews,
      ratings: req.body.ratings,
      requestType: ticketList.requestType,
      permission: ticketList.permission,
      suite: ticketList.suite,
      details: ticketList.details,
      requestId: ticketList.primaryID,
      propertyManager: managerEmail.firstname,
      propertyName: ticketList.property,
      companyName: companyName.name,
      logo: companyName?.logo,
      vendorType:
        ticketList.assignSpecificVendors.length > 0
          ? "Vendor"
          : "Technical Staff",
      toStatus: req.body.customerSatisfaction ? "Completed" : "Unresolved",
    };
    const options = Email.generateOptions(
      managerEmail.email,
      "CUSTOMER_RATING",
      data
    );
    const isEmailSent = await Email.send(options);

    res
      .status(200)
      .send({ success: true, message: "Successfully Updated", status: 200 });
  } else {
    res.json({
      status: 500,
      message: "Something Went Wrong",
    });
  }
});

router.post("/move_to_technicalStaff", authToken, async (req, res) => {
  if (req.body.ticketID !== undefined) {
    try {
      const ticket = await Ticket.findByIdAndUpdate(req.body.ticketID, {
        assignedTo: req.body.assignedStaff,
        assignedToType: "technicalStaff",
        isMovedToVendorPortal: true,
      });

      console.log(ticket);

      const ticketList = await Ticket.findOne({
        _id: req.body.ticketID,
      }).populate("assignedTo");
      const historyValue = {
        actionBy: req.user.role,
        userId: req.user.id,
        userName: `${req.user.firstname} ${req.user.lastname}`,
        action: `assigned to technical staff ${ticketList.assignedTo.first_name} ${ticketList.assignedTo.last_name}`,
        createdAt: new Date(Date.now()),
      };
      await Ticket.updateOne(
        { _id: req.body.ticketID },
        {
          $push: { history: historyValue },
        }
      );

      const findVendor = await TechnicalStaff.find(
        { _id: ObjectId(req.body.assignedStaff) },
        { email: 1, first_name: 1 }
      );

      // const vendorMails = findVendor.map((item) => item.email);
      const companyName = await Company.findOne({
        domain: ticketList.companyDomain,
      });

      findVendor.forEach((item) => {
        const data = {
          propertyName: ticketList.property,
          vendorName: item.first_name,
          companyName: companyName.name,
          propertyManager: req.user.firstname,
          propertyManagerEmail: req.user.email,
          requestType: ticketList.requestType,
          suite: ticketList.suite,
          details: ticketList.details,
          permission: ticketList.permission,
          logo: companyName?.logo,
        };

        const options = Email.generateOptions(
          item.email,
          "SEND_MAIL_TO_ALL_ASSIGNED_VENDORS",
          data
        );
        const isEmailSent = Email.send(options);
      });

      res.json({
        status: 200,
        success: true,
        message: "The resources has been fetched",
        tickets: ticketList,
        total: ticketList.length,
      });

      // const isEmailSent = await Email.send(options);
    } catch (e) {
      console.log(e);
    }
  } else {
    res.json({
      status: 201,
      message: "Ticket Id is not provided",
    });
  }
});

router.post("/update_technical_staff_ticket", authToken, async (req, res) => {
  if (req.body.ticketID !== undefined) {
    try {
      const ticketStatus = await Ticket.findOne({ _id: req.body.ticketID });
      const historyValue = {
        actionBy: req.user.role,
        userId: req.user.id,
        userName: `${req.user.firstname} ${req.user.lastname}`,
        action: `updated the ticket status from ${ticketStatus?.status} to ${req.body.status}`,
        createdAt: new Date(Date.now()),
      };

      const ticketList = await Ticket.updateOne(
        { _id: req.body.ticketID },
        {
          status: req.body.status,
          internalStatus: req.body.status,
          startDate: req.body.startDate,
          estimatedEndDate: req.body.endDate,
          startTime: req.body.startTime,
          estimatedETime: req.body.endTime,
          notes: req.body.notes,
          estimatedAmount: req.body.estimatedAmount,
          $push: { history: historyValue },
        }
      );

      const companyName = await Company.findOne({
        domain: ticketStatus.companyDomain,
      });

      let emails = [
        {
          name: ticketStatus.name,
          email: ticketStatus.email,
        },
      ];

      const managers = await Manager.find({
        properties: { $in: [ticketStatus.propertyID] },
      });

      const staffs = await TechnicalStaff.find({
        assigned_properties: { $in: [ticketStatus.propertyID] },
      });

      staffs.forEach((staff) => {
        emails.push({
          name: staff.first_name + "" + staff.last_name,
          email: staff.email,
        });
      });

      managers.forEach((manager) => {
        emails.push({
          name: manager.firstname + "" + manager.lastname,
          email: manager.email,
        });
      });

      emails.forEach((i) => {
        const data = {
          toStatus: req.body.status,
          requestId: ticketStatus.primaryID,
          propertyManager: i.name,
          permission: ticketStatus.permission,
          suite: ticketStatus.suite,
          details: ticketStatus.details,
          requestType: ticketStatus.requestType,
          companyName: companyName.name,
          phone: ticketStatus.phone,
          publicLink: companyName.slug,
          propertyName: ticketStatus.property,
          logo: companyName?.logo,
          vendorType:
            ticketStatus.assignSpecificVendors.length > 0
              ? "Vendor"
              : "Technical Staff",
        };
        const options = Email.generateOptions(
          i.email,
          "REQUEST_STATUS_UPDATE",
          data
        );
        const isEmailSent = Email.send(options);
      });

      //    const data = {
      //   owner: req.body.name,
      //   applicantName: req.body.name,
      //   applicantEmail: req.body.email,
      //   propertyName: req.body.property,
      //   propertyLayout: req.body.suite,
      //   companyName: req.body.companyDomain,
      //   applicationStatus: "Date is set",
      // };
      // const options = Email.generateOptions(
      //   req.body.email,
      //   "APPLICATION_STATUS_CHANGE_EMAIL_TO_COMPANY",
      //   data
      // );
      // const isEmailSent = await Email.send(options);
      res.json({
        status: 200,
        success: true,
        message: "The resources has been fetched",
        tickets: ticketList,
        total: ticketList.length,
      });
    } catch (error) {
      logger.error(error);

      res.json({
        status: 500,
        message: error.message,
      });
    }
  } else {
    res.json({
      status: 500,
      message: "Ticket Id is not provided",
    });
  }
});

router.post("/update_ticket", authToken, async (req, res) => {
  if (req.body.ticketID !== undefined) {
    try {
      const historyValue = {
        actionBy: req.user.role,
        userId: req.user.id,
        userName: `${req.user.firstname} ${req.user.lastname}`,
        action: "updated the ticket",
        createdAt: new Date(Date.now()),
      };

      const ticketList = await Ticket.updateOne(
        { _id: req.body.ticketID },
        {
          assignVendor: req.body.assignVendor,
          status: req.body.status,
          internalStatus: req.body.status,
          startDate: req.body.startDate,
          endDate: req.body.endDate,
          startTime: req.body.startTime,
          endTime: req.body.endTime,
          notes: req.body.notes,
          isConfirmationSet: req.body.isConfirmationSet,
          $push: { history: historyValue },
        }
      );
      const company = await Company.findOne({ _id: ticketList.companyID });

      const data = {
        owner: req.body.name,
        applicantName: req.body.name,
        applicantEmail: req.body.email,
        propertyName: req.body.property,
        propertyLayout: req.body.suite,
        companyName: req.body.companyDomain,
        applicationStatus: req.body.status,
        logo: company?.logo,
      };
      const options = Email.generateOptions(
        req.body.email,
        "APPLICATION_STATUS_CHANGE_EMAIL_TO_COMPANY",
        data
      );
      const isEmailSent = await Email.send(options);

      res.json({
        status: 200,
        message: "The resources has been fetched",
        tickets: ticketList,
        total: ticketList.length,
      });
    } catch (error) {
      logger.error(error);

      res.json({
        status: 500,
        message: "Something Went Wrong",
      });
    }
  } else {
    res.json({
      status: 500,
      message: "Ticket Id is not provided",
    });
  }
});

router.post("/confirm_ticket", authToken, async (req, res) => {
  if (req.body.ticketID !== undefined) {
    try {
      const historyValue = {
        actionBy: req.user.role,
        userId: req.user.id,
        userName: `${req.user.firstname} ${req.user.lastname}`,
        action: "confirmed",
        createdAt: new Date(Date.now()),
      };
      const ticketList = await Ticket.updateOne(
        { _id: req.body.ticketID },
        {
          isConfirmed: true,
          isConfirmationSet: false,
          $push: { history: historyValue },
        }
      );

      res.json({
        status: 200,
        message: "The resources has been fetched",
      });
    } catch (error) {
      logger.error(error);

      res.json({
        status: 500,
        message: "Something Went Wrong",
      });
    }
  } else {
    res.json({
      status: 500,
      message: "Something Went Wrong",
    });
  }
});

//Getting customer Ticket Related Data
router.post("/getdata", async (req, res) => {
  try {
    const id = req.body.propertyID;
    const property = await Property.find({ _id: { $in: id } });
    res.json({
      status: 200,
      message: "The resources has been fetched",
      property: property,
    });
  } catch (e) {
    logger.error(error);
    res.json({
      status: 500,
      message: "Something Went Wrong",
    });
  }
});

// Adding new Ticket
router.post("/public", async (req, res) => {
  try {
    const oldTicket = false; // TODO check for applicant duplicacy

    if (!oldTicket) {
      const managers = await Manager.aggregate([
        {
          $match: {
            properties: { $in: [ObjectId(req.body.propertyID)] },
          },
        },
        {
          $project: {
            _id: 1,
          },
        },
      ]);

      const historyValue = {
        actionBy: "public",
        userName: req.body.name,
        action: "created the ticket",
        createdAt: new Date(Date.now()),
      };

      // const user = await Customer.findOne({email:req.body.email},{_id:1})
      // if(!user){
      //   res.json({
      //     status: 401,
      //     message: "Enter your registered mail address",
      //   });
      // }
      const response = await axios.post(
        "https://www.rentdigicare.com:9000/requesttype/getrequest",
        {
          company_id: req.body.companyID,
        }
      );

      const validRequestTypes = response.data.requestType.map(
        (request) => request.request_type
      );

      if (!validRequestTypes.includes(req.body.requestType)) {
        return res.json({
          status: 400,
          message: "Invalid request type",
        });
      }

      const newTicket = await Ticket.create({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        details: req.body.details,
        requestType: req.body.requestType,
        permission: req.body.permission,
        property: req.body.property,
        building: req.body.building,
        propertyID: req.body.propertyID,
        propertyManagerId: managers,
        suite: req.body.suite,
        status: "Open",
        internalStatus: "Open",
        // priority: req.body.priority,
        // createdByid: 'public',
        createdByRole: "customer",
        history: historyValue,
        companyID: req.body.companyID,
        // TODO: Documents
        // documents: req.body.documents,
        companyDomain: req.body.companyDomain,
      });

      const manager = await Manager.find(
        { properties: { $in: [req.body.propertyID] } },
        "email firstname companyID"
      ).populate("companyID");

      const companyName = await Company.findOne({
        domain: req.body.companyDomain,
      });

      // console.log(companyName,'companyNamecompanyName')

      let managerName = [];
      manager.forEach((man) => {
        managerName.push(man.firstname);
        const data = {
          propertyManager: man.firstname,
          propertyName: req.body.property,
          propertyLayout: req.body.suite,
          companyName: companyName.name,
          applicantEmail: req.body.email,
          applicantName: req.body.name,
          requestType: req.body.requestType,
          permission: req.body.permission,
          suite: req.body.suite,
          phone: req.body.phone,
          details: req.body.details,
        };

        const dateMoment = moment().add(
          man?.companyID?.ticketEmailDays,
          "days"
        );
        const dayIndex = dateMoment.day();

        const monthIndex = dateMoment.month() + 1;

        const date = dateMoment.date();

        const job = schedule.scheduleJob(
          `59 30 10 ${date} ${monthIndex} ${dayIndex}`,
          async function () {
            const ticket = await Ticket.findOne({
              _id: newTicket._id,
            }).populate("assignedTo");

            if (ticket.status !== "completed") {
              if (ticket?.assignedTo?.email) {
                const notificationbData = {
                  staff: ticket?.assignedTo?.first_name,
                  ticketId: ticket._id,
                  propertyName: ticket.property,
                  companyName: ticket.companyDomain,
                };

                const options = Email.generateOptions(
                  ticket?.assignedTo?.email,
                  "CLOSE_TICKET_MAIL_TO_MANAGER",
                  notificationbData
                );
                const isEmailSent = Email.send(options);
              }
            }
          }
        );
        const options = Email.generateOptions(
          man.email,
          "NEW_TICKET_MAIL_TO_MANAGER",
          data
        );

        const isEmailSent = Email.send(options);
      });
      // const isEmailSent = Email.send(options);
      console.log(managerName);
      const dataforCustomer = {
        propertyManager: managerName.join(","),
        propertyName: req.body.property,
        propertyLayout: req.body.suite,
        companyName: companyName.name,
        applicantEmail: req.body.email,
        applicantName: req.body.name,
        requestType: req.body.requestType,
        permission: req.body.permission,
        suite: req.body.suite,
        phone: req.body.phone,
        details: req.body.details,
        logo: companyName?.logo,
      };

      // console.log(dataforCustomer, 'dataforCustomer')

      const dateMoment = moment().add(
        manager?.companyID?.ticketEmailDays,
        "days"
      );

      // const dayIndex = dateMoment.day();

      // const monthIndex = dateMoment.month() + 1;

      // const date = dateMoment.date();

      // const job = schedule.scheduleJob(
      //   `59 30 10 ${date} ${monthIndex} ${dayIndex}`,
      //   async function () {
      //     const ticket = await Ticket.findOne({ _id: newTicket._id }).populate(
      //       "assignedTo"
      //     );

      //     if (ticket.status !== "completed") {
      //       if (ticket?.assignedTo?.email) {
      //         const notificationbData = {
      //           staff: ticket?.assignedTo?.first_name,
      //           ticketId: ticket._id,
      //           propertyName: ticket.property,
      //           companyName: ticket.companyDomain,
      //         };

      //         const options = Email.generateOptions(
      //           ticket?.assignedTo?.email,
      //           "CLOSE_TICKET_MAIL_TO_MANAGER",
      //           notificationbData
      //         );
      //         const isEmailSent = Email.send(options);
      //       }
      //     }
      //   }
      // );

      // const options = Email.generateOptions(
      //   manager.email,
      //   "NEW_TICKET_MAIL_TO_MANAGER",
      //   data
      // );
      // const isEmailSent = Email.send(options);

      const staff = await TechnicalStaff.find({
        assigned_properties: { $in: [req.body.propertyID] },
      });
      console.log(staff, "staff");

      staff.forEach((staf) => {
        const data = {
          propertyManager: staf.first_name,
          propertyName: req.body.property,
          propertyLayout: req.body.suite,
          companyName: companyName.name,
          applicantEmail: req.body.email,
          applicantName: req.body.name,
          requestType: req.body.requestType,
          permission: req.body.permission,
          suite: req.body.suite,
          phone: req.body.phone,
          details: req.body.details,
        };
        const options = Email.generateOptions(
          staf.email,
          "NEW_TICKET_MAIL_TO_MANAGER",
          data
        );

        const isEmailSent = Email.send(options);
      });

      const optionsForCustomer = Email.generateOptions(
        req.body.email,
        "NEW_TICKET_FOR_USER",
        dataforCustomer
      );
      const isEmailSentCustomer = Email.send(optionsForCustomer);

      res.json({
        status: 200,
        id: newTicket._id,
        message: "Ticket Registered !",
      });
    } else {
      res.json({
        status: 400,
        message: "Already Opened Ticket",
      });
    }
  } catch (error) {
    console.log(error);
    // logger.error(error)
    res.json({
      status: 500,
      message: "Something Went Wrong",
    });
  }
});

router.post("/", authToken, async (req, res) => {
  try {
    const oldTicket = false; // TODO check for applicant duplicacy

    if (!oldTicket) {
      const managers = await Manager.aggregate([
        {
          $match: {
            properties: { $in: [ObjectId(req.body.propertyID)] },
          },
        },
        {
          $project: {
            _id: 1,
          },
        },
      ]);

      const historyValue = {
        actionBy: req.user.role,
        userId: req.user.id,
        userName: `${req.user.firstname} ${req.user.lastname}`,
        action: "created the ticket",
        createdAt: new Date(Date.now()),
      };

      const newTicket = await Ticket.create({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        details: req.body.details,
        requestType: req.body.requestType,
        permission: req.body.permission,
        property: req.body.property,
        propertyID: req.body.propertyID,
        propertyManagerId: managers,
        suite: req.body.suite,
        status: "Open",
        internalStatus: "Open",
        priority: req.body.priority,
        createdByid: req.body.createdByid,
        createdByRole: req.body.createdByRole,
        history: historyValue,
        companyID: req.body.companyID,
        // TODO: Documents
        // documents: req.body.documents,
        companyDomain: req.body.companyDomain,
      });

      const manager = await Manager.find(
        { properties: { $in: [req.body.propertyID] } },
        "email firstname companyID"
      ).populate("companyID");

      // const comapany = await Compan
      const companyName = await Company.findOne({
        domain: req.body.companyDomain,
      });

      console.log(companyName, "companyNamecompanyName");
      console.log("companyNamecompanyName");
      let managerName = [];

      manager.forEach((man) => {
        const data = {
          propertyManager: man.firstname,
          propertyName: req.body.property,
          propertyLayout: req.body.suite,
          companyName: companyName.name,
          applicantEmail: req.body.email,
          applicantName: req.body.name,
          requestType: req.body.requestType,
          permission: req.body.permission,
          suite: req.body.suite,
          details: req.body.details,
          phone: req.body.phone,
          logo: companyName?.logo,
        };

        const options = Email.generateOptions(
          man.email,
          "NEW_TICKET_MAIL_TO_MANAGER",
          data
        );
      });

      const dataforCustomer = {
        propertyManager: managerName.join(","),
        propertyName: req.body.property,
        propertyLayout: req.body.suite,
        companyName: companyName.name,
        applicantEmail: req.body.email,
        applicantName: req.body.name,
        requestType: req.body.requestType,
        permission: req.body.permission,
        suite: req.body.suite,
        phone: req.body.phone,
        details: req.body.details,
        logo: companyName?.logo,
      };

      const optionsForCustomer = Email.generateOptions(
        req.body.email,
        "NEW_TICKET_FOR_USER",
        dataforCustomer
      );
      const isEmailSentCustomer = Email.send(optionsForCustomer);
      console.log(req.body.propertyID);
      const staff = await TechnicalStaff.find({
        assigned_properties: { $in: [req.body.propertyID] },
      });
      console.log(staff, "staff");

      staff.forEach((staf) => {
        const data = {
          propertyManager: staf.first_name,
          propertyName: req.body.property,
          propertyLayout: req.body.suite,
          companyName: companyName.name,
          applicantEmail: req.body.email,
          applicantName: req.body.name,
          requestType: req.body.requestType,
          permission: req.body.permission,
          suite: req.body.suite,
          phone: req.body.phone,
          details: req.body.details,
        };
        const options = Email.generateOptions(
          staf.email,
          "NEW_TICKET_MAIL_TO_MANAGER",
          data
        );

        const isEmailSent = Email.send(options);
      });

      res.json({
        status: 200,
        id: newTicket._id,
        message: "Ticket Registered !",
      });
    } else {
      res.json({
        status: 400,
        message: "Already Opened Ticket",
      });
    }
  } catch (error) {
    console.log(error);
    // logger.error(error)
    res.json({
      status: 500,
      message: "Something Went Wrong",
    });
  }
});

//MOVE TO VENDOR PORTAL
router.post("/move_to_vendor_portal", authToken, async (req, res) => {
  if (req.body.ticketID !== undefined) {
    try {
      const historyValue = {
        actionBy: req.user.role,
        userId: req.user.id,
        userName: `${req.user.firstname} ${req.user.lastname}`,
        action: "requested all vendors for Quote",
        createdAt: new Date(Date.now()),
      };

      const ticket = await Ticket.findOneAndUpdate(
        { _id: req.body.ticketID },
        {
          propertyManagerId: req.user.id,
          isMovedToVendorPortal: true,
          $push: { history: historyValue },
        },
        {
          new: true,
        }
      );
      const findVendor = await Vendor.find(
        { approvedCompanies: ObjectId(ticket.companyID) },
        { email: 1, first_name: 1 }
      );
      // const vendorMails = findVendor.map((item) => item.email);
      const companyName = await Company.findOne({
        domain: ticket.companyDomain,
      });
      findVendor.forEach((item) => {
        const data = {
          propertyName: ticket.property,
          vendorName: item.first_name,
          companyName: companyName.name,
          propertyManager: req.user.firstname,
          propertyManagerEmail: req.user.email,
          requestType: ticket.requestType,
          suite: ticket.suite,
          details: ticket.details,
          permission: ticket.permission,
          logo: companyName?.logo,
        };

        const options = Email.generateOptions(
          item.email,
          "SEND_MAIL_TO_ALL_ASSIGNED_VENDORS",
          data
        );
        const isEmailSent = Email.send(options);
      });
      res.json({
        status: 200,
        success: true,
        message: "Moved to vendor portal",
      });
    } catch (error) {
      logger.error(error);
      console.log(error);
      res.json({
        status: 201,
        success: false,
        message: "Something Went Wrong",
      });
    }
  } else {
    res.json({
      status: 201,
      success: false,
      message: "Something Went Wrong",
    });
  }
});

//MOVE TO SPECIFIC VENDOR
router.post("/move_to_specific_vendor", authToken, async (req, res) => {
  if (req.body.ticketID !== undefined) {
    try {
      await Ticket.updateOne(
        { _id: req.body.ticketID },
        {
          propertyManagerId: req.user.id,
          $push: {
            assignSpecificVendors: req.body.vendorID,
          },
          isMovedToVendorPortal: true,
        }
      );

      const ticket = await Ticket.findOne({ _id: req.body.ticketID }).populate(
        "assignSpecificVendors"
      );

      const historyValue = {
        actionBy: req.user.role,
        userId: req.user.id,
        userName: `${req.user.firstname} ${req.user.lastname}`,
        action: `assigned to specific vendor ${ticket.assignSpecificVendors?.[0]?.first_name} ${ticket.assignSpecificVendors?.[0]?.last_name}`,
        createdAt: new Date(Date.now()),
      };

      await Ticket.updateOne(
        { _id: req.body.ticketID },
        {
          $push: {
            history: historyValue,
          },
        }
      );

      const findVendor = await Vendor.find(
        { _id: ObjectId(req.body.vendorID) },
        { email: 1, first_name: 1 }
      );
      // const vendorMails = findVendor.map((item) => item.email);
      const companyName = await Company.findOne({
        domain: ticket.companyDomain,
      });
      findVendor.forEach((item) => {
        const data = {
          propertyName: ticket.property,
          vendorName: item.first_name,
          companyName: companyName.name,
          propertyManager: req.user.firstname,
          propertyManagerEmail: req.user.email,
          requestType: ticket.requestType,
          suite: ticket.suite,
          details: ticket.details,
          permission: ticket.permission,
          logo: companyName?.logo,
        };

        const options = Email.generateOptions(
          item.email,
          "SEND_MAIL_TO_ALL_ASSIGNED_VENDORS",
          data
        );
        const isEmailSent = Email.send(options);
      });
      res.json({
        status: 200,
        success: true,
        message: "Moved to vendor ",
      });
    } catch (error) {
      logger.error(error);
      console.log("error: ", error);
      res.json({
        status: 201,
        sucess: false,
        message: "Something Went Wrong",
      });
    }
  } else {
    res.json({
      status: 201,
      success: false,
      message: "Something Went Wrong",
    });
  }
});

//GET TECHNICAL STAFF TICKET
router.post("/technicalstaff/:technicalstaff", async (req, res) => {
  try {
    const page = parseInt(req.body.pageNumber) || 1;
    const PAGE_LIMIT = 10;
    const startIndex = (page - 1) * PAGE_LIMIT;
    const endIndex = page * PAGE_LIMIT;
    const paginatedResults = {};

    const staff = await TechnicalStaff.findById(req.params.technicalstaff);

    let query = {
      $or: [
        { propertyID: { $in: staff.assigned_properties } },
        { assignedTo: staff._id },
      ],
    };

    if (req.body.requestType) {
      query.requestType = { $eq: req.body.requestType };
    }

    if (req.body.status) {
      query.status = { $eq: req.body.status };
    }
    if (req.body.startDate && req.body.endDate) {
      query.createdAt = {
        $gte: moment(req.body.startDate),
        $lt: moment(req.body.endDate),
      };
    }
    if (req.body.filterID) {
      query._id = req.body.filterID;
    }
    if (req.body.propertyID) {
      query.propertyID = req.body.propertyID;
    }

    const countQuery = function (callback) {
      Ticket.find(query, { __v: 0 })
        .sort({ _id: -1 })
        .count({}, function (err, count) {
          if (err) {
            callback(err, null);
          } else {
            callback(null, count);
          }
        });
    };

    if (endIndex < (await Ticket.find(query).countDocuments().exec())) {
      paginatedResults.next = {
        page: page + 1,
        limit: PAGE_LIMIT,
      };
    }

    if (startIndex > 0) {
      paginatedResults.previous = {
        page: page - 1,
        limit: PAGE_LIMIT,
      };
    }

    const retrieveQuery = function (callback) {
      Ticket.find(query, { __v: 0 })
        .sort({ _id: -1 })
        .skip((page - 1) * PAGE_LIMIT)
        .limit(PAGE_LIMIT)
        .populate("assignedTo")
        .populate("assignVendor")
        .populate("confirmedQuote")
        .populate("assignSpecificVendors")
        .populate("propertyManagerId")
        .exec(function (err, doc) {
          if (err) {
            callback(err, null);
          } else {
            callback(null, doc);
          }
        });
    };
    const distPropertyID = await Ticket.find({
      companyID: { $in: staff.assigned_companies },
    }).distinct("propertyID");

    const properties = await Property.find({
      _id: { $in: distPropertyID },
    }).select({ _id: 1, title: 1 });

    const distinctRequestType = await Ticket.distinct("requestType");

    const totalFilterResult = await Ticket.aggregate([
      { $match: query },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const applicationTotal = totalFilterResult?.reduce((acc, count) => {
      acc[count._id] = count.count;
      acc["Total"] = (acc["Total"] || 0) + count.count;
      return acc;
    }, {});

    async.parallel([countQuery, retrieveQuery], async function (err, results) {
      console.log(results);
      if (err) {
        console.log(err);
        res.json({
          status: 500,
          message: "Something Went Wrong",
          tickets: [],
        });
        return;
      }
      const ticketIds = results[1].map((note) => note._id);
      const notesCount = await Ticket_note.aggregate([
        {
          $match: {
            ticketID: { $in: ticketIds },
            visited: { $nin: [ObjectId(req.params.technicalstaff)] },
          },
        }, // Match the documents based on ticketIDs
        { $group: { _id: "$ticketID", count: { $sum: 1 } } }, // Group by ticketID and calculate the count
      ]);
      const notesCountFormatted = notesCount.reduce((acc, { _id, count }) => {
        acc[_id] = count;
        return acc;
      }, {});
      res.json({
        status: 200,
        message: "The resources has been fetched",
        tickets: results[1],
        requestTypes: distinctRequestType,
        totalCount: results[0],
        propertyList: properties,
        notesCount: notesCountFormatted,
        total: applicationTotal,
        results: paginatedResults,
      });
    });
  } catch (e) {
    console.log(e);
    res.json({
      status: 201,
      success: false,
      message: "Something Went Wrong",
    });
  }
});

//GET VENDOR PORTAL TICKETS
router.post("/get_vendor_portal_tickets/:vendorID", async (req, res) => {
  try {
    const page = parseInt(req.body.pageNumber) || 1;
    const PAGE_LIMIT = 10;
    const startIndex = (page - 1) * PAGE_LIMIT;
    const endIndex = page * PAGE_LIMIT;
    const paginatedResults = {};
    let vendor = await Vendor.findById(req.params.vendorID);

    let query = {
      companyID: { $in: vendor.approvedCompanies },
    };

    // if (req.body.propertyManagerID) {
    //   query.propertyManagerId = {
    //     $in: [ObjectId(req.body.propertyManagerID)],
    //   };
    // }
    // if (req.body.suite) {
    //   query.suite = { $regex: req.body.suite, $options: "i" };
    // }
    if (req.body.requestType) {
      query.requestType = { $eq: req.body.requestType };
    }

    if (req.body.status) {
      query.status = { $eq: req.body.status };
    }
    if (req.body.pr)
      if (req.body.startDate && req.body.endDate) {
        query.createdAt = {
          $gte: moment(req.body.startDate),
          $lt: moment(req.body.endDate),
        };
      }
    if (req.body.ticketID) {
      query._id = req.body.ticketID;
    }

    const countQuery = function (callback) {
      Ticket.find(query, { __v: 0 })
        .sort({ _id: -1 })
        .count({}, function (err, count) {
          if (err) {
            callback(err, null);
          } else {
            callback(null, count);
          }
        });
    };

    if (endIndex < (await Ticket.find(query).countDocuments().exec())) {
      paginatedResults.next = {
        page: page + 1,
        limit: PAGE_LIMIT,
      };
    }

    if (startIndex > 0) {
      paginatedResults.previous = {
        page: page - 1,
        limit: PAGE_LIMIT,
      };
    }

    const retrieveQuery = function (callback) {
      Ticket.find(query, { __v: 0 })
        .sort({ _id: -1 })
        .skip((page - 1) * PAGE_LIMIT)
        .limit(PAGE_LIMIT)
        .populate("assignedTo")
        .populate("assignVendor")
        .populate("confirmedQuote")
        .populate("assignSpecificVendors")
        .populate("propertyManagerId")
        .exec(function (err, doc) {
          if (err) {
            callback(err, null);
          } else {
            callback(null, doc);
          }
        });
    };

    const distPropertyID = await Ticket.find({
      companyID: { $in: vendor.approvedCompanies },
    }).distinct("propertyID");
    const properties = await Property.find({
      _id: { $in: distPropertyID },
    }).select({ _id: 1, title: 1 });

    const distinctRequestType = await Ticket.distinct("requestType");

    const totalFilterResult = await Ticket.aggregate([
      { $match: query },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const applicationTotal = totalFilterResult?.reduce((acc, count) => {
      acc[count._id] = count.count;
      acc["Total"] = (acc["Total"] || 0) + count.count;
      return acc;
    }, {});

    async.parallel([countQuery, retrieveQuery], function (err, results) {
      if (err) {
        console.log(err);
        res.json({
          status: 500,
          message: "Something Went Wrong",
          tickets: [],
        });
        return;
      }
      res.json({
        status: 200,
        message: "The resources has been fetched",
        tickets: results[1],
        requestTypes: distinctRequestType,
        totalCount: results[0],
        propertyList: properties,
        total: applicationTotal,
        results: paginatedResults,
      });
    });
  } catch (e) {
    console.log(e);
    res.json({
      status: 201,
      success: false,
      message: "Something Went Wrong",
    });
  }
});

//GET SPECIFIC VENDOR TICKETS
router.post("/get_vendor_specific_tickets/:vendorID", async (req, res) => {
  try {
    const page = req.body.pageNumber || 1;

    const PAGE_LIMIT = 10;

    let query = {
      assignSpecificVendors: { $in: [req.params.vendorID] },
      isMovedToVendorPortal: true,
      status: "Open",
    };

    if (req.body.propertyID && req.body.propertyID != "Select") {
      query.propertyID = { $eq: req.body.propertyID };
    }

    if (req.body.priority && req.body.priority != "Select") {
      query.priority = { $eq: req.body.priority };
    }

    const countQuery = function (callback) {
      Ticket.find(query, { __v: 0 })
        .sort({ _id: -1 })
        .count({}, function (err, count) {
          if (err) {
            callback(err, null);
          } else {
            callback(null, count);
          }
        });
    };

    const retrieveQuery = function (callback) {
      Ticket.find(query, { __v: 0 })
        .sort({ _id: -1 })
        .skip((page - 1) * PAGE_LIMIT)
        .limit(PAGE_LIMIT)
        .populate("assignedTo")
        .populate("assignVendor")
        .populate({
          path: "quotedVendorTickets",
          match: {
            vendorID: req.params.vendorID,
          },
        })
        .populate({ path: "companyID", select: "name" })
        .exec(function (err, doc) {
          if (err) {
            callback(err, null);
          } else {
            callback(null, doc);
          }
        });
    };

    async.parallel([countQuery, retrieveQuery], function (err, results) {
      if (err) {
        console.log(err);
        res.json({
          status: 500,
          message: "Something Went Wrong",
          tickets: [],
        });
        return;
      }

      res.json({
        status: 200,
        message: "The resources has been fetched",
        tickets: results[1],
        totalCount: results[0],
      });
    });

    // const tickets = await Ticket.find({ assignSpecificVendors: { $in: [req.params.vendorID] }, isMovedToVendorPortal: true, status: "open" }).populate({
    //     path: 'quotedVendorTickets',
    //     match: {
    //         vendorID: req.params.vendorID
    //     }
    // })

    // res.json({
    //     status: 200,
    //     sucess: true,
    //     message: "data is fetcheched",
    //     tickets: tickets

    // })
  } catch (e) {
    res.json({
      status: 201,
      success: false,
      message: "Something Went Wrong",
    });
  }
});

// QUOTE VENDOR TICKET
router.post("/quote_vendor_ticket", authToken, async (req, res) => {
  try {
    const quoted_vendor_tickets = new Quoted_vendor_tickets(req.body);

    const addedQuoteTicket = await quoted_vendor_tickets.save();

    const historyValue = {
      actionBy: req.user.role,
      userId: req.user.id,
      userName: `${req.user.firstname} ${req.user.lastname}`,
      action: "quoted",
      createdAt: new Date(Date.now()),
    };

    const ticketList = await Ticket.findOneAndUpdate(
      { _id: req.body.ticketID },
      {
        $push: {
          quotedVendorTickets: addedQuoteTicket._id,
          history: historyValue,
        },
      },
      {
        new: true,
      }
    );

    const managers = await Manager.findOne({
      _id: ticketList.propertyManagerId[0],
    });
    const vendor = await Vendor.findOne({ _id: addedQuoteTicket.vendorID });
    const companyName = await Company.findOne({
      domain: ticketList.companyDomain,
    });
    const data = {
      vendorName: vendor.first_name,
      vendorEmail: vendor.email,
      startDate: moment(addedQuoteTicket.startDate).format("DD/MM/YYYY"),
      startTime: moment(addedQuoteTicket.startTime, "HH:mm").format("hh:mm A"),
      endDate: moment(addedQuoteTicket.estimatedEndDate).format("DD/MM/YYYY"),
      endTime: moment(addedQuoteTicket.estimatedETime, "HH:mm").format(
        "hh:mm A"
      ),
      estimatedAmount: "$" + addedQuoteTicket.estimatedAmount,
      notes: addedQuoteTicket.notes,
      companyName: companyName.name,
      propertyManager: managers.firstname,
      propertyName: ticketList.property,
      suite: ticketList.suite,
      agencyName: vendor.agency_name,
      requestId: ticketList.primaryID,
      logo: companyName?.logo,
    };
    const options = Email.generateOptions(
      managers.email,
      "QUOTE_TICKET_BY_VENDOR",
      data
    );
    const isEmailSent = Email.send(options);

    res.status(200).send({ success: true, addedQuoteTicket });
  } catch (e) {
    console.log(e);
    res.status(400).send({ success: false, errorMessage: e });
  }
});

// Uplaod Documents for vendor
router.post(
  "/upload-quoted-documents",
  upload.array("file", 10),
  async (req, res) => {
    try {
      const zip = new admZip();
      if (req.files) {
        req.files.forEach((file) => {
          console.log("Files", file.path);
          zip.addLocalFile(file.path);
        });
        fs.writeFileSync(
          `uploads/quotedDocuments/${req.headers.id}.zip`,
          zip.toBuffer()
        );
        const result = await Quoted_vendor_tickets.findOneAndUpdate(
          { _id: req.headers.id },
          {
            documents: `uploads/quotedDocuments/${req.headers.id}.zip`,
          }
        );
      }
      res.json({
        status: 201,
        message: "Successfully uploaded !",
      });
    } catch (error) {
      logger.error(error);
      console.log(error);
      res.json({
        status: 500,
        message: "Something Went Wrong",
      });
    }
  }
);

router.post(
  "/view_documents",
  /*authToken,*/ async (req, res) => {
    try {
      const quoted_tickets = await Quoted_vendor_tickets.findOne({
        _id: req.body.quote_id,
      });

      var zipId_proof = new admZip(quoted_tickets.documents);
      var zipEntrieszipId_proof = zipId_proof.getEntries(); // an array of ZipEntry records

      // console.log(zipEntries)

      zipId_proof.extractAllTo("uploads/tmp", true);

      let documents = [];
      zipEntrieszipId_proof.forEach(function (zipEntry) {
        let proof_path = `/tmp/${zipEntry.entryName}`;

        documents.push(proof_path);
      });

      res.status(200).send({ success: true, documents });
    } catch (e) {}
  }
);

router.post(
  "/view_ticket_documents",
  /*authToken,*/ async (req, res) => {
    try {
      var zipId_proof = new admZip(`uploads/tickets/${req.body.id}.zip`);
      var zipEntrieszipId_proof = zipId_proof.getEntries(); // an array of ZipEntry records

      zipId_proof.extractAllTo("uploads/tmp", true);

      let documents = [];
      zipEntrieszipId_proof.forEach(function (zipEntry) {
        let proof_path = `/tmp/${zipEntry.entryName}`;

        documents.push(proof_path);
      });

      res.status(200).send({ success: true, documents });
    } catch (e) {
      res.status(400).send({ success: false, errorMessage: e });
    }
  }
);

// GET TICKET QUOTE
router.get(
  "/ticket_quote/:ticketID",
  /*authToken,*/ async (req, res) => {
    try {
      const quoted_vendor_tickets = await Quoted_vendor_tickets.find({
        ticketID: req.params.ticketID,
      }).populate("vendorID");
      const total = await Quoted_vendor_tickets.find({
        ticketID: req.params.ticketID,
      }).countDocuments();
      res
        .status(200)
        .send({ success: true, quoted_vendor_tickets, totalQuotes: { total } });
    } catch (e) {
      console.log(e);
      res.status(400).send({ success: false, errorMessage: e });
    }
  }
);

// GET TICKET DETAILS
router.get(
  "/:ticketID",
  /*authToken,*/ async (req, res) => {
    try {
      const ticket = await Ticket.findOne({ _id: req.params.ticketID });

      res.status(200).send({ success: true, ticket });
    } catch (e) {
      console.log(e);
      res.status(400).send({ success: false, errorMessage: e });
    }
  }
);

// CONFIRM QUOTE
router.post("/confirm_quote", authToken, async (req, res) => {
  try {
    const historyValue = {
      actionBy: req.user.role,
      userId: req.user.id,
      userName: `${req.user.firstname} ${req.user.lastname}`,
      action: "Approved the quote",
      createdAt: new Date(Date.now()),
    };
    const confirm_ticket = await Quoted_vendor_tickets.findOneAndUpdate(
      { _id: req.body.quote_id },
      {
        isApproved: true,
      },
      { new: true }
    );

    const ticket = await Ticket.findOneAndUpdate(
      { _id: confirm_ticket.ticketID },
      {
        internalStatus: "Assigned",
        assignedTo: confirm_ticket.vendorID,
        assignedToType: "vendor",
        startDate: confirm_ticket.startDate,
        estimatedEndDate: confirm_ticket.estimatedEndDate,
        startTime: confirm_ticket.startTime,
        estimatedETime: confirm_ticket.estimatedETime,
        notes: confirm_ticket.notes,
        estimatedAmount: confirm_ticket.estimatedAmount,
        confirmedQuote: confirm_ticket._id,
        $push: { history: historyValue },
      },
      { new: true }
    );

    // console.log("Manager",ticket)
    let conversationExists = await Conversation.find({
      members: { $all: [confirm_ticket.vendorID, req.user.id] },
    });

    if (conversationExists.length == 0) {
      const newConversation = new Conversation({
        members: [req.user.id, confirm_ticket.vendorID],
      });

      const addedConversations = await newConversation.save();

      await vendor.findOneAndUpdate(
        { _id: confirm_ticket.vendorID },
        {
          $push: { connectedManagers: req.user.id },
        },
        { new: true }
      );
    }
    const vendorUpdate = await vendor.findOne({ _id: confirm_ticket.vendorID });
    const managers = await Manager.findOne({
      _id: ticket.propertyManagerId[0],
    });
    const companyName = await Company.findOne({ domain: ticket.companyDomain });
    const data = {
      vendorName: vendorUpdate.first_name,
      propertyName: ticket.property,
      details: ticket.details,
      requestType: ticket.requestType,
      requestId: ticket.primaryID,
      suite: ticket.suite,
      agencyName: vendorUpdate.agency_name,
      startDate: moment(confirm_ticket.startDate).format("DD/MM/YYYY"),
      startTime: moment(confirm_ticket.startTime, "HH:mm").format("hh:mm A"),
      endDate: moment(confirm_ticket.estimatedEndDate).format("DD/MM/YYYY"),
      endTime: moment(confirm_ticket.estimatedETime, "HH:mm").format("hh:mm A"),
      estimatedAmount: "$" + confirm_ticket.estimatedAmount,
      notes: confirm_ticket.notes,
      companyName: companyName.name,
      propertyManager: managers.firstname + " " + managers.lastname,
      propertyManagerEmail: managers.email,
      logo: companyName?.logo,
    };
    const options = Email.generateOptions(
      vendorUpdate.email,
      "QUOTE_APPROVED",
      data
    );
    const isEmailSent = Email.send(options);
    res.status(200).send({ success: true, confirm_ticket });
  } catch (e) {
    console.log(e);
    res.status(400).send({ success: false, errorMessage: e });
  }
});

router.post("/reasign", authToken, async (req, res) => {
  try {
    const historyValue = {
      actionBy: req.user.role,
      userId: req.user.id,
      userName: `${req.user.firstname} ${req.user.lastname}`,
      action: "has reassigned",
      createdAt: new Date(Date.now()),
    };
    const ticket = await Ticket.findOneAndUpdate(
      { _id: req.body.ticketID },
      {
        internalStatus: "Open",
        status: "Open",
        isMovedToVendorPortal: false,
        $unset: {
          assignedTo: 1,
          assignedToType: 1,
          assignSpecificVendors: 1,
          quotedVendorTickets: 1,
          confirmedQuote: 1,
        },
        $push: { history: historyValue },
      },
      { new: true }
    );

    res.status(200).send({ success: true, ticket });
  } catch (e) {
    res.status(400).send({ success: false, errorMessage: e });
  }
});

// GET ON GOING TICKETS
router.post("/ongoing-tickets", authToken, async (req, res) => {
  try {
    const page = parseInt(req.body.pageNumber) || 1;
    const PAGE_LIMIT = 10;
    const startIndex = (page - 1) * PAGE_LIMIT;
    const endIndex = page * PAGE_LIMIT;
    const paginatedResults = {};
    let vendor = await Vendor.findById(req.body.vendorId);

    let query = {
      assignSpecificVendors: { $in: [req.body.vendorId] },
    };
    if (req.body.requestType) {
      query.requestType = { $eq: req.body.requestType };
    }

    if (req.body.status) {
      query.status = { $eq: req.body.status };
    }
    if (req.body.startDate && req.body.endDate) {
      query.createdAt = {
        $gte: moment(req.body.startDate),
        $lt: moment(req.body.endDate),
      };
    }
    if (req.body.filterID) {
      query._id = req.body.filterID;
    }
    if (req.body.propertyID) {
      query.propertyID = req.body.propertyID;
    }
    const countQuery = function (callback) {
      Ticket.find(query, { __v: 0 })
        .sort({ _id: -1 })
        .count({}, function (err, count) {
          if (err) {
            callback(err, null);
          } else {
            callback(null, count);
          }
        });
    };

    if (endIndex < (await Ticket.find(query).countDocuments().exec())) {
      paginatedResults.next = {
        page: page + 1,
        limit: PAGE_LIMIT,
      };
    }

    if (startIndex > 0) {
      paginatedResults.previous = {
        page: page - 1,
        limit: PAGE_LIMIT,
      };
    }

    const retrieveQuery = function (callback) {
      Ticket.find(query, { __v: 0 })
        .sort({ _id: -1 })
        .skip((page - 1) * PAGE_LIMIT)
        .limit(PAGE_LIMIT)
        .populate("assignedTo")
        .populate("assignVendor")
        .populate("confirmedQuote")
        .populate("assignSpecificVendors")
        .populate("propertyManagerId")
        .exec(function (err, doc) {
          if (err) {
            callback(err, null);
          } else {
            callback(null, doc);
          }
        });
    };

    const distPropertyID = await Ticket.find({
      companyID: { $in: vendor.approvedCompanies },
    }).distinct("propertyID");
    const properties = await Property.find({
      _id: { $in: distPropertyID },
    }).select({ _id: 1, title: 1 });

    const distinctRequestType = await Ticket.distinct("requestType");

    const totalFilterResult = await Ticket.aggregate([
      { $match: query },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const applicationTotal = totalFilterResult?.reduce((acc, count) => {
      acc[count._id] = count.count;
      acc["Total"] = (acc["Total"] || 0) + count.count;
      return acc;
    }, {});

    async.parallel([countQuery, retrieveQuery], async function (err, results) {
      if (err) {
        console.log(err);
        res.json({
          status: 500,
          message: "Something Went Wrong",
          tickets: [],
        });
        return;
      }
      const ticketIds = results[1].map((note) => note._id);
      console.log(ticketIds);
      const notesCount = await Ticket_note.aggregate([
        {
          $match: {
            ticketID: { $in: ticketIds },
            visited: { $nin: [vendor._id] },
          },
        }, // Match the documents based on ticketIDs
        { $group: { _id: "$ticketID", count: { $sum: 1 } } }, // Group by ticketID and calculate the count
      ]);
      const notesCountFormatted = notesCount.reduce((acc, { _id, count }) => {
        acc[_id] = count;
        return acc;
      }, {});
      res.json({
        status: 200,
        message: "The resources has been fetched",
        tickets: results[1],
        requestTypes: distinctRequestType,
        totalCount: results[0],
        propertyList: properties,
        total: applicationTotal,
        results: paginatedResults,
        notesCount: notesCountFormatted,
      });
    });
    // const tickets = await Ticket.find(query)

    // res.status(200).send({ success: true, ticket: tickets })
  } catch (e) {
    console.log(e);
    res.status(400).send({ success: false, errorMessage: e });
  }
});

router.post("/add_notes", authToken, async (req, res) => {
  try {
    const ticketId = req.body.ticketId;
    const notes = req.body.notes;
    const user = req.body.user;
    const id = req.body.id;
    const name = req.body.name;

    console.log(req.body, "dfdfdfdfd");
    const newNote = new Ticket_note({
      ticketID: ObjectId(ticketId),
      createdBy: ObjectId(id),
      note: notes,
      user: user,
      userName: name,
    });

    await newNote.save();
    res
      .status(200)
      .send({ success: true, message: "Notes added successfully" });
  } catch (e) {
    console.log(e);
    res.status(400).send({ success: false, errorMessage: e });
  }
});

router.post("/get_notes", async (req, res) => {
  try {
    if (req.body.ticketId) {
      console.log(req.body.ticketId);
      const notesList = await Ticket_note.find({
        ticketID: ObjectId(req.body.ticketId),
      });
      const noteIds = notesList.map((note) => note._id);
      await Ticket_note.updateMany(
        { _id: { $in: noteIds } }, // Match the notes with the specified IDs
        { $addToSet: { visited: req.body.id } } // Update the visited field to true
      );
      if (notesList.length > 0) {
        return res.json({
          status: 200,
          message: "Ticket notes fetched successfully",
          notes: notesList,
        });
      } else {
        return res.json({
          status: 404,
          message: "No notes found",
          notes: notesList,
        });
      }
    }
  } catch {
    return res.json({
      status: 400,
      message: "internal server error",
    });
  }
});

// CHANGE TICKET STATUS
router.post("/update_status", authToken, async (req, res) => {
  try {
    const ticketStatus = await Ticket.findOne({ _id: req.body.ticketID });
    const historyValue = {
      actionBy: req.user.role,
      userId: req.user.id,
      userName: `${req.user.firstname} ${req.user.lastname}`,
      action: `has updated status from ${ticketStatus.status} to ${req.body.status}`,
      createdAt: new Date(Date.now()),
    };

    if (req.body.status == "Unresolved") {
      await Ticket.updateOne(
        { _id: req.body.ticketID },
        {
          status: req.body.status,
          internalStatus: req.body.internalStatus
            ? req.body.internalStatus
            : req.body.status,
          isMovedToVendorPortal: false,
          assignSpecificVendors: [],
          $unset: { assignedTo: "" },
          assignedToType: "",
          $push: { history: historyValue },
        }
      );
    } else {
      await Ticket.updateOne(
        { _id: req.body.ticketID },
        {
          status: req.body.status,
          internalStatus: req.body.internalStatus
            ? req.body.internalStatus
            : req.body.status,
          $push: { history: historyValue },
        }
      );
    }

    const companyName = await Company.findOne({
      domain: ticketStatus.companyDomain,
    });

    const managers = await Manager.find({
      properties: { $in: [ticketStatus.propertyID] },
    });

    let emails = [
      {
        name: ticketStatus.name,
        email: ticketStatus.email,
      },
    ];
    managers.forEach((manager) => {
      emails.push({
        name: manager.firstname + "" + manager.lastname,
        email: manager.email,
      });
    });

    const staffs = await TechnicalStaff.find({
      assigned_properties: { $in: [ticketStatus.propertyID] },
    });

    staffs.forEach((staff) => {
      emails.push({
        name: staff.first_name + "" + staff.last_name,
        email: staff.email,
      });
    });

    emails.forEach((i, index) => {
      const data = {
        toStatus: req.body.status,
        requestId: ticketStatus.primaryID,
        propertyManager: i.name,
        permission: ticketStatus.permission,
        suite: ticketStatus.suite,
        details: ticketStatus.details,
        requestType: ticketStatus.requestType,
        phone: ticketStatus.phone,
        companyName: companyName.name,
        publicLink: companyName.slug,
        propertyName: ticketStatus.property,
        vendorType:
          ticketStatus.assignSpecificVendors.length > 0
            ? "Vendor"
            : "Technical Staff",
        logo: companyName.logo,
      };
      console.log(data);
      const options = Email.generateOptions(
        i.email,
        "REQUEST_STATUS_UPDATE",
        data
      );
      const isEmailSent = Email.send(options);
    });

    // const data = {
    //   toStatus: req.body.status,
    //   requestId: ticketStatus.primaryID,
    //   propertyManager: ticketStatus.name,
    //   permission: ticketStatus.permission,
    //   suite: ticketStatus.suite,
    //   details: ticketStatus.details,
    //   requestType: ticketStatus.requestType,
    //   companyName: companyName.name,
    //   publikLink: companyName.slug,
    //   propertyName: ticketStatus.property,
    //   vendorType:
    //     ticketStatus.assignSpecificVendors.length > 0
    //       ? "Vendor"
    //       : "Technical Staff",
    //   logo: companyName.logo
    // };
    // const options = Email.generateOptions(
    //   ticketStatus.email,
    //   "REQUEST_STATUS_UPDATE",
    //   data
    // );
    // const isEmailSent = Email.send(options);

    res.status(200).send({ success: true, message: "status updated" });
  } catch (e) {
    console.log(e);
    res.status(400).send({ success: false, errorMessage: e });
  }
});

router.post("/vendor_reassign", authToken, async (req, res) => {
  try {
    const ticketId = req.body.ticketId;
    const vendorIdToRemove = req.body.vendorId;
    const historyValue = {
      actionBy: req.user.role,
      userId: req.user.id,
      userName: `${req.user.firstname} ${req.user.lastname}`,
      action: `Reassigned by vendor ${req.user.firstname} ${req.user.lastname}`,
      createdAt: new Date(Date.now()),
    };
    const updatedTicket = await Ticket.findByIdAndUpdate(
      ticketId,
      {
        $pull: { assignSpecificVendors: vendorIdToRemove },
        $push: { history: historyValue },
      },
      { new: true }
    );
    let lastAssignedAction = null;

    for (let i = updatedTicket.history.length - 1; i >= 0; i--) {
      const historyItem = updatedTicket.history[i];
      if (historyItem.action.includes("assigned to specific vendor")) {
        lastAssignedAction = historyItem;
        break;
      }
    }
    if (lastAssignedAction) {
      if (
        lastAssignedAction.actionBy == "company" ||
        lastAssignedAction.actionBy == "manager"
      ) {
        await Ticket.findByIdAndUpdate(ticketId, {
          isMovedToVendorPortal: false,
        });
      }
      const logoCompany = await Company.findById(updatedTicket.companyID);
      const vendor = await Vendor.findById(vendorIdToRemove);
      if (lastAssignedAction.actionBy == "company") {
        let comapany = await Company.findById(lastAssignedAction.userId);
        const data = {
          owner: comapany.ownerName,
          email: comapany.email,
          companyName: logoCompany.name,
          reassignedBy: vendor.first_name + " " + vendor.last_name,
          role: "Vendor",
          requestType: updatedTicket.requestType,
          permission: updatedTicket.permission,
          propertyName: updatedTicket.property,
          suite: updatedTicket.suite,
          phone: updatedTicket.phone,
          details: updatedTicket.details,
          logo: logoCompany?.logo,
        };
        const options = Email.generateOptions(
          comapany.email,
          "REQUEST_REASSIGN_VENDOR",
          data
        );
        const isEmailSent = Email.send(options);
      } else if (lastAssignedAction.actionBy == "manager") {
        let manager = await Manager.findById(lastAssignedAction.userId);
        const data = {
          owner: manager.firstname + " " + manager.lastname,
          email: manager.email,
          companyName: logoCompany.name,
          reassignedBy: vendor.first_name + " " + vendor.last_name,
          role: "Vendor",
          requestType: updatedTicket.requestType,
          permission: updatedTicket.permission,
          propertyName: updatedTicket.property,
          suite: updatedTicket.suite,
          phone: updatedTicket.phone,
          details: updatedTicket.details,
          logo: logoCompany?.logo,
        };
        const options = Email.generateOptions(
          manager.email,
          "REQUEST_REASSIGN_VENDOR",
          data
        );
        const isEmailSent = Email.send(options);
      } else {
        const technical_staff = await TechnicalStaff.findById(
          lastAssignedAction.userId
        );
        const data = {
          owner: technical_staff.first_name + " " + technical_staff.last_name,
          email: technical_staff.email,
          companyName: logoCompany.name,
          reassignedBy: vendor.first_name + " " + vendor.last_name,
          role: "Vendor",
          requestType: updatedTicket.requestType,
          permission: updatedTicket.permission,
          propertyName: updatedTicket.property,
          suite: updatedTicket.suite,
          phone: updatedTicket.phone,
          details: updatedTicket.details,
          logo: logoCompany?.logo,
        };
        const options = Email.generateOptions(
          technical_staff.email,
          "REQUEST_REASSIGN_VENDOR",
          data
        );
        const isEmailSent = Email.send(options);
      }
      return res.status(200).send({ success: true });
    }
    res.status(200).send({ success: true });
  } catch (err) {
    res.status(400).send({ success: false, errorMessage: err });
  }
});

router.post("/download_excel", authToken, async (req, res) => {
  try {
    let tickets = [];
    if (req.body.role == "company") {
      tickets = await Ticket.find({ companyID: req.body.id });
    } else {
      const manager = await Manager.findOne({ _id: req.body.id }, "properties");
      tickets = await Ticket.find({ propertyID: { $in: manager.properties } });
    }
    const totalRows = tickets.length;
    const rowsPerSheet = 50;
    const totalSheets = Math.ceil(totalRows / rowsPerSheet);

    const workbook = new ExcelJS.Workbook();

    for (let sheetIndex = 0; sheetIndex < totalSheets; sheetIndex++) {
      const sheetName = `Sheet ${sheetIndex + 1}`;
      const worksheet = workbook.addWorksheet(sheetName);
      worksheet.getRow(1).values = [
        "id",
        "Date",
        "Name",
        "Email",
        "Phone",
        "Property",
        "Suite",
        "Status",
      ];

      // Set column widths
      worksheet.getColumn(1).width = 20;
      worksheet.getColumn(2).width = 20;
      worksheet.getColumn(3).width = 20;
      worksheet.getColumn(4).width = 30;
      worksheet.getColumn(5).width = 20;
      worksheet.getColumn(6).width = 30;
      worksheet.getColumn(7).width = 20;
      worksheet.getColumn(8).width = 20;

      const startIndex = sheetIndex * rowsPerSheet;
      const endIndex = Math.min(startIndex + rowsPerSheet, totalRows);

      for (
        let ticketIndex = startIndex;
        ticketIndex < endIndex;
        ticketIndex++
      ) {
        const document = tickets[ticketIndex];
        const rowIndex = ticketIndex - startIndex + 2;
        const row = worksheet.getRow(rowIndex);
        row.getCell(1).value = document.primaryID;
        row.getCell(2).value = moment(document.createdAt).format("DD/MM/YYYY");
        row.getCell(3).value = document.name;
        row.getCell(4).value = document.email;
        row.getCell(5).value = document.phone;
        row.getCell(6).value = document.property;
        row.getCell(7).value = document.suite;
        row.getCell(8).value = document.status;
      }
    }

    res.contentType(
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", 'attachment; filename="ticket.xlsx"');
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(400).send({ success: false, errorMessage: err });
  }
});

// Uplaod Documents for property
router.post("/upload-documents", upload.array("file", 10), async (req, res) => {
  try {
    // const zip = new admZip();
    // if (req.files) {
    //   req.files.forEach(async(file) => {
    // console.log("Files", file.path);
    //     const filename = file.filename;
    //     console.log("successs")
    // zip.addLocalFile(file.path);
    //   });
    // fs.writeFileSync(`uploads/tickets/${req.headers.id}.zip`, zip.toBuffer());
    let uploaded = [];

    if (req.files) {
      await Promise.all(
        req.files.map(async (file) => {
          const filename = file.filename;
          await uploadTicketDocumentsToS3(
            process.env.DO_SPACES_NAME,
            filename,
            file.path,
            "tickets"
          );
          const filePath = `${process.env.BUCKET_URL}tickets/${filename}`;
          uploaded.push(filePath);
        })
      );
      const result = await Ticket.findOneAndUpdate(
        { _id: req.headers.id },
        {
          documents: uploaded,
        }
      );
    }
    res.json({
      status: 201,
      message: "Successfully uploaded !",
    });
  } catch (error) {
    logger.error(error);
    console.log(error);
    res.json({
      status: 500,
      message: "Something Went Wrong",
    });
  }
});

// generate nice pdf
router.get("/pdf", async (req, res) => {
  const ticketId = req.query.id;
  try {
    const ticket = await Ticket.find({ _id: ticketId });
    const content = ticketTemplate(ticket[0]);

    var options = {
      format: "A1",
      orientation: "portrait",
      border: "10mm",
    };

    var document = {
      html: content,
      data: {
        test: "test",
      },
      path: "Documents/applicant.pdf",
      type: "",
    };

    htmlToPdf.create(document, options).then((info) => {
      var filePath = path.join(__dirname, `../Documents/applicant.pdf`);
      var stat = fs.statSync(filePath);

      res.writeHead(200, {
        "Content-Type": "application/octet-stream",
        "Content-Length": stat.size,
      });

      var readStream = fs.createReadStream(filePath);
      readStream.pipe(res);
    });
  } catch (error) {
    logger.error(error);
    res.json({
      status: 500,
      message: "Something Went Wrong",
    });
  }
});

// TODO pagination

function authToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

module.exports = router;

function createAggregationPipeline(requestTypes) {
  let pipeline = [];
  let requestTypeCounts = {};

  requestTypes.forEach((requestType) => {
    requestTypeCounts[requestType] = {
      $sum: {
        $cond: [{ $eq: ["$requestType", requestType] }, 1, 0],
      },
    };
  });

  pipeline.push({
    $group: {
      _id: {
        month: {
          $dateToString: { format: "%Y-%m", date: "$createdAt" },
        },
      },
      ...requestTypeCounts,
    },
  });

  return pipeline;
}

async function getRequestTypes(collection, searchFilter) {
  let requestTypes = await collection.aggregate([
    {
      $match: searchFilter,
    },
    {
      $group: {
        _id: "$requestType",
      },
    },
    {
      $group: {
        _id: "$_id",
        requestType: { $first: "$_id" },
      },
    },
    {
      $project: {
        _id: 0,
        requestType: 1,
      },
    },
  ]);
  return requestTypes.map((v) => v.requestType);
}
async function createDynamicAggregationPipeline(collection, searchFilter) {
  let requestTypes = await getRequestTypes(collection, searchFilter);
  console.log(requestTypes, "DSSS");
  let pipeline = [];
  pipeline.push({
    $match: searchFilter,
  });
  pipeline = pipeline.concat(createAggregationPipeline(requestTypes));
  return pipeline;
}
