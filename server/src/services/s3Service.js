import { PutObjectCommand } from "@aws-sdk/client-s3";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";
import {s3} from "../config/aws.config.js";
import crypto from 'crypto';
import dotenv from 'dotenv'

dotenv.config()
export const generateUploadUrl = async() =>
{
    const key = `disasters/${crypto.randomUUID()}.jpg`;
    console.log("Generated key:", key,
        process.env.S3_BUCKET_NAME
    );

    const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
        ContentType: "images/jpeg"
    })
    const uploadurl = await getSignedUrl(s3, command, {expiresIn: 60});
    return {
        uploadurl,
        key
    }
}