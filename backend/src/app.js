const express = require( 'express');
const cors = require('cors');
const app = express();


const authRoutes = require('./routes/authRoutes.js')
const analysisRoutes = require('./routes/analysisRoutes.js')
const analyticsRoutes = require('./routes/analyticsRoutes.js')
const paymentRoutes = require('./routes/paymentRoutes.js');

app.use(express.json());

const allowedOrigins = [
  'http://localhost:5173',
  'https://ai-dev-studio-mern.vercel.app',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
}));

app.get('/', (req, res) => {
  res.send('API is running');
});

app.use ('/api/auth', authRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/payment', paymentRoutes);

module.exports = app;