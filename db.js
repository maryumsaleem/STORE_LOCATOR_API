const mongoose = require("mongoose");
const dotenv = require("dotenv");
//load env vars
dotenv.config({ path: "./config/config.env" });
const dbconfig = mongoose.set("strictQuery", false);
const db = process.env.Mongo_URL;
mongoose
  .connect(db)
  .then((res) => {
    console.log("database connection established");
  })
  .catch((err) => {
    console.log("error connecting to database, ", err);
  });
module.export = { dbconfig };
