import express from 'express';
import connectDB from './config/db.js';


// Connect to database
connectDB();


// Middleware
app.use(express.json());

const app = express();

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});