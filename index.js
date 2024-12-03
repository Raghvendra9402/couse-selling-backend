const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { userRouter } = require("./routes/user");

dotenv.config();

mongoose.connect(process.env.DATABASE_URL);

const app = express();
app.use(express.json());

app.use("/user", userRouter);

app.listen(3000, () => {
  console.log("server is started on port 3000");
});
