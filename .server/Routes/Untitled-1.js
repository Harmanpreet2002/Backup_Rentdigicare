const router = require("express").Router();
const logger = require("../Logger/LoggerFactory").getProductionLogger();
const { google } = require("googleapis");
const {
    GOOGLE_CALENDAR_ID,
    GOOGLE_CALENDAR_CREDANTIALS,
} = require("../config.js");

require("dotenv").config();
// const mongoose = require("mongoose");
// mongoose.set('debug', true);
const Email = require("../utils/Email");
const SCOPES = ["https://www.googleapis.com/auth/calendar"];
const calendar = google.calendar({ version: "v3" });

const auth = new google.auth.GoogleAuth({
    keyFile: "../Server/google-keys.json",
    scopes: SCOPES,
});

const moment = require("moment");
const { ObjectID } = require('bson');
// importing database models
const ManagerAvailability = require("../Database/calender_availability");
const User_appointment = require("../Database/user_appointment");
const propertyManager = require("../Database/PropertyManager");
const Company = require("../Database/Company");

const Property = require("../Database/Property");
const Layout = require("../Database/Layout");
const insertEvent = async (event) => {
    try {
        auth.getClient().then((a) => {
            calendar.events.insert(
                {
                    auth: a,
                    calendarId: GOOGLE_CALENDAR_ID,
                    resource: event,
                },
                function (err, event) {
                    if (err) {
                        console.log(
                            "There was an error contacting the Calendar service: " + err
                        );
                        return;
                    }
                    console.log("Event created: %s", event?.data);
                }
            );
        });
    } catch (err) {
        console.log(err?.message, "SDDDDD");
    }
};

const eventUpdate = (eventId, event) => {
    const calendar = google.calendar({ version: "v3", auth });
    calendar.events.patch(
        {
            auth: auth,
            calendarId: "ogrmqudsjojp8pkdmefcti30kg@group.calendar.google.com",
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
router.get("/get-pending-slot", async (req, res) => {
    try {
        const { manager_id } = req.query;
        if (manager_id) {
      const currentDate = Math.ceil(moment().valueOf() / 1000);
      console.log(currentDate)
      const expireSlot = await User_appointment.updateMany({
        endTimeEpoch: {
          $lte: currentDate,
        },
      }, { $set: { status: "expired" } });
            const bookedSlot = await User_appointment.find({
                eventAssignedTo: manager_id,
                status: "pending",
            });

            res.json({
                status: 200,
                message: "The resources has been fetched",
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
            message: "Something Went Wrong !",
        });
    }
});

router.get("/get-booked-slot", async (req, res) => {
    try {
        const { manager_id, status } = req.query;
        if (manager_id) {
      const currentDate = Math.ceil(moment().valueOf() / 1000);
      console.log(currentDate)
      const expireSlot = await User_appointment.updateMany({
        endTimeEpoch: {
          $lte: currentDate,
        },
      }, { $set: { status: "expired" } });
            const bookedSlot = await User_appointment.find({
                eventAssignedTo: manager_id,
                status: "booked",
            });

            res.json({
                status: 200,
                message: "The resources has been fetched",
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
            message: "Something Went Wrong !",
        });
    }
});


router.post("/get-todays-event", async (req, res) => {
    try {
        let BookedEvents = await User_appointment.find({
            date: req.body.date,
            eventAssignedTo: req.body.manager_id,
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
    const id = req.query.manager_id
    const role = req.query.role
    if (!id || id === "" || !role || role === "") {
        return res.json({
            status: 400,
            message: "Bad Request: id Is Required."
        })
    }
    else {
        try {

            let manager = null;
            if (role === "manager") {
                manager = await propertyManager.findOne({ _id: id }, { primaryID: 1, _id: 0 })
            } else if (role === "company") {
                manager = await Company.findOne({ _id: id }, { primaryID: 1, _id: 0 })
            }
            if (manager) {
                return res.json({
                    status: 200,
                    message: "Fetched resource successfully",
                    url_key: manager
                })
      }
      else {
                return res.json({
                    status: 404,
                    message: "Manager Not Found"
                })
            }
        }
        catch (error) {
            console.log(error)
            return res.json({
                status: 500,
                message: "something went wrong"
            })
        }
    }
})

router.get("/get-id", async (req, res) => {
    const id = req.query.id
    if (!id || id === "") {
        return res.json({
            status: 400,
            message: "Bad Request: id Is Required."
        })
    }
    else {
        try {
            let manager, role;
            role = id.slice(0, 3)
            if (role === "MNG") {
                manager = await propertyManager.aggregate([
                    { $match: { primaryID: id } },
                    {
                        $lookup: {
                            from: "properties",
                            let: { propertyId: "$properties" },
                            pipeline: [
                                { '$match': { '$expr': { '$in': ['$_id', '$$propertyId'] } } },
                                {
                                    $lookup: {
                                        from: "layouts",
                                        let: { categoryId: "$category" },
                                        pipeline: [
                                            {
                                                $match: {
                                                    $and: [{ $expr: { '$in': ["$_id", "$$categoryId"] } }]
                                                }
                                            }
                                        ],
                                        as: "categoryList"
                                    }
                                },
                            ],
                            as: "proprtyList"
                        }
                    },
                    {
                        $project: {
                            _id: 1,
                            role: 1,
                            companyAssigned: 1,
                            proprtyList: {
                                _id: 1,
                                title: 1,

                                categoryList: {
                                    _id: 1,
                                    layoutName: 1
                                }
                            }
                        }
                    }
                ])
            }
            else if (role === "CMP") {
                manager = await Company.aggregate([
                    {
                        "$match": {
                            primaryID: id
                        }
                    },
                    {
                        "$project": {
                            _id: 1,
                            role: 1,
                            domain: 1,
                        }
                    }
                ])
                if (manager && manager.length > 0) {
                    let proprtyList = await Property.aggregate([
                        { $match: { companyID: (manager[0]?._id).toString() } },
                        {
                            $lookup: {
                                from: "layouts",
                                localField: "category",
                                foreignField: "_id",
                                as: "categoryList"
                            }
                        },
                        {
                            $project: {
                                _id: 1,
                                title: 1,
                                categoryList: {
                                    _id: 1,
                                    layoutName: 1
                                }
                            }
                        }
                    ])


                    console.log(manager)
                    manager = [{
                        _id: manager[0]?._id,
                        role: manager[0]?.role,
                        companyAssigned: manager[0]?.domain,
                        proprtyList: proprtyList
                    }]
        }
        else {
                    manager = null
                }
            }
      //console.log(manager)
      if (manager && manager.length > 0) {
                return res.json({
                    status: 200,
                    message: "Fetched Manager",
          manager: manager
                })
            }

            else {
                return res.json({
                    status: 404,
                    message: "Manager Not Found"
                })
            }
        }
        catch (error) {
            console.log(error)
            return res.json({
                status: 500,
                message: "something went wrong"
            })
        }
    }
});

router.post("/add_slot", async (req, res) => {
    try {
        // console.log(req.body.event_id)

        let managerAvailability = await ManagerAvailability.find({
            eventAssignedTo: req.body.manager_id,
        });



        let dayAvailability = managerAvailability[0].daysOfWeekAvailability.filter(
            (dayItem) => {
                if (dayItem.day == req.body.day) {
                    return dayItem;
                }
            }
        );
        dayAvailability = dayAvailability[0];
        // moment.tz.add("Asia/Calcutta|HMT BURT IST IST|-5R.k -6u -5u -6u|01232|-18LFR.k 1unn.k HB0 7zX0");

        let inAvailableTime = false;

        for (let l = 0; l < dayAvailability.slots.length; l++) {
            console.log(req.body.StartTime, dayAvailability.slots[l].startTime, dayAvailability.slots[l].endTime)
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
                        email: req.body.email,
                        description: req.body.description,
                        date: req.body.date,
                        startTime: req.body.StartTime,
                        endTime: req.body.endTime,
                        startTimeEpoch: Math.ceil((moment(req.body.StartTime, 'h:mm A').valueOf()) / 1000),
                        endTimeEpoch: Math.ceil((moment(req.body.endTime, 'h:mm A').valueOf()) / 1000),
                        companyDomain: req.body.companyDomain,
                    });

        
          let userData = await propertyManager.aggregate([
            {
              "$match": {
                _id: ObjectID("63986afed4d9cc68cf3a5bcb"),
              }
            },
            {
              "$addFields": {
                "companyID": {
                  "$toObjectId": "$companyID"
                }
              }
            },
            {
              "$lookup": {
                "from": "companies",
                "localField": "companyID",
                "foreignField": "_id",
                "as": "company"
              }
            }
          ]);
          const property = await Property.findOne({ _id : req.body.propertyId });
          const layout = await Layout.findOne({ _id : req.body.layoutId });
          const company = await Company.findOne({domain:req.body.companyDomain})

          console.log("user " ,userData)
          let EmailData = {
            applicantName: req.body.name,
            applicantPhone: req.body.phone,
            applicantEmail: req.body.email,
            applicantDescription: req.body.description,
            logo:company?.logo,
            date: req.body.date,
            startTime: req.body.StartTime,
            endTime: req.body.endTime,
            email: req.body.email,
            companyDomain: req.body.companyDomain,
            companyName : property?.company,
            property : property?.title,
            layout : layout?.layoutName
          }
          const options = Email.generateOptions(
            [req.body.email, userData[0]?.email],
            "SLOT_BOOKING_SUBMITTED",
            EmailData
          );
          const isEmailSent = Email.send(options);

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
                                        name: req.body.name,
                                        phone: req.body.phone,
                                        email: req.body.email,
                                        description: req.body.description,
                                        date: req.body.date,
                                        startTime: req.body.StartTime,
                                        endTime: req.body.endTime,
                                        startTimeEpoch: Math.ceil((moment(req.body.StartTime, 'h:mm A').valueOf()) / 1000),
                                        endTimeEpoch: Math.ceil((moment(req.body.endTime, 'h:mm A').valueOf()) / 1000),
                                        companyDomain: req.body.companyDomain,

                                    });
                  let userData = await propertyManager.aggregate([
                    {
                      "$match": {
                        _id: ObjectID(req.body.manager_id),
                      }
                    },
                    {
                      "$addFields": {
                        "companyID": {
                          "$toObjectId": "$companyID"
                        }
                      }
                    },
                    {
                      "$lookup": {
                        "from": "companies",
                        "localField": "companyID",
                        "foreignField": "_id",
                        "as": "company"
                      }
                    },
                  ]);

                  const property = await Property.findOne({ _id : req.body.propertyId });
                  const layout = await Layout.findOne({ _id : req.body.layoutId });
                  const company = await Company.findOne({domain:req.body.companyDomain})
                  console.log("user " ,userData)
                  let EmailData = {
                    applicantName: req.body.name,
                    date: req.body.date,
                    startTime: req.body.StartTime,
                    endTime: req.body.endTime,
                    email: req.body.email,
                    companyDomain: req.body.companyDomain,
                    companyName : property?.company,
                    property : property?.title,
                    layout : layout?.layoutName,
                    logo:company?.logo
                  }
                  const options = Email.generateOptions(
                    [req.body.email, userData[0]?.email],
                    "SLOT_BOOKING_SUBMITTED",
                    EmailData
                  );
                  const isEmailSent = Email.send(options);

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
                { _id: req.body.slot_id }, { status: req.body.status })
                .exec();

      if(updatedEvent){
      let userData = await propertyManager.find({
        _id: updatedEvent.eventAssignedTo,
      });
      let property = await Property.findOne({ _id : updatedEvent.propertyId });
      let layout = await Layout.findOne({ _id : updatedEvent.layoutId });
      let company = await Company.findOne({_id:layout.companyID})

        let EmailData = {
          applicantName: updatedEvent.name,
          date: moment(updatedEvent.date).format('DD-MM-YYYY'),
          startTime: updatedEvent.startTime,
          endTime: updatedEvent.endTime,
          companyDomain: updatedEvent.companyDomain,
          companyName : property?.company,
          property : property?.title,
          layout : layout?.layoutName,
          logo:company?.logo
         }
      const options = Email.generateOptions(
        [updatedEvent.email, userData[0].email],
        "SLOT_BOOKING_APPROVED",
        EmailData
      );
      const isEmailSent = Email.send(options);
            res.json({
                status: 200,
                message: "slot Updated",
                event: updatedEvent,
            });
    }else{
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
      let find = await User_appointment.find({ _id: req.body.slot_id })
      let userData = await propertyManager.find({
        _id: find[0].eventAssignedTo,
      });
            let deleted = await User_appointment.find({ _id: req.body.slot_id })
                .remove()
                .exec();
      const options = Email.generateOptions(
        [find[0].email, userData[0].email],
        "SLOT_BOOKING_REJECTED",
        { name: find[0].name }
      );
      const isEmailSent = await Email.send(options);
      if (deleted.deletedCount > 0) {
            res
                .status(200)
                .send({ success: true, message: "Successfully Updated", status: 200 });
        } else {
            res
          .status(202)
          .send({ success: false, message: "Something went wrong", status: 202 });
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

router.post("/get-company-projectmanager-slot", async (req, res) => {
    try {
        const { manager_id, status } = req.body;
        if (manager_id && manager_id.length > 0) {
            const bookedSlot = await User_appointment.find({
                eventAssignedTo: { $in: manager_id },
                status: "booked",
            });
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
})

module.exports = router;
