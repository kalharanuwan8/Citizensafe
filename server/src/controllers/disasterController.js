import * as disasterService from "../services/disasterService.js";
import * as userService from "../services/userService.js";
import { getViewingUrl } from "../services/s3Service.js";

const refreshDisasterImages = async (disasters) => {
    if (!disasters) return disasters;
    
    // If it's a single object, wrap it
    const isArray = Array.isArray(disasters);
    let list = isArray ? disasters : [disasters];
    
    // Convert Mongoose documents to plain objects to avoid accidental persistence of signed URLs
    list = list.map(d => (typeof d.toObject === 'function' ? d.toObject() : d));
    
    await Promise.all(list.map(async (d) => {
        if (d.image && d.image.key) {
            try {
                d.image.url = await getViewingUrl(d.image.key);
            } catch (err) {
                console.error("Error refreshing image URL for", d._id, err);
            }
        }
    }));
    
    return isArray ? list : list[0];
};

//POST disaster
export async function createDisaster(req, res){
    try {
        const {
            disasterType,
            description,
            location,
            image
        } = req.body;
        const reportedBy = req.user.id;

        if(!disasterType || !description || !location || !reportedBy)
            return res.status(400).json({error: 'All fields are required'});

        const { savedDisaster, pointsAwarded } = await disasterService.createDisaster({
            disasterType,
            description,
            location,
            reportedBy,
            image
        })
        const refreshedDisaster = await refreshDisasterImages(savedDisaster);
        return res.status(201).json({
            message: "Disaster created successfully",
            pointsAwarded,
            data: refreshedDisaster
        });
            
    }
    catch(error){
        return res.status(500).json({error: error.message || "Internal Server Error"
        })
    }
}

export async function getAllDisasters(req, res){
    try{
        const data = await disasterService.getAllDisasters();
        const refreshedData = await refreshDisasterImages(data);
        return res.json({
            success: true,
            count: refreshedData.length,
            data: refreshedData
        });
    }
    catch(error)
    {
        return res.status(500).json({error: error.message || "Internal Service Error"})
    }
}

export async function getNearByDisasters(req, res){
    try{
        let {lattitude, longitude, radius, useHome} =  req.query;
        if (useHome === "true" || useHome === true)
        {
            const user = await userService.getUserProfile(req.user.id);
            if (!user.homeLocation || !user.homeLocation.coordinates || user.homeLocation.coordinates.length < 2) {
                return res.status(400).json({ error: "Home location not set" });
            }
            lattitude = user.homeLocation.coordinates[1];
            longitude = user.homeLocation.coordinates[0];
        } else {
            lattitude = parseFloat(lattitude);
            longitude = parseFloat(longitude);
        }

        if(radius < 5)
            radius = 5;
        else if (radius > 500)
            radius = 500;

        let maxDistance = radius * 1000;
        const data = await disasterService.getNearByDisasters(
            lattitude,
            longitude,
            maxDistance
        )
        return res.status(200).json({
            success: true,
            radius: `${radius}km`,
            count: data.length,
            data: await refreshDisasterImages(data)
        })
    }
    catch(error)
    {
        return res.status(500).json({error: error.message || "Internal Service Error"})
    }
}

export async function getDisasterByID(req, res) {
    try {
        const {id} = req.params;
        const disaster = await disasterService.getDisasterByID(id);
        const refreshedDisaster = await refreshDisasterImages(disaster);
        return res.status(200).json({
            success: true,
            data: refreshedDisaster
        })
    } catch (error) {
        return res.status(500).json({error: error.message || "Internal Server Error"})
    }
}

//admin manually updating the disaster status
export async function updateAdminDisasterConfirmation(req, res){
    try {
        const {id} = req.params;
        const {status }= req.body
        const disasterupdate = await disasterService.updateAdminDisasterConfirmation(id, status);
        return res.status(201).json({
            success: true,
            data: disasterupdate
        })
    } catch (error) {
        return res.status(500).json({
            error: error.message || "Internal Server Error"
        })
    }
}

export async function deleteDisasterbyadmin(req, res)
{
   try {
     const {id} = req.params;
     const role = req.user.role;
     const disasterdelete = await disasterService.deleteDisaster({disasterId: id, role})
     if (!disasterdelete) {
            return res.status(404).json({ message: "Disaster not found" });
        }
     return res.status(200).json({
        message: "Deletion Successful",
        disasterdelete: disasterdelete
     })
     
 
   } catch (error) {
    return res.status(500).json({
        error: error.message
    })
   }
}

export async function confirmDisasterByUser(req, res) {
    try {
        const { id } = req.params;
        const { imageUrl } = req.body;
        const userId = req.user.id; // from protect middleware

        const result = await disasterService.confirmDisaster(id, userId, imageUrl);
        return res.status(200).json(result);
    } catch (error) {
        if (error.message === "Image is required" || error.message === "You already confirmed this disaster") {
            return res.status(400).json({ error: error.message });
        }
        return res.status(500).json({ error: error.message || "Internal Server Error" });
    }
}
