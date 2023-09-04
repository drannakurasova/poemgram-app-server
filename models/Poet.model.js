const { Schema, model, default: mongoose } = require("mongoose");

const poetSchema = new Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: true,
    },

    lastName: {
      type: String,
      trim: true,
      required: true,
    },

    photo: {
      type: String,
      // default: ....
    },

    bornIn: Number,

    createdBy: 
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
  },
  {
    timestamps: true,
  }
);

const Poet = model("Poet", poetSchema);
module.exports = Poet;
