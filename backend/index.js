require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');
const { fetchAndStoreCryptoData } = require('./services/cryptoService');

const app = express();
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
}));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));
app.use('/api/crypto', require('./routes/cryptoRoutes'));

app.get('/', (req, res) => {
  res.send('Welcome to the Crypto Tracker API');
});

cron.schedule('0 * * * *', () => {
  console.log('Running hourly crypto data update...');
  fetchAndStoreCryptoData();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));