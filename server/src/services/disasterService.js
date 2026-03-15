import Disaster from "../models/disaster.js"
import Confirmation from "../models/confirmation.js";
//disaster creation
export const createDisaster = async (data) =>{
    const newDisaster = new Disaster(data);
    return await newDisaster.save();
}
//Get all disasters
export const getAllDisasters = async() =>
{
    return Disaster.find();
}

//get nearby disasters
export const getNearByDisasters = async(latitude, longitude, maxDistanceInMeters = 5000) =>
{
    return await Disaster.find(
        {
            location: {
                $near:{
                    $geometry:{
                        type: "Point",
                        coordinates: [longitude, latitude]
                    },
                    $maxDistance: maxDistanceInMeters
                }
            }
        }
    )
}

export const getDisasterByID = async (disasterId) =>
{
    if(!disasterId)
        throw new Error ("Disaster not found")
    return await Disaster.findbyId(disasterId)
}
export const updateAdminDisasterConfirmation = async (disasterId, status) =>
{
    if(!disasterId)
        throw new Error ("Disaster not found")
    return await Disaster.findByIdAndUpdate(disasterId,
        {$set: {status: status}}
    );
}

export const deleteDisaster = async({disasterId, role}) =>
{
    if(role!= "admin"){
        throw new Error ("unauthorized")
}
    const deletingDisaster = Disaster.findById(disasterId)
    if(!deletingDisaster)
        throw new Error ("Disaster Not exists");
    
    await Confirmation.deleteMany({disasterId});
    await Disaster.findByIdAndDelete(disasterId);

    return {
        message: "Disaster Successfully Deleted",
        deletingDisaster
    };  

}