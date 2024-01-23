const { google } = require("googleapis");
const {
  GOOGLE_CALENDAR_ID,
  GOOGLE_CALENDAR_CREDANTIALS,
} = require("../config.js");
require("dotenv").config();
const SCOPES = ["https://www.googleapis.com/auth/calendar"];

const auth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CALENDAR_CLIENT_ID,
  process.env.GOOGLE_CALENDAR_CLIENT_SECRET,
  process.env.REDIRECT_URL
);

const REFRESH_TOKEN =
  "1//0gHVddOGo9QT8CgYIARAAGBASNwF-L9Irr7wYfZwLeU08cLxkpgrDvUZjFJhO-ajSej7zW_xzdQp5c_kC6AcJhZxzzzUMvWl159Q";

auth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const calendar = google.calendar({
  version: "v3",
  auth: process.env.GOOGLE_CALENDAR_API_KEY,
});

const insertEvents = async (event) => {
  try {
    calendar.events.insert(
      {
        calendarId: "primary",
        sendUpdates: "all",
        sendNotifications: true,
        auth: auth2Client,
        resource: event,
      },
      function (err, event) {
        if (err) {
          console.log(
            "There was an error contacting the Calendar service: " + err
          );
          return;
        }
        console.log("Event created: %s", event?.data);
        return event;
      }
    );
  } catch (err) {
    console.log(err);
  }
};

module.exports = insertEvents;
