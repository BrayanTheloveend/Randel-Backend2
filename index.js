//IMPORTS

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const ToggleRoute = require('./endpoint').router
const mongoose = require('mongoose');
//const corsOptions =  require('./Config/corsOptions')
const cors = require('cors')
require('dotenv').config()



// app.use(credentials);

// Cross Origin Resource Sharing
// app.use(cors(corsOptions));
//Encryptment
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

//cors & cookies

app.use(cors())
app.use(cookieParser());



// //image
// app.use('/image', express.static(path.join(__dirname,'/Public/image')))

// //API TOGGLE ROUTE
app.use('/api', ToggleRoute);


//PORT
const PORT = 5000;


app.get('/', (req, res)=>{

    const root = path.join(__dirname, '/index.html')
    res.setHeader("Content-type", 'text/html');
    res.status(200).sendFile(root)
})

mongoose.connect(process.env.DATABASE_URI)

const connection = mongoose.connection;
connection.once('open', () => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});