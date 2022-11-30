const mongoose= require("mongoose");

const pitchOfferSchema= new mongoose.Schema({
    id: {type: String},
    investor: {type: String},
    amount: {type: mongoose.Types.Decimal128},
    equity: {type: mongoose.Types.Decimal128},
    comment: {type: String}
});
const pitchSchema= new mongoose.Schema({

    entrepreneur: {type: String, required:true},
    pitchTitle: {type: String, required:true},
    pitchIdea: {type: String, required:true},
    askAmount: {type: mongoose.Types.Decimal128, required:true},
    equity: {type: mongoose.Types.Decimal128, required:true},
    offers: [pitchOfferSchema]
    },{
        versionKey: false
});

module.exports= mongoose.model("pitch", pitchSchema);

// const mongoose= require("mongoose");

// function getValue(value) {
//     if (typeof value !== 'undefined') {
//        return parseFloat(value.toString());
//     }
//     return value;
// };

// const pitchOfferSchema= new mongoose.Schema({
//     id: {type:String},
//     investor: {type:String},
//     amount: {
//         type: mongoose.Types.Decimal128,
//         get: getValue
//     },
//     equity: {
//         type: mongoose.Types.Decimal128,
//         get: getValue
//     },
//     comment: {type:String}

// }, {toJSON: {getters: true}});
// const pitchSchema= new mongoose.Schema({
//     id: {type: String, required:true},
//     entrepreneur: {type: String, required:true},
//     pitchTitle: {type: String, required:true},
//     pitchIdea: {type: String, required:true},
//     askAmount: {
//         type: mongoose.Types.Decimal128,
//         required: true,
//         get: getValue
//     },
//     equity: {
//         type: mongoose.Types.Decimal128,
//         required: true,
//         get: getValue
//     },
//     offers: [pitchOfferSchema]
//     },
//     {
//         versionKey: false
//     },
//    {toJSON: {getters: true}});


// module.exports= mongoose.model("pitch", pitchSchema);