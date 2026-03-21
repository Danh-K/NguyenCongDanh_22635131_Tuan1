const mongoose = require("mongoose");

class Database {
  constructor() {
    if (!Database.instance) {
      mongoose.connect(process.env.MONGO_URI);
      Database.instance = this;
      console.log("MongoDB connected");
    }
    return Database.instance;
  }
}

module.exports = new Database();
