import express from 'express';
import {
  getContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
  getActivityLogs,
  contactValidation,
  contactUpdateValidation,
  idValidation,
  queryValidation
} from '../controllers/contactController.js';
import { validate } from '../middleware/validate.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', validate(queryValidation), getContacts);
router.get('/logs', getActivityLogs);
router.get('/:id', validate(idValidation), getContact);
router.post('/', validate(contactValidation), createContact);
router.put('/:id', validate([...idValidation, ...contactUpdateValidation]), updateContact);
router.delete('/:id', validate(idValidation), deleteContact);

export default router;
