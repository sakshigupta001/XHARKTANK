require('dotenv').config();
const mongoose = require("mongoose")

function connectDB(){

    mongoose.connect(process.env.MONGO_CONNECTION_URL, { useNewUrlParser: 
        true, useUnifiedTopology: true});

        const connection= mongoose.connection;

        connection.once('open', function(){
            console.log("DATABASE CONNECTED");
        }).on('error', function(err){
            console.log("DATABASE CONNECTION FAILED");
        })
}

module.exports= connectDB;