const router = require("express").Router();
const Pitches= require("../db/models");
//to check if fields are valid or not
function notValid(value)
{
    if(typeof(value)==='string')
       value= value.trim();
    if(value==="" || value===null)
       return true;
    return false;   
}
//post a pitch
router.post("/", async (req,res)=>{
    const {entrepreneur,pitchTitle,pitchIdea, askAmount, equity}= req.body;
    //invalid request body
    if(notValid(entrepreneur) || notValid(pitchTitle) || notValid(pitchIdea) || notValid(askAmount) || notValid(equity) || (equity>100) || askAmount<=0 || equity<0)
        return res.status(400).send({error: "Invalid request body"});
    try
    {
        const pitch= new Pitches({
            entrepreneur: entrepreneur,
            pitchTitle: pitchTitle,
            pitchIdea: pitchIdea,
            askAmount: askAmount,
            equity: equity
        });
        //pitch created successfully
        const response= await pitch.save();
        return res.status(201).json({id:response._id});
    }catch(err){
        return res.status(400).send({ error: 'Something went wrong.'});
    }
});
//create counter offer
router.post("/:id/makeOffer", async (req,res)=>{
    
    const {investor, amount, equity, comment}= req.body;
    //invalid request body 
    if(notValid(investor) || notValid(comment) || (equity>100) || amount<=0 || equity<0)
        return res.status(400).send({error: "Invalid request body"});
    
    try{    
        //pitch not found
        const pitch= await Pitches.findOne({_id:req.params.id});
        if(!pitch)
            return res.status(404).json({error:"Pitch Not found"});
        //creating offer
        const offerOnPitch= {
            id: req.params.id,
            investor: investor,
            amount: amount,
            equity: equity
        };
        if(comment)
            offerOnPitch.comment= comment;
        //pushing offer to given pitch    
        const updateStatus= Pitches.updateOne({_id:req.params.id}, 
        {$push: {offers: offerOnPitch}},
        function(error, success)
        {
            if(error)
                console.log("Error in updating pitch",error);
            else
                console.log("Pitch updated successfully",success);   
        });
        if(!updateStatus)
            return res.status(404).json({error:"Pitch Not found"});
        return res.status(201).json({id:req.params.id});
    }catch(err){
        return res.status(400).json({error:"Something went wrong",err});
    }
});
//fetch all pitches in reverse chronological order
router.get("/", async (req,res)=>{
    try{

        //find  all pitches and sort them
        const allpitches= await Pitches.find({}).sort({ 
            $natural: -1 })
        const allpitchesArray= new Array(allpitches.length);
        for(i=0; i<allpitches.length; i++)
        {
            let offersOnPitch= new Array();
            const pitchInfo= {
                id: allpitches[i]._id, 
                entrepreneur: allpitches[i].entrepreneur,
                pitchTitle: allpitches[i].pitchTitle,
                pitchIdea: allpitches[i].pitchIdea,
                askAmount: (allpitches[i].askAmount), 
                equity: (allpitches[i].equity)
            }//pitchInfo
            for(j=0; j < allpitches[i].offers.length; j++)
            {           
                const offer={
                    id:  allpitches[i]._id,
                    investor:  allpitches[i].offers[j].investor,
                    amount:  (allpitches[i].offers[j].amount),
                    equity:  (allpitches[i].offers[j].equity),
                    comment:  allpitches[i].offers[j].comment
                }
                 offersOnPitch.push(offer);
            }//inner for loop  
            pitchInfo.offers= offersOnPitch;
            allpitchesArray[i]= pitchInfo;
        }
        return res.status(200).json(allpitchesArray);
    }catch(err){
        return res.status(400).json("wrong");
    }
});
//fetch single pitch
router.get("/:id", async (req,res)=>{
    
    try{
        //pitch not found
        const pitch= await Pitches.findOne({_id:req.params.id});
        if(!pitch)
            return res.status(404).json({error:"Pitch Not found"});
        //pitch found
        const offersOnPitch= new Array();
        for(ind=0; ind < pitch.offers.length; ind++)
        {           
            const offer={
            id:  req.params.id,
            investor:  pitch.offers[ind].investor,
            amount:  (pitch.offers[ind].amount),
            equity:  (pitch.offers[ind].equity),
            comment:  pitch.offers[ind].comment
            }
            offersOnPitch.push(offer);
        }
        //returning specific pitch
        return res.status(200).json({
            id: req.params.id, 
            entrepreneur: pitch.entrepreneur,
            pitchTitle: pitch.pitchTitle,
            pitchIdea: pitch.pitchIdea,
            askAmount: parseFloat(pitch.askAmount), 
            equity: parseFloat(pitch.equity),
            offers: offersOnPitch
        });
    }catch(err){
        return res.status(400).json({error:"Something went wrong"});
    }
});
module.exports= router;


// const router = require("express").Router();
// const pitchModel= require("../db/pitchSchema");
// const offerModel= require("../db/offerSchema");
// //to check if fields are valid or not
// function notValid(value)
// {
//     if(value==="" || value===null)
//        return true;
//     return false;   
// }
// //post a pitch
// router.post("/", async (req,res)=>{
//     const {entrepreneur,pitchTitle,pitchIdea, askAmount, equity}= req.body;
//     //invalid request body
//     if(notValid(entrepreneur) || notValid(pitchTitle) || notValid(pitchIdea) || notValid(askAmount) || notValid(equity) || (equity>100) || askAmount<=0)
//         return res.status(400).send({error: "Invalid request body"});
//     try
//     {
//         const newpitch= await pitchModel.create({
//             entrepreneur: entrepreneur,
//             pitchTitle: pitchTitle,
//             pitchIdea: pitchIdea,
//             askAmount: askAmount,
//             equity: equity
//         });
//         //pitch created successfully
//         return res.status(201).json({id:newpitch._id});
//     }catch(err){
//         return res.status(400).send({ error: 'Something went wrong.'});
//     }
// });
// //create counter offer
// router.post("/:id/makeOffer", async (req,res)=>{
    
//     const {investor, amount, equity, comment}= req.body;
//     //invalid request body 
//     if(notValid(investor) || notValid(comment) || (equity>100) || amount<=0)
//         return res.status(400).send({error: "Invalid request body"});
    
//     try{    
//         //pitch not found
//         // const pitch= await Pitches.findOne({_id:req.params.id});
//         // if(!pitch)
//         //     return res.status(404).json({error:"Pitch Not found"});
//         //creating offer
//         const offerOnPitch= await offerSchema.create({
//             id: req.params.id,
//             investor: investor,
//             amount: amount,
//             equity: equity,
//             comment: comment
//         });
//         //pushing offer to given pitch    
//         const updateStatus= pitchModel.updateOne({_id:req.params.id}, 
//         {$push: {offers: offerOnPitch}},
//         function(error, success)
//         {
//             if(error)
//                 console.log("Error in updating pitch",error);
//             else
//                 console.log("Pitch updated successfully",success);   
//         });
//         if(!updateStatus)
//             return res.status(404).json({error:"Pitch Not found"});
//         return res.status(201).json({id:offerOnPitch._id});
//     }catch(err){
//         return res.status(400).json({error:"Something went wrong",err});
//     }
// });
// //fetch all pitches in reverse chronological order
// router.get("/", async (req,res)=>{
//     try{
//         //find  all pitches and sort them
//         const allpitches= await pitchModel.find().sort({ 
//             createdAt: -1 }).populate("offers");
//         // const allpitchesArray= new Array(allpitches.length);
//         // for(i=0; i<allpitches.length; i++)
//         // {
//         //     let offersOnPitch= new Array();
//         //     const pitchInfo= {
//         //         id: allpitches[i]._id, 
//         //         entrepreneur: allpitches[i].entrepreneur,
//         //         pitchTitle: allpitches[i].pitchTitle,
//         //         pitchIdea: allpitches[i].pitchIdea,
//         //         askAmount: parseFloat(allpitches[i].askAmount), 
//         //         equity: parseFloat(allpitches[i].equity)
//         //     }//pitchInfo
//         //     for(j=0; j < allpitches[i].offers.length; j++)
//         //     {           
//         //         const offer={
//         //             id:  allpitches[i]._id,
//         //             investor:  allpitches[i].offers[j].investor,
//         //             amount:  parseFloat(allpitches[i].offers[j].amount),
//         //             equity:  parseFloat(allpitches[i].offers[j].equity),
//         //             comment:  allpitches[i].offers[j].comment
//         //         }
//         //          offersOnPitch.push(offer);
//         //     }//inner for loop  
//         //     pitchInfo.offers= offersOnPitch;
//         //     allpitchesArray[i]= pitchInfo;
//         // }
//         const pitches= allpitches.map((pitch)=>{
//             const pitchob= {
//                 id: pitch._id,
//                 entrepreneur: pitch.entrepreneur,
//                 pitchTitle: pitch.pitchTitle,
//                 pitchIdea: pitch.pitchIdea,
//                 askAmount: pitch.askAmount,
//                 equity: pitch.equity,
//             };
//             pitchob.offers= pitch.offers.map((offer)=>{
//                 return{
//                     id: req.params.id,
//                     investor: offer.investor,
//                     amount: offer.amount,
//                     equity: offer.equity,
//                     comment: offer.comment
//                 };
//             });
//             return pitchob;
//         });
//         return res.status(200).json(pitches);
//     }catch(err){
//         return res.status(400).send({ error: 'Something went wrong.'});
//     }
// });
// //fetch single pitch
// router.get("/:id", async (req,res)=>{
    
//     try{
//         //pitch not found
//         const pitch= await pitchModel.findById(req.params.id).populate("offers");
//         if(!pitch)
//             return res.status(404).json({error:"Pitch Not found"});
//         //pitch found
//         // const offersOnPitch= new Array();
//         // for(ind=0; ind < pitch.offers.length; ind++)
//         // {           
//         //     const offer={
//         //     id:  req.params.id,
//         //     investor:  pitch.offers[ind].investor,
//         //     amount:  parseFloat(pitch.offers[ind].amount),
//         //     equity:  parseFloat(pitch.offers[ind].equity),
//         //     comment:  pitch.offers[ind].comment
//         //     }
//         //     offersOnPitch.push(offer);
//         // }
//         // //returning specific pitch
//         // return res.status(200).json({
//         //     id: req.params.id, 
//         //     entrepreneur: pitch.entrepreneur,
//         //     pitchTitle: pitch.pitchTitle,
//         //     pitchIdea: pitch.pitchIdea,
//         //     askAmount: parseFloat(pitch.askAmount), 
//         //     equity: parseFloat(pitch.equity),
//         //     offers: offersOnPitch
//         // });
//         const pitchob= {
//             id: req.params.id,
//             entrepreneur: pitch._doc.entrepreneur,
//             pitchTitle: pitch._doc.pitchTitle,
//             pitchIdea: pitch._doc.pitchIdea,
//             askAmount: pitch._doc.askAmount,
//             equity: pitch._doc.equity,
//             offers: pitch._doc.offers
//         };
//         const offerob= pitch._doc.offers.map((offer)=>{
//             return{
//                 id: offer._id,
//                 investor: offer.investor,
//                 amount: offer.amount,
//                 equity: offer.equity,
//                 comment: offer.comment
//             };
//         });
//         pitchob.offers= offerob;
        
//         return res.status(200).json(pitchob);
//     }catch(err){
//         return res.status(400).json({error:"Something went wrong"});
//     }
// });
// module.exports= router;




// const router = require("express").Router();
// const pitchModel= require("../db/pitchModel");
// const offerModel= require("../db/offerSchema");

// //to check if fields are valid or not
// function notValid(value)
// {
//     if(value==="" || value===null)
//        return true;
//     return false;   
// }

// //post a pitch
// router.post("/", async (req,res)=>{

//     const {entrepreneur,pitchTitle,pitchIdea, askAmount, equity}= req.body;

//     //invalid request body
//     if(notValid(entrepreneur) || notValid(pitchTitle) || notValid(pitchIdea) || notValid(askAmount) || notValid(equity) || (equity>100) || askAmount<=0)
//     {
//         throw new Error("Invalid request body");
//     }

//     try
//     {
//         const newpitch= await pitchModel.create({
//             entrepreneur: entrepreneur,
//             pitchTitle: pitchTitle,
//             pitchIdea: pitchIdea,
//             askAmount: askAmount,
//             equity: equity
//         });

//         //pitch created successfully
//         return res.status(201).json({id:newpitch._id});
//     }catch(err){
//         return res.status(400).send({ error: 'Something went wrong.'});
//     }

// });

// //create counter offer
// router.post("/:id/makeOffer", async (req,res)=>{
    
//     const {investor, amount, equity, comment}= req.body;

//     //invalid request body 
//     if(notValid(investor) || notValid(comment) || (equity>100) || amount<=0)
//         throw new Error("Invalid request body");
    
//     try{    
//         //pitch not found
//         // const pitch= await Pitches.findOne({_id:req.params.id});
//         // if(!pitch)
//         //     return res.status(404).json({error:"Pitch Not found"});

//         //creating offer
//         const offerOnPitch= await offerModel.create({
//             investor: investor,
//             amount: amount,
//             equity: equity,
//             comment: comment
//         });

//         //pushing offer to given pitch    
//         const updateStatus= pitchModel.findByIdAndUpdate(req.params.id, 
//         {$push: {offers: offerOnPitch._id}},
//         {new: true},
//         );
//         if(!updateStatus)
//             return res.status(404).send("Pitch Not found");


//         return res.status(201).json({id:offerOnPitch._id});
//     }catch(err){
//         return res.status(400).send("Something went wrong");
//     }

// });

// //fetch all pitches in reverse chronological order
// router.get("/", async (req,res)=>{

//     try{
//         //find  all pitches and sort them
//         const allpitches= await pitchModel.find().
//         sort({createdAt: -1 }).populate("offers");

//         // const allpitchesArray= new Array(allpitches.length);

//         // for(i=0; i<allpitches.length; i++)
//         // {
//         //     let offersOnPitch= new Array();
//         //     const pitchInfo= {
//         //         id: allpitches[i]._id, 
//         //         entrepreneur: allpitches[i].entrepreneur,
//         //         pitchTitle: allpitches[i].pitchTitle,
//         //         pitchIdea: allpitches[i].pitchIdea,
//         //         askAmount: parseFloat(allpitches[i].askAmount), 
//         //         equity: parseFloat(allpitches[i].equity)
//         //     }//pitchInfo
//         //     for(j=0; j < allpitches[i].offers.length; j++)
//         //     {           
//         //         const offer={
//         //             id:  allpitches[i]._id,
//         //             investor:  allpitches[i].offers[j].investor,
//         //             amount:  parseFloat(allpitches[i].offers[j].amount),
//         //             equity:  parseFloat(allpitches[i].offers[j].equity),
//         //             comment:  allpitches[i].offers[j].comment
//         //         }
//         //          offersOnPitch.push(offer);
//         //     }//inner for loop  
//         //     pitchInfo.offers= offersOnPitch;
//         //     allpitchesArray[i]= pitchInfo;
//         // }
//         console.log("pitches:");
//         const pitches= allpitches.map((pitch)=>{
//             const pitchob= {
//                 id: pitch._id,
//                 entrepreneur: pitch.entrepreneur,
//                 pitchTitle: pitch.pitchTitle,
//                 pitchIdea: pitch.pitchIdea,
//                 askAmount: pitch.askAmount,
//                 equity: pitch.equity,
//             };
//             pitchob.offers= pitch.offers.map((offer)=>{
//                 return{
//                     id: offer._id,
//                     investor: offer.investor,
//                     amount: offer.amount,
//                     equity: offer.equity,
//                     comment: offer.comment
//                 };
//             });
//             return pitchob;
//         });
//         return res.status(200).json(pitches);
//     }catch(err){
//         return res.status(400).send({ error: 'Something went wrong.'});
//     }
// });


// //fetch single pitch
// router.get("/:id", async (req,res)=>{
    
//     try{
//         //pitch not found
//         const pitch= await pitchModel.findById(req.params.id).populate("offers");
//         if(!pitch)
//             return res.status(404).send("Pitch Not found");

//         //pitch found
//         // const offersOnPitch= new Array();

//         // for(ind=0; ind < pitch.offers.length; ind++)
//         // {           
//         //     const offer={
//         //     id:  req.params.id,
//         //     investor:  pitch.offers[ind].investor,
//         //     amount:  parseFloat(pitch.offers[ind].amount),
//         //     equity:  parseFloat(pitch.offers[ind].equity),
//         //     comment:  pitch.offers[ind].comment
//         //     }
//         //     offersOnPitch.push(offer);
//         // }

//         // //returning specific pitch
//         // return res.status(200).json({
//         //     id: req.params.id, 
//         //     entrepreneur: pitch.entrepreneur,
//         //     pitchTitle: pitch.pitchTitle,
//         //     pitchIdea: pitch.pitchIdea,
//         //     askAmount: parseFloat(pitch.askAmount), 
//         //     equity: parseFloat(pitch.equity),
//         //     offers: offersOnPitch
//         // });
//         const pitchob= {
//             id: req.params.id,
//             entrepreneur: pitch._doc.entrepreneur,
//             pitchTitle: pitch._doc.pitchTitle,
//             pitchIdea: pitch._doc.pitchIdea,
//             askAmount: pitch._doc.askAmount,
//             equity: pitch._doc.equity,
//             offers: pitch._doc.offers
//         };

//         const offerob= pitch._doc.offers.map((offer)=>{
//             return{
//                 id: offer._id,
//                 investor: offer.investor,
//                 amount: offer.amount,
//                 equity: offer.equity,
//                 comment: offer.comment
//             };
//         });
//         pitchob.offers= offerob;
        
//         return res.status(200).json(pitchob);
//     }catch(err){
//         return res.status(400).json({error:"Something went wrong"});
//     }
// });

// module.exports= router;