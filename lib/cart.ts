import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { CartItem } from "@/app/redux/features/cartSlice";
import { Session } from "inspector";
import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
// export async function getCart() {
//   const session = await getServerSession(authOptions);

//   const cart = await findCart(session);

//   if (!cart) {
//     return null;
//   }
//   return {
//     ...cart,
//     products: cart.products,
//   };
// }

// async function findCart(session: any) {
//   if (session) {
//     return await prisma?.cart.findFirst({
//       where: { userId: session.user.id },
//       include: { products: true },
//     });
//   }

//   const localCartId = cookies().get("localCartId")?.value;

//   return localCartId
//     ? await prisma?.cart.findUnique({
//         where: { id: localCartId },
//         include: { products: true },
//       })
//     : null;
// }

// export async function createCart() {
//   const session = await getServerSession(authOptions);

//   const newCart = await createNewCart(session);
//   return {
//     ...newCart,
//     products: [],
//   };
// }

// async function createNewCart(session: any) {
//   if (session) {
//     return await prisma?.cart.create({
//       data: { userId: session.user.id },
//     });
//   } else {
//     const cart = await prisma?.cart.create({});

//     cookies().set("localCartId", cart!.id);
//     return cart;
//   }
// }

export async function mergeAnonymousCart(userId: string) {
  const localCartId = cookies().get("localCartId")?.value;

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
