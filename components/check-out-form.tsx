import { selectCart } from "@/app/redux/features/cartSlice";
import { hkdollar } from "@/util/currency";
import {
  AddressElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

const CheckoutForm = (clientSecret: { clientSecret: string }) => {
  const cart = useSelector(selectCart);
  const dispatch = useDispatch();
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [loading, setIsLoading] = useState(false);

  const orderTotal = cart.reduce((acc: number, item: any) => {
    return acc + item.quantity * Number(item.price);
  }, 0);

  useEffect(() => {
    if (!stripe) {
      return;
    }
    if (!clientSecret) {
      return;
    }
  }, [stripe]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    setIsLoading(true);

    stripe
      .confirmPayment({
        elements,
        confirmParams: {
          return_url: "https://startfromzero.vercel.app/order-confirmation",
        },
      })
      .then((result) => {
        if (!result.error) {
          console.log("success");
        } else {
          console.log("error");
        }

        setIsLoading(false);
      });
  };

  return (
    <div className=" text-white flex flex-col md:flex-row gap-10 w-full">
      <div className="w-full md:w-1/2">
        <h1 className="text-md mb-6">Checkout</h1>
        <form onSubmit={handleSubmit} id="payment-form">
          <PaymentElement id="payment-element" options={{ layout: "tabs" }} />
          <h2 className="mt-10 mb-6">Shipping Address</h2>
          <AddressElement options={{ mode: "shipping" }} />

          <button
            className={`py-2 mt-4  w-full bg-black hover:bg-red-500 rounded-md text-white disabled:opacity-25`}
            id="submit"
            disabled={loading || !stripe || !elements}
          >
            <span id="button-text">
              {loading ? <span>Processing</span> : <span>Pay now</span>}
            </span>
          </button>
        </form>
      </div>
      <div className="w-full md:w-1/3 ">
        <h2>Order Summary</h2>
        <div className="mt-6">
          {cart.map((item) => (
            <div key={item.id} className="flex gap-2 mb-6">
              <div className="relative w-[80px] h-[80px]">
                <Image fill alt="product image" src={item.images[0].url} />
              </div>
              <div>
                <p>{item.name}</p>
                <p>{`${item.quantity} x $${item.price}`}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="my-8">
          ORDER TOTAL:
          <span className="font-bold ml-2 tracking-wider">
            {hkdollar.format(Number(orderTotal))}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
