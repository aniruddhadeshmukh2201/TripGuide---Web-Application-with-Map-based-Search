var mongoose = require("mongoose");
//Schema Setup

const ImageSchema = new mongoose.Schema({
   url: String,
   filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
   return this.url.replace('/upload', '/upload/w_200');
});

const opts = { toJSON: { virtuals: true } };




var spotSchema = new mongoose.Schema({
   name: String,
   location: String,
   price: String,
   geometry: {
      type: {
          type: String,
          enum: ['Point'],
          required: true
      },
      coordinates: {
          type: [Number],
          required: true
      }
  },
   images: [ ImageSchema],
   description: String,
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
   reviews: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Review"
      }
   ]
   
}, opts);

spotSchema.virtual('properties.popUpMarkup').get(function () {
   return `
   <strong><a href="/spots/${this._id}">${this.name}</a><strong>
   <p>${this.description.substring(0, 20)}...</p>`
});
module.exports = mongoose.model("spot", spotSchema);