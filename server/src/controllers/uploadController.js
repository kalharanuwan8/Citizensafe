import { generateUploadUrl } from "../services/s3Service.js";

export async function  getUploadUrl(req, res)
{
    try {
        const data = await generateUploadUrl();
        return res.status(200).json({
            success: true,
            data
        })
    } catch (error) {
        return res.status(500).json({
            error: error.message      
        })
    }
}