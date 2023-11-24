"use client";
import { setOpen } from "@/app/redux/features/authSlice";
import {
  selectCart,
  selectCheckout,
  selectPaymentIntent,
  setPaymentIntent,
} from "@/app/redux/features/cartSlice";
import CheckoutForm from "@/components/check-out-form";
import { Elements } from "@stripe/react-stripe-js";
import { StripeElementsOptions, loadStripe } from "@stripe/stripe-js";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loading from "./loading";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const Checkout = () => {
  const router = useRouter();
  const cart = useSelector(selectCart);

  const paymentIntent = useSelector(selectPaymentIntent);
  const dispatch = useDispatch();

  const [clientSecret, setClientSecret] = useState("");
  const { data: session, status } = useSession();

  if (!session?.user) {
    router.push("/");
    dispatch(setOpen());
  }
  console.log(paymentIntent);

  useEffect(() => {
    if (session?.user) {
      fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart,
          payment_intent_id: paymentIntent,
        }),
      })
        .then((res) => {
          if (res.status === 403) {
            router.push("/");
          }

          return res.json();
        })
        .then((data) => {
          console.log(data);
          setClientSecret(data.paymentIntent.client_secret);
          dispatch(setPaymentIntent(data.paymentIntent.id));
        });
    }
  }, []);

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: "night",
      labels: "floating",
    },
  };

  return (
    <div className="w-full px-6 md:px-20 text-white">
      {clientSecret && (
        <div className="p-4">
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm clientSecret={clientSecret} />
          </Elements>
        </div>
      )}
    </div>
  );
};

export default Checkout;
