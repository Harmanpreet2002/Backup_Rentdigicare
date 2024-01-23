require("dotenv").config()
const router = require("express").Router()
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const Email = require("../utils/Email")

const logger = require("../Logger/LoggerFactory").getProductionLogger()

// Importing Database model
const Admin = require("../Database/Admin")
const crypto = require("crypto");

// Post Admin Login
router.post("/", async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
        res.json({
            status: 400,
            message: "Bad Request !"
        })
    } else {
        try {
            // Authenticate Admin
            const isLoggedIn = await loginAdmin(email, password)
            if (isLoggedIn[0]) {
                const admin = isLoggedIn[1]
                const isTwoFactorEnabled = admin.twoFactorEnabled
                if(isTwoFactorEnabled){
                    const code = Math.floor(100000 + Math.random() * 900000);
                    const codeExpireTime = Date.now() + 120000;
                    const verificationCodeToken = crypto.randomBytes(20).toString('hex');
                    const updateInfo = await Admin.updateOne({email: req.body.email}, {
                        $set: {
                            verificationCode: code,
                            codeExpireTime: codeExpireTime,
                            verificationCodeToken: verificationCodeToken
                        }
                    })
                    const updatedUser = await Admin.findOne({email: req.body.email})
                    let link = `${process.env.DOMAIN}` + "/twoFA?tkn=" + updatedUser.verificationCodeToken;
                    const data = {
                        verificationCode: code,
                        verificationLink: link,
                    }

                    const options = Email.generateOptions(req.body.email, "SEND_LOGIN_OTP",  data)
                    const emailSent  = Email.send(options)

                    res.json({
                        status: 200,
                        message: "Verification Sent !",
                        verificationCodeToken: verificationCodeToken
                    })
                }else{
                    const user = {
                        id: admin._id,
                        role: admin.role,
                        username: admin.username,
                        firstname: admin.firstname,
                        lastname: admin.lastname,
                        timezone: admin.timezone,
                        email: email,
                        profile: admin?.profile ?  admin?.profile : ''
                    }
                    console.log(user);
                    const accessToken = generateAccessToken(user)
                    res.status(200).json({
                        status: 200,
                        role: "admin",
                        message: "Logged in successfully",
                        accessToken: accessToken
                    });
                }
            } else {
                res.status(401).json({
                    status: "Error",
                    message: "Invalid Credentials !",
                    accessToken: false
                });
            }

        } catch (error) {
            logger.error(error)
            res.json({
                status: 500,
                message: "Something Went wrong !"
            })
        }
    }


});

// Todo: LogOut
router.post("/logout", (req, res) => {
    //TODO logout and update logout time
})

module.exports = router;

// Middlewares
function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_KEY, { expiresIn: '60m' })
}

// API Helper Functions
async function loginAdmin(email, password) {
    const adminExists = await Admin.exists({ email: email });
    if (adminExists) {
        const admin = await Admin.findOne({ email: email })
        const hashMatch = bcrypt.compareSync(password, admin.password);
        if (hashMatch) {
            await updateLoginTime(admin);
            return [true, admin];
        }
    }
    return [false, null];
}

// update login time of admin whenever logged in
async function updateLoginTime(admin) {
    await Admin.updateOne({ email: admin.email }, { $push: { loginTime: Date.now() } });
}

