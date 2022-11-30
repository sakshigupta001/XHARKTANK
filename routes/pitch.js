const router = require("express").Router();
const Pitches= require("../db/models");

//post a pitch
router.post("/", async (req,res)=>{

    const {entrepreneur,pitchTitle,pitchIdea, askAmount, equity}= req.body;

    //invalid request body
    if(!entrepreneur || !pitchTitle || !pitchIdea || !askAmount || !equity || (equity>100))
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
        return res.status(201).json({id:response.id});
    }catch(err){
        return res.status(400).send({ error: 'Something went wrong.'});
    }

});

//create counter offer
router.post("/:id/makeOffer", async (req,res)=>{
    
    const {investor, amount, equity, comment}= req.body;

    //invalid request body 
    if(!investor || !amount || !equity || (equity>100))
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
        Pitches.updateOne({_id:req.params.id}, 
        {$push: {offers: offerOnPitch}},
        function(error, success)
        {
            if(error)
                console.log("Error in updating pitch",error);
            else
                console.log("Pitch updated successfully",success);   
        });

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
                askAmount: parseFloat(allpitches[i].askAmount), 
                equity: parseFloat(allpitches[i].equity)
            }//pitchInfo
            for(j=0; j < allpitches[i].offers.length; j++)
            {           
                const offer={
                    id:  allpitches[i]._id,
                    investor:  allpitches[i].offers[j].investor,
                    amount:  parseFloat(allpitches[i].offers[j].amount),
                    equity:  parseFloat(allpitches[i].offers[j].equity),
                    comment:  allpitches[i].offers[j].comment
                }
                 offersOnPitch.push(offer);
            }//inner for loop  
            pitchInfo.offers= offersOnPitch;
            allpitchesArray[i]= pitchInfo;
        }

        return res.status(200).json(allpitchesArray);
    }catch(err){
        return res.status(400).send({ error: 'Something went wrong.'});
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
            amount:  parseFloat(pitch.offers[ind].amount),
            equity:  parseFloat(pitch.offers[ind].equity),
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
        return res.status(404).json({error:"Something went wrong"});
    }
});

module.exports= router;