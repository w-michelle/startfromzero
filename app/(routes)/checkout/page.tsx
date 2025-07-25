"use client";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { setOpen } from "@/app/redux/features/authSlice";
import {
  selectCart,
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

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const Checkout = () => {
  const router = useRouter();
  const cart = useSelector(selectCart);

  const paymentIntent = useSelector(selectPaymentIntent);
  const dispatch = useDispatch();

  const [clientSecret, setClientSecret] = useState("");

  const [loading, setLoading] = useState(false);

  const { data: session, status } = useSession();

  useEffect(() => {
    if (!session?.user) {
      router.push("/");
      dispatch(setOpen());
    }
  }, []);

  useEffect(() => {
    setLoading(true);
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
          setClientSecret(data.paymentIntent.client_secret);
          dispatch(setPaymentIntent(data.paymentIntent.id));
          setLoading(false);
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

  if (loading) {
    return (
      <div className="h-screen text-white flex flex-col items-center justify-center">
        <AiOutlineLoading3Quarters className="text-[3rem] animate-spin" />
        <p className="mt-3">Loading ...</p>
      </div>
    );
  }

  return (
    <div className="w-full px-6 md:px-20 text-white max-w-[1250px]">
      {clientSecret && (
        <div className="p-4">
          <Elements
            options={options}
            stripe={stripePromise}
          >
            <CheckoutForm clientSecret={clientSecret} />
          </Elements>
        </div>
      )}
    </div>
  );
};

export default Checkout;
