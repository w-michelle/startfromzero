import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST() {
  const session = await getServerSession();

  if (!session?.user) {
    return new NextResponse("Not logged in", { status: 403 });
  }

  try {
    const existingCart = await prisma?.cart.findFirst({
      where: { user: { id: session.user.id } },
      include: { cartItems: true, products: true },
    });
    if (existingCart) {
      await prisma?.cart.delete({
        where: { id: existingCart.id },
      });
    }
    return NextResponse.json({ message: "Cart Deleted" });
  } catch (error) {
    return new NextResponse(`${error}`, { status: 500 });
  }
}
