import Comment from '../models/Comment.js';
import Video from '../models/Video.js';

// @desc    Get comments for a video
// @route   GET /api/comments/video/:videoId
// @access  Public
export const getVideoComments = async (req, res) => {
  try {
    const comments = await Comment.find({ videoId: req.params.videoId })
      .populate('userId', 'username avatar')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a comment
// @route   POST /api/comments
// @access  Private
export const addComment = async (req, res) => {
  const { text, videoId } = req.body;

  try {
    const video = await Video.findById(videoId);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    const comment = await Comment.create({
      text,
      videoId,
      userId: req.user._id,
    });

    video.comments.push(comment._id);
    await video.save();

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a comment
// @route   PUT /api/comments/:id
// @access  Private
export const updateComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (comment) {
      if (comment.userId.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized to update this comment' });
      }

      comment.text = req.body.text || comment.text;
      const updatedComment = await comment.save();
      res.json(updatedComment);
    } else {
      res.status(404).json({ message: 'Comment not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (comment) {
      if (comment.userId.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized to delete this comment' });
      }

      const video = await Video.findById(comment.videoId);
      if (video) {
        video.comments = video.comments.filter(cId => cId.toString() !== comment._id.toString());
        await video.save();
      }

      await comment.deleteOne();
      res.json({ message: 'Comment removed' });
    } else {
      res.status(404).json({ message: 'Comment not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
