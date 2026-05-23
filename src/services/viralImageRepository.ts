import type { UploadApiResponse } from "cloudinary";
import { ObjectId } from "mongodb";
import { getCloudinary } from "@/lib/cloudinary";
import { getDb } from "@/lib/mongodb";

export type ViralImage = {
  id: string;
  title: string;
  description: string;
  titleHtml?: string;
  descriptionHtml?: string;
  coverImageUrl: string;
  images: ViralImageAsset[];
  imageCount: number;
  createdAt: string;
};

export type ViralImageAsset = {
  imageUrl: string;
  publicId: string;
  width?: number;
  height?: number;
  format?: string;
};

type ViralImageDocument = {
  _id: ObjectId;
  title: string;
  description: string;
  titleHtml?: string;
  descriptionHtml?: string;
  coverImageUrl?: string;
  images?: ViralImageAsset[];
  imageUrl: string;
  publicId: string;
  width?: number;
  height?: number;
  format?: string;
  createdAt: Date;
};

const getAssets = (image: ViralImageDocument): ViralImageAsset[] => {
  if (image.images?.length) {
    return image.images;
  }

  return [
    {
      imageUrl: image.imageUrl,
      publicId: image.publicId,
      width: image.width,
      height: image.height,
      format: image.format,
    },
  ];
};

const toViralImage = (image: ViralImageDocument): ViralImage => {
  const assets = getAssets(image);
  const cover = image.coverImageUrl ?? assets[0]?.imageUrl ?? image.imageUrl;

  return {
    id: image._id.toString(),
    title: image.title,
    description: image.description,
    titleHtml: image.titleHtml,
    descriptionHtml: image.descriptionHtml,
    coverImageUrl: cover,
    images: assets,
    imageCount: assets.length,
    createdAt: image.createdAt.toISOString(),
  };
};

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

export async function getViralImage(id: string) {
  if (!ObjectId.isValid(id)) {
    return null;
  }

  const db = await getDb();
  const image = await db.collection<ViralImageDocument>("viral_images").findOne({ _id: new ObjectId(id) });

  return image ? toViralImage(image) : null;
}

export async function createViralImage(input: {
  title: string;
  description: string;
  titleHtml?: string;
  descriptionHtml?: string;
  files: File[];
}) {
  const uploadedImages = await Promise.all(
    input.files.map(async (file) => {
      const arrayBuffer = await file.arrayBuffer();
      const uploaded = await uploadBuffer(Buffer.from(arrayBuffer));

      return {
        imageUrl: uploaded.secure_url,
        publicId: uploaded.public_id,
        width: uploaded.width,
        height: uploaded.height,
        format: uploaded.format,
      };
    }),
  );
  const db = await getDb();
  const document = {
    title: input.title,
    description: input.description,
    titleHtml: input.titleHtml,
    descriptionHtml: input.descriptionHtml,
    coverImageUrl: uploadedImages[0].imageUrl,
    images: uploadedImages,
    imageUrl: uploadedImages[0].imageUrl,
    publicId: uploadedImages[0].publicId,
    width: uploadedImages[0].width,
    height: uploadedImages[0].height,
    format: uploadedImages[0].format,
    createdAt: new Date(),
  };

  const result = await db.collection<Omit<ViralImageDocument, "_id">>("viral_images").insertOne(document);

  return toViralImage({ _id: result.insertedId, ...document });
}
