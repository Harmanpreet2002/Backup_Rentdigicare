const router = require("express").Router();
const logger = require("../Logger/LoggerFactory").getProductionLogger();
const { google } = require("googleapis");
const {
  GOOGLE_CALENDAR_ID,
  GOOGLE_CALENDAR_CREDANTIALS,
} = require("../config.js");
require("dotenv").config();
const SCOPES = ["https://www.googleapis.com/auth/calendar"];
// const

// const auth = new google.auth.GoogleAuth({
//   keyFile: "../Server/google-keys.json",
//   scopes: SCOPES,
// });

// const calendar = google.calendar({
//   version: "v3",
//   auth: auth,
//   clientOptions: {
//     subject: "amitoj@dupleit.com",
//   },
// });

// auth.setSubject="amitoj@dupleit.com";
// console.log(auth, "auth");

const auth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CALENDAR_CLIENT_ID,
  process.env.GOOGLE_CALENDAR_CLIENT_SECRET,
  process.env.REDIRECT_URL
);

const REFRESH_TOKEN =
  "1//0gHVddOGo9QT8CgYIARAAGBASNwF-L9Irr7wYfZwLeU08cLxkpgrDvUZjFJhO-ajSej7zW_xzdQp5c_kC6AcJhZxzzzUMvWl159Q";

auth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const moment = require("moment");

// importing database models
const Manager = require("../Database/PropertyManager");
const Ticket = require("../Database/Ticket");
const ManagerAvailability = require("../Database/calender_availability");
const Calender_events = require("../Database/calender_events");
const Property = require("../Database/Property");
const insertEvents = require("../utils/GoogleCalendar");
const CalendarReasonTypes = require("../Database/CalendarReasonTypes");
const ObjectId = require("mongodb").ObjectId;

// const REFRESH_TOKEN ="1//0g3mNjqFi0TyaCgYIARAAGBASNwF-L9Ir3DEVmjjp8PyHmJ2rS7MoR_DCJQxdAoncV77xvZb_GyOzyMv7M4n41DhKBAfJjVMmyFo";

const calendar = google.calendar({
  version: "v3",
  auth: process.env.GOOGLE_CALENDAR_API_KEY,
});

// const insertEvent = async (event) => {
//   try {
//     // auth.getClient().then((a) => {

//     // console.log(">>>>>>>>>inserting event");

//     calendar.events.insert(
//       {
//         calendarId: "primary",
//         auth: auth2Client,
//         resource: event,
//       },
//       function (err, event) {
//         if (err) {
//           console.log(
//             "There was an error contacting the Calendar service: " + err
//           );
//           return;
//         }
//         console.log("Event created: %s", event?.data);
//       }
//     );
//     // });
//   } catch (err) {
//     console.log(err?.message, "SDDDDD");
//   }
// };

const eventUpdate = (eventId, event) => {
  // const calendar = google.calendar({ version: "v3", auth });
  calendar.events.patch(
    {
      auth: auth2Client,
      calendarId: "primary",
      eventId: eventId,
      resource: event,
    },
    function (err, event) {
      if (err) {
        console.log(
          "There was an error contacting the Calendar service: " + err
        );
        return;
      }
      console.log("Event created: %s", event.data);
    }
  );
};

router.get("/google", (req, res) => {
  const url = auth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  res.redirect(url);
});

router.get("/googleCalendar", async (req, res) => {
  const code = req.query.code;

  const { tokens } = await auth2Client.getToken(code);
  // console.log(data ,'data');
  // // const token = data.access_token;

  res.send.json({ success: true });
});
// Get all the Companies
router.post("/", async (req, res) => {
  try {
    let ticketList = [];

    let events = [];

    let query = {};

    let managerId = req.body.manager_id;

    if (!Array.isArray(managerId)) {
      managerId = [managerId];
    }

    let eventQuery = {};

    if (req.body.propertyID) {
      eventQuery.propertyId = req.body.propertyID;
      query = {
        propertyID: req.body.propertyID,
      };
    }

    if (req.body.role == "manager") {
      const manager = await Manager.findOne(
        { _id: { $in: managerId } },
        "properties"
      );

      if (manager?.properties) {
        query = {
          propertyID: { $in: manager.properties },
        };
      }
    } else if (
      req.body.role == "technical staff" ||
      req.body.role == "vendor"
    ) {
      query = {
        assignedTo: { $in: managerId },
      };
    } else if (req.body.role == "property") {
      const property = await Property.findOne({ _id: req.body.propertyID });
      managerId = property?.managers?.[0];
    }

    eventQuery.eventAssignedTo = { $in: managerId };

    console.log(query);

    if (Object.keys(query).length > 0) {
      ticketList = await Ticket.find(query)
        .populate("assignVendor")
        .populate("assignedTo")
        .populate("confirmedQuote")
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
        });
    }

    if (Object.keys(eventQuery).length > 0) {
      events = await Calender_events.find(eventQuery);
    }

    res.json({
      status: 200,
      message: "The resources has been fetched",
      ticketList: ticketList,
      events: events,
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

router.post("/customer_tickets", async (req, res) => {
  try {
    const ticketList = await Ticket.find({ createdByid: req.body.customer_id });

    res.json({
      status: 200,
      message: "The resources has been fetched",
      ticketList: ticketList,
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

router.post("/set-availability", async (req, res) => {
  try {
    const upComingEvents = await Calender_events.find({
      eventAssignedTo: req.body.manager_id,
      eventDate: {
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
        const date = moment(ticket.eventDate);

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
        logger.error(error);
        console.log(error);
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
    console.log("req.query.manager_id: ", req.query.manager_id);
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

router.post("/add-event", async (req, res) => {
  console.log("Add-event api get called:", req.body);
  try {
    // console.log(req.body.event_id)

    let managerAvailability = await ManagerAvailability.find({
      eventAssignedTo: req.body.manager_id,
    });

    console.log("ManagerAvailability:", managerAvailability[0].daysOfWeekAvailability);

    let dayAvailability = managerAvailability[0].daysOfWeekAvailability.filter(
      (dayItem) => {
        if (dayItem.day == req.body.day) {
          return dayItem;
        }
      }
    );

    console.log("Day Availability:", dayAvailability);

    dayAvailability = dayAvailability[0];

    // moment.tz.add("Asia/Calcutta|HMT BURT IST IST|-5R.k -6u -5u -6u|01232|-18LFR.k 1unn.k HB0 7zX0");

    let inAvailableTime = false;

    for (let l = 0; l < dayAvailability.slots.length; l++) {
      let available = moment(req.body.StartTime, ["h:mm A"]).isBetween(
        moment(dayAvailability.slots[l].startTime, ["h:mm A"]),
        moment(dayAvailability.slots[l].endTime, ["h:mm A"]),
        "minute",
        "[)"
      );

      if (available) {
        inAvailableTime = true;
        break;
      }
    }

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

    console.log(dayAvailability.available, inAvailableTime);

    if (dayAvailability.available && inAvailableTime) {
      let BookedEvents = await Calender_events.find({
        eventDate: req.body.eventDate,
        eventAssignedTo: req.body.manager_id,
      });

      if (BookedEvents.length <= 0) {
        if (req.body.event_id) {
          let updatedEvent = await Calender_events.findOneAndUpdate(
            { _id: req.body.event_id },
            {
              eventDate: req.body.eventDate,
              description: req.body.description,
              startTime: req.body.StartTime,
              endTime: req.body.endTime,
              title: req.body.title,
              type: req.body.type,
              propertyId: req.body.propertyId,
              companyDomain: req.body.companyDomain,
            }
          );

          let event = {
            summary: req.body.title,
            description: req.body.description,
            start: {
              dateTime:
                req.body.eventDate +
                "T" +
                moment(req.body.StartTime, ["h:mm A"]).format("HH:mm:ss"),
              timeZone: "Asia/Kolkata",
            },
            end: {
              dateTime:
                req.body.eventDate +
                "T" +
                moment(req.body.endTime, ["h:mm A"]).format("HH:mm:ss"),
              timeZone: "Asia/Kolkata",
            },
            attendees: req.body.attendees,
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

          eventUpdate(req.body.event_id, event);

          return res.status(200).send({
            success: true,
            message: "Successfully Updated",
            status: 200,
            updatedEvent: updatedEvent,
          });
        } else {
          let addedEvent = await Calender_events.create({
            eventAssignedTo: req.body.manager_id,
            assignedToType: req.body.role,
            description: req.body.description,
            eventDate: req.body.eventDate,
            startTime: req.body.StartTime,
            endTime: req.body.endTime,
            createdBy: req.body.createdBy,
            type: req.body.type,
            title: req.body.title,
            propertyId: req.body.propertyId,
            companyDomain: req.body.companyDomain,
          });

          let newEvent = {
            id: req.body._id,
            summary: req.body.title,
            description: req.body.description,
            start: {
              dateTime:
                req.body.eventDate +
                "T" +
                moment(req.body.StartTime, ["h:mm A"]).format("HH:mm:ss"),
              timeZone: "Asia/Kolkata",
            },
            end: {
              dateTime:
                req.body.eventDate +
                "T" +
                moment(req.body.endTime, ["h:mm A"]).format("HH:mm:ss"),
              timeZone: "Asia/Kolkata",
            },
            // attendees: [
            //   { email: "Azim.duple@gmail.com" },
            //   { email: "anupam.dupleIt@gmail.com" },
            // ],
            attendees: [
              { email: "nkay2487@gmail.com" },
              { email: "sagguharman11@gmail.com" },
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

          insertEvents(newEvent);

          res.json({
            status: 200,
            message: "Event Added",
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
                if (req.body.event_id) {
                  let updatedEvent = await Calender_events.findOneAndUpdate(
                    { _id: req.body.event_id },
                    {
                      eventDate: req.body.eventDate,
                      startTime: req.body.StartTime,
                      endTime: req.body.endTime,
                      title: req.body.title,
                      type: req.body.type,
                      description: req.body.description,
                    }
                  );

                  return res.status(200).send({
                    success: true,
                    message: "Successfully Updated",
                    status: 200,
                    updatedEvent: updatedEvent,
                  });
                } else {
                  let event = await Calender_events.create({
                    eventAssignedTo: req.body.manager_id,
                    assignedToType: req.body.role,
                    eventDate: req.body.eventDate,
                    startTime: req.body.StartTime,
                    endTime: req.body.endTime,
                    createdBy: req.body.createdBy,
                    title: req.body.title,
                    type: req.body.type,
                    description: req.body.description,
                    propertyId: req.body.propertyId,
                  });

                  let newEvent = {
                    summary: req.body.title,
                    description: req.body.description,
                    start: {
                      dateTime:
                        req.body.eventDate +
                        "T" +
                        moment(req.body.StartTime, ["h:mm A"]).format(
                          "HH:mm:ss"
                        ),
                      timeZone: "Asia/Kolkata",
                    },
                    end: {
                      dateTime:
                        req.body.eventDate +
                        "T" +
                        moment(req.body.endTime, ["h:mm A"]).format("HH:mm:ss"),
                      timeZone: "Asia/Kolkata",
                    },
                    conferenceData: {
                      createRequest: {
                        requestId: "sample123",
                        conferenceSolutionKey: { type: "hangoutsMeet" },
                      },
                    },
                    organizer: {
                      email: "pankajsharma0071uk@gmail.com",
                      displayName: "Pankaj Sharma",
                    },
                    attendees: [
                      { email: "Azim.duple@gmail.com" },
                      { email: "anupam.dupleIt@gmail.com" },
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

                  insertEvent(newEvent);
                  return res.json({
                    status: 200,
                    message: "Event Added",
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

router.post("/get-todays-event", async (req, res) => {
  try {
    let BookedEvents = await Calender_events.find({
      eventDate: req.body.eventDate,
      eventAssignedTo: req.body.manager_id,
    });

    res.status(200).send({
      success: true,
      message: "Successfully fetched",
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

router.post("/delete-event", async (req, res) => {
  try {
    let deleted = await Calender_events.find({ _id: req.body.event_id })
      .remove()
      .exec();

    var params = {
      auth: auth2Client,
      calendarId: "primary",
      eventId: req.body.event_id,
    };

    // const calendar = google.calendar({ version: "v3", auth });

    calendar.events.delete(params, function (err) {
      if (err) {
        console.log("The API returned an error: " + err);
        return;
      }
      console.log("Event deleted.");
    });

    res
      .status(200)
      .send({ success: true, message: "Successfully Updated", status: 200 });
  } catch (e) {
    console.log(e);
    res.status(200).send({
      success: false,
      message: e.details || "Something went wrong",
      status: 202,
    });
  }
});

router.post("/reason/add", async (req, res) => {
  if (!req.body.companyID) {
    return res.status(400).json({ message: "Missing companyID field" });
  }
  if (!req.body.reasonType) {
    return res.status(400).json({ message: "Missing reasonType field" });
  }
  try {
    const { companyID, reasonType, color } = req.body;
    const reason = await CalendarReasonTypes.findOne({
      companyId: ObjectId(companyID),
      reasonType,
    });

    if (reason) {
      return res.json({
        status: 201,
        message: "Reason Type already exists for this company",
      });
    }

    await CalendarReasonTypes.create({ companyId: companyID, reasonType });
    res.json({ status: 200, message: "Reason added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

router.put("/reason/update", async (req, res) => {
  if (!req.body.id) {
    return res.status(400).json({ message: "Missing reason id field" });
  }
  if (!req.body.reasonType) {
    return res.status(400).json({ message: "Missing reasonType field" });
  }
  try {
    const { id, reasonType } = req.body;
    console.log(id, reasonType, "SDDDD");
    const reason = await CalendarReasonTypes.findOne({ _id: ObjectId(id) });
    if (!reason) {
      res.status(500).json({ message: "Reason not found" });
    }
    console.log(reason);
    await CalendarReasonTypes.findOneAndUpdate(
      { _id: ObjectId(id) },
      { reasonType },
      { new: true }
    );
    res.json({ status: 200, message: "Reason updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

router.delete("/reason/delete", async (req, res) => {
  if (!req.query.id) {
    return res.status(400).json({ message: "Missing reason field" });
  }
  try {
    const { id } = req.query;
    const reason = await CalendarReasonTypes.findOne({ _id: ObjectId(id) });
    if (!reason) {
      res.status(500).json({ message: "Reason not found" });
    }
    await CalendarReasonTypes.findOneAndDelete({ _id: ObjectId(id) });
    res.json({ status: 200, message: "Reason deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/reason/get", async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = {};
    const filter = {};
    if (req.query.companyID) {
      filter.companyId = ObjectId(req.query.companyID);
    }
    if (
      endIndex <
      (await CalendarReasonTypes.find(filter).countDocuments().exec())
    ) {
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
    results.reasons = await CalendarReasonTypes.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(startIndex)
      .exec();
    results.total = reasons = await CalendarReasonTypes.find(
      filter
    ).countDocuments();
    res.json({ status: 200, results, message: "Reasons fetched successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
