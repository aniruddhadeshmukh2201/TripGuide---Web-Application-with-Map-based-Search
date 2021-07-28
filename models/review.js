const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const reviewSchema = new mongoose.Schema({
   text: String,
   rating: Number,
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   }
});

module.exports = mongoose.models.Review || mongoose.model("Review", reviewSchema);