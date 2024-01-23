const router = require("express").Router();
const bcrypt = require("bcrypt");
const fs = require("fs")

// importing models
const Admin = require("../Database/Admin")
const Company = require("../Database/Company")
const Manager = require("../Database/PropertyManager")
const Customer = require("../Database/Customer")
const jwt = require("jsonwebtoken");
const logger = require("../Logger/LoggerFactory").getProductionLogger()

const multer = require("multer")
const path = require("path");
const admZip = require("adm-zip")

const Email = require("../utils/Email");
const vendor = require("../Database/vendor");
const Technical_Staff = require("../Database/Technical_Staff");
const Properties = require("../Database/Property")
const {uploadTicketDocumentsToS3} = require('../utils/bucket')

// multer for file uploading 
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `uploads/profile/${req.headers.role}`);
    },
    filename: function (req, file, cb) {
        cb(null, `${req.headers.id}.${file.originalname.split(".")[1]}`);
    }
    
});
const upload = multer({ storage: storage });


router.post("/edit-information", async (req, res) => {
    if (!req.body.role || !req.body.userID) {
        res.json({
            status: 400,
            message: "Bad Request: userRole or userID not defined !"
        });
    } else {
        try {
            const usernameExists = await isUsernameExits(req.body.username, req.body.userID)
            // if (!usernameExists) {
            const role = req.body.role
            const userID = req.body.userID
            const data = req.body
            const database = getDatabaseFromRole(role)
            if (database) {
                try {
                    const isUserExits = await userExits(userID, database)
                    if (isUserExits) {
                        const updatedAccessToken = await updateUserInformation(userID, data, database, role)
                        if (updatedAccessToken) {
                            res.json({
                                status: 201,
                                message: "Profile Information Updated",
                                accessToken: updatedAccessToken
                            })
                        } else {
                            res.json({
                                status: 409,
                                statusCode: "UNABLE_TO_UPDATE",
                                message: "Unable To Update Profile"
                            })
                        }
                    } else {
                        res.json({
                            status: 400,
                            message: "Bad Request: Invalid User ID"
                        })
                    }
                } catch (error) {
                    res.json({
                        status: 500,
                        message: "Internal Server Error"
                    })
                }
            } else {
                res.json({
                    status: 400,
                    message: "Invalid User Role"
                })
            }
            // } else {
            //     res.json({
            //         status: 409,
            //         statusCode: "USERNAME_EXISTS",
            //         message: "Username Already Exits !"
            //     })
            // }
        } catch (error) {
            logger.error(error)
            res.json({
                status: 500,
                message: "Something Went Wrong !"
            });
        }
    }
})

router.post("/change-password", async (req, res) => {
    if (!req.body.role || !req.body.userID || !req.body.password || !req.body.confirmPassword || !req.body.oldPassword) {
        console.log(req.body)
        res.json({
            status: 400,
            message: "Bad Request !"
        });
    } else {
        try {
            const validPassword = await authPassword(req.body.userID, req.body.oldPassword, req.body.role)
            if (validPassword) {
                if (passwordMatch(req.body.password, req.body.confirmPassword)) {
                    const role = req.body.role
                    const userID = req.body.userID
                    const database = getDatabaseFromRole(role)
                    if (database) {
                        try {
                            const isUserExits = await userExits(userID, database)
                            if (isUserExits) {
                                const updated = await updatePassword(userID, req.body.password, database, role)
                                if (updated) {
                                    res.json({
                                        status: 201,
                                        message: "Password Updated !"
                                    })
                                } else {
                                    res.json({
                                        status: 409,
                                        statusCode: "UNABLE_TO_UPDATE",
                                        message: "Unable To Update Password"
                                    })
                                }
                            } else {
                                res.json({
                                    status: 400,
                                    message: "Bad Request: Invalid User ID"
                                })
                            }
                        } catch (error) {
                            res.json({
                                status: 500,
                                message: "Internal Server Error"
                            })
                        }
                    } else {
                        res.json({
                            status: 400,
                            message: "Invalid User Role"
                        })
                    }
                } else {
                    res.json({
                        status: 409,
                        statusCode: "PASSWORD_NOT_MATCH",
                        message: "Confirm Password doesn't match !"
                    })
                }
            } else {
                res.json({
                    status: 409,
                    statusCode: "OLD_PASSWORD_NOT_MATCH",
                    message: "Incorrect Password !"
                })
            }
        } catch (error) {
            logger.error(error)
            res.json({
                status: 500,
                message: "Something Went Wrong !"
            });
        }
    }
})

// Role Validation
function getDatabaseFromRole(role) {
    if (role === "admin") return Admin
    if (role === "company") return Company
    if (role === "manager") return Manager
    if (role === "customer") return Customer
    if (role === "vendor") return vendor
    if (role === "technical staff") return Technical_Staff

    return null
}

// Getting user from database
async function userExits(userID, database) {
    return await database.exists({ _id: userID })
}

async function isUsernameExits(username, userID) {
    const adminUsernameOwner = await Admin.findOne({ username: username })
    const companyUsernameOwner = await Company.findOne({ username: username })
    const managerUsernameOwner = await Manager.findOne({ username: username })
    const customerUsernameOwner = await Customer.findOne({ username: username })
    const vendorUsername = await vendor.findOne({ username: username })
    const technicalUsername = await Technical_Staff.findOne({ username: username })



    if (adminUsernameOwner) {
        return adminUsernameOwner._id.toString() !== userID
    }
    if (companyUsernameOwner) {
        return companyUsernameOwner._id.toString() !== userID
    }
    if (managerUsernameOwner) {
        return managerUsernameOwner._id.toString() !== userID
    }
    if (customerUsernameOwner) {
        return customerUsernameOwner._id.toString() !== userID
    }
    if (vendorUsername) {
        return vendorUsername._id.toString() !== userID
    }
    if (technicalUsername) {
        return technicalUsername._id.toString() !== userID
    }

}

// TO Update User Profile Information
async function updateUserInformation(userID, data, database, role) {
    if (role === "admin") {
        const user = await database.findOne({ _id: userID });
        try {
            const res = await database.updateOne({ _id: userID }, {
                $set: {
                    username: data.username ? data.username : user.username,
                    firstname: data.firstname ? data.firstname : user.firstname,
                    lastname: data.lastname ? data.lastname : user.lastname,
                    timezone: data.timezone ? data.timezone : user.timezone,
                }
            })

            const updatedUser = await database.findOne({ _id: userID });
            const tokenInfo = {
                id: updatedUser._id,
                role: updatedUser.role,
                username: updatedUser.username,
                firstname: updatedUser.firstname,
                lastname: updatedUser.lastname,
                timezone: updatedUser.timezone,
                email: updatedUser.email,
                profile: updatedUser?.profile
            }
            try {
                const data = {
                    adminName: updatedUser.firstname,

                }
                const options = Email.generateOptions(updatedUser.email, "SUPER_ADMIN_PROFILE_UPDATE", data);
                const isEmailSent = await Email.send(options);
            } catch (error) {
                logger.error(error)
            }
            return generateAccessToken(tokenInfo)
        } catch (error) {
            logger.error(error)
            return undefined
        }
    }

    if (role === "company") {
        const user = await database.findOne({ _id: userID });
        try {
            const res = await database.updateOne({ _id: userID }, {
                $set: {
                    username: data.username ? data.username : user.username,
                    name: data.companyName ? data.companyName : user.name,
                    ownerFirstName: data.firstname ? data.firstname : user.ownerFirstName,
                    ownerLastName: data.lastname ? data.lastname : user.ownerLastName,
                    timezone: data.timezone ? data.timezone : user.timezone,
                }
            })
            const updatedUser = await database.findOne({ _id: userID });
            const tokenInfo = {
                role: updatedUser.role,
                username: updatedUser.username,
                timezone: updatedUser.timezone,
                id: updatedUser._id,
                email: updatedUser.email,
                domain: updatedUser.domain,
                company: updatedUser.name,
                owner: updatedUser.owner,
                firstname: updatedUser.ownerFirstName,
                lastname: updatedUser.ownerLastName,
                profile: updatedUser.profile
            }
            try {
                const data = {
                    owner: updatedUser.ownerFirstName,
                    companyName: updatedUser.name
                }
                const options = Email.generateOptions(updatedUser.email, "COMPANY_PROFILE_UPDATE", data);
                const isEmailSent = await Email.send(options);
            } catch (error) {
                logger.error(error)
            }
            return generateAccessToken(tokenInfo)
        } catch (error) {
            logger.error(error)
            return undefined
        }
    }

    if (role === "manager") {

        const user = await database.findOne({ _id: userID });
        try {
            const res = await database.updateOne({ _id: userID }, {
                $set: {
                    username: data.username ? data.username : user.username,
                    name: data.managerName ? data.managerName : user.name,
                    firstname: data.firstname ? data.firstname : user.firstname,
                    lastname: data.lastname ? data.lastname : user.lastname,
                    timezone: data.timezone ? data.timezone : user.timezone,
                }
            })
            const updatedUser = await database.findOne({ _id: userID });
            const tokenInfo = {
                role: updatedUser.role,
                username: updatedUser.username,
                timezone: updatedUser.timezone,
                id: updatedUser._id,
                email: updatedUser.email,
                managerOf: updatedUser.companyAssigned,
                firstname: updatedUser.firstname,
                lastname: updatedUser.lastname,
                profile: updatedUser.profile
            }
            try {
                const company = await Company.findOne({ _id: user.companyID })
                const data = {
                    managerName: updatedUser.firstname,
                    companyName: company.name,
                    logo:company?.logo
                }
                const options = Email.generateOptions(updatedUser.email, "PROPERTY_MANAGER_PROFILE_UPDATE", data);
                const isEmailSent = await Email.send(options);
            } catch (error) {
                logger.error(error)
            }

            return generateAccessToken(tokenInfo)
        } catch (error) {
            logger.error(error)
            return undefined
        }
    }

    if (role === "customer") {
        const user = await database.findOne({ _id: userID });
        try {
            const res = await database.updateOne({ _id: userID }, {
                $set: {
                    username: data.username ? data.username : user.username,
                    firstname: data.firstname ? data.firstname : user.firstname,
                    lastname: data.lastname ? data.lastname : user.lastname,
                    timezone: data.timezone ? data.timezone : user.timezone,
                }
            })

            const updatedUser = await database.findOne({ _id: userID });

            let company = await Properties.findOne({ _id: updatedUser.properties[0] })


            const tokenInfo = {
                role: updatedUser.role,
                id: updatedUser._id,
                email: updatedUser.email,
                properties: updatedUser.properties,
                firstname: updatedUser.firstname,
                lastname: updatedUser.lastname,
                mobile: updatedUser.mobile,
                companyId: company.companyID,
                profile: updatedUser.profile,
                username: updatedUser.username

            }


            try {
                const data = {
                    managerName: updatedUser.firstname,
                    companyName: company.name,
                    
                }
                const options = Email.generateOptions(updatedUser.email, "PROPERTY_MANAGER_PROFILE_UPDATE", data);
                const isEmailSent = await Email.send(options);
            } catch (error) {
                logger.error(error)
                console.log(error)
            }

            return generateAccessToken(tokenInfo)
        } catch (error) {
            logger.error(error)
            return undefined
        }
    }

    if (role === "vendor") {

        const user = await database.findOne({ _id: userID });
        try {
            const res = await database.updateOne({ _id: userID }, {
                $set: {
                    username: data.username ? data.username : user.username,
                    first_name: data.firstname ? data.firstname : user.firstname,
                    last_name: data.lastname ? data.lastname : user.lastname,
                    timezone: data.timezone ? data.timezone : user.timezone,
                }
            })

            const updatedUser = await database.findOne({ _id: userID });

            const tokenInfo = {
                role: updatedUser.role,
                id: updatedUser._id,
                email: updatedUser.email,
                firstname: updatedUser.first_name,
                lastname: updatedUser.last_name,
                profile: updatedUser.profile,
                username: updatedUser.username
            }
            try {
                const data = {
                    managerName: updatedUser.firstname,
                    companyName: "RentigiCare",
                }
                const options = Email.generateOptions(updatedUser.email, "PROPERTY_MANAGER_PROFILE_UPDATE", data);
                const isEmailSent = await Email.send(options);
            } catch (error) {
                logger.error(error)
            }

            return generateAccessToken(tokenInfo)
        } catch (error) {
            logger.error(error)
            return undefined
        }


    }

    if (role === "technical staff") {

        const user = await database.findOne({ _id: userID });
        try {
            const res = await database.updateOne({ _id: userID }, {
                $set: {
                    username: data.username ? data.username : user.username,
                    first_name: data.firstname ? data.firstname : user.firstname,
                    last_name: data.lastname ? data.lastname : user.lastname,
                    timezone: data.timezone ? data.timezone : user.timezone,
                }
            })

            const updatedUser = await database.findOne({ _id: userID });

            const tokenInfo = {
                role: "technical staff",
                id: updatedUser._id,
                email: updatedUser.email,
                firstname: updatedUser.first_name,
                lastname: updatedUser.last_name,
                profile: updatedUser.profile,
                username: updatedUser.username
            }
            try {
                const data = {
                    managerName: updatedUser.firstname,
                    companyName: "RentigiCare",
                }
                const options = Email.generateOptions(updatedUser.email, "PROPERTY_MANAGER_PROFILE_UPDATE", data);
                const isEmailSent = await Email.send(options);
            } catch (error) {
                logger.error(error)
            }

            return generateAccessToken(tokenInfo)
        } catch (error) {
            logger.error(error)
            return undefined
        }


    }
    return false
}

// For Password change
function passwordMatch(password, confirmPassword) {
    return password === confirmPassword
}

async function authPassword(userID, password, role) {
    const database = getDatabaseFromRole(role)
    try {
        const user = await database.findOne({ _id: userID })
        const hashMatch = bcrypt.compareSync(password, user.password);
        return !!hashMatch;
    } catch (error) {
        logger.error(error)
        return false
    }
}

// Update password for user
async function updatePassword(userID, password, database, role) {
    const hashedPassword = hashPassword(password);
    try {
        const res = await database.updateOne({ _id: userID }, {
            $set: {
                password: hashedPassword
            }
        })

        if (role === "admin") {
            try {
                const user = await database.findOne({ _id: userID })
                const data = {
                    adminName: user.firstname,
                }
                const options = Email.generateOptions(user.email, "SUPER_ADMIN_PASSWORD_CHANGE", data);
                const isEmailSent = await Email.send(options);
            } catch (error) {
                logger.error(error)
            }

        }

        if (role === "company") {
            try {
                const user = await database.findOne({ _id: userID })
                const data = {
                    owner: user.ownerFirstName,
                    companyName: user.name,
                }
                const options = Email.generateOptions(user.email, "COMPANY_ACCOUNT_PASSWORD_CHANGE", data);
                const isEmailSent = await Email.send(options);
            } catch (error) {
                logger.error(error)
            }

        }

        if (role === "manager") {
            try {
                const user = await database.findOne({ _id: userID })
                const company = await Company.findOne({ _id: user.companyID })
                const data = {
                    managerName: user.firstname,
                    companyName: company.name,
                }
                const options = Email.generateOptions(user.email, "PROPERTY_MANAGER_PASSWORD_CHANGE", data);
                const isEmailSent = await Email.send(options);
            } catch (error) {
                logger.error(error)
            }
        }

        if (role === "customer") {
            try {
                const user = await database.findOne({ _id: userID })
                let company = await Properties.findOne({ _id: user.properties[0] })
                const data = {
                    managerName: user.firstname,
                    companyName: company.name,
                }
                const options = Email.generateOptions(user.email, "PROPERTY_MANAGER_PASSWORD_CHANGE", data);
                const isEmailSent = await Email.send(options);
            } catch (error) {
                logger.error(error)
            }
        }

        if (role === "vendor") {
            try {
                const user = await database.findOne({ _id: userID })
                const data = {
                    managerName: user.first_name,
                    companyName: "Rentigicare",
                }
                const options = Email.generateOptions(user.email, "PROPERTY_MANAGER_PASSWORD_CHANGE", data);
                const isEmailSent = await Email.send(options);
            } catch (error) {
                logger.error(error)
            }
        }

        if (role === "technical staff") {
            try {
                const user = await database.findOne({ _id: userID })
                const data = {
                    managerName: user.first_name,
                    companyName: "Rentigicare",
                }
                const options = Email.generateOptions(user.email, "PROPERTY_MANAGER_PASSWORD_CHANGE", data);
                const isEmailSent = await Email.send(options);
            } catch (error) {
                logger.error(error)
            }
        }

        return true
    } catch (error) {
        logger.error(error)
        return false
    }
}

// To Hash Password
function hashPassword(plainPassword) {
    const saltRounds = 10;
    return bcrypt.hashSync(plainPassword, saltRounds);
}

// TO generate new access token with updated information
// Middlewares
function generateAccessToken(tokenInfo) {
    return jwt.sign(tokenInfo, process.env.ACCESS_TOKEN_KEY, { expiresIn: '60m' })
}



// Uplaod Documents for property
router.post('/upload-documents', upload.array('file', 10), async (req, res) => {
    try {
        if (req.files?.[0]) {
            if (req.headers.role == "company") {
                const filename = req.files[0].filename;
                let pathTO = req.files[0].path
                await uploadTicketDocumentsToS3(process.env.DO_SPACES_NAME, filename, pathTO, 'profile/company');
                const filePath = `${process.env.BUCKET_URL}profile/company/${filename}`;
                const result = await Company.findOneAndUpdate({ _id: req.headers.id },
                    {
                        profile: filePath,

                    })
            }

            if (req.headers.role == "manager") {
                const filename = req.files[0].filename;
                let pathTO = req.files[0].path
                await uploadTicketDocumentsToS3(process.env.DO_SPACES_NAME, filename, pathTO, 'profile/manager');
                const filePath = `${process.env.BUCKET_URL}profile/manager/${filename}`;
                const result = await Manager.findOneAndUpdate({ _id: req.headers.id },
                    {
                        profile: filePath,

                    })
            }

            if (req.headers.role == "customer") {
                const filename = req.files[0].filename;
                let pathTO = req.files[0].path
                await uploadTicketDocumentsToS3(process.env.DO_SPACES_NAME, filename, pathTO, 'profile/customer');
                const filePath = `${process.env.BUCKET_URL}profile/customer/${filename}`;
                const result = await Customer.findOneAndUpdate({ _id: req.headers.id },
                    {
                        profile: filePath,

                    })
            }
            if (req.headers.role == "vendor") {
                const filename = req.files[0].filename;
                let pathTO = req.files[0].path
                await uploadTicketDocumentsToS3(process.env.DO_SPACES_NAME, filename, pathTO, 'profile/vendor');
                const filePath = `${process.env.BUCKET_URL}profile/vendor/${filename}`;
                const result = await vendor.findOneAndUpdate({ _id: req.headers.id },
                    {
                        profile: filePath,

                    })
            }
            if (req.headers.role == "technical staff") {
                const filename = req.files[0].filename;
                let pathTO = req.files[0].path
                await uploadTicketDocumentsToS3(process.env.DO_SPACES_NAME, filename, pathTO, 'profile/technical_staff');
                const filePath = `${process.env.BUCKET_URL}profile/technical_staff/${filename}`;
                const result = await Technical_Staff.findOneAndUpdate({ _id: req.headers.id },
                    {
                        profile: filePath,

                    })
            }

            if (req.headers.role == "admin") {

                const filename = req.files[0].filename;
                let pathTO = req.files[0].path
                await uploadTicketDocumentsToS3(process.env.DO_SPACES_NAME, filename, pathTO, 'profile/admin');
                const filePath = `${process.env.BUCKET_URL}profile/admin/${filename}`;
                const result = await Admin.findOneAndUpdate({ _id: req.headers.id },
                    {
                        profile: filePath,

                    })
            }

        } else {
            if (req.headers.role == "company") {
                const result = await Company.findOneAndUpdate({ _id: req.headers.id },
                    {
                        profile: ``,

                    })
            }

            if (req.headers.role == "manager") {
                const result = await Manager.findOneAndUpdate({ _id: req.headers.id },
                    {
                        profile: ``,

                    })
            }

            if (req.headers.role == "customer") {
                const result = await Customer.findOneAndUpdate({ _id: req.headers.id },
                    {
                        profile: ``,

                    })
            }
            if (req.headers.role == "vendor") {
                const result = await vendor.findOneAndUpdate({ _id: req.headers.id },
                    {
                        profile: ``,

                    })
            }
            if (req.headers.role == "technical staff") {
                const result = await Technical_Staff.findOneAndUpdate({ _id: req.headers.id },
                    {
                        profile: ``,

                    })
            }
            if (req.headers.role == "admin") {
                const result = await Admin.findOneAndUpdate({ _id: req.headers.id },
                    {
                        profile: ``,

                    })
            }
        }
        res.json({
            status: 201,
            message: "Successfully uploaded !",
        });
    } catch (error) {
        logger.error(error)
        console.log(error)
        res.json({
            status: 500,
            message: "Something Went Wrong"
        })
    }
})

// upload document for customer
router.post('/upload-docs-customer', upload.array('file', 10), async (req, res) => {
    try {
        if (req.files.length > 0) {
            let file = []
            req.files.forEach((element) => {
                file.push(`document/${req.headers.role}/${req.headers.id}.${element.originalname.split(".")[1]}`)
            });
            const result = await Customer.findOneAndUpdate({ _id: req.headers.id },
                {
                    document: file,
                })
            res.json({
                status: 201,
                message: "Successfully uploaded !",
            });
        }
    } catch (e) {
        logger.error(error)
        console.log(error)
        res.json({
            status: 500,
            message: "Something Went Wrong"
        })
    }
});


module.exports = router;