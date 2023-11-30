import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { CartItem } from "@/app/redux/features/cartSlice";
import { Session } from "inspector";
import { getServerSession } from "next-auth";
import { cookies } from "next/headers";

export async function mergeAnonymousCart(userId: string) {
  const localCartId = cookies().get("localCartId")?.value;

  console.log(localCartId);
  const localCart = localCartId
    ? await prisma?.cart.findUnique({
        where: { id: localCartId },
        include: { cartItems: true },
      })
    : null;

  if (!localCart) return;
  const userCart = await prisma?.cart.findFirst({
    where: { userId: userId },
    include: { cartItems: true },
  });

  await prisma?.$transaction(async (tx) => {
    if (userCart) {
      const mergedCartItems = mergeCartItems(
        localCart.cartItems,
        userCart.cartItems
      );

      await tx.cartItem.deleteMany({
        where: { cartId: userCart.id },
      });

      await tx.cart.update({
        where: { id: userCart.id },
        data: {
          cartItems: {
            createMany: {
              data: mergedCartItems.map((item: any) => ({
                productId: item.productId,
                quantity: item.quantity,
              })),
            },
          },
        },
      });
    } else {
      await tx.cart.create({
        data: {
          userId,
          cartItems: {
            createMany: {
              data: localCart.cartItems.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
              })),
            },
          },
        },
      });
    }
    await tx.cart.delete({
      where: { id: localCart.id },
    });

    cookies().set("localCartId", "");
  });
}

function mergeCartItems(...cartItems: any) {
  return cartItems.reduce((acc: any, items: any) => {
    items.forEach((item: any) => {
      const existingItem = acc.find((i: any) => i.productId === item.productId);
      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        acc.push(item);
      }
    });
    return acc;
  }, []);
}
