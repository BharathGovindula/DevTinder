const cron = require("node-cron");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const sendEmail = require("./sendEmail");
const ConnectionRequestModel = require("../model/connectionRequest");



// This job will run at 8 Am in the morning everyday 
cron.schedule("45 14 * * *", async () => {

    // send emails to all people who got requests the previous day
    try {
    const yesterday = subDays(new Date(), 0);

    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);

    const pendingRequests = await ConnectionRequestModel.find({
      status: "interested",
      createdAt: {
        $gte: yesterdayStart,
        $lt: yesterdayEnd,
      },
    }).populate("fromUserId toUserId");

    const listOfEmails = [
      ...new Set(pendingRequests.map((req) => req.toUserId.emailId)),
    ];

    for (const email of listOfEmails) {
      try {
        const res = await sendEmail.run(
          "New Friend Requests pending for" + email,
          "There are so many friend requests pending, please login to DevTinder and accept or reject the requests"
        );
      } catch (err) {
        console.error(err.message);
      }
    }
  } catch (err) {
    console.error(err);
  }
});
