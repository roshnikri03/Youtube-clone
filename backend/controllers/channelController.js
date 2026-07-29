import Channel from '../models/Channel.js';
import User from '../models/User.js';

// @desc    Create a channel
// @route   POST /api/channels
// @access  Private
export const createChannel = async (req, res) => {
  const { channelName, description, channelBanner } = req.body;

  try {
    const existingChannel = await Channel.findOne({ owner: req.user._id });
    if (existingChannel) {
      return res.status(400).json({ message: 'User already has a channel' });
    }

    const channel = await Channel.create({
      channelName,
      description,
      channelBanner,
      owner: req.user._id,
    });

    // Update user with channel ID
    await User.findByIdAndUpdate(req.user._id, {
      $push: { channels: channel._id },
    });

    res.status(201).json(channel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get channel by ID
// @route   GET /api/channels/:id
// @access  Public
export const getChannelById = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id)
      .populate('owner', 'username avatar')
      .populate('videos');

    if (channel) {
      res.json(channel);
    } else {
      res.status(404).json({ message: 'Channel not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get channel for logged in user
// @route   GET /api/channels/my-channel
// @access  Private
export const getMyChannel = async (req, res) => {
  try {
    const channel = await Channel.findOne({ owner: req.user._id }).populate(
      'videos'
    );

    if (channel) {
      res.json(channel);
    } else {
      res.status(404).json({ message: 'Channel not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
