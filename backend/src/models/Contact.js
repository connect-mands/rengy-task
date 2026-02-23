import mongoose from 'mongoose';

const statusEnum = ['Lead', 'Prospect', 'Customer'];

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name too long']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email format']
  },
  phone: {
    type: String,
    trim: true,
    maxlength: [20, 'Phone too long']
  },
  company: {
    type: String,
    trim: true,
    maxlength: [100, 'Company name too long']
  },
  status: {
    type: String,
    enum: { values: statusEnum, message: `Status must be one of: ${statusEnum.join(', ')}` },
    default: 'Lead'
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes too long']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

contactSchema.index({ createdBy: 1, name: 'text', email: 'text', status: 1 });

export default mongoose.model('Contact', contactSchema);
