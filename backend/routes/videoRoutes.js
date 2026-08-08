import express from 'express';
import {
  getVideos,
  getVideoById,
  createVideo,
  updateVideo,
  deleteVideo,
  likeVideo,
  dislikeVideo,
} from '../controllers/videoController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/').get(getVideos).post(protect, upload.fields([{ name: 'video', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]), createVideo);
router
  .route('/:id')
  .get(getVideoById)
  .put(protect, upload.fields([{ name: 'video', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]), updateVideo)
  .delete(protect, deleteVideo);
  
router.route('/:id/like').put(protect, likeVideo);
router.route('/:id/dislike').put(protect, dislikeVideo);

export default router;
