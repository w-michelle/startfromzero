import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: "ca-central-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY as string,
    secretAccessKey: process.env.AWS_SECRET_KEY as string,
  },
});

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ message: "Not logged in" });
  }

  try {
    const orders = await prisma?.order.findMany({
      where: { userId: session?.user.id, status: "complete" },
      include: {
        orderItems: {
          include: {
            images: true,
          },
        },
      },
    });

    if (orders) {
      for (const item of orders) {
        for (let i = 0; i < item.orderItems.length; i++) {
          for (let j = 0; j < item.orderItems[i].images.length; j++) {
            console.log(item.orderItems[i].images[j].imageKey);
            const params = {
              Bucket: process.env.AWS_BUCKET_NAME,
              Key: item.orderItems[i].images[j].imageKey,
            };
            const command = new GetObjectCommand(params);
            const url = await getSignedUrl(s3Client, command, {
              expiresIn: 3600,
            });
            item.orderItems[i].images[j].url = url;
          }
        }
      }
    }

    return NextResponse.json(orders);
  } catch (error) {
    return new NextResponse(`${error}`, { status: 500 });
  }
}
