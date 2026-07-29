import mongoose from 'mongoose';
import User from './models/User.js';
import Video from './models/Video.js';
import Channel from './models/Channel.js';
import connectDB from './config/db.js';

connectDB();

const fixDb = async () => {
  try {
    // 1. Fix the broken Unsplash URL for the Node.js video
    await Video.updateMany(
      { thumbnailUrl: 'https://images.unsplash.com/photo-1627398225056-f3a4115162a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80' },
      { $set: { thumbnailUrl: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80' } }
    );
    
    // 2. Fix any user avatars that are via.placeholder.com
    await User.updateMany(
      { avatar: { $regex: 'via.placeholder.com' } },
      { $set: { avatar: 'https://ui-avatars.com/api/?name=User' } }
    );
    
    // 3. Fix any channel banners that are via.placeholder.com
    await Channel.updateMany(
      { channelBanner: { $regex: 'via.placeholder.com' } },
      { $set: { channelBanner: 'https://placehold.co/800x200' } }
    );

    // 4. Fix any video thumbnails that are via.placeholder.com
    await Video.updateMany(
      { thumbnailUrl: { $regex: 'via.placeholder.com' } },
      { $set: { thumbnailUrl: 'https://placehold.co/320x180' } }
    );

    console.log('Database successfully updated!');
    process.exit(0);
  } catch (error) {
    console.error('Error fixing database:', error);
    process.exit(1);
  }
};

fixDb();
