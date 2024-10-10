const express = require('express');
const connectDB = require('./config/database');
const routes = require('./routes');
require('dotenv').config();
const cors = require('cors');
const path = require('path');


const app = express();
connectDB();
app.use(express.json());
app.use(cors(
  {
    origin: 'http://localhost:4200',
    credentials: true,
  }
));

app.use('/api', routes);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
