const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/internships', require('./routes/internships'));
app.use('/api/gossip', require('./routes/gossip'));
app.use('/api/happenings', require('./routes/happenings'));
app.use('/api/groups', require('./routes/groups'));
app.use('/api/dm', require('./routes/directMessages'));
app.use('/api/explore', require('./routes/explore'));
app.use('/api/stories', require('./routes/stories'));
app.use('/api/profile', require('./routes/profile'));

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'AITM Alumni Portal API' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});