const router = require("express").Router();
const logger = require("../Logger/LoggerFactory").getProductionLogger();
const jwt = require("jsonwebtoken");
const moment = require("moment");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const Applicant = require("../Database/Applicant");
const calender_events = require("../Database/calender_events");
const { count } = require("../Database/Customer");
// Importing models
const Customer = require("../Database/Customer");
const Property = require("../Database/Property");
const Ticket = require("../Database/Ticket");
const Transactions = require("../Database/Transactions");
const Company = require("../Database/Company");
const user_appointment = require("../Database/user_appointment");
const Leads = require("../Database/Leads");
const PropertyManager = require("../Database/PropertyManager");

router.get("/", (req, res) => {
  const code = req.query.code;
  console.log("Code:",code);
})

router.post("/company_stat", async (req, res) => {
  try {
    const Allproperty = await Property.find(
      { companyID: req.body.companyId },
      { _id: 1,title:1 }
    );

    const Activeproperty = await Property.find({
      companyID: req.body.companyId,
      status: "Active",
    }).count();

    let propertyList = Allproperty.map((item) => {
      return item._id;
    });
    

    const  properties = Allproperty.map((item) => {
        return { label:item.title ,value:item._id}
      })

    const totaltransactionAmount = await Transactions.aggregate([
      {
        $match: {
          companyDomain: req.body.companyDomain,
          createdAt: {
            $gte: new Date(moment().subtract(1, "month").format("yyyy-MM-DD")),
          },
        },
      },
      {
        $group: {
          _id: { companyDomain: req.body.companyDomain },
          totalAmount: { $sum: { $toInt: "$amount" } },
        },
      },
    ]);

    console.log(totaltransactionAmount,"totaltransactionAmount")


    const pendingtransactionAmount = await Transactions.aggregate([
      {
        $match: {
          companyDomain: req.body.companyDomain,
          payment_status: { $ne: "paid" },
          createdAt: {
            $gte: new Date(moment().subtract(1, "month").format("yyyy-MM-DD")),
          },
        },
      },
      {
        $group: {
          _id: { companyDomain: req.body.companyDomain },
          pendingAmount: { $sum: { $toInt: "$amount" } },
        },
      },
    ]);

    console.log(pendingtransactionAmount,"pendingtransactionAmount")


    const tickets = await Ticket.aggregate([
      {
        $match: {
          companyDomain: req.body.companyDomain,
          createdAt: {
            $gte: new Date(moment().subtract(1, "month").format("yyyy-MM-DD")),
          },
        },
      },

      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    console.log(tickets,"tickets")

    // const CalenderEvents = await calender_events
    //   .find({
    //     eventDate: {
    //       $gte: new Date(moment().format("yyyy-MM-DD")),
    //     },
    //     companyDomain: req.body.companyDomain,
    //   })
    //   .populate("eventAssignedTo")
    //   .populate("propertyId");

      
    const CalenderEvents = await calender_events.aggregate([
        {
            $match: {
                eventDate: {
                    $gte: new Date(moment().format("yyyy-MM-DD")),

                }
            }
        },
        {
            $lookup: {
                from: "propertymanagers",
                let: { 'eventAssignedTo': "$eventAssignedTo", 'companyAssigned': '$companyAssigned' },
                pipeline: [
                    {
                        '$match': {
                            '$expr': {
                                '$and': [
                                    { '$eq': ['$$eventAssignedTo', '$_id'] },
                                    { '$eq': ['$companyAssigned', req.body.companyDomain] }

                                ]
                            }
                        }
                    },
                ],
                as: "managerList"
            },

        },
        { $match: { "managerList.0": { $exists: true } } }
    ])

    console.log(CalenderEvents,"CalenderEvents")

    const customerCount = await Customer.find({
      properties: { $in: propertyList },
    }).count();

    console.log(customerCount,"customerCount")


    res.json({
      status: 200,
      success: true,
      message: "The resources has been fetched",
      Allproperty: Allproperty.length,
      Activeproperty: Activeproperty,
      customerCount: customerCount,
      propertyList: properties,
      totaltransactionAmount: totaltransactionAmount?.[0],
      pendingtransactionAmount: pendingtransactionAmount?.[0],
      receivedTransaction:
        totaltransactionAmount?.[0]?.totalAmount -
        (pendingtransactionAmount?.[0]?.pendingAmount || 0),
      tickets,
      totalTickets:
        (tickets?.[0]?.count || 0) +
        (tickets?.[1]?.count || 0) +
        (tickets?.[2]?.count || 0),
      CalenderEvents,
    });
  } catch (error) {
    logger.error(error);
    console.log(error);
    res.json({
      status: 201,
      message: "Something Went Wrong !",
    });
  }
});

router.post("/manager_stat", async (req, res) => {
  try {
    const Allproperty = await Property.find(
      { managers: { $in: req.body.managerId } },
      { _id: 1 ,title:1}
    );

    const Activeproperty = await Property.find({
      managers: { $in: req.body.managerId },
      status: "Active",
    }).count();

    let propertyList = Allproperty.map((item) => {
      return item._id;
    });
 
    let properties = Allproperty.map((item) => {
      return { label: item.title, value: item._id };
    });

    const totaltransactionAmount = await Transactions.aggregate([
      {
        $match: {
          property_id: { $in: propertyList },
          createdAt: {
            $gte: new Date(moment().subtract(1, "month").format("yyyy-MM-DD")),
          },
        },
      },
      {
        $group: {
          _id: "$companyDomain",
          totalAmount: { $sum: { $toInt: "$amount" } },
        },
      },
    ]);

    const pendingtransactionAmount = await Transactions.aggregate([
      {
        $match: {
          property_id: { $in: propertyList },
          payment_status: { $ne: "paid" },
          createdAt: {
            $gte: new Date(moment().subtract(1, "month").format("yyyy-MM-DD")),
          },
        },
      },
      {
        $group: {
          _id: "$companyDomain",
          pendingAmount: { $sum: { $toInt: "$amount" } },
        },
      },
    ]);

    const tickets = await Ticket.aggregate([
      {
        $match: {
          propertyID: { $in: propertyList },
          createdAt: {
            $gte: new Date(moment().subtract(1, "month").format("yyyy-MM-DD")),
          },
        },
      },

      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
      // { $project: { _id: 0 } }
    ]);

    const CalenderEvents = await calender_events
      .find({
        eventDate: {
          $gte: new Date(moment().format("yyyy-MM-DD")),
        },
        eventAssignedTo: ObjectId(req.body.managerId),
      })
      .populate("eventAssignedTo")
      .populate("propertyId");

    const customerCount = await Customer.find({
      properties: { $in: propertyList },
    }).count();

    res.json({
      status: 200,
      success: true,
      message: "The resources has been fetched",
      Allproperty: Allproperty.length,
      Activeproperty: Activeproperty,
      customerCount: customerCount,
      propertyList: properties,
      totaltransactionAmount: totaltransactionAmount?.[0] || 0,
      pendingtransactionAmount: pendingtransactionAmount?.[0] || 0,
      receivedTransaction:
        (totaltransactionAmount?.[0]?.totalAmount || 0) -
        (pendingtransactionAmount?.[0]?.pendingAmount || 0),
      tickets,
      totalTickets:
        (tickets?.[0]?.count || 0) +
        (tickets?.[1]?.count || 0) +
        (tickets?.[2]?.count || 0),
      CalenderEvents,
    });
  } catch (error) {
    logger.error(error);
    console.log(error);
    res.json({
      status: 201,
      message: "Something Went Wrong !",
    });
  }
});
router.get('/getallcharts',  async(req, res)=>{
  try {

    const getAppointments =(req)=>{
      return new Promise(async(resolve, reject) => {
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
      
            const propertyID = req.query.propertyId !== ''
              ? req.query.propertyId
              : null;
              
      
            if (propertyID !== null) {
              matchConditions = {
                "propertyId": ObjectId(propertyID),
              };
            }
            if (req.query.startDate && req.query.endDate) {
              matchConditions.createdAt = {
                $gte: new Date(req.query.startDate),
                $lte: new Date(req.query.endDate),
              };
            }
            if(role == 'manager'){
              matchConditions.eventAssignedTo = ObjectId(req.query.propertyManagerID)
            }else{
              let company = await Company.findOne({domain:req.query.domain})
              matchConditions.eventAssignedTo = ObjectId(company._id)
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
                  total: { $sum: 1 },  // Set total to a constant value of 1
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
            
      
            console.log(appointment,"appointment-----------------")  
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
                canceled:0,
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
          resolve(results)
        } catch (error) {
          console.log(error);
          resolve([])
        }
      })
    }
    const getApplicants = (req)=>{
      return new Promise(async(resolve, reject) => {
        try {
          let applicant = "";
    var searchCriteria = {};

    const role = req.query.role;
    let domain = req.query.domain;
    if (!role) {
      return res.json({
        status: 201,
        message: "role and domain is required",
        success: false,
      });
    }
    if (req.query.startDate && req.query.endDate) {
      searchCriteria.createdAt = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate),
      };
    }

    if (req.query.filterBy === "barChart") {
      let matchConditions = {};
      const propertyManagerID = req.query.propertyManagerID !== ''
        ? ObjectId(req.query.propertyManagerID)
        : null;
      const propertyID = req.query.propertyId !== ''
        ? req.query.propertyId
        : null;
      // if (role == "manager") {

      //   if (propertyManagerID !== null) {
      //     matchConditions = {
      //       managers: { $in: [propertyManagerID] },
      //     };
      //   }
      // } else if (role == "company") {
      //   searchCriteria.companyDomain = domain;
      // }

   

      if (propertyManagerID !== null && role === "company") {
        matchConditions = {
          managers: { $in: [propertyManagerID] },
        };
      } else {
        if (role === "company" && propertyManagerID === null) {
          searchCriteria.companyDomain = domain;
        }
      }

      if (propertyManagerID !== null && role === "manager") {
        matchConditions = {
          managers: { $in: [propertyManagerID] },
        };
      }
      if (propertyID !== null) {
        matchConditions = {
          "_id": ObjectId(propertyID),
        };
      }
      const applicant2 = await Applicant.aggregate([
        {
          $match: matchConditions,
        }])
      console.log(matchConditions,'matchConditions')
      console.log(applicant2.length,'---applicant2------')



        // if (propertyID !== null) {
        //   applicant = await Applicant.aggregate([
        //     {
        //       $match: matchConditions,
        //     },
        //     {
        //       $addFields: {
        //         propertyId: { $toString: "$_id" },
        //       },
        //     },
        //     // {
        //     //   $lookup: {
        //     //     from: "applicants",
        //     //     localField: "propertyId",
        //     //     foreignField: "main.propertyID",
        //     //     as: "applicant",
        //     //     pipeline: [
        //     //       {
        //     //         $match: searchCriteria,
        //     //       },
        //     //       {
        //     //         $group: {
        //     //           _id: {
        //     //             month: {
        //     //               $dateToString: { format: "%Y-%m", date: "$createdAt" },
        //     //             },
        //     //             year: {
        //     //               $dateToString: { format: "%Y", date: "$createdAt" },
        //     //             },
        //     //           },
        //     //           total: { $sum: 1 },
        //     //           pending: {
        //     //             $sum: {
        //     //               $cond: {
        //     //                 if: { $eq: ["$status", "Pending"] },
        //     //                 then: 1,
        //     //                 else: 0,
        //     //               },
        //     //             },
        //     //           },
        //     //           approved: {
        //     //             $sum: {
        //     //               $cond: {
        //     //                 if: { $eq: ["$status", "Approved"] },
        //     //                 then: 1,
        //     //                 else: 0,
        //     //               },
        //     //             },
        //     //           },
        //     //           denied: {
        //     //             $sum: {
        //     //               $cond: {
        //     //                 if: { $eq: ["$status", "Denied"] },
        //     //                 then: 1,
        //     //                 else: 0,
        //     //               },
        //     //             },
        //     //           },
        //     //         },
        //     //       },
        //     //       {
        //     //         $sort: { "_id.year": 1, "_id.month": 1 },
        //     //       },
        //     //     ],
        //     //   },
        //     // },
        //     // {
        //     //   $unwind: "$applicant",
        //     // },
        //     // {
        //     //   $project: {
        //     //     applicant: 1,
        //     //     _id: 0,
        //     //   },
        //     // },
        //   ]);
        //   console.log(applicant,'-------------')
        // }  
      applicant = await Property.aggregate([
        {
          $match: matchConditions,
        },
        {
          $addFields: {
            propertyId: { $toString: "$_id" },
          },
        },
        {
          $lookup: {
            from: "applicants",
            localField: "propertyId",
            foreignField: "main.propertyID",
            as: "applicant",
            pipeline: [
              {
                $match: searchCriteria,
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
                  total: { $sum: 1 },
                  pending: {
                    $sum: {
                      $cond: {
                        if: { $eq: ["$status", "Pending"] },
                        then: 1,
                        else: 0,
                      },
                    },
                  },
                  approved: {
                    $sum: {
                      $cond: {
                        if: { $eq: ["$status", "Approved"] },
                        then: 1,
                        else: 0,
                      },
                    },
                  },
                  denied: {
                    $sum: {
                      $cond: {
                        if: { $eq: ["$status", "Denied"] },
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
            ],
          },
        },
        {
          $unwind: "$applicant",
        },
        {
          $project: {
            applicant: 1,
            _id: 0,
          },
        },
      ]);

      console.log(applicant.length,"applicant-----------------")  
    }
    const actual = applicant.map((v) => v.applicant);
    const expected = actual.reduce((acc, cur, index) => {
      const month = cur._id.month;
      if (!acc[month]) {
        acc[month] = {
          _id: { month },
          pending: 0,
          total: 0,
          approved: 0,
          denied: 0,
        };
      }
      acc[month].pending += cur.pending;
      acc[month].total += cur.total;
      acc[month].approved += cur.approved;
      acc[month].denied += cur.denied;
      return acc;
    }, {});
    const results = Object.entries(expected).map(([month, value]) => {
      value.month = month;
      return value;
    });
    resolve(results)
        } catch (error) {
          console.log(error);
          resolve([])
        }
      })
    }
    const getMaintenanceRequests = (req)=>{
      return new Promise(async(resolve, reject) => {
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
            const propertyID = req.query.propertyId ? ObjectId(req.query.propertyId)
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
              searchCriteria.propertyID =
                propertyID
      
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
            console.log('hiii');
            resolve(ticket)
          }
        } catch (err) {
          console.log(err);
          resolve([])
        }
      })
    }
    const getLeads = (req)=>{
      return new Promise(async(resolve, reject) => {
        try {
          let leads = "";
          var searchCriteria = {};
      
          if (req.query.filterBy === "barChart") {
            const propertyManagerID = req.query.propertyManagerID
              ? ObjectId(req.query.propertyManagerID)
              : null;
      
            const propertyID = req.query.propertyId ? req.query.propertyId : null;
      
            if (propertyManagerID !== null && req.query.role === "company") {
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
            } else if (req.query.role === "company" && propertyManagerID === null) {
              if (req.query.startDate && req.query.endDate) {
                searchCriteria.createdAt = {
                  $gte: new Date(req.query.startDate),
                  $lte: new Date(req.query.endDate),
                };
              }
      
              if (req.query.domain) {
                searchCriteria.propertyUrl = {
                  $regex: req.query.domain,
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
                  $project: {
                    _id: 1,
                    pending: { $ifNull: ["$pending", 0] },
                    closed: { $ifNull: ["$closed", 0] },
                    cancelled: { $ifNull: ["$cancelled", 0] },
                    follow_up: { $ifNull: ["$follow_up", 0] },
                  },
                },
                {
                  $sort: { "_id.month": 1 },
                },
              ]);
              
              console.log(leads, ":SD");
            }
      
            if (propertyManagerID !== null && req.query.role === "manager") {
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
          console.log(leads);
          resolve(leads)
        } catch (err) {
          console.log(err);
        }
      })
    }
    const getProperties = (req)=>{
      return new Promise(async(resolve, reject) => {
        try {
          let property = "";
          var searchCriteria = {};
          if (req.query.startDate && req.query.endDate) {
            searchCriteria.createdAt = {
              $gte: new Date(req.query.startDate),
              $lte: new Date(req.query.endDate),
            };
          }
          if (req.query.filterBy === "barChart") {
            const propertyManagerID = req.query.propertyManagerID !== ''
              ? ObjectId(req.query.propertyManagerID)
              : null;
            const property_id = req.query.propertyId !== ''
              ? ObjectId(req.query.propertyId)
              : null;
      
            if(property_id !== null){
              searchCriteria._id = property_id;
            }
            if (propertyManagerID !== null && req.query.role === "company") {
              searchCriteria.managers = { $in: [propertyManagerID] };
            } else {
              if (req.query.role === "company" && propertyManagerID === null) {
                searchCriteria.companyDomain = req.query.domain
              }
            }
      
            if (propertyManagerID !== null && req.query.role === "manager") {
              searchCriteria.managers = { $in: [propertyManagerID] };
            }
            console.log(searchCriteria);
            property = await Property.aggregate([
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
                  active: {
                    $sum: {
                      $cond: [{ $eq: ["$status", "Active"] }, 1, 0],
                    },
                  },
                  inactive: {
                    $sum: {
                      $cond: [{ $eq: ["$status", "Inactive"] }, 1, 0],
                    },
                  },
                },
              },
              {
                $sort: { "_id.month": 1 },
              },
            ]);
          resolve(property)
          }
        } catch (err) {
          console.log(err);
        }
      })
    }
    const getPropertyMangers = (req)=>{
      return new Promise(async(resolve, reject) => {
        try {
          let manager = [];
          var searchCriteria = {};
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
            if (propertyManagerID !== null && req.query.role === "company") {
              searchCriteria._id = ObjectId(req.query.propertyManagerID)
            } else {
              if (req.query.role === "company" && propertyManagerID === null) {
                searchCriteria.companyAssigned = req.query.domain;
              }
            }
            if (propertyManagerID !== null && req.query.role === "manager") {
              searchCriteria.managers = { $in: [propertyManagerID] };
            }
            manager = await PropertyManager.aggregate([
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
                  active: {
                    $sum: {
                      $cond: [{ $eq: ["$status", "Active"] }, 1, 0],
                    },
                  },
                  inactive: {
                    $sum: {
                      $cond: [{ $eq: ["$status", "Inactive"] }, 1, 0],
                    },
                  },
                },
              },
              {
                $sort: { "_id.month": 1 },
              },
            ]);
          }
          resolve(manager)
        } catch (err) {
          console.log(err);
        }
      })
    }
    const [appointments,applicants, maintenanceRequests,properties, leads] = await Promise.all([
      getAppointments(req),
      getApplicants(req),
      getMaintenanceRequests(req),
      getProperties(req),
      getLeads(req),
    ]);
    let managers = []
    if(req.query.role == 'company'){
       managers = await getPropertyMangers(req)
    }
    // console.log("applicant",applicant[0].applicant)
    // console.log(results,'-results')
    const sortedAppointments = appointments.sort((a, b) => {
      let monthA = a._id.month;
      let monthB = b._id.month;
      if (monthA < monthB) {
        return -1;
      }
      if (monthA > monthB) {
        return 1;
      }
      return 0;
    });
    
    const sortedApplicants = applicants.sort((a, b) => {
      let monthA = a._id.month;
      let monthB = b._id.month;
      if (monthA < monthB) {
        return -1;
      }
      if (monthA > monthB) {
        return 1;
      }
      return 0;
    });
    
    const sortedMaintenanceRequests = maintenanceRequests.sort((a, b) => {
      let monthA = a._id.month;
      let monthB = b._id.month;
      if (monthA < monthB) {
        return -1;
      }
      if (monthA > monthB) {
        return 1;
      }
      return 0;
    });
    // Create a map to hold the colors dynamically based on request types
const typeColorsMap = new Map();

// Function to generate random colors (you can use your preferred method to get colors)
function generateRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

sortedMaintenanceRequests.forEach((item) => {
  for (const requestType in item) {
    if (requestType !== '_id') {
      if (!typeColorsMap.has(requestType)) {
        // Assign a random color for new request types
        typeColorsMap.set(requestType, generateRandomColor());
      }
      item[requestType] = {
        count: item[requestType],
        color: typeColorsMap.get(requestType),
      };
    }
  }
});

    const sortedProperties = properties ?  properties.sort((a, b) => {
      let monthA = a._id.month;
      let monthB = b._id.month;
      if (monthA < monthB) {
        return -1;
      }
      if (monthA > monthB) {
        return 1;
      }
      return 0;
    }) : []
    const sortedLeads = leads ? leads.sort((a, b) => {
      let monthA = a._id.month;
      let monthB = b._id.month;
      if (monthA < monthB) {
        return -1;
      }
      if (monthA > monthB) {
        return 1;
      }
      return 0;
    }) : []
    const sortedManagers = managers?.sort((a, b) => {
      let monthA = a._id.month;
      let monthB = b._id.month;
      if (monthA < monthB) {
        return -1;
      }
      if (monthA > monthB) {
        return 1;
      }
      return 0;
    })
    console.log(sortedMaintenanceRequests);
    res.json({
      status: 201,
      data: {
        appointments: sortedAppointments,
        applicants: sortedApplicants,
        maintenanceRequests: sortedMaintenanceRequests,
        leads: sortedLeads,
        properties: sortedProperties,
        managers: sortedManagers
      }
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: 500,
      message: error?.message,
    });
  }
})
module.exports = router;
