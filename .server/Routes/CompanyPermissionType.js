const router = require("express").Router();

const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const CompanyRequestType = require("../Database/CompanyRequestType")
const PermissionTypes = require("../Database/CompanyPermissionTypes");
const CompanyPermissionTypes = require("../Database/CompanyPermissionTypes");


// Get all the Companies
router.post("/addpermissiontype", /*authToken,*/ async (req, res) => {
    console.log(req.body);
    try {
        const permission_type = await PermissionTypes.create({
            company_id: req.body.company_id,
            PermissionType: req.body.permission_type
        })

        res.json({
            status: 200,
            message: "The resources has been fetched",
            PermissionType: permission_type
        })
    } catch (error) {
        logger.error(error)
        res.json({
            status: 201,
            message: error.message
        })
    }

});


router.post("/editPermissionTypes", /*authToken,*/ async (req, res) => {
    try {
        const editPermissionType = await CompanyPermissionTypes.findOneAndUpdate({ _id: req.body.id }, {
            PermissionType: req.body.permission_type
        })
        res.json({
            status: 200,
            message: "The resources has been fetched",
            PermissionType: editPermissionType
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
        const deleted = await CompanyPermissionTypes.find({ _id: req.body.id }).remove()
        res.json({
            status: 200,
            message: "The resources has been fetched",
            PermissionType: deleted
        })
    } catch (error) {
        // logger.error(error)
        res.json({
            status: 201,
            message: "Something Went Wrong !"
        })
    }

});


router.post("/getpermissions", /*authToken,*/ async (req, res) => {
    console.log(req.body,'bofy on getpermission')
    try {
        const permission_type = await CompanyPermissionTypes.find({ company_id: req.body.company_id })
        res.json({
            status: 200,
            message: "The resources has been fetched",
            permission_type: permission_type
        })
       console.log(permission_type,'typess--') 
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
