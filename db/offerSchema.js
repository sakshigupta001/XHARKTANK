const mongoose= require("mongoose");

const pitchOfferSchema= new mongoose.Schema({
    
    investor: {type: String, required:true},
    amount: {type: Number, required:true},
    equity: {type: Number, required:true},
    comment: {type: String, required:true}
},
{timestamps:true}
);

const offerModel= mongoose.model("offer", pitchOfferSchema);
offerModel.deleteMany({});  
module.exports= offerModel;

//id: {type: String, required:true},