require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const path = require('path');

const app = express();
const server = http.createServer(app);
require('./socket')(server);

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/chat', require('./routes/chat'));

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('MongoDB connected');
  server.listen(5000, () => console.log('Server started on port 5000'));
});
