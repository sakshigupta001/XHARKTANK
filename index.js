require('dotenv').config();
const express= require("express");
const cors= require("cors");
const bodyParser= require("body-parser");
const app= express();

const PORTUSED= 8081;

connectDb= require("./db/config");
connectDb();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use("/pitches", require("./routes/pitch"));

app.listen(PORTUSED, (error)=>{
     
    if(!error)
        console.log(`SERVER RUNNING ON PORT: http://localhost:${PORTUSED}`);
    else    
        console.log("Server can't start");   
});
