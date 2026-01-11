const express = require("express");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/userRoutes");

const allowedOrigins = [
  "http://localhost:5173",
  "http://devstinder.duckdns.org",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin like Postman/curl
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) return callback(null, true);

      return callback(new Error("CORS not allowed: " + origin));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.get("/health", (req, res) => {
  res.json({ ok: true, message: "Server running ✅" });
});

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    console.log("Database connection established....");
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log("Server is running on Port", PORT);
    });
  })
  .catch((err) => {
    console.log("Database cannot be connected.", err);
  });
