const express = require( 'express');
const cors = require('cors');
const app = express();

const authRoutes = require('./routes/authRoutes.js')
const analysisRoutes = require('./routes/analysisRoutes.js')
const analyticsRoutes = require('./routes/analyticsRoutes.js')

app.use(express.json());

app.use(cors({
  origin: 'https://ai-dev-studio-mern.vercel.app', // tumhara actual Vercel URL
}));

app.get('/', (req, res) => {
  res.send('API is running');
});

app.use ('/api/auth', authRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/analytics', analyticsRoutes);

module.exports = app;