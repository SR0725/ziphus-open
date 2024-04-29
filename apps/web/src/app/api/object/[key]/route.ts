import { bucketName, s3 } from "../s3";
import NodeCache from "node-cache";

const nodeCache = new NodeCache({ stdTTL: 300, checkperiod: 120 });

interface ImageCache {
  data: BodyInit | null | undefined;
  contentType: string;
}

export async function GET(
  request: Request,
  { params }: { params: { key: string } }
) {
  const { key } = params;

  if (!key) {
    return new Response(JSON.stringify({ error: "No key provided" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const cachedData = nodeCache.get(key) as ImageCache;
  if (cachedData) {
    nodeCache.set(key, cachedData, 300);
    return new Response(cachedData.data as BodyInit | null | undefined, {
      status: 200,
      headers: {
        "Content-Type": cachedData.contentType,
      },
    });
  }

  try {
    const data = await s3
      .getObject({
        Bucket: bucketName,
        Key: key,
      })
      .promise();

    if (!data.Body) {
      return new Response(JSON.stringify({ error: "File not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      nodeCache.set(
        key,
        {
          data: data.Body as BodyInit | null | undefined,
          contentType: data.ContentType as string,
        } as ImageCache,
        300
      );
      return new Response(data.Body as BodyInit | null | undefined, {
        status: 200,
        headers: { "Content-Type": "image/png" },
      });
    }
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to fetch file" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { key: string } }
) {
  const { key } = params;

  if (!key) {
    return new Response(JSON.stringify({ error: "No key provided" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    await s3
      .deleteObject({
        Bucket: bucketName,
        Key: key,
      })
      .promise();

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to delete file" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
