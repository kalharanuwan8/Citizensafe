import { generateUploadUrl, getViewingUrl } from "../services/s3Service.js";

export async function  getUploadUrl(req, res)
{
    try {
        const { folder } = req.query;
        const data = await generateUploadUrl(folder);
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

export async function getViewUrl(req, res) {
    try {
        const { key } = req.query;
        if (!key) {
            return res.status(400).json({ success: false, error: "Key is required" });
        }
        const url = await getViewingUrl(key);
        return res.status(200).json({
            success: true,
            url
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message      
        });
    }
}