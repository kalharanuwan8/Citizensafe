import * as confirmationService from '../services/confirmationService'

export async function confirmationbyvote(req, res)
{
    try {
        const {disasterId, userId, vote} = req.body;
        const confirmation = await confirmationService.confirmbyvote({disasterId, userId, vote})
        return res.status(201).json({message:"successfully voted"
            
        })
    } catch (error) {
        if(error.code === 11000)
            res.json({message: "You have already voted"})
        else
        res.status(500).json({error:"Intenal Service Error"})
    }
}