import AWS from "aws-sdk";

export const bucketName = "ziphus";

export const s3 = new AWS.S3({
  accessKeyId: process.env.C2_OBJECT_STORAGE_STORAGE_KEY,
  secretAccessKey: process.env.C2_OBJECT_STORAGE_PRIVATE_KEY,
  endpoint: process.env.C2_OBJECT_STORAGE_ENDPOINT,
  s3ForcePathStyle: true,
  signatureVersion: "v4",
});
