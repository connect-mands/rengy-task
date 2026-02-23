import Contact from '../models/Contact.js';
import ActivityLog from '../models/ActivityLog.js';
import { body, param, query } from 'express-validator';

const createLog = async (userId, action, entityId, details) => {
  await ActivityLog.create({ userId, action, entity: 'contact', entityId, details });
};

export const getContacts = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = 10;
    const skip = (page - 1) * limit;
    const search = (req.query.search || '').trim();
    const status = req.query.status;

    const filter = { createdBy: req.user._id };
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') }
      ];
    }

    const [contacts, total] = await Promise.all([
      Contact.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(limit).lean(),
      Contact.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: {
        contacts,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

export const getContact = async (req, res, next) => {
  try {
    const contact = await Contact.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    }).lean();
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }
    res.json({ success: true, data: { contact } });
  } catch (err) {
    next(err);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const contact = await Contact.create({
      ...req.body,
      createdBy: req.user._id
    });
    await createLog(req.user._id, 'add', contact._id, `Added contact: ${contact.name}`);
    res.status(201).json({ success: true, data: { contact } });
  } catch (err) {
    next(err);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const allowed = ['name', 'email', 'phone', 'company', 'status', 'notes'];
    const updates = {};
    allowed.forEach(k => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });
    const contact = await Contact.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      updates,
      { new: true, runValidators: true }
    );
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }
    await createLog(req.user._id, 'edit', contact._id, `Updated contact: ${contact.name}`);
    res.json({ success: true, data: { contact } });
  } catch (err) {
    next(err);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id
    });
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }
    await createLog(req.user._id, 'delete', contact._id, `Deleted contact: ${contact.name}`);
    res.json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};

export const getActivityLogs = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = 20;
    const skip = (page - 1) * limit;
    const logs = await ActivityLog.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    const total = await ActivityLog.countDocuments({ userId: req.user._id });
    res.json({
      success: true,
      data: {
        logs,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) }
      }
    });
  } catch (err) {
    next(err);
  }
};

const statusValues = ['Lead', 'Prospect', 'Customer'];

export const contactValidation = [
  body('name').trim().notEmpty().isLength({ max: 100 }).withMessage('Name required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('phone').optional().trim().isLength({ max: 20 }),
  body('company').optional().trim().isLength({ max: 100 }),
  body('status').optional().isIn(statusValues).withMessage(`Status must be one of: ${statusValues.join(', ')}`),
  body('notes').optional().trim().isLength({ max: 1000 })
];

export const contactUpdateValidation = [
  body('name').optional().trim().notEmpty().isLength({ max: 100 }).withMessage('Name invalid'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Valid email required'),
  body('phone').optional().trim().isLength({ max: 20 }),
  body('company').optional().trim().isLength({ max: 100 }),
  body('status').optional().isIn(statusValues).withMessage(`Status must be one of: ${statusValues.join(', ')}`),
  body('notes').optional().trim().isLength({ max: 1000 })
];

export const idValidation = [
  param('id').isMongoId().withMessage('Invalid contact id')
];

export const queryValidation = [
  query('page').optional().isInt({ min: 1 }),
  query('status').optional().isIn(statusValues),
  query('search').optional().isString()
];
