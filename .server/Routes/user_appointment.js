const router = require("express").Router();
const logger = require("../Logger/LoggerFactory").getProductionLogger();
const schedule = require("node-schedule");
const { google } = require("googleapis");
const {
  GOOGLE_CALENDAR_ID,
  GOOGLE_CALENDAR_CREDANTIALS,
} = require("../config.js");
const insertEvents = require("../utils/GoogleCalendar");

require("dotenv").config();
// const mongoose = require("mongoose");
// mongoose.set('debug', true);
const Email = require("../utils/Email");

const moment = require("moment");
const moment_timezone = require("moment-timezone");
const { ObjectID } = require("bson");
// importing database models
const ManagerAvailability = require("../Database/calender_availability");
const User_appointment = require("../Database/user_appointment");
const propertyManager = require("../Database/PropertyManager");
const Company = require("../Database/Company");
const Property = require("../Database/Property");
const Layout = require("../Database/Layout");
const Reason_types = require("../Database/CalendarReasonTypes");
const user_appointment = require("../Database/user_appointment");

router.post("/set-availability", async (req, res) => {
  try {
    const upComingEvents = await User_appointment.find({
      eventAssignedTo: req.body.manager_id,
      requestDate: {
        $gte: moment(),
      },
    });

    let promises = [];

    let OverRidingDates = [];

    for (var ticket in upComingEvents) {
      promises.push(checkAvailability(upComingEvents[ticket]));
    }

    function checkAvailability(ticket) {
      return new Promise(function (resolve, reject) {
        const date = moment(ticket.requestDate);

        console.log(ticket);

        let dayIndex = date.isoWeekday();

        if (dayIndex == 7) {
          dayIndex = 0;
        }

        const newAvailability = req.body.daysOfWeekAvailability[dayIndex];

        console.log(req.body.daysOfWeekAvailability[dayIndex]);

        let inAvailableTime = false;

        for (let l = 0; l < newAvailability.slots.length; l++) {
          let available =
            moment(newAvailability.slots[l].startTime, ["h:mm A"]) <=
              moment(ticket.startTime, ["h:mm A"]) &&
            moment(newAvailability.slots[l].endTime, ["h:mm A"]) >=
              moment(ticket.endTime, ["h:mm A"]);

          if (available) {
            inAvailableTime = true;
            break;
          }
        }

        if (newAvailability.available && inAvailableTime) {
          console.log("Yes");
        } else {
          console.log("No");
          OverRidingDates.push(ticket);
        }

        resolve();
      });
    }

    Promise.all(promises)
      .then(async function (data) {
        if (OverRidingDates.length > 0) {
          res.json({
            status: 200,
            success: false,
            message: "The resources has been fetched",
            OverRidingDates: OverRidingDates,
          });
        } else {
          const availability = await ManagerAvailability.findOneAndUpdate(
            { eventAssignedTo: req.body.manager_id },
            {
              assignedToType: req.body.role,
              daysOfWeekAvailability: req.body.daysOfWeekAvailability,
            },
            { upsert: true }
          );

          res.json({
            status: 200,
            success: true,
            message: "The resources has been fetched",
            ManagerAvailability: availability,
          });
        }
      })
      .catch(function (err) {
        logger.error(err);
        console.log(err);
        res.json({
          success: false,
          message: "Something Went Wrong !",
        });
      });
  } catch (error) {
    logger.error(error);
    console.log(error);
    res.json({
      status: 500,
      message: "Something Went Wrong !",
    });
  }
});

router.get("/get-availability", async (req, res) => {
  try {
    if (req.query.manager_id) {
      const availability = await ManagerAvailability.findOne({
        eventAssignedTo: req.query.manager_id,
      });

      res.json({
        status: 200,
        message: "The resources has been fetched",
        ManagerAvailability: availability,
      });
    } else {
      res.json({
        status: 201,
        message: "Something Went Wrong !",
        ManagerAvailability: [],
      });
    }
  } catch (error) {
    logger.error(error);
    console.log(error);
    res.json({
      status: 500,
      message: "Something Went Wrong !",
    });
  }
});

// now we get the booked slot for view in calendar
router.post("/get-pending-slot", async (req, res) => {
  try {
    const { manager_id } = req.body;
    if (manager_id) {
      // const currentDate = Math.ceil(moment().valueOf() / 1000);
      // console.log(currentDate)
      // const expireSlot = await User_appointment.updateMany({
      //   endTimeEpoch: {
      //     $lte: currentDate,
      //   },
      // }, { $set: { status: "expired" } });
      const page = parseInt(req.body.pageNumber) || 1;
      const PAGE_LIMIT = req.body.limit || 10;
      const startIndex = (page - 1) * PAGE_LIMIT;
      const endIndex = page * PAGE_LIMIT;
      const paginatedResults = {};
      let query = {
        eventAssignedTo: ObjectID(manager_id),
      };
      if (req.body.status) {
        query.status = req.body.status;
      }
      if (req.body.property) {
        query.propertyId = ObjectID(req.body.property);
      }
      if (req.body.reasonId) {
        query.reasonId = ObjectID(req.body.reasonId);
      }
      if (req.body.startDate && req.body.endDate) {
        query.createdAt = {
          $gte: moment(req.body.startDate).toDate(),
          $lte: moment(req.body.endDate).endOf("day").toDate(),
        };
      }
      const bookedSlot = await User_appointment.aggregate([
        {
          $match: query,
        },
        {
          $lookup: {
            from: "calendar_reason_types",
            localField: "reasonId",
            foreignField: "_id",
            as: "reasonType",
          },
        },
        {
          $lookup: {
            from: "layouts",
            localField: "layoutId",
            foreignField: "_id",
            as: "layouts",
          },
        },
        {
          $lookup: {
            from: "properties",
            localField: "propertyId",
            foreignField: "_id",
            as: "properties",
          },
        },
        {
          $sort: {
            _id: -1,
          },
        },
        {
          $skip: (page - 1) * PAGE_LIMIT,
        },
        {
          $limit: PAGE_LIMIT,
        },
      ]);

      const countQuery = await User_appointment.find(query, { __v: 0 }).count();
      const propertyIds = await User_appointment.find({
        eventAssignedTo: ObjectID(manager_id),
      }).distinct("propertyId");
      const properties = await Property.find({
        _id: { $in: propertyIds },
      }).select({ _id: 1, title: 1 });
      const reasonIds = await User_appointment.find({
        eventAssignedTo: ObjectID(manager_id),
      }).distinct("reasonId");
      const reasons = await Reason_types.find({
        _id: { $in: reasonIds },
      }).select({ _id: 1, reasonType: 1 });
      const totalFilterResult = await User_appointment.aggregate([
        { $match: query },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]);

      const applicationTotal = totalFilterResult?.reduce((acc, count) => {
        acc[count._id] = count.count;
        acc["Total"] = (acc["Total"] || 0) + count.count;
        return acc;
      }, {});

      if (
        endIndex < (await User_appointment.find(query).countDocuments().exec())
      ) {
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

      res.json({
        status: 200,
        message: "The resources has been fetched",
        bookedSlot: bookedSlot,
        totalCount: countQuery,
        total: applicationTotal,
        properties: properties,
        reasons: reasons,
      });
    } else {
      res.json({
        status: 201,
        message: "Something Went Wrong !",
        bookedSlot: [],
      });
    }
  } catch (error) {
    logger.error(error);
    console.log(error);
    res.json({
      status: 500,
      message: "Something Went Wrong !",
    });
  }
});

router.get("/get-booked-slot", async (req, res) => {
  try {
    const { manager_id, status, reasonType, propertyId } = req.query;
    let query = {};
    let reasonQuery = {};
    if (reasonType) {
      reasonQuery = { ...reasonQuery, "reasonType._id": ObjectID(reasonType) };
    }

    if (propertyId) {
      reasonQuery = {
        ...reasonQuery,
        "property._id": ObjectID(propertyId),
      };
    }
    if (manager_id) {
      query = {
        eventAssignedTo: ObjectID(manager_id),
        status: "booked",
      };

      // const currentDate = Math.ceil(moment().valueOf() / 1000);
      // console.log(currentDate)
      // const expireSlot = await User_appointment.updateMany({
      //   endTimeEpoch: {
      //     $lte: currentDate,
      //   },
      // }, { $set: { status: "expired" } });
      const bookedSlot = await User_appointment.aggregate([
        {
          $match: query,
        },
        {
          $lookup: {
            from: "calendar_reason_types",
            localField: "reasonId",
            foreignField: "_id",
            as: "reasonType",
          },
        },

        {
          $lookup: {
            from: "layouts",
            localField: "layoutId",
            foreignField: "_id",
            as: "layout",
          },
        },
        {
          $lookup: {
            from: "properties",
            localField: "propertyId",
            foreignField: "_id",
            as: "property",
          },
        },
        {
          $match: reasonQuery,
        },
      ]);
      const uniqueTypes = await User_appointment.aggregate([
        {
          $match: {
            eventAssignedTo: ObjectID(manager_id),
            status: "booked",
          },
        },
        {
          $lookup: {
            from: "calendar_reason_types",
            localField: "reasonId",
            foreignField: "_id",
            as: "reasonType",
          },
        },
        {
          $unwind: "$reasonType",
        },
        {
          $group: {
            _id: "$reasonType._id",
            name: { $first: "$reasonType.reasonType" },
          },
        },
        {
          $project: {
            _id: 1,
            reasonType: "$name",
          },
        },
      ]);

      const uniqueProperty = await User_appointment.aggregate([
        {
          $match: {
            eventAssignedTo: ObjectID(manager_id),
            status: "booked",
          },
        },
        {
          $lookup: {
            from: "properties",
            localField: "propertyId",
            foreignField: "_id",
            as: "property",
          },
        },
        {
          $unwind: "$property",
        },
        {
          $group: {
            _id: "$property._id",
            name: { $first: "$property.title" },
          },
        },
        {
          $project: {
            _id: 1,
            property: "$name",
          },
        },
      ]);
      res.json({
        status: 200,
        message: "The resources has been fetched",
        reasonTypes: uniqueTypes,
        properties: uniqueProperty,
        bookedSlot: bookedSlot,
      });
    } else {
      res.json({
        status: 201,
        message: "Something Went Wrong !",
        bookedSlot: [],
      });
    }
  } catch (error) {
    logger.error(error);
    console.log(error);
    res.json({
      status: 500,
      message: error.message,
    });
  }
});

router.post("/get-todays-event", async (req, res) => {
  try {
    let BookedEvents = await User_appointment.find({
      date: req.body.date,
      eventAssignedTo: ObjectID(req.body.manager_id),
      status: { $nin: ["rejected", "canceled"] },
    });

    res.status(200).send({
      success: true,
      message: "Successfully fetched22",
      status: 200,
      BookedEvents: BookedEvents,
    });
  } catch (e) {
    console.log(e);
    res.status(200).send({
      success: false,
      message: e.details || "Something went wrong",
      status: 202,
    });
  }
});

router.get("/get-url-key", async (req, res) => {
  const id = req.query.manager_id;
  const role = req.query.role;
  if (!id || id === "" || !role || role === "") {
    return res.json({
      status: 400,
      message: "Bad Request: id Is Required.",
    });
  } else {
    try {
      let manager = null;
      if (role === "manager") {
        manager = await propertyManager.findOne(
          { _id: id },
          { primaryID: 1, _id: 0 }
        );
      } else if (role === "company") {
        manager = await Company.findOne({ _id: id }, { primaryID: 1, _id: 0 });
      }
      if (manager) {
        return res.json({
          status: 200,
          message: "Fetched resource successfully",
          url_key: manager,
        });
      } else {
        return res.json({
          status: 404,
          message: "Manager Not Found",
        });
      }
    } catch (error) {
      console.log(error);
      return res.json({
        status: 500,
        message: "something went wrong",
      });
    }
  }
});

router.get("/get-id", async (req, res) => {
  const id = req.query.id;
  if (!id || id === "") {
    return res.json({
      status: 400,
      message: "Bad Request: id Is Required.",
    });
  } else {
    try {
      let manager, role;
      role = id.slice(0, 3);
      if (role === "MNG") {
        manager = await propertyManager.aggregate([
          { $match: { primaryID: id } },
          {
            $lookup: {
              from: "properties",
              let: { propertyId: "$properties" },
              pipeline: [
                { $match: { $expr: { $in: ["$_id", "$$propertyId"] } } },
                {
                  $lookup: {
                    from: "layouts",
                    let: { categoryId: "$category" },
                    pipeline: [
                      {
                        $match: {
                          $and: [{ $expr: { $in: ["$_id", "$$categoryId"] } }],
                        },
                      },
                    ],
                    as: "categoryList",
                  },
                },
              ],
              as: "proprtyList",
            },
          },
          {
            $addFields: {
              companyObjId: { $toObjectId: "$companyID" },
            },
          },
          {
            $lookup: {
              from: "companies",
              let: { companyObjId: "$companyObjId" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ["$_id", "$$companyObjId"],
                    },
                  },
                },
                {
                  $project: {
                    _id: 1,
                    name: 1,
                    logo: 1,
                    domain: 1,
                  },
                },
              ],
              as: "company",
            },
          },
          // {
          //   $lookup : {
          //     from : "companies",
          //     localField : "companyObjId",
          //     foreignField : "_id",
          //     as : "company"
          //   }
          // },
          {
            $project: {
              _id: 1,
              role: 1,
              mobile: 1,
              companyAssigned: 1,
              companyID: 1,
              company: { $first: "$company" },
              proprtyList: {
                _id: 1,
                title: 1,

                categoryList: {
                  _id: 1,
                  layoutName: 1,
                },
              },
            },
          },
        ]);
        if (manager && manager.length > 0) {
          manager[0].phone = manager[0]?.mobile;
        }
      } else if (role === "CMP") {
        manager = await Company.aggregate([
          {
            $match: {
              primaryID: id,
            },
          },
          {
            $project: {
              _id: 1,
              role: 1,
              phone: 1,
              domain: 1,
              logo: 1,
              name: 1,
            },
          },
        ]);
        if (manager && manager.length > 0) {
          let proprtyList = await Property.aggregate([
            { $match: { companyID: (manager[0]?._id).toString() } },
            {
              $lookup: {
                from: "layouts",
                localField: "category",
                foreignField: "_id",
                as: "categoryList",
              },
            },
            {
              $project: {
                _id: 1,
                title: 1,
                categoryList: {
                  _id: 1,
                  layoutName: 1,
                },
              },
            },
          ]);

          manager = [
            {
              _id: manager[0]?._id,
              role: manager[0]?.role,
              phone: manager[0]?.phone,
              companyAssigned: manager[0]?.domain,
              proprtyList: proprtyList,
              company: {
                name: manager[0]?.name,
                logo: manager[0]?.logo,
                _id: manager[0]?._id,
                domain: manager[0]?.domain,
              },
            },
          ];
        } else {
          manager = null;
        }
      }

      if (manager && manager.length > 0) {
        return res.json({
          status: 200,
          message: "Fetched Manager",
          manager: manager[0],
        });
      } else {
        return res.json({
          status: 404,
          message: "Manager Not Found",
        });
      }
    } catch (error) {
      console.log(error);
      return res.json({
        status: 500,
        message: "something went wrong",
      });
    }
  }
});

// const convertToLocalTime = (utcTime) => {
//   const utcMoment = moment_timezone.utc(utcTime);
//   const localTimezone = moment_timezone.tz.guess();
//   const localMoment = utcMoment.clone().tz(localTimezone);
//   const formattedTime = localMoment.format("h:mm A");

//   return formattedTime;
// };

const convertToUTC = (localTime) => {
  const localMoment = moment(localTime, "h:mm A");
  const utcTime = localMoment.toISOString();

  return utcTime;
};

router.post("/add_slot", async (req, res) => {
  try {
    console.log("Body:", req.body.available);
    // Fetch manager availability from the database
    const managerAvailability = await ManagerAvailability.findOne({
      eventAssignedTo: req.body.manager_id,
    });

    // Find the manager's availability for the specified day
    const dayAvailability = managerAvailability.daysOfWeekAvailability.find(
      (dayItem) => dayItem.day === req.body.day
    );

    let alreadyBooked = false;

    const findBooked = async (startTime, endTime) => {
      return new Promise((resolve, reject) => {
        alreadyBooked = moment(req.body.StartTime, ["h:mm A"]).isBetween(
          moment(startTime, ["h:mm A"]),
          moment(endTime, ["h:mm A"]),
          "minute",
          "[)"
        );
        resolve(alreadyBooked);
      });
    };

    let inAvailableTime;

    if (req.body.available) {
      inAvailableTime = req.body.available;
    }

    console.log(dayAvailability.available, inAvailableTime);

    if (dayAvailability.available && inAvailableTime) {
      let BookedEvents = await User_appointment.find({
        date: req.body.date,
        eventAssignedTo: req.body.manager_id,
      });

      if (BookedEvents.length <= 0) {
        if (req.body.slot_id) {
          let updatedEvent = await User_appointment.findOneAndUpdate(
            { _id: req.body.slot_id },
            {
              date: req.body.date,
              startTime: req.body.StartTime,
              endTime: req.body.endTime,
            }
          );

          // let event = {
          //   summary: req.body.name,
          //   description: req.body.description,
          //   start: {
          //     dateTime:
          //       req.body.requestDate +
          //       "T" +
          //       moment(req.body.StartTime, ["h:mm A"]).format("HH:mm:ss"),
          //     timeZone: "Asia/Kolkata",
          //   },
          //   end: {
          //     dateTime:
          //       req.body.requestDate +
          //       "T" +
          //       moment(req.body.endTime, ["h:mm A"]).format("HH:mm:ss"),
          //     timeZone: "Asia/Kolkata",
          //   },
          //   // attendees: [
          //   //   { email: "azimcool06@gmail.com" },
          //   //   { email: "azim.duple@egmail.com" },
          //   // ],
          //   reminders: {
          //     useDefault: false,
          //     overrides: [
          //       { method: "email", minutes: 240 },
          //       { method: "popup", minutes: 40 },
          //     ],
          //   },
          // };

          // eventUpdate(req.body.event_id, event);

          return res.status(200).send({
            success: true,
            message: "Successfully Updated",
            status: 200,
            updatedEvent: updatedEvent,
          });
        } else {
          let addedEvent = await User_appointment.create({
            eventAssignedTo: req.body.manager_id,
            assignedToType: req.body.role,
            propertyId: req.body.propertyId,
            layoutId: req.body.layoutId,
            name: req.body.name,
            phone: req.body.phone,
            phone1: req.body.phone1,
            reasonId: req.body.reasonId,
            email: req.body.email,
            description: req.body.description,
            date: req.body.date,
            startTime: req.body.StartTime,
            endTime: req.body.endTime,
            startTimeEpoch: Math.ceil(
              moment(req.body.StartTime, "h:mm A").valueOf() / 1000
            ),
            endTimeEpoch: Math.ceil(
              moment(req.body.endTime, "h:mm A").valueOf() / 1000
            ),
            companyDomain: req.body.companyDomain,
            status: req.body.status ? req.body.status : "pending",
          });
          let userData = [];
          if (req.body.role == "manager") {
            userData = await propertyManager.aggregate([
              {
                $match: {
                  _id: ObjectID(req.body.manager_id),
                },
              },
              {
                $addFields: {
                  companyID: {
                    $toObjectId: "$companyID",
                  },
                },
              },
              {
                $lookup: {
                  from: "companies",
                  localField: "companyID",
                  foreignField: "_id",
                  as: "company",
                },
              },
            ]);
          } else {
            userData = await Company.find({
              _id: ObjectID(req.body.manager_id),
            });
          }

          const property = await Property.findOne({ _id: req.body.propertyId });
          const layout = await Layout.findOne({
            _id: ObjectID(req.body.layoutId),
          });

          console.log("user ", userData);
          let EmailDataApplicant = {
            applicantName: req.body.name,
            applicantPhone: req.body.phone,
            applicantEmail: req.body.email,
            applicantDescription: req.body.description,
            date: req.body.date,
            startTime: req.body.StartTime,
            endTime: req.body.endTime,
            email: req.body.email,
            companyDomain: req.body.companyDomain,
            companyName: property?.company,
            property: property?.title,
            layout:
              layout?.layoutName === undefined ? "NA" : layout?.layoutName,
          };
          if (req.body.role == "manager") {
            EmailDataApplicant.managerName =
              userData[0].firstname + " " + userData[0].lastname;
            EmailDataApplicant.managerEmail = userData[0].email;
            EmailDataApplicant.managerPhone = userData[0].mobail;
          } else {
            EmailDataApplicant.managerName = userData[0].ownerName;
            EmailDataApplicant.managerEmail = userData[0].email;
            EmailDataApplicant.managerPhone = userData[0].phone;
          }
          const options = Email.generateOptions(
            req.body.email,
            "SLOT_BOOKING_SUBMITTED",
            EmailDataApplicant
          );
          const isEmailSent = Email.send(options);
          if (userData?.length > 0) {
            let EmailDataManager = {
              applicantName: req.body.name,
              applicantPhone: req.body.phone,
              applicantEmail: req.body.email,
              applicantDescription: req.body.description,
              date: req.body.date,
              startTime: req.body.StartTime,
              endTime: req.body.endTime,
              email: req.body.email,
              companyDomain: req.body.companyDomain,
              companyName: property?.company,
              property: property?.title,
              layout:
                layout?.layoutName === undefined ? "NA" : layout?.layoutName,
            };
            if (req.body.role == "manager") {
              EmailDataManager.managerName = userData[0].firstname;
            } else {
              EmailDataManager.managerName = userData[0].ownerName;
            }
            console.log(EmailDataManager, "MANAGER");

            const options1 = Email.generateOptions(
              userData[0].email,
              "SLOT_BOOKING_SUBMITTED_TO_MANAGER",
              EmailDataManager
            );
            const isEmailSent = Email.send(options1);
          }

          res.json({
            status: 200,
            message: "slot Created",
            event: addedEvent,
          });
        }
      } else {
        const findNext = async (i) => {
          findBooked(BookedEvents[i].startTime, BookedEvents[i].endTime).then(
            async (result) => {
              if (result) {
                return res.json({
                  status: 500,
                  message: "Slot is already Booked",
                });
              } else if (BookedEvents.length - 1 == i) {
                if (req.body.slot_id) {
                  let updatedEvent = await User_appointment.findOneAndUpdate(
                    { _id: req.body.slot_id },
                    {
                      date: req.body.date,
                      startTime: req.body.StartTime,
                      endTime: req.body.endTime,
                    }
                  );

                  return res.status(200).send({
                    success: true,
                    message: "Successfully Updated",
                    status: 200,
                    updatedEvent: updatedEvent,
                  });
                } else {
                  let event = await User_appointment.create({
                    eventAssignedTo: req.body.manager_id,
                    assignedToType: req.body.role,
                    propertyId: req.body.propertyId,
                    layoutId: req.body.layoutId,
                    reasonId: req.body.reasonId,
                    name: req.body.name,
                    phone: req.body.phone,
                    phone1: req.body.phone1,
                    email: req.body.email,
                    description: req.body.description,
                    date: req.body.date,
                    startTime: req.body.StartTime,
                    endTime: req.body.endTime,
                    startTimeEpoch: Math.ceil(
                      moment(req.body.StartTime, "h:mm A").valueOf() / 1000
                    ),
                    endTimeEpoch: Math.ceil(
                      moment(req.body.endTime, "h:mm A").valueOf() / 1000
                    ),
                    companyDomain: req.body.companyDomain,
                    status: req.body.status ? req.body.status : "pending",
                  });
                  let userData = [];
                  if (req.body.role == "manager") {
                    userData = await propertyManager.aggregate([
                      {
                        $match: {
                          _id: ObjectID(req.body.manager_id),
                        },
                      },
                      {
                        $addFields: {
                          companyID: {
                            $toObjectId: "$companyID",
                          },
                        },
                      },
                      {
                        $lookup: {
                          from: "companies",
                          localField: "companyID",
                          foreignField: "_id",
                          as: "company",
                        },
                      },
                    ]);
                  } else {
                    userData = await Company.find({
                      _id: ObjectID(req.body.manager_id),
                    });
                  }

                  const property = await Property.findOne({
                    _id: req.body.propertyId,
                  });
                  const layout = await Layout.findOne({
                    _id: req.body.layoutId,
                  });
                  const company = await Company.findOne({
                    _id: property.companyID,
                  });
                  let EmailData = {
                    applicantName: req.body.name,
                    applicantPhone: req.body.phone,
                    applicantEmail: req.body.email,
                    applicantDescription: req.body.description,
                    logo: company?.logo,
                    date: req.body.date,
                    startTime: req.body.StartTime,
                    endTime: req.body.endTime,
                    email: req.body.email,
                    companyDomain: req.body.companyDomain,
                    companyName: property?.company,
                    property: property?.title,
                    layout: layout?.layoutName,
                  };
                  if (req.body.role == "manager") {
                    EmailData.managerName =
                      userData[0].firstname + " " + userData[0].lastname;
                    EmailData.managerEmail = userData[0].email;
                    EmailData.managerPhone = userData[0].mobile;
                  } else {
                    EmailData.managerName = userData[0].ownerName;
                    EmailData.managerEmail = userData[0].email;
                    EmailData.managerPhone = userData[0].phone;
                  }
                  const options = Email.generateOptions(
                    [req.body.email],
                    "SLOT_BOOKING_SUBMITTED",
                    EmailData
                  );
                  const isEmailSent = Email.send(options);
                  if (userData?.length > 0) {
                    let EmailDataManager = {
                      applicantName: req.body.name,
                      applicantPhone: req.body.phone,
                      applicantEmail: req.body.email,
                      applicantDescription: req.body.description,
                      date: req.body.date,
                      startTime: req.body.StartTime,
                      endTime: req.body.endTime,
                      email: req.body.email,
                      companyDomain: req.body.companyDomain,
                      companyName: property?.company,
                      property: property?.title,
                      layout:
                        layout?.layoutName === undefined
                          ? "NA"
                          : layout?.layoutName,
                    };
                    if (req.body.role == "manager") {
                      EmailDataManager.managerName = userData[0].firstname;
                    } else {
                      EmailDataManager.managerName = userData[0].ownerName;
                    }

                    const options1 = Email.generateOptions(
                      userData[0].email,
                      "SLOT_BOOKING_SUBMITTED_TO_MANAGER",
                      EmailDataManager
                    );
                    const isEmailSent = Email.send(options1);
                  }
                  return res.json({
                    status: 200,
                    message: "slot Created",
                    event: event,
                  });
                }
              } else {
                i++;
                findNext(i);
              }
            }
          );
        };

        findNext(0);
      }
      
      // let alreadyBooked = moment(req.body.StartTime, ["h:mm A"]).isBetween(moment(dayAvailability.startTime, ["h:mm A"]), moment(dayAvailability.endTime, ["h:mm A"]), 'minute');
    } else {
      return res.json({
        status: 500,
        message: "Slot is unavailable",
      });
    }
  } catch (error) {
    logger.error(error);
    console.log(error);
    res.json({
      status: 500,
      message: "Something Went Wrong !",
    });
  }
});

// update event
router.post("/update-event-status", async (req, res) => {
  try {
    let { slot_id, status } = req.body;
    if (slot_id && status) {
      let updatedEvent = await User_appointment.findOneAndUpdate(
        { _id: req.body.slot_id },
        { status: req.body.status }
      ).exec();

      if (updatedEvent) {
        let userData;
        if (updatedEvent.assignedToType == "manager") {
          userData = await propertyManager.find({
            _id: updatedEvent.eventAssignedTo,
          });
        } else if (updatedEvent.assignedToType == "company") {
          userData = await Company.find({
            _id: updatedEvent.eventAssignedTo,
          });
        }
        let property = await Property.findOne({ _id: updatedEvent.propertyId });
        let layout = await Layout.findOne({ _id: updatedEvent.layoutId });
        const company = await Company.findOne({ _id: property.companyID });

        let EmailData = {
          applicantName: updatedEvent.name,
          date: moment(updatedEvent.date).format("DD-MM-YYYY"),
          startTime: updatedEvent.startTime,
          endTime: updatedEvent.endTime,
          companyDomain: updatedEvent.companyDomain,
          companyName: property?.company,
          property: property?.title,
          logo: company?.logo,
          layout: layout?.layoutName,
          managerPhone: userData[0]?.mobile || userData[0]?.phone,
          managerEmail: userData[0]?.email,
          calendarId: userData[0]?.primaryID,
        };
        let emailFor = "";
        if (status == "booked") {
          emailFor = "SLOT_BOOKING_APPROVED_TO_USER";
          EmailData.id = updatedEvent._id;
        } else {
          EmailData.reason = req.body.reason;
          emailFor = "SLOT_BOOKING_REJECTED";
        }
        const options = Email.generateOptions(
          updatedEvent.email,
          emailFor,
          EmailData
        );
        const isEmailSent = Email.send(options);

        if (userData.length > 0) {
          let EmailData = {
            applicantName: userData[0].firstname || userData[0].ownerFirstName,
            date: moment(updatedEvent.date).format("DD-MM-YYYY"),
            startTime: updatedEvent.startTime,
            endTime: updatedEvent.endTime,
            companyDomain: updatedEvent.companyDomain,
            companyName: property?.company,
            property: property?.title,
            layout:
              layout?.layoutName === undefined ? "NA" : layout?.layoutName,
            logo: company?.logo,
          };
          let emailFor = "";
          if (status == "booked") {
            emailFor = "SLOT_BOOKING_APPROVED";
          } else {
            emailFor = "SLOT_BOOKING_REJECTED";
            const options1 = Email.generateOptions(
              userData[0].email,
              emailFor,
              EmailData
            );
            const isEmailSent = Email.send(options1);
          }
        }

        const eventOBJ = {
          id: updatedEvent._id,
          summary: `${property?.title}   ${layout?.layoutName}`,
          description: updatedEvent.description,
          guestsCanInviteOthers: false,
          start: {
            dateTime:
              moment(updatedEvent.date).format("YYYY-MM-DD") +
              "T" +
              moment(updatedEvent.startTime, ["h:mm A"]).format("HH:mm:ss"),
            timeZone: "Asia/Kolkata",
          },
          end: {
            dateTime:
              moment(updatedEvent.date).format("YYYY-MM-DD") +
              "T" +
              moment(updatedEvent.endTime, ["h:mm A"]).format("HH:mm:ss"),
            timeZone: "Asia/Kolkata",
          },
          conferenceData: {
            createRequest: {
              requestId: "sample123",
              conferenceSolutionKey: { type: "hangoutsMeet" },
            },
          },
          // organizer: {
          //   email: "pankajsharma0071uk@gmail.com",
          //   displayName: "Pankaj Sharma",
          // },
          attendees: [
            { email: updatedEvent.email, responseStatus: "accepted" },
            { email: userData[0].email, responseStatus: "accepted" },
          ],
          reminders: {
            useDefault: false,
            overrides: [
              {
                method: "email",
                minutes: 240,
              },
              {
                method: "popup",
                minutes: 40,
              },
            ],
          },
        };
        insertEvents(eventOBJ);
        res.json({
          status: 200,
          message: "slot Updated",
          event: updatedEvent,
        });
      } else {
        res.json({
          status: 500,
          message: "slot not Find",
        });
      }
    } else {
      res.json({
        status: 500,
        message: "slot not Updated",
      });
    }
  } catch (error) {
    logger.error(error);
    console.log(error);
    res.json({
      status: 500,
      message: "Something Went Wrong !",
    });
  }
});

router.post("/delete-event", async (req, res) => {
  try {
    if (req.body.slot_id) {
      let find = await User_appointment.find({ _id: req.body.slot_id });
      let deleted = await User_appointment.deleteOne({ _id: req.body.slot_id });
      console.log(deleted);
      if (deleted.deletedCount > 0) {
        let userData, company, companyName;
        if (find[0].assignedToType == "manager") {
          userData = await propertyManager.find({
            _id: find[0].eventAssignedTo,
          });

          company = await Company.find({ _id: userData[0].companyID });
          companyName = company[0].companyName;
        } else if (find[0].assignedToType == "company") {
          userData = await Company.find({
            _id: find[0].eventAssignedTo,
          });
          companyName = userData[0].name;
        }
        const options = Email.generateOptions(
          [find[0].email, userData[0].email],
          "SLOT_BOOKING_REJECTED",
          {
            companyDomain: find[0].companyDomain,
            applicantName: find[0].name,
            companyName,
          }
        );
        const isEmailSent = await Email.send(options);
        res.status(200).send({
          success: true,
          message: "Successfully Updated",
          status: 200,
        });
      } else {
        res.status(202).send({
          success: false,
          message: "Something went wrong",
          status: 202,
        });
      }
    } else {
      res
        .status(202)
        .send({ success: false, message: "Something went wrong", status: 202 });
    }
  } catch (e) {
    console.log(e);
    res.status(400).send({
      success: false,
      message: e.details || "Something went wrong",
      status: 400,
    });
  }
});

router.patch("/cancel-appointment", async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointment = await user_appointment.findByIdAndUpdate(
      appointmentId,
      {
        status: "canceled",
      }
    );

    let property = await Property.findOne({ _id: appointment.propertyId });
    let layout = await Layout.findOne({ _id: appointment.layoutId });
    const company = await Company.findOne({ _id: appointment.companyID });
    let EmailData = {
      applicantName: appointment.name,
      date: moment(appointment.date).format("DD-MM-YYYY"),
      startTime: appointment.startTime,
      endTime: appointment.endTime,
      companyDomain: appointment.companyDomain,
      companyName: property?.company,
      property: property?.title,
      logo: company?.logo,
      layout: layout?.layoutName,
      reason: req.body?.reason,
    };
    const options = Email.generateOptions(
      [appointment.email],
      "SLOT_BOOKING_CANCELED",
      EmailData
    );
    const isEmailSent = await Email.send(options);

    if (!appointment) {
      return res.status(404).send({
        success: false,
        message: "Appointment not found",
        status: 404,
      });
    }

    res.status(200).send({
      success: true,
      message: "Successfully updated",
      status: 200,
    });
  } catch (e) {
    console.log(e);
    res.status(400).send({
      success: false,
      message: e.details || "Something went wrong",
      status: 400,
    });
  }
});

router.post("/get-company-projectmanager-slot", async (req, res) => {
  try {
    const { manager_id, status, reasonType, propertyId } = req.body;
    let reasonQuery = {};
    if (reasonType !== "") {
      reasonQuery = { ...reasonQuery, "reasonType._id": ObjectID(reasonType) };
    }
    if (propertyId !== "") {
      reasonQuery = { ...reasonQuery, "property._id": ObjectID(propertyId) };
    }
    if (manager_id && manager_id.length > 0) {
      // const bookedSlot = await User_appointment.find({
      //   eventAssignedTo: { $in: manager_id },
      //   status: "booked",
      // });
      const managerIDs = manager_id?.map((m) => ObjectID(m));
      const bookedSlot = await User_appointment.aggregate([
        {
          $match: {
            eventAssignedTo: { $in: managerIDs },
            status: "booked",
          },
        },
        {
          $lookup: {
            from: "calendar_reason_types",
            localField: "reasonId",
            foreignField: "_id",
            as: "reasonType",
          },
        },
        {
          $lookup: {
            from: "layouts",
            localField: "layoutId",
            foreignField: "_id",
            as: "layoutType",
          },
        },
        {
          $lookup: {
            from: "propertymanagers",
            localField: "eventAssignedTo",
            foreignField: "_id",
            pipeline: [
              {
                $project: {
                  firstname: 1,
                  lastname: 1,
                },
              },
            ],
            as: "propertyManager",
          },
        },
        {
          $unwind: "$propertyManager",
        },
        {
          $lookup: {
            from: "properties",
            localField: "propertyId",
            foreignField: "_id",
            as: "property",
          },
        },
        {
          $match: reasonQuery,
        },
      ]);
      console.log("SD", bookedSlot);
      if (bookedSlot.length > 0) {
        res.json({
          status: 200,
          message: "The resources has been fetched",
          bookedSlot: bookedSlot,
        });
      } else {
        res.json({
          status: 201,
          message: "Slots Not Available !",
          bookedSlot: [],
        });
      }
    } else {
      res.json({
        status: 201,
        message: "Something Went Wrong !",
        bookedSlot: [],
      });
    }
  } catch (error) {
    logger.error(error);
    console.log(error);
    res.json({
      status: 500,
      message: "Something Went Wrong !",
    });
  }
});

//application filter for graph
router.get("/dashboardfilter", async (req, res) => {
  console.log(req.query, "----------------");
  try {
    let appointment = "";

    const role = req.query.role;
    let domain = req.query.domain;
    if (!role) {
      return res.json({
        status: 201,
        message: "role and domain is required",
        success: false,
      });
    }

    if (req.query.filterBy === "barChart") {
      let matchConditions = {};

      const propertyID =
        req.query.propertyId !== "" ? req.query.propertyId : null;

      if (propertyID !== null) {
        matchConditions = {
          propertyId: ObjectID(propertyID),
        };
      }
      if (req.query.startDate && req.query.endDate) {
        matchConditions.createdAt = {
          $gte: new Date(req.query.startDate),
          $lte: new Date(req.query.endDate),
        };
      }
      if (role == "manager") {
        matchConditions.eventAssignedTo = ObjectID(req.query.propertyManagerID);
      } else {
        let company = await Company.findOne({ domain: req.query.domain });
        matchConditions.eventAssignedTo = ObjectID(company._id);
      }
      appointment = await user_appointment.aggregate([
        {
          $match: matchConditions,
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
            total: { $sum: 1 }, // Set total to a constant value of 1
            pending: {
              $sum: {
                $cond: {
                  if: { $eq: ["$status", "pending"] },
                  then: 1,
                  else: 0,
                },
              },
            },
            booked: {
              $sum: {
                $cond: {
                  if: { $eq: ["$status", "booked"] },
                  then: 1,
                  else: 0,
                },
              },
            },
            rejected: {
              $sum: {
                $cond: {
                  if: { $eq: ["$status", "rejected"] },
                  then: 1,
                  else: 0,
                },
              },
            },
            canceled: {
              $sum: {
                $cond: {
                  if: { $eq: ["$status", "canceled"] },
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
      ]);

      console.log(appointment, "appointment-----------------");
    }

    const expected = appointment.reduce((acc, cur, index) => {
      const month = cur._id.month;
      if (!acc[month]) {
        acc[month] = {
          _id: { month },
          pending: 0,
          total: 0,
          booked: 0,
          rejected: 0,
          canceled: 0,
        };
      }
      acc[month].pending += cur.pending;
      acc[month].total += cur.total;
      acc[month].booked += cur.booked;
      acc[month].rejected += cur.rejected;
      acc[month].canceled += cur.canceled;
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
    console.log(error);
    res.json({
      status: 500,
      message: error?.message,
    });
  }
});

router.get("/get_appointment/:id", async (req, res) => {
  try {
    const appointment = await user_appointment.findOne({
      _id: ObjectID(req.params.id),
    });
    console.log(appointment);
    res.send({
      status: 200,
      message: "The resources has been fetched",
      appointment: appointment,
    });
  } catch (error) {
    res.json({
      status: 500,
      message: error?.message,
    });
  }
});
module.exports = router;
