import Video from '../models/Video.js';
import Channel from '../models/Channel.js';

// @desc    Get all videos
// @route   GET /api/videos
// @access  Public
export const getVideos = async (req, res) => {
  try {
    const keyword = req.query.keyword
      ? {
          title: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        }
      : {};

    const category = req.query.category && req.query.category !== 'All' 
      ? { category: req.query.category } 
      : {};

    const videos = await Video.find({ ...keyword, ...category })
      .populate('channelId', 'channelName channelBanner')
      .populate('uploader', 'username avatar');
      
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get video by ID
// @route   GET /api/videos/:id
// @access  Public
export const getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)
      .populate('channelId', 'channelName subscribers')
      .populate('uploader', 'username avatar');

    if (video) {
      // Increment views logic could be placed here or in a separate endpoint
      video.views += 1;
      await video.save();
      res.json(video);
    } else {
      res.status(404).json({ message: 'Video not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a video
// @route   POST /api/videos
// @access  Private
export const createVideo = async (req, res) => {
  const { title, description, category } = req.body;
  
  let videoUrl = req.body.videoUrl;
  let thumbnailUrl = req.body.thumbnailUrl;

  if (req.files) {
    if (req.files.video) {
      videoUrl = `http://localhost:5001/uploads/${req.files.video[0].filename}`;
    }
    if (req.files.thumbnail) {
      thumbnailUrl = `http://localhost:5001/uploads/${req.files.thumbnail[0].filename}`;
    }
  }

  try {
    const channel = await Channel.findOne({ owner: req.user._id });

    if (!channel) {
      return res.status(400).json({ message: 'User does not have a channel' });
    }

    const video = await Video.create({
      title,
      description,
      videoUrl,
      thumbnailUrl,
      category,
      channelId: channel._id,
      uploader: req.user._id,
    });

    // Add video to channel's video list
    channel.videos.push(video._id);
    await channel.save();

    res.status(201).json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a video
// @route   PUT /api/videos/:id
// @access  Private
export const updateVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (video) {
      // Check if user is uploader
      if (video.uploader.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'User not authorized to update this video' });
      }

      video.title = req.body.title || video.title;
      video.description = req.body.description || video.description;
      video.category = req.body.category || video.category;
      
      let newVideoUrl = req.body.videoUrl;
      let newThumbnailUrl = req.body.thumbnailUrl;

      if (req.files) {
        if (req.files.video) {
          newVideoUrl = `http://localhost:5001/uploads/${req.files.video[0].filename}`;
        }
        if (req.files.thumbnail) {
          newThumbnailUrl = `http://localhost:5001/uploads/${req.files.thumbnail[0].filename}`;
        }
      }

      video.videoUrl = newVideoUrl || video.videoUrl;
      video.thumbnailUrl = newThumbnailUrl || video.thumbnailUrl;

      const updatedVideo = await video.save();
      res.json(updatedVideo);
    } else {
      res.status(404).json({ message: 'Video not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a video
// @route   DELETE /api/videos/:id
// @access  Private
export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (video) {
      if (video.uploader.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'User not authorized to delete this video' });
      }

      const channel = await Channel.findById(video.channelId);
      if (channel) {
        channel.videos = channel.videos.filter(vId => vId.toString() !== video._id.toString());
        await channel.save();
      }

      await video.deleteOne();
      res.json({ message: 'Video removed' });
    } else {
      res.status(404).json({ message: 'Video not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Like a video
// @route   PUT /api/videos/:id/like
// @access  Private
export const likeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (video) {
      video.likes += 1;
      await video.save();
      res.json(video);
    } else {
      res.status(404).json({ message: 'Video not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Dislike a video
// @route   PUT /api/videos/:id/dislike
// @access  Private
export const dislikeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (video) {
      video.dislikes += 1;
      await video.save();
      res.json(video);
    } else {
      res.status(404).json({ message: 'Video not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
