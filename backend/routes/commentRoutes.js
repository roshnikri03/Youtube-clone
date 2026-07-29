import express from 'express';
import {
  getVideoComments,
  addComment,
  updateComment,
  deleteComment,
} from '../controllers/commentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, addComment);
router.route('/video/:videoId').get(getVideoComments);
router
  .route('/:id')
  .put(protect, updateComment)
  .delete(protect, deleteComment);

export default router;
