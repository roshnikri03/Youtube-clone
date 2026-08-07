import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import channelRoutes from './routes/channelRoutes.js';
import videoRoutes from './routes/videoRoutes.js';
import commentRoutes from './routes/commentRoutes.js';


// Connect to database
await connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/channels', channelRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/comments', commentRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


// roshnikumari90403_db_user
// P3slRESfBDmcFeNP
// mongodb+srv://<db_username>:P3slRESfBDmcFeNP@cluster0.l4psoig.mongodb.net/?appName=Cluster0