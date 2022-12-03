const mongoose = require("mongoose");
const pitches= require("../db/models");

function connectDB(){

    mongoose.connect("mongodb://localhost:27017/xharktank", { serverSelectionTimeoutMS: 10000, connectTimeoutMS:10000, socketTimeoutMS:10000, useNewUrlParser: 
        true, useUnifiedTopology: true});

        const connection= mongoose.connection;

        connection.once('open', async function(){
            console.log("DATABASE CONNECTED");
            await pitches.deleteMany({});
        }).on('error', function(err){
            console.log("DATABASE CONNECTION FAILED");
        })
}

module.exports= connectDB;