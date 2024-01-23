const router = require("express").Router()
const Admin = require("../Database/Admin")
const jwt = require("jsonwebtoken");
const Company = require("../Database/Company");
const Customer = require("../Database/Customer");
const Manager = require("../Database/PropertyManager");
const Email = require("../utils/Email");

router.post("/login", async(req, res) => {
    console.log(req.body);
    try {
        const information = await getDatabaseWithRole(req.body.email)
        const database = information[0]
        const role = information[1]
        console.log(information)
        if(database){
            let user = await database.findOne({verificationCodeToken: req.body.verificationToken, codeExpireTime: {$gt: Date.now()}});
            if (user) {
                if(user.verificationCode === req.body.verificationCode){
                    const updateInfo  = await database.updateOne({verificationCodeToken: req.body.verificationToken,}, { $set:{
                            verificationCode: null,
                            codeExpireTime: null,
                            verificationCodeToken: null
                        }
                    });

                    let accessToken = ""
                    if(role === "admin"){
                        const data = {
                            id: user._id,
                            role: user.role,
                            username: user.username,
                            firstname: user.firstname,
                            lastname: user.lastname,
                            timezone: user.timezone,
                            email: user.email
                        }

                        accessToken = generateAccessToken(data)
                    }

                    if(role === "company"){
                        const data = { role: "company",
                            username: user.username,
                            timezone: user.timezone,
                            id: user._id,
                            email: user.email,
                            domain: user.domain,
                            company: user.name,
                            owner: user.owner,
                            firstname: user.ownerFirstName,
                            lastname: user.ownerLastName
                        }
                        accessToken = generateAccessToken(data)
                    }

                    if(role === "manager"){
                        const data = {
                            role: "manager",
                            username: user.username,
                            timezone: user.timezone,
                            id: user._id,
                            name: user.name,
                            email: user.email,
                            managerOf: user.companyAssigned,
                            firstname: user.firstname,
                            lastname: user.lastname
                        }
                        accessToken = generateAccessToken(data)
                    }

                    if(role === "customer"){
                        const data = {
                            role: "customer",
                            id: user._id,
                            email: user.email
                        }
                        accessToken = generateAccessToken(data)
                    }

                    res.status(200).json({
                        status: 200,
                        role: req.body.role,
                        message: "Logged in successfully",
                        accessToken: accessToken
                    });

                }else{
                    res.json({
                        status: 401,
                        message: "Invalid verification Code"
                    })
                }
            } else {
                res.status(201).send({ message: "Verification Token is invalid or expired", status: false });
            }
        }else{
            res.json({
                status: 404,
                message: "Account and Role not found !"
            })
        }

    } catch (err) {
        res.status(400).send({ message: err.message, status: false });
    }
})

// Middlewares
function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_KEY, {expiresIn: '60m' })
}

router.post("/enable", async(req, res) => {
    try{
        const database = await getDatabase(req.body.email, req.body.role);
        if(database){
            const account = await database.findOne({email: req.body.email});
            if(account){
                const updateRes = await database.updateOne( {email: req.body.email}, {
                    $set:{
                        twoFactorEnabled: true
                    }
                })
                res.json({
                    status: 200,
                    message: "Two Factor Authentication Enabled"
                })
            }else{
                res.json({
                    status: 400,
                    message: "Bad Request: Email or Account not found"
                })
            }
        }else{
            res.json({
                status: 404,
                message: "Account not Found !"
            })
        }
    }catch(error){
        res.json({
            status: 500,
            message: " Something Went Wrong"
        })
    }
})

router.post("/disable-link", async(req, res) => {
    try{
        const database = await getDatabase(req.body.email, req.body .role)
        if(database){
            const account = await database.findOne({email: req.body.email});
            if(account){
                const code = Math.floor(100000 + Math.random() * 900000);
                const updateRes = await database.updateOne({email: req.body.email}, {
                    $set: {
                        disableCode: code
                    }
                })
                const data = {
                    disableCode: code,
                }

                const options = Email.generateOptions(req.body.email, "DISABLE_2FA",  data)
                const emailSent  = Email.send(options)
                res.json({
                    status: 200,
                    message: "Disable Code Sent To Email"
                })
            }else{
                res.json({
                    status: 400,
                    message: "Bad Request: Email or Account not found"
                })
            }
        }else{
            res.json({
                status: 404,
                message: "Account not Found !"
            })
        }

    }catch(error){
        console.log(error)
        res.json({
            status: 500,
            message: " Something Went Wrong"
        })
    }
})

router.post("/disable", async(req, res) => {
    try{
        const database = await getDatabase(req.body.email, req.body.role)
        if(database){
            const account = await database.findOne({email: req.body.email});
            if(account){
                if(account.disableCode === req.body.disableCode){
                    const updateRes = await database.updateOne({email: req.body.email}, {
                        $set: {
                            twoFactorEnabled: false,
                            disableCode: null
                        }
                    })
                    res.json({
                        status: 200,
                        message: "Successfully Disabled Two Factor Authentication"
                    })
                }else{
                    res.json({
                        status: 401,
                        message: "Disable Code Expired or Invalid"
                    })
                }

            }else{
                res.json({
                    status: 400,
                    message: "Bad Request: Email or Account not found"
                })
            }

        }else{
            res.json({
                status: 404,
                message: "Account not Found !"
            })
        }

    }catch(error){
        console.log(error)
        res.json({
            status: 500,
            message: "Something Went Wrong"
        })
    }
})

// API Helper Functions
async function getDatabase(email, role) {
    if(role === "admin"){
        if(await Admin.exists({ email: email })) return Admin
    }

    if(role === "company"){
        if(await Company.exists({ email: email })) return Company
    }

    if(role === "manager"){
        if(await Manager.exists({email: email})) return Manager
    }

    if(role === "customer"){
        if(await Customer.exists({ email: email })) return Customer
    }

    return false;
}

async function getDatabaseWithRole(email){
    const adminExits = await Admin.exists({ email: email });
    const companyExits = await Company.exists({ email: email });
    const customerExits = await Customer.exists({ email: email });
    const managerExits = await Manager.exists({email: email});

    if(adminExits) return [Admin, "admin"]
    if(companyExits) return [Company, "company"];
    if(managerExits) return [Manager, "manager"]
    if(customerExits) return [Customer, "customer"];
    return [false, null];
}


module.exports = router