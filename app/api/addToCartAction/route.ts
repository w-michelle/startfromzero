import { CartItem } from "@/app/redux/features/cartSlice";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Session } from "inspector";
import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
import prisma from "@/lib/prismadb";
export async function POST(req: NextRequest) {
  const url = new URL(req.url);

  const productId = url.searchParams.get("id");

  const cart = (await getCart()) ?? (await createCart());

  const itemInCart = cart?.cartItems?.find(
    (item: any) => item.productId === productId
  );

  try {
    if (itemInCart) {
      await prisma?.cart.update({
        where: { id: cart.id },
        data: {
          cartItems: {
            update: {
              where: { id: itemInCart.id },
              data: { quantity: { increment: 1 } },
            },
          },
        },
      });
    } else {
      await prisma?.cart.update({
        where: { id: cart.id },
        data: {
          cartItems: {
            create: {
              productId: productId as string,
              quantity: 1,
            },
          },
        },
      });
    }
    revalidatePath("/");
    return NextResponse.json({ message: "success" });
  } catch (error) {
    return new NextResponse(`${error}`);
  }
}
export async function getCart() {
  const session = await getServerSession(authOptions);

  const cart = await findCart(session);

  if (!cart) {
    return null;
  }
  return {
    ...cart,
    cartItems: cart.cartItems,
  };
}

export async function findCart(session: any) {
  if (session?.user?.id) {
    return await prisma?.cart.findFirst({
      where: { userId: session.user.id },
      include: { cartItems: true },
    });
  }

  const localCartId = cookies().get("localCartId")?.value;
  return localCartId
    ? await prisma?.cart.findUnique({
        where: { id: localCartId },
        include: { cartItems: true },
      })
    : null;
}

export async function createCart() {
  const session = await getServerSession(authOptions);

  const newCart = await createNewCart(session);
  return {
    ...newCart,
    cartItems: [],
  };
}

async function createNewCart(session: any) {
  if (session) {
    return await prisma?.cart.create({
      data: { userId: session.user.id },
    });
  } else {
    const cart = await prisma?.cart.create({ data: {} });

    cookies().set("localCartId", cart!.id);
    return cart;
  }
}
