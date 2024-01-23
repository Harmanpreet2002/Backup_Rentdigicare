const router = require("express").Router();
const logger = require("../Logger/LoggerFactory").getProductionLogger();
const { google } = require("googleapis");
const moment = require("moment");
const moment_timezone = require("moment-timezone");
const jwt = require("jsonwebtoken");
const {
  GOOGLE_CALENDAR_ID,
  GOOGLE_CALENDAR_CREDANTIALS,
} = require("../config.js");
require("dotenv").config();

const SCOPES = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/userinfo.email",
];
const CLIENT_ID =
  "254361738607-fg17gedpionksf6gbgb85b05hfngub10.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URL = "http://localhost:9000/calender/add-event";

const auth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URL
);

// importing database models
const Manager = require("../Database/PropertyManager");
const Ticket = require("../Database/Ticket");
const ManagerAvailability = require("../Database/calender_availability");
const Events = require("../Database/events");
const Calender_events = require("../Database/calender_events");
const Property = require("../Database/Property");
const insertEvents = require("../utils/GoogleCalendar");
const CalendarReasonTypes = require("../Database/CalendarReasonTypes");
const ObjectId = require("mongodb").ObjectId;

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

router.post("/auth", async (req, res) => {
  const existingEvent = await Events.findOne({ authEmail: req.body.authEmail });
  const eventData = req.body;

  console.log("Event Data: ", eventData);

  if (existingEvent) {
    const updatedEvent = await Events.findOneAndUpdate(
      { authEmail: req.body.authEmail },
      eventData,
      { new: true }
    );

    console.log("Updated Event Data:", updatedEvent);
  } else {
    const newEvent = await Events.create(eventData);
    console.log("Newly Created Event Data:", newEvent);
  }

  const authUrl = auth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",
  });
  res.status(200).send(authUrl);
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

const insertEventGoogleCalendar = async (event, accessToken) => {
  try {
    console.log("Access Token in function:", accessToken);
    console.log("Event in function:", event);

    console.log("Constructed Event", event);

    const calendar = google.calendar({
      version: "v3",
      auth: "AIzaSyC9iuP9dmClgizbZz-F-O-GmqxB5VQT4m4",
    });

    const response = await calendar.events.insert({
      calendarId: "primary",
      sendUpdates: "all",
      sendNotifications: true,
      auth: auth2Client,
      resource: event,
    });

    console.log("Event created: %s", response.data);
  } catch (err) {
    console.error("Error inserting event into Google Calendar:", err);

    // Check if the error indicates a lack of permission
    if (
      err.code === 403 &&
      err.errors &&
      err.errors.length > 0 &&
      err.errors[0].reason === "forbidden"
    ) {
      console.error(
        "Permission error: The authenticated user does not have permission to add events to this calendar."
      );
      // You can handle this case and provide a user-friendly response
    } else {
      // Handle other types of errors or rethrow the original error
      throw err;
    }
  }
};

const convertToLocalTime = (utcTime) => {
  const utcMoment = moment_timezone.utc(utcTime);
  const localTimezone = moment_timezone.tz.guess();
  const localMoment = utcMoment.clone().tz(localTimezone);
  const formattedTime = localMoment.format("h:mm A");

  return formattedTime;
};

router.get("/add-event", async (req, res) => {
  try {
    const code = req.query.code;

    const { tokens } = await auth2Client.getToken(code);

    const idToken = tokens.id_token;
    const decodedToken = jwt.decode(idToken, { complete: true });

    const email = decodedToken.payload.email;

    tokens.expiry_date = Date.now() + tokens.expiry_date * 1000;
    auth2Client.setCredentials(tokens);

    const accessToken = tokens.access_token;
    console.log("Access Token:", accessToken);

    auth2Client.setCredentials({
      access_token: accessToken,
      scope: tokens.scope,
      expiry_date: tokens.expiry_date,
    });

    const event = await Events.findOne({ authEmail: email });

    if (event) {
      const managerAvailability = await ManagerAvailability.findOne({
        eventAssignedTo: event.manager_id,
      });

      const convertedManagerAvailability =
        managerAvailability.daysOfWeekAvailability.map((day) => ({
          ...day,
          slots: day.slots.map((slot) => ({
            startTime: convertToLocalTime(slot.startTime),
            endTime: convertToLocalTime(slot.endTime),
          })),
        }));

      const dayAvailability = convertedManagerAvailability.find(
        (dayItem) => dayItem.day === event.day
      );

      if (!dayAvailability || !dayAvailability.available) {
        return res.json({
          status: 500,
          message: "Manager not available on the specified day.",
        });
      }
      const inAvailableTime = dayAvailability.slots.some((slot) =>
        moment(event.StartTime, ["h:mm A"]).isBetween(
          moment(slot.startTime, ["h:mm A"]),
          moment(slot.endTime, ["h:mm A"]),
          "minute",
          "[)"
        )
      );
      if (!inAvailableTime) {
        return res.json({
          status: 500,
          message: "Slot is unavailable.",
        });
      }
      const bookedEvents = await Calender_events.find({
        eventDate: event.eventDate,
        eventAssignedTo: event.manager_id,
      });
      const isSlotBooked = () =>
        bookedEvents.some((eve) =>
          moment(event.StartTime, ["h:mm A"]).isBetween(
            moment(eve.startTime, ["h:mm A"]),
            moment(eve.endTime, ["h:mm A"]),
            "minute",
            "[)"
          )
        );
      if (bookedEvents.length > 0 && isSlotBooked()) {
        return res.json({
          status: 500,
          message: "Slot is already booked.",
        });
      }
      let eve;
      const eventData = {
        eventId: event.event_id,
        eventAssignedTo: event.manager_id,
        assignedToType: event.role,
        description: event.description,
        eventDate: event.eventDate,
        startTime: event.StartTime,
        endTime: event.endTime,
        createdBy: event.createdBy,
        type: event.type,
        title: event.title,
        propertyId: event.propertyId,
        companyDomain: event.companyDomain,
      };
      // Check if event with the provided ID exists
      const existingEvent = await Calender_events.findOne({
        eventId: event.event_id,
      });
      if (existingEvent) {
        // Update the existing event
        eve = await Calender_events.findByIdAndUpdate(
          event.event_id,
          eventData,
          {
            new: true,
          }
        );
        console.log("Updated event in create-event:", eve);
        const updateCalenderEvent = {
          summary: event.title,
          description: event.description,
          start: {
            dateTime: moment(event.eventDate + "T" + event.StartTime, [
              "YYYY-MM-DDTHH:mm",
            ]).toISOString(),
            timeZone: "Asia/Kolkata",
          },
          end: {
            dateTime: moment(event.eventDate + "T" + event.endTime, [
              "YYYY-MM-DDTHH:mm",
            ]).toISOString(),
            timeZone: "Asia/Kolkata",
          },
          attendees: event.attendees,
          reminders: event.reminders || {
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
        // eventUpdate(event.event_id, updateCalenderEvent);
      } else {
        // Create a new event
        eve = await Calender_events.create(eventData);
        console.log("Create event in create-event:", eve);
        const newCalenderEvent = {
          id: eve._id,
          summary: event.title,
          description: event.description,
          start: {
            dateTime: moment(event.eventDate + "T" + event.StartTime, [
              "YYYY-MM-DDTHH:mm",
            ]).toISOString(),
            timeZone: "Asia/Kolkata",
          },
          end: {
            dateTime: moment(event.eventDate + "T" + event.endTime, [
              "YYYY-MM-DDTHH:mm",
            ]).toISOString(),
            timeZone: "Asia/Kolkata",
          },
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
        if (auth2Client.credentials && auth2Client.credentials.access_token) {
          await insertEventGoogleCalendar(
            newCalenderEvent,
            auth2Client.credentials.access_token
          );

          const responseData = {
            success: true,
            message: existingEvent ? "Successfully Updated" : "Event added",
            status: 200,
            event: eve,
          };

          const encodedResponse = encodeURIComponent(
            JSON.stringify(responseData)
          );

          res.redirect(`http://localhost:3000/apps-calendar`);
        } else {
          res
            .status(500)
            .send("Authentication failed. Please check logs for details.");
        }
      }
    } else {
      res.status(400).json({
        status: 400,
        message: "Bad request",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: "Something went wrong!",
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
