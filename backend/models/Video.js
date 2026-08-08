import mongoose from 'mongoose';

const videoSchema = mongoose.Schema(
  {
    // Video metadata is stored here while the media itself is referenced by URL.
    title: {
      type: String,
      required: true,
    },
    thumbnailUrl: {
      type: String,
      default: 'https://placehold.co/320x180',
    },
    videoUrl: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    channelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Channel',
      required: true,
    },
    uploader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    dislikes: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      required: true,
      default: 'All',
    },
    comments: [
      {
        // Keep comment ids on the video for efficient relationship tracking.
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Video = mongoose.model('Video', videoSchema);

export default Video;
