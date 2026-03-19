import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";
import {s3} from "../config/aws.config.js";
import crypto from 'crypto';
import dotenv from 'dotenv'

dotenv.config()
export const generateUploadUrl = async(folder = 'disasters') =>
{
    const key = `${folder}/${crypto.randomUUID()}.jpg`;
    console.log("Generated key:", key,
        process.env.S3_BUCKET_NAME
    );

    const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
        ContentType: "image/jpeg"
    })
    const uploadurl = await getSignedUrl(s3, command, {expiresIn: 3600});
    return {
        uploadurl,
        key
    }
}

export const getViewingUrl = async (key) => {
    if (!key) throw new Error("Key is required");
    const command = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
    });
    return await getSignedUrl(s3, command, { expiresIn: 3600 });
};