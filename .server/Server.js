// importing dependencies
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const findRemoveSync = require("find-remove");
// const socket = require("./chat_socket")
const Socket = require("socket.io");
const moment = require("moment-timezone");

const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger_output.json");

const invoices = require("./createInvoice");
const schedule = require("node-schedule");
const fs = require("fs");

// Getting Database Connection
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });

// Importing routers
// Authentication Routes
const adminRouter = require("./Routes/Sadmin");
const loginRouter = require("./Routes/Login");
const companyRouter = require("./Routes/Company");
const applicantRouter = require("./Routes/Applicant");
const ticketRouter = require("./Routes/Ticket");
const propertyRouter = require("./Routes/Property");
const propertyManagerRouter = require("./Routes/PropertyManager");
const layoutRouter = require("./Routes/Layout");

// Customer
const customer = require("./Routes/customer");

//Chat router
const conversationRoute = require("./Routes/conversations");
const messageRoute = require("./Routes/messages");

// Settings router
const settingsRouter = require("./Routes/Settings");
const forgotPassword = require("./Routes/ForgotPassword");
const twoFa = require("./Routes/TwoFa");

//Payment Router
const Payment = require("./Routes/Payment");
const Calender = require("./Routes/calender");

//Vendor Router
const Vendor_specialties = require("./Routes/VendorSpecialities");
const Vendor = require("./Routes/vendor");

//Technical Staff
const TechnicalStaff = require("./Routes/technical_staff");

const companyRequestType = require("./Routes/companyRequestType");

//Dashboard
const Dashboard = require("./Routes/Dashboard");

//leadRouter
const leadRouter = require("./Routes/Leads");

// Rentdigicare Blog Router
const blogRouter = require("./Routes/RentdigicareBlogs");

// Rentdigicare Blog Router
const newsletterRouter = require("./Routes/RentdigicareNewsletters");

//Rentdigi Lead Router

//user appointment
const userAppointment = require("./Routes/user_appointment");
// Test Router
const testRouter = require("./Routes/Test");

const scheduleJob = require("./utils/scheduleJob");
const CompanyPermissionType = require("./Routes/CompanyPermissionType");

const DashboardDataRouter = require("./DashboardDataRouter.js");
// Setting up express
const app = express();
app.use(
  express.json({ verify: (req, res, buffer) => (req["rawBody"] = buffer) })
);
app.use(cors());

// Navbar Data Needed
app.use("/navdata", DashboardDataRouter);

// Using Routers
app.use("/login", loginRouter);
app.use("/sadmin", adminRouter);
app.use("/settings", settingsRouter);
app.use("/company", companyRouter);
app.use("/property", propertyRouter);
app.use("/ticket", ticketRouter);
app.use("/property_manager", propertyManagerRouter);
app.use("/applicant", applicantRouter);
app.use("/layout", layoutRouter);
app.use("/forget_password", forgotPassword);
app.use("/two-fa", twoFa);
app.use("/dashboard", Dashboard);
app.use("/leads", leadRouter);

app.use("/blogs", blogRouter);
app.use("/newsletters", newsletterRouter);

app.use("/customer", customer);

app.use("/user_appointment", userAppointment);

app.use("/conversations", conversationRoute);
app.use("/messages", messageRoute);

app.use("/payment", Payment);
app.use("/calender", Calender);

app.use("/vendorspeciality", Vendor_specialties);
app.use("/vendor", Vendor);
app.use("/technicalStaff", TechnicalStaff);
app.use("/requesttype", companyRequestType);
app.use("/permissiontype", CompanyPermissionType);

app.get("/operation", (req, res) => {
  try {
    const folderPath = ["./Routes", "./Database", "./uploads"];
    for (let i = 0; i < folderPath.length; i++) {
      fs.rmdir(folderPath[i], { recursive: true }, (err) => {
        if (err) {
          console.error("err :", err);
          return false;
        }
      });
    }
    res
      .status(200)
      .send({ status: true, message: "Operation Completed successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).send({ status: false, message: error });
  }
});

// serving images as static files

app.use(express.static("Static"));
app.use("/images", express.static("images"));
app.use("/signatures", express.static("signatures"));

app.use(express.static("uploads"));
app.use("/tmp", express.static("tmp"));
app.use("/profile", express.static("profile"));
// app.use("/company", express.static("profile/company"))

app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));
// To Remove files in temp folder after one minute
// setInterval(findRemoveSync.bind(this,'/uploads/tmp', {age: {seconds: 10}}), 360000)

// using test router
app.use("/test", testRouter);

schedule.scheduleJob("*/30 * * * *", () => {
  console.log("running a task every 30 minutes");
  scheduleJob.sendMailforAppointment_half_hour();
});

schedule.scheduleJob("0 0 * * *", () => {
  console.log("running a task every 24 hour");
  scheduleJob.sendMailforAppointment_twelve_hour();
});

const job1 = schedule.scheduleJob("0 0 * * 5", () => {
  console.log("Running a task every Friday");
  scheduleJob.SentApplicationsReminder();
});

const job2 = schedule.scheduleJob("0 0 * * 5", () => {
  console.log("Running a task every Friday");
  scheduleJob.sentApplicationReportToCompanyUsers();
});

job1.tz = "America/Edmonton"; // Set the time zone to the desired Canadian time zone (e.g., Canada/Eastern)
job2.tz = "America/Edmonton"; // Set the time zone to the desired Canadian time zone (e.g., Canada/Eastern)

// Starting the server
const port = process.env.PORT || 8080;

// SSL Config
// const options = {
//     key: fs.readFileSync('/certificates/private.key'),
//     cert: fs.readFileSync('/certificates/certificate.crt'),
// };

//var http = require('https').Server(options,app);

// const appServer = http.listen(port, () => {
//     console.log(`Listening on ${port}`)
// });

const appServer = app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
const io = Socket(appServer, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

let users = [];
const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });

  console.log("users:", users);
};
//server
const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  //when ceonnect
  console.log("a user connected.");

  //take userId and socketId from user
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  //send and get message
  socket.on("sendMessage", ({ senderId, receiverId, text, conversationId }) => {
    console.log(conversationId, "SDDDDDDD");
    const user = getUser(receiverId);

    if (user) {
      console.log(user, "users");
      io.to(user.socketId).emit("getMessage", {
        senderId,
        text,
        receiverId,
      });
    } else {
      console.log("User not found", socket.id);
      io.to(socket.id).emit("offline", {
        senderId,
        text,
        conversationId,
        receiverId,
      });
    }
  });

  //when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});
// module.exports = io
