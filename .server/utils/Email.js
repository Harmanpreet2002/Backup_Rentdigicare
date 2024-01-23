const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs").promises;

// module to get dynamic html according to mail type
const FetchHtml = require("./FetchHtml");
const FetchReminderHtml = require("./FetchReminderHtml");

const email = process.env.SMTP_EMAIL;
const password = process.env.SMTP_PASSWORD;

// Function to generate Different email options according to mail type
exports.generateOptions = (emailTo, emailFor, emailData) => {
  // emailTo = "harry2701@yopmail.com";
  if (emailFor === "ADD_COMPANY") {
    const htmlContent = FetchHtml.get(emailFor, emailData);
    return {
      from: email,
      to: emailTo,
      subject: "Company Added",
      html: htmlContent,
    };
  }
  if (emailFor === "ADD_CUSTOMER") {
    const htmlContent = FetchHtml.get(emailFor, emailData);
    return {
      from: email,
      to: emailTo,
      subject: `Your Customer Account Created`,
      html: htmlContent,
    };
  }
  if (emailFor === "ADD_PROPERTY_MANAGER") {
    const htmlContent = FetchHtml.get(emailFor, emailData);

    return {
      from: email,
      to: emailTo,
      subject: "Welcome to Rentdigicare",
      html: htmlContent,
    };
  }
  if (emailFor === "UPDATE_PROPERTY_MANAGER") {
    const htmlContent = FetchHtml.get(emailFor, emailData);
    return {
      from: email,
      to: [emailTo, emailData.companyEmail],
      subject: "Update: Privileges Changes",
      html: htmlContent,
    };
  }

  if (emailFor === "UPDATE_PROPERTY_MANAGER_PROPERTY") {
    const htmlContent = FetchHtml.get(emailFor, emailData);
    return {
      from: email,
      to: emailTo,
      subject: "Update: Property Changes",
      html: htmlContent,
    };
  }
  if (emailFor === "ADD_PROPERTY_VENDOR") {
    const htmlContent = FetchHtml.get(emailFor, emailData);
    return {
      from: email,
      to: emailTo,
      subject: "Added As Vendor",
      html: htmlContent,
    };
  }
  if (emailFor === "ADD_TECHNICAL_STAFF") {
    const htmlContent = FetchHtml.get(emailFor, emailData);
    return {
      from: email,
      to: emailTo,
      subject: "Added As Technical Staff",
      html: htmlContent,
    };
  }

  if (emailFor === "NEW_APPLICATION_MAIL_TO_MANAGER") {
    const htmlContent = FetchHtml.get(emailFor, emailData);
    return {
      from: email,
      to: emailTo,
      subject: "New Application Received !",
      html: htmlContent,
    };
  }
  if (emailFor === "NEW_TICKET_MAIL_TO_MANAGER") {
    const htmlContent = FetchHtml.get(emailFor, emailData);
    return {
      from: email,
      to: emailTo,
      subject: "New Maintenance Request Received!",
      html: htmlContent,
    };
  }
  if (emailFor === "CLOSE_TICKET_MAIL_TO_MANAGER") {
    const htmlContent = FetchHtml.get(emailFor, emailData);
    return {
      from: email,
      to: emailTo,
      subject: "Close the ticket !",
      html: htmlContent,
    };
  }

  if (emailFor === "APPLICATION_REGISTERED_EMAIL_TO_APPLICANT") {
    const htmlContent = FetchHtml.get(emailFor, emailData);
    return {
      from: email,
      to: emailTo,
      subject: "Application Registered !",
      html: htmlContent,
    };
  }

  if (emailFor === "COMPANY_PROFILE_UPDATE") {
    const htmlContent = FetchHtml.get(emailFor, emailData);
    return {
      from: email,
      to: emailTo,
      subject: "Your Profile Has Been Updated",
      html: htmlContent,
    };
  }

  if (emailFor === "COMPANY_ACCOUNT_PASSWORD_CHANGE") {
    const htmlContent = FetchHtml.get(emailFor, emailData);
    return {
      from: email,
      to: emailTo,
      subject: "Password Changed",
      html: htmlContent,
    };
  }

  if (emailFor === "APPLICATION_STATUS_CHANGE_EMAIL_TO_COMPANY") {
    const htmlContent = FetchHtml.get(emailFor, emailData);
    return {
      from: email,
      to: emailTo,
      subject: "Application Status Change",
      html: htmlContent,
    };
  }

  if (emailFor === "COMPANY_RESET_PASSWORD_EMAIL") {
    const htmlContent = FetchHtml.get(emailFor, emailData);
    return {
      from: email,
      to: emailTo,
      subject: "Reset Password",
      html: htmlContent,
    };
  }

  if (emailFor === "PROPERTY_MANAGER_PASSWORD_CHANGE") {
    const htmlContent = FetchHtml.get(emailFor, emailData);
    return {
      from: email,
      to: emailTo,
      subject: "Password Changed",
      html: htmlContent,
    };
  }

  if (emailFor === "PROPERTY_ASSIGNED_TO_MANAGER") {
    const htmlContent = FetchHtml.get(emailFor, emailData);
    return {
      from: email,
      to: emailTo,
      subject: "Property Assigned !",
      html: htmlContent,
    };
  }

  if (emailFor === "PROPERTY_MANAGER_PROFILE_UPDATE") {
    const htmlContent = FetchHtml.get(emailFor, emailData);
    return {
      from: email,
      to: emailTo,
      subject: "Profile Updated",
      html: htmlContent,
    };
  }

  if (emailFor === "PROPERTY_MANAGER_RESET_PASSWORD") {
    const htmlContent = FetchHtml.get(emailFor, emailData);
    return {
      from: email,
      to: emailTo,
      subject: "Reset Password",
      html: htmlContent,
    };
  }

  if (emailFor === "SUPER_ADMIN_PASSWORD_CHANGE") {
    const htmlContent = FetchHtml.get(emailFor, emailData);
    return {
      from: email,
      to: emailTo,
      subject: "Password Changed !",
      html: htmlContent,
    };
  }

  if (emailFor === "SUPER_ADMIN_RESET_PASSWORD") {
    const htmlContent = FetchHtml.get(emailFor, emailData);
    return {
      from: email,
      to: emailTo,
      subject: "Reset Password",
      html: htmlContent,
    };
  }

  if (emailFor === "SUPER_ADMIN_PROFILE_UPDATE") {
    const htmlContent = FetchHtml.get(emailFor, emailData);
    return {
      from: email,
      to: emailTo,
      subject: "Profile Updated !",
      html: htmlContent,
    };
  }

  if (emailFor === "SEND_LOGIN_OTP") {
    const htmlContent = FetchHtml.get(emailFor, emailData);
    return {
      from: email,
      to: emailTo,
      subject: "Login OTP - Rentdigicare",
      html: htmlContent,
    };
  }

  if (emailFor === "DISABLE_2FA") {
    const htmlContent = FetchHtml.get(emailFor, emailData);
    return {
      from: email,
      to: emailTo,
      subject: "Disable Two-Factor Rentdigicare",
      html: htmlContent,
    };
  }
  if (emailFor === "SLOT_BOOKING_SUBMITTED") {
  
    const htmlContent = FetchHtml.get(emailFor, emailData);
    return {
      from: email,
      to: emailTo,
      subject: "Appointment Form Submitted",
      html: htmlContent,
    };
  }
  if (emailFor === "SLOT_BOOKING_APPROVED") {
    const htmlContent = FetchHtml.get(emailFor, emailData);
    return {
      from: email,
      to: emailTo,
      subject: "Appointment Approved",
      html: htmlContent,
    };
  }
  if (emailFor === "SLOT_BOOKING_APPROVED_TO_USER") {
    const htmlContent = FetchHtml.get(emailFor, emailData);
    return {
      from: email,
      to: emailTo,
      subject: "Your Appoinment is Approved",
      html: htmlContent,
    };
  }
  if (emailFor === "SLOT_BOOKING_CANCELED") {
    const htmlContent = FetchHtml.get(emailFor, emailData);
    return {
      from: email,
      to: emailTo,
      subject: "Appointment Canceled",
      html: htmlContent,
    };
  }
  if (emailFor === "SLOT_BOOKING_REJECTED") {
    const htmlContent = FetchHtml.get(emailFor, emailData);
    return {
      from: email,
      to: emailTo,
      subject: "Appointment Canceled",
      html: htmlContent,
    };
  }
  if (emailFor === "SLOT_BOOKING_SUBMITTED_TO_MANAGER") {
    const htmlContent = FetchHtml.get(emailFor, emailData);
    return {
      from: email,
      to: emailTo,
      subject: "Appointment Request Received",
      html: htmlContent,
    };
  }
  if (emailFor === "REMINDER_APPOINTMENT_12_HOURS") {
    const htmlContent = FetchHtml.get(emailFor, emailData);
    return {
      from: email,
      to: emailTo,
      subject: "Appointment Reminder",
      html: htmlContent,
    };
  }
  if (emailFor === "REMINDER_APPOINTMENT_12_HOURS_TO_USER") {
    const htmlContent = FetchHtml.get(emailFor, emailData);
    return {
      from: email,
      to: emailTo,
      subject: "Appointment Reminder",
      html: htmlContent,
    };
  }
  if (emailFor === "REMINDER_APPOINTMENT_30_MINUTES") {
    const htmlContent = FetchHtml.get(emailFor, emailData);
    return {
      from: email,
      to: emailTo,
      subject: "Appointment Reminder",
      html: htmlContent,
    };
  }
  if (emailFor === "REMINDER_APPOINTMENT_30_MINUTES_TO_USER") {
    const htmlContent = FetchHtml.get(emailFor, emailData);
    return {
      from: email,
      to: emailTo,
      subject: "Appointment Reminder",
      html: htmlContent,
    };
  }
  if (emailFor === "SEND_MAIL_TO_ALL_ASSIGNED_VENDORS") {
    const htmlContent = FetchHtml.get(emailFor, emailData);
    return {
      from: email,
      to: emailTo,
      subject: "New Maintenance Request Assigned!",
      html: htmlContent,
    };
  }
  if (emailFor === "QUOTE_TICKET_BY_VENDOR") {
    const htmlContent = FetchHtml.get(emailFor, emailData);
    return {
      from: email,
      to: emailTo,
      subject: `New Quote received for Request: ${emailData.requestId}`,
      html: htmlContent,
    };
  }
  if (emailFor === "QUOTE_APPROVED") {
    const htmlContent = FetchHtml.get(emailFor, emailData);
    return {
      from: email,
      to: emailTo,
      subject: `Quote accepted for Request: ${emailData.requestId}`,
      html: htmlContent,
    };
  }
  if (emailFor === "REQUEST_STATUS_UPDATE") {
    const htmlContent = FetchHtml.get(emailFor, emailData);
    return {
      from: email,
      to: emailTo,
      subject: `Status changed for Request: ${emailData.requestId}`,
      html: htmlContent,
    };
  }
  if (emailFor === "CUSTOMER_RATING") {
    const htmlContent = FetchHtml.get(emailFor, emailData);
    return {
      from: email,
      to: emailTo,
      subject: `${emailData.toStatus==="Unresolved"? "Unresolved Status for Request:" : "Status changed for Request:"} ${emailData?.requestId}`,
      html: htmlContent,
    };
  }
  if (emailFor === "APPLICATION_REMINDER") {
    const htmlContent = FetchReminderHtml.get(emailFor, emailData);
    return {
      from: email,
      to: emailData.emailaddress,
      subject: `Applicants Reminder`,
      html: htmlContent,
    };
  }
  if(emailFor === "COMPANY_USER_REPORT_OF_MANAGERS"){
    const htmlContent = FetchReminderHtml.get(emailFor, emailData);
    return {
      from : email,
      to:emailData.emailaddress,
      subject: `Application Status`,
      html: htmlContent,
    }
  }
  if(emailFor === "NEW_TICKET_FOR_USER"){
    const htmlContent = FetchReminderHtml.get(emailFor, emailData);
    return {
      from : email,
      to:emailData.applicantEmail,
      subject: `Maintenance Request Recieved`,
      html: htmlContent,
    }
  }
  if(emailFor === "LEADS_FOR_SUPER_ADMIN"){
    const htmlContent = FetchReminderHtml.get(emailFor, emailData);
    return {
      from : email,
      to:emailData.superAdminEmail,
      // to:"hsaleel6@gmail.com",
      subject: `Application Recieved`,
      html: htmlContent,
    }
  }
  if (emailFor === "REQUEST_REASSIGN_VENDOR") {
    const htmlContent = FetchReminderHtml.get(emailFor, emailData);
    return {
      from: email,
      to: emailData.email,
      subject: `Reassigned ticket`,
      html: htmlContent,
    }
  }

};

// Function to send email accoding tho that option
exports.send = async (options) => {
  let mailSent = true;
  try {
    let transporter = nodemailer.createTransport({
      host: "smtp.office365.com",
      port: "587",
      auth: { user: email, pass: password }, // todo in process.env
      secureConnection: false,
      pool: true,
      tls: { ciphers: "SSLv3" },
      maxConnections: 5,
    });
    const info = await transporter.sendMail(options);
    console.log(info);
    
  } catch (error) {
    mailSent = false;
    if (
      error.code === 'EMAXCONNECTIONS' &&
      error.message.includes('Max number of connections exceeded')
    ) {
      console.log('Concurrent connections limit exceeded. Waiting and retrying...');
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for 5 seconds
      return sendEmail(options); // Retry sending the email
    } else {
      console.error('Error sending email:', error);
      return false; // Failed to send email
    }
    
  }
  return mailSent;
};
