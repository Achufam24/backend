//require dotenv
require('dotenv').config()

const express = require('express');
const workoutRoutes = require('./routes/workouts');
const userRoutes = require('./routes/user')

const mongoose = require('mongoose');

//installing cors
var cors = require('cors')


const app = express();

//middlewares
app.use(cors({credentials:true, origin:true}));
app.use(express.json());
app.use((req,res,next) =>{
    console.log(req.path,req.method);
    next();
})
//routes
app.use('/api/workouts/',workoutRoutes);
app.use('/api/user/',userRoutes);

//connect to db
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    //listen for requests
    app.listen(process.env.PORT, () => {
        console.log('connected to db & listening at port', process.env.PORT);
    })
}).catch((error) => {
    console.log(error);
})


