const { Schema, model, default: mongoose } = require("mongoose");

const poemSchema = new Schema(
  {
    text: String,

    poet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Poet",
    },

    apiId: String,
  },
  {
    timestamps: true,
  }
);

const Poem = model("Poem", poemSchema);
module.exports = Poem;
