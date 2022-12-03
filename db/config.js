require('dotenv').config();
const mongoose = require("mongoose");
// const pitchModel= require("../db/pitchSchema");
// const offerModel= require("../db/offerSchema");
//const MONGO_CONNECTION_URL= "mongodb://localhost:27017/xharktank";
const pitches= require("../db/models");

async function deleteCollection(){
    const db = mongoose.connection.db;

    // Get all collections
    const collections = await db.listCollections().toArray();

    // Create an array of collection names and drop each collection
    collections
      .map((collection) => collection.name)
      .forEach(async (collectionName) => {
        if(collectionName=='pitches' || collectionName=='offers')
        {
            //db.dropCollection(collectionName);
            //db.collectionName.deleteMany({});
        }      
      });
}

function connectDB(){

    mongoose.connect("mongodb://localhost:27017/xharktank", { serverSelectionTimeoutMS: 10000, connectTimeoutMS:10000, socketTimeoutMS:10000, useNewUrlParser: 
        true, useUnifiedTopology: true});

        const connection= mongoose.connection;

        connection.once('open', async function(){
            console.log("DATABASE CONNECTED");
            // pitchModel.deleteMany({});
            // offerModel.deleteMany({});
            await pitches.deleteMany({});
            //deleteCollection();
        }).on('error', function(err){
            console.log("DATABASE CONNECTION FAILED");
        })
}

module.exports= connectDB;