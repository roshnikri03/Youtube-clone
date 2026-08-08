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

    // 2. Create a channel for the user
    const createdChannel = await Channel.create({
      channelName: 'Code with John',
      owner: createdUser._id,
      description: 'Coding tutorials and tech reviews by John Doe.',
      channelBanner: 'https://images.unsplash.com/photo-1550439062-609e1531270e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      subscribers: 5200,
    });
    
    // Add channel to user
    createdUser.channels.push(createdChannel._id);
    await createdUser.save();

    console.log('Channel created:', createdChannel.channelName);

    // 3. Create sample videos
    const videos = [
      {
        title: 'Learn React in 30 Minutes',
        thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        description: 'A quick tutorial to get started with React.',
        channelId: createdChannel._id,
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
        channelId: createdChannel._id,
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
        channelId: createdChannel._id,
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
        channelId: createdChannel._id,
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
        channelId: createdChannel._id,
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
        channelId: createdChannel._id,
        uploader: createdUser._id,
        views: 500000,
        likes: 34000,
        dislikes: 800,
        category: 'Gaming'
      }
    ];

    const createdVideos = await Video.insertMany(videos);
    
    // Keep the channel's video reference list synchronized with the inserted documents.
    createdChannel.videos = createdVideos.map(v => v._id);
    await createdChannel.save();

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
