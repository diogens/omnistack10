const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const routes = require("./routes");

const app = express();
const port = 3333;

mongoose.connect(
  //CRIE UM NOVO BANCO NO MONGOATLAS
  "mongodb+srv://<USER>:<SENHA>@cluster0-awox0.mongodb.net/<BANCO>?retryWrites=true&w=majority",
  {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(port, () => {
  console.log(`listen... ${port}`);
});
