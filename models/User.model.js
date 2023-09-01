const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: true
    },
    lastName: {
      type: String,
      trim: true,
      required: true
    },
    photo: {
      type: String,
      // default: ""
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Password is required.']
    },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
    },
   },
  {
    timestamps: true
  }

);

const User = model("User", userSchema);

module.exports = User;
