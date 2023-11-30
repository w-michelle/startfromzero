import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { authOptions } from "../auth/[...nextauth]/route";
import { current } from "@reduxjs/toolkit";
import prisma from "@/lib/prismadb";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

export async function POST(req: NextRequest, res: NextResponse) {
  const { items, payment_intent_id } = await req.json();

  const orderTotal = items.reduce((acc: number, item: any) => {
    return acc + item.quantity * Number(item.price);
  }, 0);

  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return new NextResponse("Not logged", { status: 403 });
  }

  const orderData = {
    user: {
      connect: { id: session.user?.id },
    },

    amount: orderTotal,
    status: "pending",
    paymentIntentID: payment_intent_id,
    orderItems: {
      create: items?.map((item: any) => ({
        name: item.name,
        price: item.price,
        description: item.description,
        images: {
          create: item?.images?.map((image: any) => ({
            imageKey: image.imageKey,
            url: "",
          })),
        },
        quantity: item.quantity,
      })),
    },
  };

  if (payment_intent_id) {
    const current_intent = await stripe.paymentIntents.retrieve(
      payment_intent_id
    );

    if (current_intent) {
      const updated_intent = await stripe.paymentIntents.update(
        payment_intent_id,
        { amount: orderTotal }
      );

      const [existing_order, updated_order] = await Promise.all([
        prisma?.order.findFirst({
          where: {
            paymentIntentID: updated_intent.id,
          },
          include: { orderItems: true },
        }),
        prisma?.order.update({
          where: { paymentIntentID: updated_intent.id },
          data: {
            amount: orderTotal,
            orderItems: {
              create: items?.map((item: any) => ({
                name: item.name,
                price: item.price,
                description: item.description || null,
                images: {
                  create: item?.images?.map((image: any) => ({
                    imageKey: image.imageKey,
                    url: "",
                  })),
                },
                quantity: item.quantity,
              })),
            },
          },
        }),
      ]);

      if (!existing_order) {
        return NextResponse.json({ message: "Invalid Payment Intent" });
      }

      return NextResponse.json({ paymentIntent: updated_intent });
    }
  } else {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: orderTotal,
      currency: "hkd",
      automatic_payment_methods: { enabled: true },
    });
    orderData.paymentIntentID = paymentIntent.id;
    const newOrder = await prisma?.order.create({
      data: orderData,
    });

    return NextResponse.json({ paymentIntent });
  }
}
