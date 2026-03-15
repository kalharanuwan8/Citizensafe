import * as disasterService from "../services/disasterService.js";

//POST disaster
export async function createDisaster(req, res){
    try {
        const {
            disasterType,
            description,
            location
        } = req.body;
        const reportedBy = req.user.id;

        if(!disasterType || !description || !location || !reportedBy)
            return res.status(400).json({error: 'All fields are required'});

        const disaster = await disasterService.createDisaster({
            disasterType,
            description,
            location,
            reportedBy
        })
        return res.status(201).json({message:"Disaster created successfully",
            data: disaster
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
        return res.json({
            success: true,
            count: data.length,
            data: data
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
        if (useHome == true)
        {
            lattitude = req.user.homelocation.coordinates[1];
            longitude = req.user.homelocation.coordinates[0];
        }

        if(radius < 5)
            radius = 5;
        else if (radius >20)
            radius = 20;

        maxDistance = radius * 1000;
        const data = await disasterService.getNearByDisasters(
            lattitude,
            longitude,
            maxDistance
        )
        return res.status(200).json({
            success: true,
            radius: `${radius}km`,
            count: data.length,
            data: data
        })
    }
    catch(error)
    {
        return res.status(500).json({error: error.message || "Internal Service Error"})
    }
}

export async function getDisasterByID(req, res) {
    try {
        const {disasterId} = req.params;
        const disaster = await disasterService.getDisasterByID(disasterId);
        return res.status(200).json({
            success: true,
            data: disaster
        })
    } catch (error) {
        
    }
}

//admin manually updating the disaster status
export async function updateAdminDisasterConfirmation(req, res){
    try {
        const {disasterId} = req.params;
        const {status }= req.body
        const disasterupdate = await disasterService.updateAdminDisasterConfirmation(disasterId, status);
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
