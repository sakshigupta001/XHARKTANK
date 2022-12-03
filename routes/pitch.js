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

//api- post a pitch
router.post("/", async (req,res)=>{

    const {entrepreneur,pitchTitle,pitchIdea, askAmount, equity}= req.body;
    
    //invalid request body
    if(!Object.keys(req.body).length || notValid(entrepreneur) || notValid(pitchTitle) || notValid(pitchIdea) || notValid(askAmount) || notValid(equity) || (equity>100) || askAmount<=0 || equity<0)
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

        //returning successful response
        return res.status(201).json({id:response._id});
    }catch(err){
        return res.status(400).send({ error: 'Something went wrong.'});
    }
});

//api- create counter offer
router.post("/:id/makeOffer", async (req,res)=>{
    
    //checking all keys present or not
    if(!req.body.hasOwnProperty('investor') || !req.body.hasOwnProperty('amount') || !req.body.hasOwnProperty('equity') || !req.body.hasOwnProperty('comment'))
        return res.status(400).send({error: "Invalid request body"});

    const {investor, amount, equity, comment}= req.body;

    //invalid request body 
    if(!Object.keys(req.body).length || notValid(investor) || notValid(amount) || notValid(equity) || notValid(comment) || (equity>100) || amount<=0 || equity<0)
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
            equity: equity,
            comment: comment
        };
            
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

        //pitch not updated
        if(!updateStatus)
            return res.status(404).json({error:"Pitch Not found"});

        //returning successful response    
        return res.status(201).json({id:req.params.id});
    }catch(err){
        return res.status(400).json({error:"Something went wrong",err});
    }
});

//api- fetch all pitches in reverse chronological order
router.get("/", async (req,res)=>{
    try{

        //find  all pitches and sort them
        const allpitches= await Pitches.find({}).sort({ 
            $natural: -1 });
        
        //saving all pitches in array according to response requirement    
        const allpitchesArray= new Array(allpitches.length);
        for(i=0; i<allpitches.length; i++)
        {
            let offersOnPitch= new Array();
            const pitchInfo= {
                id: allpitches[i]._id, 
                entrepreneur: allpitches[i].entrepreneur,
                pitchTitle: allpitches[i].pitchTitle,
                pitchIdea: allpitches[i].pitchIdea,
                askAmount: allpitches[i].askAmount, 
                equity: allpitches[i].equity
            }//pitchInfo
            for(j=0; j < allpitches[i].offers.length; j++)
            {           
                const offer={
                    id:  allpitches[i]._id,
                    investor:  allpitches[i].offers[j].investor,
                    amount:  allpitches[i].offers[j].amount,
                    equity:  allpitches[i].offers[j].equity,
                    comment:  allpitches[i].offers[j].comment
                }
                 offersOnPitch.push(offer);
            }//inner for loop  
            pitchInfo.offers= offersOnPitch;
            allpitchesArray[i]= pitchInfo;
        }

        //returning array
        return res.status(200).json(allpitchesArray);
    }catch(err){
        return res.status(400).json("wrong");
    }
});

//api-fetch single pitch
router.get("/:id", async (req,res)=>{
    
    try{
        //pitch not found
        const pitch= await Pitches.findOne({_id:req.params.id});
        if(!pitch)
            return res.status(404).json({error:"Pitch Not found"});
        
        //pitch found
        const offersOnPitch= new Array();

        //saving all offfers of pitch in array according to response requirement    
        for(ind=0; ind < pitch.offers.length; ind++)
        {           
            const offer={
            id:  req.params.id,
            investor:  pitch.offers[ind].investor,
            amount:  pitch.offers[ind].amount,
            equity:  pitch.offers[ind].equity,
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
            askAmount: pitch.askAmount, 
            equity: pitch.equity,
            offers: offersOnPitch
        });
    }catch(err){
        return res.status(400).json({error:"Something went wrong"});
    }
});
module.exports= router;