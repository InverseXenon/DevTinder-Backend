const express = require("express");
const { sendEmail } = require("../utils/mailer");

const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

// ✅ Send request
requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    console.log("🔥 request/send HIT", req.params);

    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    const allowedStatus = ["ignored", "interested"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "This Status is not possible => " + status });
    }

    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(400).json({ message: "THIS USER IS NOT AVAILABLE." });
    }

    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });

    if (existingConnectionRequest) {
      return res.status(400).send("CONNECTION REQUEST ALREADY EXISTS!");
    }

    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });

    const data = await connectionRequest.save();

    // ✅ Send email only when interested
    if (status === "interested") {
      console.log("📩 Interested request created");

      if (!toUser.email) {
        console.log("❌ Receiver email missing in DB");
      } else {
        console.log("📨 Sending email to:", toUser.email);

        sendEmail({
          to: toUser.email,
          subject: "New Connection Request 🔥",
          html: `
            <div style="font-family: Arial, sans-serif;">
              <h2>Hey ${toUser.firstName} 👋</h2>
              <p><b>${req.user.firstName}</b> sent you a connection request on DevTinder.</p>
              <p>Open the Website → <a href="http://devstinder.duckdns.org/">DevTinder</a> to accept/reject.</p>
              <br/>
              <p style="font-size:12px;color:gray;">DevTinder Alerts</p>
            </div>
          `,
        })
          .then(() => console.log("✅ Email sent to:", toUser.email))
          .catch((err) => console.log("❌ Email failed:", err));
      }
    }

    return res.json({
      message: `${req.user.firstName} is ${status} in ${toUser.firstName}`,
      data,
    });
  } catch (error) {
    console.log("❌ request/send error:", error);
    return res.status(400).send("Error: " + error.message);
  }
});

// ✅ Review request
requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const status = req.params.status;
    const requestId = req.params.requestId;

    const allowedStatus = ["accepted", "rejected"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Status not allowed!" });
    }

    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      status: "interested",
      toUserId: loggedInUser._id,
    });

    if (!connectionRequest) {
      return res.status(404).json({ message: "NO REQUEST FOUND!" });
    }

    connectionRequest.status = status;
    const data = await connectionRequest.save();

    return res.json({
      message: "Request " + status + " succesfully!",
      data,
    });
  } catch (error) {
    return res.status(400).send("Error " + error);
  }
});

module.exports = requestRouter;
