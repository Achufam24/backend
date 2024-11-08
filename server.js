//require dotenv
require('dotenv').config()

const express = require('express');
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
app.use('/api/v1/user/',userRoutes);

//connect to db
mongoose.connect("mongodb+srv://Tracman:Achufam24@cluster0.ittx4rp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
.then(() => {
    //listen for requests
    app.listen(process.env.PORT, () => {
        console.log('connected to db & listening at port', process.env.PORT);
    })
}).catch((error) => {
    console.log(error);
})


