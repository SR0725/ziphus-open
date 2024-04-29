import sharp from "sharp";
import axiosInstance from "@/utils/axios";
import { bucketName, s3 } from "./s3";

const MAX_IMAGE_WIDTH = 3840;
const MAX_IMAGE_HEIGHT = 2160;

const allowedImageType = [
  {
    type: "image/jpeg",
    ext: "jpg",
  },
  {
    type: "image/png",
    ext: "png",
  },
  {
    type: "image/webp",
    ext: "webp",
  },
  {
    type: "image/gif",
    ext: "gif",
  },
  {
    type: "image/svg+xml",
    ext: "svg",
  },
  {
    type: "image/bmp",
    ext: "bmp",
  },
  {
    type: "image/tiff",
    ext: "tiff",
  },
];

export async function POST(request: Request) {
  const formData = await request.formData();
  const image = formData.get("image") as File;
  const cardId = formData.get("cardId") as string;
  const authorization = request.headers.get("authorization");

  if (!image || !cardId) {
    return new Response(
      JSON.stringify({ error: "No image uploaded or No Card Id provider" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const imageType = allowedImageType.find((type) => type.type === image.type);

  if (!imageType) {
    return new Response(JSON.stringify({ error: "Invalid image type." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const rawBuffer = Buffer.from(await image.arrayBuffer());
  const compressedBuffer = await sharp(rawBuffer)
    .resize(MAX_IMAGE_WIDTH, MAX_IMAGE_HEIGHT, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .jpeg({ quality: 90, force: false })
    .png({ quality: 90, force: false })
    .webp({ quality: 90, force: false })
    .toBuffer();

  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${imageType.ext}`;

  try {
    const data = await s3
      .upload({
        Bucket: bucketName,
        Key: fileName,
        Body: compressedBuffer,
        ACL: "public-read",
        ContentType: imageType.type,
      })
      .promise();

    axiosInstance.defaults.headers.authorization = authorization;
    const response = await axiosInstance.post(`/card/${cardId}/image`, {
      key: data.Key,
      url: data.Location,
      bytes: Buffer.byteLength(compressedBuffer),
    });

    return new Response(
      JSON.stringify({
        key: data.Key,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to upload file" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
