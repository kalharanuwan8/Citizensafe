import Disaster from "../models/disaster.js"
import Confirmation from "../models/confirmation.js";
import Point from "../models/point.js";
import User from "../models/user.js";
//disaster creation
export const createDisaster = async (data) =>{
    const user = await User.findById(data.reportedBy);
    if (user && user.verifiedBadge) {
        data.status = "Active";
        data.isConfirmed = true;
    } else {
        data.status = "Unverified";
        data.isConfirmed = false;
    }

    const newDisaster = new Disaster(data);
    const savedDisaster = await newDisaster.save();

    // Award points for reporting
    let pointsAwarded = 2; // Base report points
    let reason = "Reported a disaster";

    if (data.image && (data.image.url || data.image.key)) {
        pointsAwarded += 2; // Bonus for photo
        reason = "Reported a disaster with photo proof";
    }

    const point = new Point({ 
        userId: data.reportedBy, 
        points: pointsAwarded, 
        reason, 
        referenceId: savedDisaster._id 
    });
    await point.save();

    if (user) {
        user.points = (user.points || 0) + pointsAwarded;
        await user.save();
    }

    return { savedDisaster, pointsAwarded };
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
    return await Disaster.findById(disasterId)
}
export const updateAdminDisasterConfirmation = async (disasterId, status) =>
{
    if(!disasterId)
        throw new Error ("Disaster not found")
    
    const disaster = await Disaster.findById(disasterId);
    if (!disaster) throw new Error("Disaster not found");

    const oldStatus = disaster.status;
    disaster.status = status;
    await disaster.save();

    // Point adjustments based on admin action
    // If transitioning to a "Valid" state (Active or Solved) from something else
    if ((status === "Active" || status === "Solved") && oldStatus !== "Active" && oldStatus !== "Solved") {
        const point = new Point({
            userId: disaster.reportedBy,
            points: 3,
            reason: "Report verified by Admin",
            referenceId: disaster._id
        });
        await point.save();

        const user = await User.findById(disaster.reportedBy);
        if (user) {
            user.points = (user.points || 0) + 3;
            await user.save();
        }
    } 
    // If transitioning to "False" (Reject)
    else if (status === "False" && oldStatus !== "False") {
        const point = new Point({
            userId: disaster.reportedBy,
            points: -1,
            reason: "False alarm reported",
            referenceId: disaster._id
        });
        await point.save();

        const user = await User.findById(disaster.reportedBy);
        if (user) {
            user.points = (user.points || 0) - 1;
            await user.save();
        }
    }

    return disaster;
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

export const confirmDisaster = async (disasterId, userId, imageUrl) => {
    if (!imageUrl) throw new Error("Image is required");
    
    const existingConfirmation = await Confirmation.findOne({ disasterId, userId });
    if (existingConfirmation) {
        throw new Error("You already confirmed this disaster");
    }

    const confirmation = new Confirmation({ disasterId, userId, vote: "confirm" });
    await confirmation.save();

    const disaster = await Disaster.findById(disasterId);
    if (disaster) {
        disaster.confirmationCount += 1;
        if (disaster.confirmationCount >= 5 && disaster.status === "Unverified") {
            disaster.status = "Active";
            disaster.isConfirmed = true;
        } else if (disaster.confirmationCount >= 10 && disaster.status === "False") {
            disaster.status = "Active"; 
        }
        await disaster.save();
    }

    const point = new Point({ userId, points: 5, reason: "Confirmed Disaster", referenceId: disasterId });
    await point.save();

    const user = await User.findById(userId);
    if (user) {
        user.points = (user.points || 0) + 5;
        if (user.points >= 50 && !user.verifiedBadge) {
            user.verifiedBadge = true;
        }
        await user.save();
    }

    return { message: "Disaster confirmed successfully" };
};