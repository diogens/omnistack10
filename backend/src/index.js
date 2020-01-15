const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes");

const app = express();
const port = 3333;

mongoose.connect(
  "mongodb+srv://dioge2020:dioge2020@cluster0-awox0.mongodb.net/week10?retryWrites=true&w=majority",
  {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

app.use(express.json());
app.use(routes);

app.listen(port, () => {
  console.log(`listen... ${port}`);
});
