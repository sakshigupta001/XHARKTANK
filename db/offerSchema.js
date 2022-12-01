const mongoose= require("mongoose");

const pitchOfferSchema= new mongoose.Schema({
    id: {type: String, required:true},
    investor: {type: String, required:true},
    amount: {type: Number, required:true},
    equity: {type: Number, required:true},
    comment: {type: String, required:true}
},
{timestamps:true}
);

module.exports= mongoose.model("offers", pitchOfferSchema);