const express = require('express');
const connectDB = require('./config/database');
const routes = require('./routes');
require('dotenv').config();
const cors = require('cors');
const path = require('path');


const app = express();
connectDB();
app.use(express.json());
app.use(cors());

app.use('/api', routes);

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
