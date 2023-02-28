const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const URL = require("./db/index");
const app = express();
const port = 4000;

app.listen(port, function () {
  console.log("SERVER RUN on", port);
});

mongoose.set("strictQuery", false); //if we set true that mean, all the fields will be saved in the database, even if some of them are not specified in the schema model
mongoose
  .connect(URL)
  .then(console.log("connected"))
  .catch((error) => console.log("not connected", error));

app.use(express.json());
app.use(cors());
app.use("/", require("./routes/rootroutes"));
