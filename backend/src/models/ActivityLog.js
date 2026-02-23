import mongoose from 'mongoose';

const actionEnum = ['add', 'edit', 'delete'];

const activityLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    enum: { values: actionEnum, message: `Action must be one of: ${actionEnum.join(', ')}` },
    required: true
  },
  entity: {
    type: String,
    default: 'contact'
  },
  entityId: mongoose.Schema.Types.ObjectId,
  details: {
    type: String,
    trim: true,
    maxlength: [500, 'Details too long']
  }
}, { timestamps: true });

activityLogSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('ActivityLog', activityLogSchema);
