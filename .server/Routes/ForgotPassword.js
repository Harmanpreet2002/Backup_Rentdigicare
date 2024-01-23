const router = require("express").Router()
const bcrypt = require("bcrypt");
const logger = require("../Logger/LoggerFactory").getProductionLogger()

// Modules
const Email = require("../utils/Email")

// Importing Database model
const Admin = require("../Database/Admin")
const Company = require("../Database/Company")
const Manager = require("../Database/PropertyManager")
const Customer = require("../Database/Customer");
const Property = require("../Database/Property");
const Vendor = require("../Database/vendor");
const Technical_Staff = require("../Database/Technical_Staff");


// TODO Apply JWT

// Generate Reset Password Link
router.post("/reset-link", async (req, res) => {
    const email = req.body.email;
    if (!email) {
        res.json({
            status: 409,
            message: "Email not Provided !"
        });
    } else {
        // getting Database by checking account in db by email
        const [database, role] = await getUserDatabase("email", email);
        console.log(database)
        if (database) {
            database.findOne({ email: email })
                .then(user => {

                    // console.log(user)

                    //Generate and set password reset token
                   const otp = user.generatePasswordReset();
             
                    // Save the updated user object
                    user.save()
                        .then(async (user) => {
                            // send email
                            let link = `${process.env.DOMAIN_FORGOT_PASSWORD}` + "/reset_password?tkn=" + user.resetPasswordToken;
                            
                            // TODO send rest Email
                            try {
                                console.log('role: ', role);
                                const options = await getResetLinkEmailOptions(role, user, link)
                                console.log('options: ', options);
                                const isEmailSent = await Email.send(options)
                                if (isEmailSent) {
                                    res.json({
                                        status: 200,
                                        message: "Rest Password Link Sent !"
                                    })
                                } else {
                                    res.json({
                                        status: 400,
                                        message: "Trouble Sending Reset Link !"
                                    })
                                }
                            } catch (error) {
                                logger.error(error)

                            }
                        }).catch(err => res.status(500).json({ message: err.message }));
                })
                .catch(err => res.status(500).json({ message: err.message }));
        } else {
            res.json({
                status: 400,
                message: "User Doesn't exits !"
            });
        }
    }
});

// Token check API
router.post("/check_token", async (req, res) => {
    if (!req.body.resetToken) {
        res.json({
            status: 401,
            message: 'Password reset token is invalid or has expired.'
        });
    } else {
        const token = req.body.resetToken
        const [database, role] = await getUserDatabase("token", token);
        console.log(database)
        if (database) {
            database.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } })
                .then((user) => {
                    if (!user) {
                        return res.json({
                            status: 401,
                            message: 'Password reset token is invalid or has expired.'
                        });
                    }
                    res.json({
                        status: 200,
                        message: "Token Is Valid !"
                    })

                });
        } else {
            res.json({
                status: 401,
                message: 'Password reset token is invalid or has expired.'
            });
        }
    }
})

// Reset Password
router.post("/reset", async (req, res) => {
    if (!req.body.resetToken) {
        res.json({
            status: 401,
            message: 'Password reset token is invalid or has expired.'
        });
    } else if (!req.body.password) {
        res.json({
            status: 400,
            message: 'Bad Request !'
        });
    } else {
        const token = req.body.resetToken
        const [database, role] = await getUserDatabase("token", token);
        if (database) {
            database.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } })
                .then((user) => {
                    if (!user) {
                        return res.json({
                            status: 401,
                            message: 'Password reset token is invalid or has expired.'
                        });
                    }

                    //Set the new password
                    user.password = hashPassword(req.body.password);
                    user.resetPasswordToken = undefined;
                    user.resetPasswordExpires = undefined;

                    // Save
                    user.save(async (err) => {
                        if (err) {
                            logger.error(err)
                            return res.json({
                                status: 500,
                                message: "Something went wrong !"
                            });
                        }

                        // TODO Send Email
                        const options = await getPasswordChangedEmailOption(role, user);
                        const isEmailSent = await Email.send(options);

                        res.json({
                            status: 200,
                            message: "Password Changed !"
                        })
                    });
                });
        } else {
            res.json({
                status: 401,
                message: 'Password reset token is invalid or has expired.'
            });
        }

    }
});

// Get User Home Database
async function getUserDatabase(filter, value) {
    if (filter === "email") {
        if (await Admin.exists({ email: value })) return [Admin, "admin"]
        if (await Company.exists({ email: value })) return [Company, "company"]
        if (await Technical_Staff.exists({ email: value })) return [Technical_Staff, "technical_staff"]
        if (await Manager.exists({ email: value })) return [Manager, "manager"]
        if (await Customer.exists({ email: value })) return [Customer, "customer"]
        if (await Vendor.exists({ email: value })) return [Vendor, "vendor"]
    }

    if (filter === "token") {
        if (await Admin.exists({ resetPasswordToken: value })) return [Admin, "admin"]
        if (await Company.exists({ resetPasswordToken: value })) return [Company, "company"]
        if (await Technical_Staff.exists({ resetPasswordToken: value })) return [Technical_Staff, "technical_staff"]
        if (await Manager.exists({ resetPasswordToken: value })) return [Manager, "manager"]
        if (await Customer.exists({ resetPasswordToken: value })) return [Customer, "customer"]
        if (await Vendor.exists({ resetPasswordToken: value })) return [Vendor, "vendor"]
    }

    if (filter === "otp") {
        if (await Customer.exists({ otp: value })) return [Customer, "customer"]
        if (await Vendor.exists({ otp: value })) return [Vendor, "vendor"]
        if (await Manager.exists({ otp: value })) return [Manager, "manager"]

    }

    return [undefined, undefined]
}

// Reset Password Email Data  or options
async function getResetLinkEmailOptions(role, user, link) {
    if (role === "admin") {
        const data = {
            adminName: user.firstname,
            email: user.email,
            resetLink: link
        }
        return Email.generateOptions(user.email, "SUPER_ADMIN_RESET_PASSWORD", data)
    }

    if (role === "company") {
        const data = {
            owner: user.ownerFirstName,
            email: user.email,
            companyName: user.name,
            resetLink: link
        }
        return Email.generateOptions(user.email, "COMPANY_RESET_PASSWORD_EMAIL", data)
    }

    if (role === "manager") {
        const company = await Company.findOne({ domain: user.companyAssigned });
        const data = {
            managerName: user.firstname,
            email: user.email,
            resetLink: link,
            companyName: company.name
        }
        return Email.generateOptions(user.email, "PROPERTY_MANAGER_RESET_PASSWORD", data)
    }

    if (role === "customer") {
        const property = await Property.findOne({ _id: { $in: user.properties } }, "companyDomain");
        const data = {
            managerName: user.firstname,
            email: user.email,
            resetLink: link,
            companyName: property.companyDomain
        }
        return Email.generateOptions(user.email, "PROPERTY_MANAGER_RESET_PASSWORD", data)
    }

    if (role === "technical_staff") {
        // const vendor = await Vendor.findOne({ domain: user.companyAssigned });
        const data = {
            managerName: user.first_name,
            email: user.email,
            resetLink: link,
            companyName: "Rentigicare"
        }
        return Email.generateOptions(user.email, "PROPERTY_MANAGER_RESET_PASSWORD", data)
    }

    if (role === "vendor") {
        // const vendor = await Vendor.findOne({ domain: user.companyAssigned });
        const data = {
            managerName: user.first_name,
            email: user.email,
            resetLink: link,
            companyName: user.agency_name
        }
        return Email.generateOptions(user.email, "PROPERTY_MANAGER_RESET_PASSWORD", data)
    }
}

// Email options for after changing email password
async function getPasswordChangedEmailOption(role, user) {
    if (role === "admin") {
        let data = {
            adminName: user.firstname,
        }
        return Email.generateOptions(user.email, "SUPER_ADMIN_PASSWORD_CHANGE", data)
    }

    if (role === "company") {
        let data = {
            owner: user.ownerFirstName,
            companyName: user.name,
        }
        return Email.generateOptions(user.email, "COMPANY_ACCOUNT_PASSWORD_CHANGE", data)
    }

    if (role === "manager") {
        const company = await Company.findOne({ domain: user.companyAssigned });
        let data = {
            managerName: user.firstname,
            companyName: company.name
        }
        return Email.generateOptions(user.email, "PROPERTY_MANAGER_PASSWORD_CHANGE", data)
    }

    if (role === "customer") {
        const property = await Property.findOne({ _id: { $in: user.properties } }, "companyDomain");
        const data = {
            managerName: user.firstname,
            companyName: property.companyDomain
        }
        return Email.generateOptions(user.email, "PROPERTY_MANAGER_PASSWORD_CHANGE", data)
    }

    if (role === "technical_staff") {
        const data = {
            managerName: user.first_name,
            companyName: "Rentigicare"
        }
        return Email.generateOptions(user.email, "PROPERTY_MANAGER_PASSWORD_CHANGE", data)
    }


    if (role === "vendor") {
        const data = {
            managerName: user.first_name,
            companyName: user.agency_name
        }
        return Email.generateOptions(user.email, "PROPERTY_MANAGER_PASSWORD_CHANGE", data)
    }
}

// Generating hash password to store 0n DB
function hashPassword(plainPassword) {
    const saltRounds = 10;
    return bcrypt.hashSync(plainPassword, saltRounds);
}


router.post("/get-otp", async (req, res) => {
    const email = req.body.email;
    if (!email) {
        res.json({
            status: 409,
            message: "Email not Provided !"
        });
    } else {
        const [database, role] = await getUserDatabase("email", email);
        if (database) {
            database.findOne({ email: email })
                .then(user => {
                    user.generateOTP();

                    // Save the updated user object
                    user.save()
                        .then(async (user) => {
                            try {
                                const options = await getResetLinkEmailOptions(role, user, user.otp)
                                const isEmailSent = await Email.send(options)
                                if (isEmailSent) {
                                    res.json({
                                        status: 200,
                                        message: "Rest Password Link Sent !"
                                    })
                                } else {
                                    res.json({
                                        status: 400,
                                        message: "Trouble Sending Reset Link !"
                                    })
                                }
                            } catch (error) {
                                logger.error(error)
                            }
                        }).catch(err => res.status(500).json({ message: err.message }));
                }).catch(err => res.status(500).json({ message: err.message }));
        } else {
            res.json({
                status: 400,
                message: "User Doesn't exits !"
            });
        }
    }

})


//VERIFY OTP
router.post("/verify-otp", async (req, res) => {
    if (!req.body.otp) {
        res.json({
            status: 401,
            message: 'OTP is not provided.'
        });

    } else {
        const otp = req.body.otp
        const [database, role] = await getUserDatabase("otp", otp);
        if (database) {
            database.findOne({ otp: otp, email: req.body.email })
                .then((user) => {
                    if (!user) {
                        return res.json({
                            status: 401,
                            message: 'Otp invalid or has expired.'
                        });
                    }

                    res.json({
                        status: 200,
                        message: "Valid OTP !"
                    })

                });
        } else {
            res.json({
                status: 401,
                message: 'Otp invalid or has expired.'
            });
        }

    }
});



//CHANGE PASSWORD
router.post("/change-password", async (req, res) => {
    if (!req.body.password) {
        res.json({
            status: 401,
            message: 'password is not provided'
        });
    } else {
        const password = req.body.password
        const [database, role] = await getUserDatabase("email", req.body.email);
        if (database) {
            database.findOne({ email: req.body.email })
                .then((user) => {
                    if (!user) {
                        return res.json({
                            status: 401,
                            message: 'something wend wrong.'
                        });
                    }

                    //Set the new password
                    user.password = hashPassword(req.body.password);
                    user.otp = undefined;

                    // Save
                    user.save(async (err) => {
                        if (err) {
                            logger.error(err)
                            return res.json({
                                status: 500,
                                message: "Something went wrong !"
                            });
                        }

                        // TODO Send Email
                        const options = await getPasswordChangedEmailOption(role, user);
                        const isEmailSent = await Email.send(options);

                        res.json({
                            status: 200,
                            message: "Password Changed !"
                        })
                    });
                });
        } else {
            res.json({
                status: 401,
                message: 'Password reset token is invalid or has expired.'
            });
        }

    }
});

module.exports = router;


