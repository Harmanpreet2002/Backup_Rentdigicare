const router = require("express").Router();

const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const Conversation = require("../Database/Conversation");
const PropertyManager = require("../Database/PropertyManager");
const Customer = require("../Database/Customer");
const vendor = require("../Database/vendor");

//new conv

router.post("/", async (req, res) => {
  const newConversation = new Conversation({
    members: [req.body.senderId, req.body.receiverId],
  });

  try {
    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get conv of a user

router.get("/:userId", async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get conv includes two userId

router.get("/find/:firstUserId/:secondUserId", async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [req.params.firstUserId, req.params.secondUserId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get company Owner conversions
router.get("/company/:companyId", async (req, res) => {
  try {
    const PropertyMangers = await PropertyManager.aggregate([
      {
        $match: { companyID: req.params.companyId },
      },
      {
        $lookup: {
          from: "conversations",
          let: { companyId: { $toObjectId: "$companyID" }, managerId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $in: ["$$companyId", "$members"] },
                    { $in: ["$$managerId", "$members"] },
                  ],
                },
              },
            },

            // Add additional stages here
          ],
          as: "conversation",
        },
      },
      {
        $project: {
          _id: 1,
          conversation: 1,
          name: "$firstname",
        },
      },
    ]);

    res.status(200).json({ conversations: PropertyMangers });
  } catch (err) {
    res.status(500).json(err);
  }
});

//get manager conversation
router.get("/manager/:managerId", async (req, res) => {
  try {
    console.log(req.params.managerId,"SD");
    // const Comapny = await PropertyManager.aggregate([
    //   {
    //     $match: { _id: ObjectId(req.params.managerId) },
    //   },
    //   {
    //     $lookup: {
    //       from: "conversations",
    //       let: { companyId: { $toObjectId: "$companyID" }, managerId: "$_id" },
    //       pipeline: [
    //         {
    //           $match: {
    //             $expr: {
    //               $and: [
    //                 { $in: ["$$companyId", "$members"] },
    //                 { $in: ["$$managerId", "$members"] },
    //               ],
    //             },
    //           },
    //         },
    //         // {
    //         //     $lookup: {
    //         //         let: { "companyObjId": "$_id" },
    //         //         from: "messages",
    //         //         pipeline: [
    //         //             { "$match": { "$expr": { "$eq": ["$conversationId", "$$companyObjId"] } } }
    //         //         ],
    //         //         as: "comapnyDetails"
    //         //     }
    //         // }
    //         // Add additional stages here
    //       ],
    //       as: "conversation",
    //     },
    //   },
    //   {
    //     $lookup: {
    //       let: { companyObjId: { $toObjectId: "$companyID" } },
    //       from: "companies",
    //       pipeline: [
    //         { $match: { $expr: { $eq: ["$_id", "$$companyObjId"] } } },
    //       ],
    //       as: "comapnyDetails",
    //     },
    //   },

    //   {
    //     $project: {
    //       _id: 1,
    //       conversation: 1,
    //       name: "$companies.ownerFirstName",
    //     },
    //   },
    // ]);

    const manager= await Conversation.aggregate([{
      $match:{
        members:ObjectId(req.params.managerId),      
      }
    },
    {
      $lookup: {
        let: { coversation_id: { $toString: "$_id" } },
        from: "messages",
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$conversationId", "$$coversation_id"] },
            },
          },
          {
            $sort: { createdAt: -1 },
          },
        ],
        as: "message",
      },
    },
  ]);


    res
      .status(200)
      .json({ data: manager});
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get("/customer/:customerId", async (req, res) => {
  try {
    const Managers = await Customer.aggregate([
      {
        $match: { _id: ObjectId(req.params.customerId) },
      },
      { $unwind: "$properties" },
      {
        $lookup: {
          from: "propertymanagers",
          let: { propertyId: "$properties", customerId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $in: ["$$propertyId", "$properties"] },
              },
            },
            {
              $lookup: {
                from: "conversations",
                let: { managerId: "$_id" },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $in: ["$$customerId", "$members"] },
                          { $in: ["$$managerId", "$members"] },
                        ],
                      },
                    },
                  },
                  {
                    $lookup: {
                      let: { coversation_id: { $toString: "$_id" } },
                      from: "messages",
                      pipeline: [
                        {
                          $match: {
                            $expr: {
                              $eq: ["$conversationId", "$$coversation_id"],
                            },
                          },
                        },
                        {
                          $sort: { createdAt: -1 },
                        },
                      ],
                      as: "message",
                    },
                  },
                  {
                    $project: {
                      message: { $arrayElemAt: ["$message", 0] },
                      notification: "$notification",
                      offline_user: "$offline_user",
                      members: "$members",
                    },
                  },

                  // Add additional stages here
                ],

                as: "conversation",
              },
            },
            {
              $project: {
                // "conversation": { "$arrayElemAt": ["$conversation", 0] },
                // conversation: "$conversation",
                name: "$firstname",
              },
            },

            // Add additional stages here
          ],
          as: "data",
        },
      },
      {
        $project: {
          _id: 0,
          name: 1,
          data: 1,
        },
      },
    ]);
    res.status(200).json({ managers: Managers });
  } catch (e) {
    console.log(e);
    res.status(200).json({ error: e });
  }
});

router.post("/:mangerId", async (req, res) => {
  try {
    const managerId = req.params.mangerId
      ? ObjectId(req.params.mangerId)
      : null;
    const customerId = req.body.senderId ? ObjectId(req.body.senderId) : null;

    const currentConv = await Conversation.aggregate([
      {
        $match: {
          members: {
            $in: [managerId, customerId],
          },
        },
      },
      {
        $lookup: {
          let: { coversation_id: { $toString: "$_id" } },
          from: "messages",
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$conversationId", "$$coversation_id"] },
              },
            },
            {
              $sort: { createdAt: -1 },
            },
          ],
          as: "message",
        },
      },
    ]);
    res.status(200).json(currentConv[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get("/vendor/:vendorID", async (req, res) => {
  const Managers = await vendor.aggregate([
    {
      $match: { _id: ObjectId(req.params.vendorID) },
    },
    { $unwind: "$connectedManagers" },
    {
      $lookup: {
        from: "propertymanagers",
        let: { managerId: "$connectedManagers", vendorID: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$$managerId", "$_id"] },
            },
          },
          {
            $lookup: {
              from: "conversations",
              let: { managerId: "$_id" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $in: ["$$vendorID", "$members"] },
                        { $in: ["$$managerId", "$members"] },
                      ],
                    },
                  },
                },
                {
                  $lookup: {
                    let: { coversation_id: { $toString: "$_id" } },
                    from: "messages",
                    pipeline: [
                      {
                        $match: {
                          $expr: {
                            $eq: ["$conversationId", "$$coversation_id"],
                          },
                        },
                      },
                      {
                        $sort: { createdAt: -1 },
                      },
                    ],
                    as: "message",
                  },
                },
                {
                  $project: {
                    message: { $arrayElemAt: ["$message", 0] },
                    notification: "$notification",
                    offline_user: "$offline_user",
                    members: "$members",
                  },
                },

                // Add additional stages here
              ],

              as: "conversation",
            },
          },
          {
            $project: {
              conversation: { $arrayElemAt: ["$conversation", 0] },
              name: "$firstname",
            },
          },

          // Add additional stages here
        ],
        as: "data",
      },
    },
    {
      $project: {
        _id: 0,
        name: 1,
        data: 1,
      },
    },
  ]);

  try {
    res.status(200).json({ managers: Managers });
  } catch (e) {
    console.log(e);
    res.status(200).json({ error: e });
  }
});

router.post("/notification", async (req, res) => {
  try {
    const notification = await Conversation.updateOne(
      { _id: req.body.conversationId },
      {
        notification: true,
        offline_user: req.body.receiverId,
      }
    );
    res.status(200).send({ success: true });
  } catch (e) {
    res.status(201).send({ success: false });
  }
});

module.exports = router;
