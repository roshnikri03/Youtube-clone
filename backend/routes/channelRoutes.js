import express from 'express';
import {
  createChannel,
  getChannelById,
  getMyChannel,
} from '../controllers/channelController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, createChannel);
router.route('/my-channel').get(protect, getMyChannel);
router.route('/:id').get(getChannelById);

export default router;
