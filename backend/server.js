const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const homeRoutes = require('./routes/homeRoutes');
const authRoutes = require('./routes/authRoutes')

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

connectDB()

app.use('/', homeRoutes);
app.use('/api/auth', authRoutes);

const PORT = 5001;
app.listen(PORT, ()=> {
    console.log('Server is running')
})