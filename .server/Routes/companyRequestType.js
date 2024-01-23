const router = require("express").Router();

const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const CompanyRequestType = require("../Database/CompanyRequestType")

// Get all the Companies
router.post("/addrequesttype", /*authToken,*/ async (req, res) => {
    try {
        const newRequestType = await CompanyRequestType.create({
            company_id: req.body.company_id,
            request_type: req.body.request_type
        })
        res.json({
            status: 200,
            message: "The resources has been fetched",
            requestType: newRequestType
        })
    } catch (error) {
        // logger.error(error)
        res.json({
            status: 201,
            message: error.message
        })
    }

});


router.post("/editrequesttype", /*authToken,*/ async (req, res) => {
    try {
        const editRequestType = await CompanyRequestType.findOneAndUpdate({ _id: req.body.id }, {
            request_type: req.body.request_type
        })
        res.json({
            status: 200,
            message: "The resources has been fetched",
            requestType: editRequestType
        })
    } catch (error) {
        // logger.error(error)
        res.json({
            status: 201,
            message: "Something Went Wrong !"
        })
    }
});


router.post("/delete", /*authToken,*/ async (req, res) => {
    try {
        const deleted = await CompanyRequestType.find({ _id: req.body.id }).remove()
        res.json({
            status: 200,
            message: "The resources has been fetched",
            requestType: deleted
        })
    } catch (error) {
        // logger.error(error)
        res.json({
            status: 201,
            message: "Something Went Wrong !"
        })
    }

});


router.post("/getrequest", /*authToken,*/ async (req, res) => {
    try {
        const requestTypes = await CompanyRequestType.find({ company_id: req.body.company_id })
        res.json({
            status: 200,
            message: "The resources has been fetched",
            requestType: requestTypes
        })
    } catch (error) {
        // logger.error(error)
        console.log(error)
        res.json({
            status: 201,
            message: "Something Went Wrong !"
        })
    }
    

});



module.exports = router
