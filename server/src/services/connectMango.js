const mongoose = require("mongoose");

require('dotenv').config()

const MANGO_URL = process.env.MANGO_URL


async function connectToMango() {
  await mongoose.connect(MANGO_URL, 
    {
    useNewUrlParser: true,
    // no longer supported
    // useFindAndModify: false,
    // useCreateIndex: true,
    useUnifiedTopology: true,
  }
  );

  console.log("connected to MangoDB");
}

module.exports = connectToMango;
