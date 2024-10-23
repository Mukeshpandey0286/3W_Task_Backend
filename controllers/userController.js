const User = require('../models/userModel');
const cloudinary = require('../config/cloudinaryConfig');
const fs = require('fs');

// Helper function to upload images to Cloudinary
const uploadImagesToCloudinary = async (files) => {
  const images = [];
  for (const file of files) {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'user-submissions'
    });
    images.push({ url: result.secure_url, publicId: result.public_id });
    fs.unlinkSync(file.path); // Clean up local file after upload
  }
  return images;
};

// Create User Submission
exports.submitUser = async (req, res) => {
  try {
    const { name, socialMediaHandle } = req.body;
    if (!name || !socialMediaHandle) {
      return res.status(400).json({ error: 'Name and social media handle are required' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'At least one image is required' });
    }

    const images = await uploadImagesToCloudinary(req.files);
    
    const user = new User({
      name,
      socialMediaHandle,
      images
    });
    
    await user.save();
    res.status(201).json({ message: 'User submission successful', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error. Try again later' });
  }
};

// Fetch all user submissions for admin dashboard
exports.getAllSubmissions = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch submissions. Try again later' });
  }
};
