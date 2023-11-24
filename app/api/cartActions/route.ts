import { NextRequest, NextResponse } from "next/server";
import { findCart } from "../addToCartAction/route";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// need product id to know what to delete, need action word
export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const productId = url.searchParams.get("id");
  const action = url.searchParams.get("action");

  const session = await getServerSession(authOptions);
  const cart = await findCart(session);
  const itemInCart = cart?.cartItems?.find(
    (item: any) => item.productId === productId
  );

  if (action == "increase") {
    try {
      await prisma?.cart.update({
        where: { id: cart?.id },
        data: {
          cartItems: {
            update: {
              where: { id: itemInCart?.id },
              data: { quantity: { increment: 1 } },
            },
          },
        },
      });

      return NextResponse.json({ message: "success" });
    } catch (error) {
      return new NextResponse(`${error}`);
    }
  } else if (action == "decrease") {
    try {
      await prisma?.cart.update({
        where: { id: cart?.id },
        data: {
          cartItems: {
            update: {
              where: { id: itemInCart?.id },
              data: { quantity: { decrement: 1 } },
            },
          },
        },
      });

      return NextResponse.json({ message: "success" });
    } catch (error) {
      return new NextResponse(`${error}`);
    }
  } else if (action == "remove") {
    try {
      await prisma?.cart.update({
        where: { id: cart?.id },
        data: {
          cartItems: {
            delete: [{ id: itemInCart?.id }],
          },
        },
      });

      return NextResponse.json({ message: "success" });
    } catch (error) {
      return new NextResponse(`${error}`);
    }
  }
  return NextResponse.json({ message: "success" });
}
