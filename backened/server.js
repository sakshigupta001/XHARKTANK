require('dotenv').config();
const express= require("express");
const cors= require("cors");
const app= express();

const PORTUSED= process.env.PORTUSED;

connectDb= require("./db/config");
connectDb();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use("/pitches", require("./routes/pitch"));

app.listen(PORTUSED, (error)=>{
     
    if(!error)
        console.log(`SERVER RUNNING ON PORT: http://localhost:${PORTUSED}`);
    else    
        console.log("Server can't start")
        
});
