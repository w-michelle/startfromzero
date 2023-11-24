import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuid } from "uuid";
import sharp from "sharp";

const s3Client = new S3Client({
  region: process.env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY as string,
    secretAccessKey: process.env.AWS_SECRET_KEY as string,
  },
});

export async function POST(req: NextRequest, res: NextResponse) {
  const userSession = await getServerSession(authOptions);

  try {
    const formData = await req.formData();

    const imageFiles = formData.getAll("images") as Blob[];
    const imageSrcs = [];

    for (const file of imageFiles) {
      const buffer = Buffer.from(await file.arrayBuffer());

      const resizedImageBuffer = await sharp(buffer).toBuffer();

      const imageName = uuid();

      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: imageName,
        Body: resizedImageBuffer,
        ContentType: file.type,
      };

      const command = new PutObjectCommand(params);
      await s3Client.send(command);

      imageSrcs.push(imageName);
    }

    const data = {
      name: formData.get("name")?.toString() || "",
      description: formData.get("description")?.toString() || "",
      price: formData.get("price")?.toString() || "",
      images: {
        create: imageSrcs.map((imagename: any) => ({
          imageKey: imagename,
          url: "",
        })),
      },
    };

    //save to db

    const product = await prisma?.product.create({
      data: { ...data },
    });
    return NextResponse.json(product);
  } catch (error) {
    return new NextResponse(`${error}`);
  }
}
