import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
const s3Client = new S3Client({
  region: "ca-central-1",
  credentials: {
    accessKeyId: process.env.A_ACCESS_KEY as string,
    secretAccessKey: process.env.A_SECRET_KEY as string,
  },
});
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const posts = await prisma?.product.findMany({
      include: { images: true },
    });
    console.log("found posts:", posts);
    if (posts) {
      for (let i = 0; i < posts.length; i++) {
        for (let j = 0; j < posts[i].images.length; j++) {
          const params = {
            Bucket: process.env.A_BUCKET_NAME,
            Key: posts[i].images[j].imageKey,
          };
          const command = new GetObjectCommand(params);
          const url = await getSignedUrl(s3Client, command, {
            expiresIn: 3600,
          });
          posts[i].images[j].url = url;
        }
      }
    }

    return NextResponse.json(posts);
  } catch (error) {
    return new NextResponse(`${error}`, { status: 500 });
  }
}
