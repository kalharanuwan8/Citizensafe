import Confirmation from '../models/confirmation'
import Disaster from '../models/disaster';

export const confirmbyvote = async (data) =>
{
    const existingvote = await Confirmation.findOne({
        disasterId: data.disasterId,
        userId: data.userId
    })

    const newconfirmation =  new Confirmation(data);
    await newconfirmation.save()

    const votecount = await Confirmation.countDocuments({disasterId: data.disasterId, vote: "confirm"
    })
    if (votecount>=10)
        await Disaster.findByIdAndUpdate(data.disasterId,
    {
        $set:{
            isConfirmed: true
        }
    },
    {new: true, runValidators: true}
)
return {
    confirmation: newconfirmation,
    votecount: votecount,
    isConfirmed: votecount >=10
}
}