import {
  decreaseQty,
  increaseQty,
  removeFromCart,
  selectCart,
  selectCartOpen,
  setCheckout,
  setIsCartOpen,
} from "@/app/redux/features/cartSlice";
import { hkdollar } from "@/util/currency";
import { CartItem } from "@/app/redux/features/cartSlice";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AiFillMinusCircle, AiFillPlusCircle } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

const Cart = () => {
  const cart = useSelector(selectCart);
  const dispatch = useDispatch();

  const isOpen = useSelector(selectCartOpen);

  const path = usePathname();

  const modalRef = useRef<HTMLDivElement | null>(null);

  const orderTotal = cart.reduce((acc, item) => {
    return acc + item.quantity! * Number(item.price);
  }, 0);

  const handleOutsideClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;

    if (
      modalRef.current &&
      !modalRef.current.contains(target as Node) &&
      target &&
      !target.closest(".cart-content")
    ) {
      dispatch(setIsCartOpen());
    }
  };

  const totalPrice = (price: number, qty: number) => {
    return Number(price) * qty;
  };

  const increaseItem = async (item: CartItem) => {
    try {
      dispatch(increaseQty(item));
      await axios.post(`/api/cartActions?id=${item.id}&action=increase`);
    } catch (error) {
      toast.error("Oops! Something  went wrong");
    }
  };

  const decreaseItem = async (item: CartItem) => {
    try {
      dispatch(decreaseQty(item));
      await axios.post(`/api/cartActions?id=${item.id}&action=decrease`);
    } catch (error) {
      toast.error("Oops! Something  went wrong");
    }
  };

  const removeItem = async (item: CartItem) => {
    try {
      dispatch(removeFromCart(item));

      await axios.post(`/api/cartActions?id=${item.id}&action=remove`);
    } catch (error) {
      toast.error("Oops! Something  went wrong");
    }
  };

  const handleCheckout = () => {
    dispatch(setCheckout());
    dispatch(setIsCartOpen());
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("click", handleOutsideClick);
    } else {
      document.removeEventListener("click", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={` text-white absolute z-[999] top-0 left-0 w-full backdrop-blur-sm bg-black/40 ${
            path === "/" ? "h-screen" : "h-full"
          }`}
          initial={{ x: "100%" }} // Initially positioned to the right
          animate={{ x: 0, transition: { duration: 0.5, ease: "easeInOut" } }} // Slower slide in with ease
          exit={{ x: "100%", transition: { duration: 0.5, ease: "easeInOut" } }}
        >
          <div
            className="bg-black border-l-[1px] border-white w-full sm:w-[450px] h-full absolute right-0"
            ref={modalRef}
          >
            <button
              className="m-4 absolute right-0 font-thin text-sm"
              onClick={() => dispatch(setIsCartOpen())}
            >
              Close
            </button>
            <div className="p-4 mt-10">
              <h1 className="mb-4">
                {cart?.length === 0
                  ? "Your cart is empty"
                  : `Cart (${cart.length})`}
              </h1>
              {cart?.length > 0 && (
                <div className="h-full">
                  <div className="text-[10px] sm:text-xs w-full">
                    <ul className="border-b-[1px] border-white w-full flex ">
                      <li className="w-1/5">Item</li>
                      <li className="w-1/5">Quantity</li>
                      <li className="w-1/5">Unit Price</li>
                      <li className="w-1/5">Total Price</li>
                      <li className="w-1/5"></li>
                    </ul>

                    <div className="scrollbar border-t-[1px] border-white w-full h-[500px] md:h-[600px] overflow-y-scroll">
                      {cart.map((item) => (
                        <div
                          key={item.id}
                          className="cart-content flex items-center w-full"
                        >
                          <div className="pt-4 w-1/5">
                            <div className="hidden md:block relative w-[60px] h-[60px]">
                              <Image
                                src={item?.images[0].url}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <Link href={`/product/${item.id}`}>
                              <p
                                className="uppercase mt-2 w-[30px] underline"
                                onClick={() => dispatch(setIsCartOpen())}
                              >
                                {item.name}
                              </p>
                            </Link>
                          </div>
                          <div className="flex flex-col justify-center h-[150px] w-1/5">
                            <div className="flex">
                              <AiFillMinusCircle
                                onClick={() => decreaseItem(item)}
                                className="text-[14px] mr-2 hover:cursor-pointer"
                                title="Decrease Quantity"
                                aria-label="Decrease Quantity"
                              />
                              <span>{item.quantity}</span>
                              <AiFillPlusCircle
                                onClick={() => increaseItem(item)}
                                className="text-[14px] ml-2 hover:cursor-pointer"
                                title="Increase Quantity"
                                aria-label="Increase Quantity"
                              />
                            </div>
                          </div>
                          <div className="w-1/5 pl-2">
                            ${Number(item.price)}
                          </div>
                          <div className="w-1/5 pl-2">
                            <p>
                              $
                              {totalPrice(
                                Number(item.price),
                                Number(item.quantity)
                              )}
                            </p>
                          </div>
                          <div>
                            <div
                              className="underline cursor-pointer w-1/5"
                              onClick={() => removeItem(item)}
                            >
                              Remove
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <hr className="border-t-[1px] border-white text-sm mt-4"></hr>
                  <div className="w-full flex justify-between mt-4 ">
                    <p>Subtotal</p>
                    <p>{hkdollar.format(Number(orderTotal))}</p>
                  </div>

                  <Link href="/checkout">
                    <button
                      className=" w-full py-2 mt-8 rounded-sm bg-red-600 hover:bg-red-700"
                      onClick={() => handleCheckout()}
                    >
                      Checkout
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Cart;
