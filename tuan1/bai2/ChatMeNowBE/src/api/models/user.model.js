const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    displayName: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, default: "" },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    
    isPremium: { type: Boolean, default: false },
    premiumExpiryDate: { type: Date, default: null },

    bio: { type: String, default: "" },
    avatar: { type: String, default: "" },
    coverImage: { type: String, default: "" },

    language: { type: String, default: "vi" },
    themeColor: { type: String, default: "light" },

    isOnline: { type: Boolean, default: false },
    lastSeen: { type: Date, default: Date.now },

    friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  },
);

UserSchema.index({ displayName: "text" }, { language_override: "none" });

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
