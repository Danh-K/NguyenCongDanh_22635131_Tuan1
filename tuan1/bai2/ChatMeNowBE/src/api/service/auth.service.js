const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

class AuthService {
  generateTokens(userId, role) {
    const accessToken = jwt.sign(
      { userId, role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_ACCESS_EXPIRE || "15m" }
    );

    const refreshToken = jwt.sign(
      { userId, role },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRE || "7d" }
    );

    return { accessToken, refreshToken };
  }

  async register({ displayName, email, password }) {
    if (!displayName || !email || !password) {
      throw {
        statusCode: 400,
        message:
          "Vui lòng điền đầy đủ thông tin (displayName, email, password)",
      };
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw {
        statusCode: 400,
        message: "Email này đã được sử dụng.",
      };
    }

    const newUser = await User.create({
      email,
      password,
      role: "user",
      displayName: displayName,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random`,
    });

    const tokens = this.generateTokens(newUser._id, newUser.role);

    return {
      ...tokens,
      user: newUser,
    };
  }

  async login({ email, password }) {
    const user = await User.findOne({ email });
    if (!user) {
      throw {
        statusCode: 401,
        message: "Email hoặc mật khẩu không đúng.",
      };
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw {
        statusCode: 401,
        message: "Email hoặc mật khẩu không đúng.",
      };
    }

    const tokens = this.generateTokens(user._id, user.role);

    return {
      ...tokens,
      user,
    };
  }

  async refreshToken({ refreshToken }) {
    if (!refreshToken) {
      throw { statusCode: 401, message: "Refresh Token is required" };
    }

    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      
      // Check if user still exists
      const user = await User.findById(decoded.userId);
      if (!user) {
         throw { statusCode: 403, message: "User verification failed" };
      }

      // Generate new tokens
      const tokens = this.generateTokens(decoded.userId, decoded.role);
      
      return tokens;
    } catch (error) {
       throw { statusCode: 403, message: "Invalid Refresh Token" };
    }
  }

  async getMe(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw {
        statusCode: 404,
        message: "Không tìm thấy user",
      };
    }
    return user;
  }

  async changePassword(userId, { oldPassword, newPassword }) {
    throw {
      statusCode: 200,
      message: "Tính năng đang phát triển",
    };
  }
}

module.exports = new AuthService();
