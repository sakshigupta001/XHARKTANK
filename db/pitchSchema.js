const mongoose= require("mongoose");

const pitchSchema= new mongoose.Schema({

    entrepreneur: {type: String, required:true},
    pitchTitle: {type: String, required:true},
    pitchIdea: {type: String, required:true},
    askAmount: {type: Number, required:true},
    equity: {type: Number, required:true},
    offers: [{
        type: mongoose.Types.ObjectId,
        ref: 'offers'
    }]
    },
    {
        timestamps: true,
        versionKey: false
    });

module.exports= mongoose.model("pitch", pitchSchema);
