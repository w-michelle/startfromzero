import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
const s3Client = new S3Client({
  region: "ca-central-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY as string,
    secretAccessKey: process.env.AWS_SECRET_KEY as string,
  },
});

export async function GET(req: NextRequest, res: NextResponse) {
  const posts = await prisma?.product.findMany({
    where: {
      OR: [
        { quantity: { equals: 0 } }, // Fetch products with quantity equal to zero
        { quantity: { equals: null } },
      ],
    },
    include: { images: true },
  });

  if (posts) {
    for (let i = 0; i < posts.length; i++) {
      for (let j = 0; j < posts[i].images.length; j++) {
        const params = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: posts[i].images[j].imageKey,
        };
        const command = new GetObjectCommand(params);
        const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
        posts[i].images[j].url = url;
      }
    }
  }

  return NextResponse.json(posts);
}
