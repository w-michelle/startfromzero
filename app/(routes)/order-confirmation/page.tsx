"use client";
import {
  clearCart,
  selectCart,
  selectPaymentIntent,
  setCheckout,
  setPaymentIntent,
} from "@/app/redux/features/cartSlice";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const OrderConfirmation = () => {
  const cart = useSelector(selectCart);
  const paymentIntent = useSelector(selectPaymentIntent);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const clear = async () => {
      try {
        await fetch("/api/remove-cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cart: [],
          }),
        });

        dispatch(clearCart());
        dispatch(setPaymentIntent(""));
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    clear();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full bg-black absolute top-0 text-white z-[9999] flex flex-col justify-center items-center">
        <AiOutlineLoading3Quarters className="text-[3rem] animate-spin" />
        <p className="mt-3">Processing ...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[100vh] flex flex-col items-center justify-center p-10 text-font">
      <h1 className="text-2xl font-bold mb-4">THANK YOU</h1>
      <p className="text-center">
        Your order has been received and we are excited to send it your way!
      </p>
      <Link href="/history">
        <button className="py-4 w-[300px] bg-black hover:bg-black/20 text-font font-semibold mt-4">
          Check your Order
        </button>
      </Link>
    </div>
  );
};

export default OrderConfirmation;
