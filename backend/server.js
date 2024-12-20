const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const homeRoutes = require('./routes/homeRoutes');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/', homeRoutes);

const PORT = 5001;
app.listen(PORT, ()=> {
    console.log('Server is running')
})