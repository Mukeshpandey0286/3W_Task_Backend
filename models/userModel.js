const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  socialMediaHandle: { type: String, required: true, trim: true },
  images: [
    {
      url: { type: String, required: true },
      publicId: { type: String, required: true }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
