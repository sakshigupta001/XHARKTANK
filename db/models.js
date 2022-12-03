const mongoose= require("mongoose");

const pitchOfferSchema= new mongoose.Schema({
    id: {type: String, required:true},
    investor: {type: String, required:true},
    amount: {type: Number, required:true},
    equity: {type: Number, required:true},
    comment: {type: String, required:true}
});
const pitchSchema= new mongoose.Schema({
    entrepreneur: {type: String, required:true},
    pitchTitle: {type: String, required:true},
    pitchIdea: {type: String, required:true},
    askAmount: {type: Number, required:true},
    equity: {type: Number, required:true},
    offers: [pitchOfferSchema]
    },{
        versionKey: false
});
module.exports= mongoose.model("pitch", pitchSchema);