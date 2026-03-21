const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");

// Try loading .env in project root, or fallback to `env` file (some setups use that name)
const envPath = path.resolve(__dirname, "../.env");
const altEnvPath = path.resolve(__dirname, "../.env");
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else if (fs.existsSync(altEnvPath)) {
  dotenv.config({ path: altEnvPath });
} else {
  // Fall back to default behavior (process env variables already set in environment)
  dotenv.config();
}

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error(
        'MONGO_URI is not defined. Make sure you have a .env (or env) file with MONGO_URI set or set the environment variable.'
      );
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB đã kết nối thành công: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Lỗi kết nối MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
