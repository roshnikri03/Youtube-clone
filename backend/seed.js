import mongoose from 'mongoose';
import User from './models/User.js';
import Channel from './models/Channel.js';
import Video from './models/Video.js';
import Comment from './models/Comment.js';
import connectDB from './config/db.js';


// Connect before issuing any destructive or insert operations.
connectDB();

const seedData = async () => {
  try {
    // Clear all existing data
    await User.deleteMany();
    await Channel.deleteMany();
    await Video.deleteMany();
    await Comment.deleteMany();

    console.log('Existing data cleared.');

    // 1. Create a user
    const createdUser = await User.create({
      username: 'JohnDoe',
      email: 'john@example.com',
      password: 'password123',
      avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=random',
    });

    console.log('User created:', createdUser.username);

    // Create one sample channel per video so the home page represents multiple creators.
    const channelDetails = [
      ['React Academy', 'React tutorials and frontend patterns.', 5200],
      ['JavaScript Simplified', 'Practical JavaScript lessons for every level.', 8900],
      ['Backend Builders', 'Scalable Node.js and backend architecture.', 4500],
      ['Web Craft Studio', 'Modern web development ideas and trends.', 3100],
      ['Late Night Lo-Fi', 'Relaxing music for coding and study sessions.', 12500],
      ['Pixel Perfect Gaming', 'Gaming setups, hardware, and desk tours.', 7600],
    ];

    const createdChannels = await Channel.create(
      channelDetails.map(([channelName, description, subscribers]) => ({
        channelName,
        owner: createdUser._id,
        description,
        channelBanner: 'https://images.unsplash.com/photo-1550439062-609e1531270e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        subscribers,
      }))
    );

    // Add every sample channel reference to the seeded user's profile.
    createdUser.channels.push(...createdChannels.map((channel) => channel._id));
    await createdUser.save();

    console.log(`${createdChannels.length} channels created.`);

    // 3. Create sample videos
    const videos = [
      {
        title: 'Learn React in 30 Minutes',
        thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        description: 'A quick tutorial to get started with React.',
        channelId: createdChannels[0]._id,
        uploader: createdUser._id,
        views: 15200,
        likes: 1023,
        dislikes: 45,
        category: 'React'
      },
      {
        title: 'Complete JavaScript Course 2024',
        thumbnailUrl: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        description: 'Master JavaScript from scratch.',
        channelId: createdChannels[1]._id,
        uploader: createdUser._id,
        views: 89000,
        likes: 5400,
        dislikes: 120,
        category: 'JavaScript'
      },
      {
        title: 'Node.js Backend Architecture',
        thumbnailUrl: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        description: 'Learn how to build scalable backend systems.',
        channelId: createdChannels[2]._id,
        uploader: createdUser._id,
        views: 45000,
        likes: 3200,
        dislikes: 80,
        category: 'Node.js'
      },
      {
        title: 'Top 10 Web Development Trends',
        thumbnailUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        description: 'Stay ahead of the curve with these web dev trends.',
        channelId: createdChannels[3]._id,
        uploader: createdUser._id,
        views: 12000,
        likes: 800,
        dislikes: 20,
        category: 'Web Development'
      },
      {
        title: 'Lo-Fi Coding Music',
        thumbnailUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        description: 'Chill beats to code/study to.',
        channelId: createdChannels[4]._id,
        uploader: createdUser._id,
        views: 2000000,
        likes: 150000,
        dislikes: 1000,
        category: 'Music'
      },
      {
        title: 'Gaming Setup Tour 2024',
        thumbnailUrl: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        description: 'Tour of my ultimate productivity and gaming setup.',
        channelId: createdChannels[5]._id,
        uploader: createdUser._id,
        views: 500000,
        likes: 34000,
        dislikes: 800,
        category: 'Gaming'
      }
    ];

    const createdVideos = await Video.insertMany(videos);
    
    // Keep each channel's video reference list synchronized with its assigned video.
    await Promise.all(
      createdChannels.map((channel, index) => {
        channel.videos = [createdVideos[index]._id];
        return channel.save();
      })
    );

    console.log(`${createdVideos.length} Videos created.`);

    // 4. Add a sample comment to the first video
    const comment = await Comment.create({
      text: 'Great video! Very helpful.',
      videoId: createdVideos[0]._id,
      userId: createdUser._id,
    });
    
    createdVideos[0].comments.push(comment._id);
    await createdVideos[0].save();

    console.log('Sample comment created.');
    console.log('Database successfully seeded!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
