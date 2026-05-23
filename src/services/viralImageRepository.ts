import type { UploadApiResponse } from "cloudinary";
import { ObjectId } from "mongodb";
import { getCloudinary } from "@/lib/cloudinary";
import { getDb } from "@/lib/mongodb";

export type ViralImage = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  publicId: string;
  width?: number;
  height?: number;
  format?: string;
  createdAt: string;
};

type ViralImageDocument = {
  _id: ObjectId;
  title: string;
  description: string;
  imageUrl: string;
  publicId: string;
  width?: number;
  height?: number;
  format?: string;
  createdAt: Date;
};

const toViralImage = (image: ViralImageDocument): ViralImage => ({
  id: image._id.toString(),
  title: image.title,
  description: image.description,
  imageUrl: image.imageUrl,
  publicId: image.publicId,
  width: image.width,
  height: image.height,
  format: image.format,
  createdAt: image.createdAt.toISOString(),
});

function uploadBuffer(buffer: Buffer, folder = "viral-topic/images") {
  const cloudinary = getCloudinary();

  return new Promise<UploadApiResponse>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        transformation: [{ quality: "auto", fetch_format: "auto" }],
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Image upload failed"));
          return;
        }

        resolve(result);
      },
    );

    stream.end(buffer);
  });
}

export async function getViralImages(limit = 8) {
  const db = await getDb();
  const images = await db
    .collection<ViralImageDocument>("viral_images")
    .find({})
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();

  return images.map(toViralImage);
}

export async function createViralImage(input: {
  title: string;
  description: string;
  file: File;
}) {
  const arrayBuffer = await input.file.arrayBuffer();
  const uploaded = await uploadBuffer(Buffer.from(arrayBuffer));
  const db = await getDb();
  const document = {
    title: input.title,
    description: input.description,
    imageUrl: uploaded.secure_url,
    publicId: uploaded.public_id,
    width: uploaded.width,
    height: uploaded.height,
    format: uploaded.format,
    createdAt: new Date(),
  };

  const result = await db.collection<Omit<ViralImageDocument, "_id">>("viral_images").insertOne(document);

  return toViralImage({ _id: result.insertedId, ...document });
}

