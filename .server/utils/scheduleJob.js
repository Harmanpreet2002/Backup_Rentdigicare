const moment = require("moment");
const User_appointment = require("../Database/user_appointment");
const Company = require("../Database/Company");
const propertyManager = require("../Database/PropertyManager");
const Property = require("../Database/Property");
const Layout = require("../Database/Layout");
const Email = require("./Email");
const Applicants = require('../Database/Applicant')
const ObjectID = require("mongodb").ObjectId;

exports.send = async (options) => {
  try {
    console.log("lets check");
  } catch (e) {
    console.log(e);
  }
};

exports.sendMailforAppointment_half_hour = async () => {
  try {
    const currentTimestamp = Math.ceil(
      moment().subtract(30, "minutes").valueOf() / 1000
    );
    //console.log(currentTimestamp); // e.g. 1612615168236
    const halfAnHourFromNow = Math.ceil(
      moment().add(30, "minutes").valueOf() / 1000
    );
    //console.log(halfAnHourFromNow); // e.g. 1612618768236
    //1672992901
    const findSlot = await User_appointment.find({
      startTimeEpoch: {
        $gte: currentTimestamp,
        $lte: halfAnHourFromNow,
      },
      status: "booked",
    });
    let userData;
    console.log(findSlot);
    if (findSlot.length > 0) {
      findSlot.forEach(async (slot, index) => {
        if (slot.assignedToType == "manager") {
          userData = await propertyManager.findOne({
            _id: slot.eventAssignedTo,
          });
        } else if (slot.assignedToType == "company") {
          userData = await Company.findOne({
            _id: slot.eventAssignedTo,
          });
        }
        let property = await Property.findOne({
          _id: ObjectID(slot.propertyId),
        });
        let layout = await Layout.findOne({ _id: ObjectID(slot.layoutId) });
        const company = await Company.findOne({_id:property.companyID})
        let EmailData = {
          // applicantName: slot.name,
          date: moment(slot.date).format("DD-MM-YYYY"),
          startTime: slot.startTime,
          endTime: slot.endTime,
          companyDomain: slot.companyDomain,
          companyName: property?.company,
          property: property?.title,
          layout: layout?.layoutName,
          logo:company?.logo
        };
        if (slot.assignedToType == "manager") {
          EmailData.applicantName = userData?.firstname + ' ' + userData[0]?.lastname 
        } else if (slot.assignedToType == "company") {
          EmailData.applicantName = userData?.ownerName
        }
        let EmailDatauser = {
          applicantName: slot.name,
          date: moment(slot.date).format("DD-MM-YYYY"),
          startTime: slot.startTime,
          endTime: slot.endTime,
          companyDomain: slot.companyDomain,
          companyName: property?.company,
          property: property?.title,
          layout: layout?.layoutName,
          logo:company?.logo,
          id:slot._id,
        };
        const options = Email.generateOptions(
          [userData?.email],
          "REMINDER_APPOINTMENT_30_MINUTES",
          EmailData
        );
        const options1 = Email.generateOptions(
          [slot.email],
          "REMINDER_APPOINTMENT_30_MINUTES_TO_USER",
          EmailDatauser
        );
        const isEmailSent = await Email.send(options);
        const isEmailSent1 = await Email.send(options1);
        console.log("isEmailSent: ", isEmailSent);
        console.log("isEmailSent1: ", isEmailSent1);
      });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.sendMailforAppointment_twelve_hour = async () => {
  try {
    const currentTimestamp = Math.ceil(
      moment().add(12, "hour").valueOf() / 1000
    );
    const oneHourFromNow = Math.ceil(
      moment().add(12, "hour").add(30, "minutes").valueOf() / 1000
    );
    const findSlot = await User_appointment.find({
      startTimeEpoch: {
        $gte: currentTimestamp,
        $lte: oneHourFromNow,
      },
      status: "booked",
    });
    let userData;
    if (findSlot.length > 0) {
      findSlot.forEach(async (slot, index) => {
        if (slot.assignedToType == "manager") {
          userData = await propertyManager.findOne({
            _id: slot.eventAssignedTo,
          });
        } else if (slot.assignedToType == "company") {
          userData = await Company.findOne({
            _id: slot.eventAssignedTo,
          });
        }
        let property = await Property.findOne({
          _id: ObjectID(slot.propertyId),
        });
        let layout = await Layout.findOne({ _id: ObjectID(slot.layoutId) });
        const company = await Company.findOne({_id:property.companyID})
        console.log(slot);
        let EmailData = {
          // applicantName: slot.name,
          date: moment(slot.date).format("DD-MM-YYYY"),
          startTime: slot.startTime,
          endTime: slot.endTime,
          companyDomain: slot.companyDomain,
          companyName: property?.company,
          property: property?.title,
          layout: layout?.layoutName,
          logo:company?.logo
        };
        if (slot.assignedToType == "manager") {
          EmailData.applicantName = userData?.firstname + ' ' + userData[0]?.lastname 
        } else if (slot.assignedToType == "company") {
          EmailData.applicantName = userData?.ownerName
        }
        const options = Email.generateOptions(
          [userData?.email],
          "REMINDER_APPOINTMENT_12_HOURS",
          EmailData
        );
        let EmailDataUser = {
          applicantName: slot.name,
          date: moment(slot.date).format("DD-MM-YYYY"),
          startTime: slot.startTime,
          endTime: slot.endTime,
          companyDomain: slot.companyDomain,
          companyName: property?.company,
          property: property?.title,
          layout: layout?.layoutName,
          logo:company?.logo,
          id:slot._id,
        };
        const options1 = Email.generateOptions(
          [slot.email],
          "REMINDER_APPOINTMENT_12_HOURS_TO_USER",
          EmailDataUser
        );
        const isEmailSent = await Email.send(options);
        const isEmailSent1 = await Email.send(options1);
        console.log("isEmailSent: ", isEmailSent);
        console.log("isEmailSent1: ", isEmailSent1);
      });
    }
  } catch (error) {
    console.log(error);
  }
};
exports.SentApplicationsReminder = async () => {
  try {
    //categories the applications 
    const result = await Applicants.aggregate([
      {
        $group: {
          _id: '$main.propertyID',
          pending: { $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] } },
          approved: { $sum: { $cond: [{ $eq: ['$status', 'Approved'] }, 1, 0] } },
          denied: { $sum: { $cond: [{ $eq: ['$status', 'Denied'] }, 1, 0] } }
        }
      }
    ]);

    // populate the managers field for each property
    const properties = await Property.find({ _id: { $in: result.map(r => r._id) } })
      .populate('managers');

    // add the managers field to the result object
    var resultWithManagers = result.map(r => {
      const property = properties.find(p => p._id.toString() === r._id.toString());
      return {
        ...r,
        managers: property ? property.managers : []
      };
    });
    //apend the managers email with every object
    const resultWithManagerEmails = await addManagerEmails(resultWithManagers);


    let newData = []
    for (const result of resultWithManagerEmails) {
      // console.log("Sending email to managers:", result.managersEmail);
      const emailData = {
        pending: result.pending,
        approved: result.approved,
        denied: result.denied,
        emailaddress: result.managersEmail,
      };
      newData.push(emailData)

      

      // console.log('ddllll', emailData);
      
      
      const options = Email.generateOptions(
        result.managersEmail,
        "APPLICATION_REMINDER",
        emailData
      );
      // console.log(emailData);
      
      // console.log("Email options:", options);
      // const isEmailSent = await Email.send(options);
      // console.log("Email sent to managers:", result.managersEmail, "Success:", isEmailSent);
    }
    // Iterate over each object in newData
    for (const data of newData) {
      // Iterate over each email address in the emailaddress array
      for (const email of data.emailaddress) {
        // Create a new emailData object with the pending, approved, and denied data
        const emailDataWithCounts = {
          pending: data.pending,
          approved: data.approved,
          denied: data.denied,
          emailaddress: email.email, // Use the current email address from the iteration
          name: email.firstname + " " + email.lastname
        };
        // console.log(emailDataWithCounts);
        // Generate options for the current email address
        const options = Email.generateOptions(
          email.email,
          "APPLICATION_REMINDER",
          emailDataWithCounts
        );

        // Send the email for the current email address
        const isEmailSent = await Email.send(options);
        // console.log(`Email sent to ${email.email}: ${isEmailSent}`);
      }
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// async function addManagerEmails(resultWithManagers) {
//   try {
//     const managerIds = resultWithManagers.map((result) => result.managers).flat();
//     const managers = await propertyManager.find({ _id: { $in: managerIds } }, 'email', 'firstname', 'lastname');
//     const managersByEmail = managers.reduce((map, manager) => {
//       map[manager._id.toString()] = manager.email;
//       return map;
//     }, {});

//     return resultWithManagers.map((result) => {
//       const managersEmailSet = new Set();
//       result.managers.forEach((managerId) => {
//         const managerEmail = managersByEmail[managerId.toString()];
//         if (managerEmail) {
//           managersEmailSet.add(managerEmail);
//         }
//       });
//       const managersEmail = Array.from(managersEmailSet);
//       return { ...result, managersEmail };
//     });
//   } catch (error) {
//     console.log(error);
//     throw error;
//   }
// }
async function addManagerEmails(resultWithManagers) {
  try {
    const managerIds = resultWithManagers.map((result) => result.managers).flat();
    const managers = await propertyManager.find({ _id: { $in: managerIds } }, 'email firstname lastname');
    const managersByEmail = managers.reduce((map, manager) => {
      map[manager._id.toString()] = {
        email: manager.email,
        firstname: manager.firstname,
        lastname: manager.lastname
      };
      return map;
    }, {});

    return resultWithManagers.map((result) => {
      const managersEmailSet = new Set();
      result.managers.forEach((managerId) => {
        const manager = managersByEmail[managerId.toString()];
        if (manager) {
          managersEmailSet.add(manager);
        }
      });
      const managersEmail = Array.from(managersEmailSet);
      return { ...result, managersEmail };
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}




exports.sentApplicationReportToCompanyUsers = async () => {
  try {
    // Categories the applications 
    const result = await Applicants.aggregate([
      {
        $group: {
          _id: '$main.propertyID',
          pending: { $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] } },
          approved: { $sum: { $cond: [{ $eq: ['$status', 'Approved'] }, 1, 0] } },
          denied: { $sum: { $cond: [{ $eq: ['$status', 'Denied'] }, 1, 0] } }
        },
      }
    ]);
   //adding the property manager 
    const resultArray = [];
    for (const application of result) {
      const property = await propertyManager.findOne({ properties: application._id }).populate('properties');;
      if (property) {
        const updatedProperty = { ...property.toObject(), PropertyID: application._id, pending: application.pending, approved: application.approved, denied: application.denied };
        resultArray.push(updatedProperty);
      } else {
        console.log('Property not found for Application ID:', application._id);
      }
    }


    //categorizing the managers and data according to companywisee
    const categorizedResult = [];
    for (const item of resultArray) {
      const companyID = item.companyID;
      const category = categorizedResult.find((cat) => cat.companyID === companyID);
      if (category) {
        category.items.push(item);
      } else {
        const newCategory = { companyID: companyID, items: [item] };
        categorizedResult.push(newCategory);
      }
    }
 
    //if duplicate manger found ,removing duplication and adding datas appended to single manger
    for (const category of categorizedResult) {
      const emailMap = new Map();
      for (const item of category.items) {
        if (emailMap.has(item.email)) {
          const existingItem = emailMap.get(item.email);
          existingItem.pending += item.pending;
          existingItem.approved += item.approved;
          existingItem.denied += item.denied;
        } else {
          emailMap.set(item.email, item);
        }
      }
      const updatedItems = [...emailMap.values()];
      category.items = updatedItems;
      const emails = await Company.findOne({ _id: category.companyID }, { scriptContent: 0 });
      if (emails) {
        category.companyDetails = emails;
      }
    }
   //organizing the data of sending mail
    for (const company of categorizedResult) {
      const emailData = {
        managerData: company.items,
        companyDetails: company.companyDetails,
        emailaddress: company.companyDetails.email,
      };
      
      let totalCount = 0;
      let totalPending = 0;
      let totalApproved = 0;
      let totalDenied = 0;

      emailData.managerData.forEach(obj => {
        totalCount += obj.pending + obj.approved + obj.denied;
        totalApproved += obj.approved;
        totalPending += obj.pending;
        totalDenied += obj.denied;
      });
      
      emailData.totalCount = totalCount;
      emailData.totalApproved = totalApproved;
      emailData.totalPending = totalPending;
      emailData.totalDenied = totalDenied;

      
      const options = Email.generateOptions(
        company.companyDetails.email,
        "COMPANY_USER_REPORT_OF_MANAGERS",
        emailData
      );

      
      console.log("Email options:", options);
      const isEmailSent = await Email.send(options);
      console.log("Email sent to managers:", result.managersEmail, "Success:", isEmailSent);
    }
  } catch (error) {
    console.log(error);
  }
};


exports.sentTicketReportToCompanies = async () => {
  
}


