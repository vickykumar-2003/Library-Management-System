const Member = require('../models/Member');

const getMembers = async (req, res) => {
  try {
    const members = await Member.find({});
    res.json({ success: true, data: members });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMemberById = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (member) {
      res.json({ success: true, data: member });
    } else {
      res.status(404).json({ success: false, message: 'Member not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createMember = async (req, res) => {
  try {
    const { name, email, phone, membershipId, address, status } = req.body;
    
    const memberExists = await Member.findOne({ $or: [{ email }, { membershipId }] });
    if (memberExists) {
      return res.status(400).json({ success: false, message: 'Member with this email or membership ID already exists' });
    }

    const member = await Member.create({
      name, email, phone, membershipId, address, status
    });

    res.status(201).json({ success: true, message: 'Member created successfully', data: member });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateMember = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);

    if (member) {
      const updatedMember = await Member.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      res.json({ success: true, message: 'Member updated successfully', data: updatedMember });
    } else {
      res.status(404).json({ success: false, message: 'Member not found' });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteMember = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);

    if (member) {
      await Member.deleteOne({ _id: member._id });
      res.json({ success: true, message: 'Member removed' });
    } else {
      res.status(404).json({ success: false, message: 'Member not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getMembers, getMemberById, createMember, updateMember, deleteMember };
