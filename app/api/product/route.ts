import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { useSearchParams } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

const s3Client = new S3Client({
  region: "ca-central-1",
  credentials: {
    accessKeyId: process.env.A_ACCESS_KEY as string,
    secretAccessKey: process.env.A_SECRET_KEY as string,
  },
});

export async function GET(req: NextRequest) {
  const url = new URL(req.url);

  const id = url.searchParams.get("id");

  try {
    if (!id) {
      return new NextResponse("Product id is required", { status: 400 });
    }
    const product = await prisma?.product.findUnique({
      where: { id: id },
      include: { images: true },
    });

    if (product?.images[0].url == "") {
      for (let i = 0; i < product.images.length; i++) {
        const params = {
          Bucket: process.env.A_BUCKET_NAME,
          Key: product.images[i].imageKey,
        };
        const command = new GetObjectCommand(params);
        const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
        product.images[i].url = url;
      }
    }

    return NextResponse.json(product);
  } catch (error) {
    return new NextResponse(`${error}`, { status: 500 });
  }
}
