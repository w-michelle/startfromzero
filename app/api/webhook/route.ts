import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/prismadb";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

export async function POST(res: NextRequest) {
  const body = await res.text(); //get in text format and pass to webhook which accpets text
  const sig = headers().get("Stripe-Signature");

  if (!sig) {
    return new NextResponse("Missing the stripe signature");
  }

  let event: Stripe.Event;
  //Handle different types of events

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return new NextResponse(`Webook error: ${err.message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case "payment_intent.created":
        const paymentIntent = event.data.object;

        break;
      case "charge.succeeded":
        const charge = event.data.object as Stripe.Charge;

        if (typeof charge.payment_intent === "string") {
          const order = await prisma?.order.update({
            where: { paymentIntentID: charge.payment_intent },
            data: { status: "complete" },
          });
        }
        break;
      default:
        throw new Error("Unhandled event type:" + event.type);
    }
  } catch (error) {
    return new NextResponse("Webhook error: webhook handler failed.", {
      status: 400,
    });
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
