require("dotenv").config();
const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const logger = require("../Logger/LoggerFactory").getProductionLogger();

const COMPANY_ROLE = "company";
const MANAGER_ROLE = "manager";
const CUSTOMER_ROLE = "customer";
const VENDOR_ROLE = "vendor";
const TECHNICAL_STAFF_ROLE = "technical staff";

// Importing Database model
const Company = require("../Database/Company");
const Customer = require("../Database/Customer");
const Properties = require("../Database/Property");
const Manager = require("../Database/PropertyManager");
const Vendor = require("../Database/vendor");
const Technical_Staff = require("../Database/Technical_Staff");
const crypto = require("crypto");
const Admin = require("../Database/Admin");
const Email = require("../utils/Email");

let jwtInformation = {};
let verificationCodeToken = "";
// Post Company Login
router.post("/", async (req, res) => {
  const email = req.body.email.toLowerCase().toString();
  const password = req.body.password;

  try {
    // Authenticate Company
    const isLoggedIn = await login(email, password);
    if (isLoggedIn === "2FA") {
      res.json({
        status: "200",
        message: "Verification Code Sent To Email",
        verificationCodeToken: verificationCodeToken,
      });
    } else if (isLoggedIn === true) {
      const accessToken = generateAccessToken(jwtInformation);
      res.status(200).json({
        status: 200,
        message: "Logged in successfully",
        accessToken: accessToken,
        jwtInformation,
      });
    } else {
      res.status(401).json({
        status: 401,
        message: "Invalid Credentials !",
      });
    }
  } catch (error) {
    console.log(error);

    logger.error(error);
    res.json({
      status: 500,
      message: error.message,
    });
  }
});

module.exports = router;

// API Helper Functions
async function login(email, password) {
  const companyExits = await Company.exists({ email: email });
  const customerExits = await Customer.exists({ email: email });
  const managerExits = await Manager.exists({ email: email });
  const technicalStaffExists = await Technical_Staff.exists({ email: email });
  const vendorExists = await Vendor.exists({ email: email });

  if (companyExits)
    return await loginValidation(email, password, Company, COMPANY_ROLE);
  if (managerExits)
    return await loginValidation(email, password, Manager, MANAGER_ROLE);
  if (customerExits)
    return await loginValidation(email, password, Customer, CUSTOMER_ROLE);
  if (technicalStaffExists)
    return await loginValidation(
      email,
      password,
      Technical_Staff,
      TECHNICAL_STAFF_ROLE
    );
  if (vendorExists)
    return await loginValidation(email, password, Vendor, VENDOR_ROLE);

  return false;
}

async function loginValidation(email, password, database, role) {
  const user = await database.findOne({ email: email });

  const hashMatch = bcrypt.compareSync(password, user.password);

  if (hashMatch) {
    if (user.twoFactorEnabled) {
      const code = Math.floor(100000 + Math.random() * 900000);
      const codeExpireTime = Date.now() + 120000;
      const generatedVerificationCodeToken = crypto
        .randomBytes(20)
        .toString("hex");
      const updateInfo = await database.updateOne(
        { email: email },
        {
          $set: {
            verificationCode: code,
            codeExpireTime: codeExpireTime,
            verificationCodeToken: generatedVerificationCodeToken,
          },
        }
      );
      verificationCodeToken = generatedVerificationCodeToken;
      const updatedUser = await database.findOne({ email: email });
      let link =
        `${process.env.DOMAIN}` +
        "/twoFA?tkn=" +
        updatedUser.verificationCodeToken;
      const data = {
        verificationCode: code,
        verificationLink: link,
      };
      const options = Email.generateOptions(email, "SEND_LOGIN_OTP", data);
      const emailSent = Email.send(options);
      return "2FA";
    } else {
      await updateLoginTime(user, database);
      if (role === COMPANY_ROLE) {
        jwtInformation = {
          role: COMPANY_ROLE,
          username: user.username,
          timezone: user.timezone,
          id: user._id,
          email: email,
          domain: user.domain,
          company: user.name,
          owner: user.owner,
          firstname: user.ownerFirstName,
          lastname: user.ownerLastName,
          profile: user.profile,
        };
      }

      // if(role === MANAGER_ROLE) {
      //     jwtInformation = { role: MANAGER_ROLE, username: user.username, timezone: user.timezone, id: user._id, name: user.name, email: email, managerOf: user.companyAssigned, firstname: user.firstname, lastname: user.lastname}
      // }

      // // TODO full data for Customer
      // if(role === CUSTOMER_ROLE){
      //     jwtInformation = {role: CUSTOMER_ROLE, id: user._id,  email: user.email}
      // }
      // return true
    }

    if (role === MANAGER_ROLE) {
      jwtInformation = {
        role: MANAGER_ROLE,
        username: user.username,
        timezone: user.timezone,
        id: user._id,
        name: user.name,
        email: email,
        managerOf: user.companyAssigned,
        firstname: user.firstname,
        lastname: user.lastname,
        properties: user.properties,
        companyId: user.companyID,
        applicationPrivilege: user.applicationPrivilege,
        ticketPrivilege: user.ticketPrivilege,
        profile: user.profile,
        calendarPrivilege:user.calendarPrivilege,
      };
    }

    // TODO full data for Customer
    if (role === CUSTOMER_ROLE) {
      let company = await Properties.findOne({ _id: user.properties[0] });

      jwtInformation = {
        role: CUSTOMER_ROLE,
        id: user._id,
        email: user.email,
        properties: user.properties,
        firstname: user.firstname,
        lastname: user.lastname,
        mobile: user.mobile,
        companyId: company.companyID,
        profile: user.profile,
        username: user.username,
      };
    }

    if (role === TECHNICAL_STAFF_ROLE) {
      if (!["Rejected", "Suspended"].includes(user.status)) {
        jwtInformation = {
          role: TECHNICAL_STAFF_ROLE,
          id: user._id,
          email: user.email,
          firstname: user.first_name,
          lastname: user.last_name,
          profile: user.profile,
          username: user.username,
        };
      } else {
        throw new Error(`User account is ${user.status} contact your admin.`);
      }
    }

    if (role === VENDOR_ROLE) {
      if (!["Rejected", "Suspended"].includes(user.status)) {
        jwtInformation = {
          role: VENDOR_ROLE,
          id: user._id,
          email: user.email,
          firstname: user.first_name,
          lastname: user.last_name,
          profile: user.profile,
          username: user.username,
        };
      } else {
        throw new Error(`User account is ${user.status} contact your admin.`);
      }
    }
    return true;
  }
  return false;
}

async function updateLoginTime(user, database) {
  await database.updateOne(
    { email: user.email },
    { $push: { loginTime: Date.now() } }
  );
}

// Middlewares
function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_KEY, { expiresIn: "60m" });
}
