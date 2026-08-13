const mongoose = require('mongoose');

const memberSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    membershipId: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    joinDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  },
  { timestamps: true }
);

const Member = mongoose.model('Member', memberSchema);

module.exports = Member;
