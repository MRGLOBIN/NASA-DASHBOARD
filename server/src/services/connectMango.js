const mongoose = require("mongoose");

const MANGO_URL =
  "mongodb+srv://nasa-api:123@nasa-api.zow29kl.mongodb.net/?retryWrites=true&w=majority";
// 'mongodb+srv://NASA-SERVER-API:123@nasa-database.jdej7po.mongodb.net/?retryWrites=true&w=majority'

async function connectToMango() {
  await mongoose.connect(MANGO_URL, {
    useNewUrlParser: true,
    // useFindAndModify: false,
    // useCreateIndex: true,
    useUnifiedTopology: true,
  });

  console.log("connected to MangoDB");
}

module.exports = connectToMango;
