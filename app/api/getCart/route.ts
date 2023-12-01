import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { findCart } from "../addToCartAction/route";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import prisma from "@/lib/prismadb";
const s3Client = new S3Client({
  region: "ca-central-1",
  credentials: {
    accessKeyId: process.env.A_ACCESS_KEY as string,
    secretAccessKey: process.env.A_SECRET_KEY as string,
  },
});
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const cart = await findCart(session);

  const products = await Promise.all(
    cart?.cartItems.map(async (item) => {
      const product = await prisma?.product.findFirst({
        where: { id: item.productId },
        include: { images: true },
      });

      if (product) {
        for (let i = 0; i < product.images.length; i++) {
          const params = {
            Bucket: process.env.A_BUCKET_NAME,
            Key: product.images[i].imageKey,
          };
          const command = new GetObjectCommand(params);
          const url = await getSignedUrl(s3Client, command, {
            expiresIn: 3600,
          });
          product.images[i].url = url;
        }
      }
      return product;
    }) || []
  );

  return NextResponse.json({ ...cart, products: products });
}
