"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { BsPlusLg } from "react-icons/bs";
import { useEffect, useState } from "react";
import Navmenu from "./nav-menu";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  selectCartOpen,
  CartItem,
  selectCart,
  setCart,
  selectCheckout,
} from "@/app/redux/features/cartSlice";
import Cart from "./cart";
import axios from "axios";
import { getSession, useSession } from "next-auth/react";

type Products = {
  id: string;
  name: string;
  price: string;
  description: string;
  images: Image[];
};
type Image = {
  id: string;
  url: string;
};
type CartItemType = {
  id: string;
  productId: string;
  quantity: number;
  cartId: string;
};

const Navbar = () => {
  const pathname = usePathname();
  const [toggle, setToggle] = useState(false);
  const isOpen = useSelector(selectCartOpen);
  const cart = useSelector(selectCart);
  const dispatch = useDispatch();
  //retrieves cart when landing on page
  const { data: session } = useSession();

  useEffect(() => {
    const getCart = async () => {
      const response = await axios.get(`/api/getCart`);

      const cart = response.data;
      if (cart && cart.cartItems) {
        const updatedCart = cart.cartItems?.map((cartItem: any) => {
          const { productId, quantity } = cartItem;

          const cartproduct = cart.products.find(
            (product: any) => product.id === productId
          );

          if (cartproduct) {
            return { ...cartproduct, quantity };
          }
          return null;
        });
        dispatch(setCart(updatedCart));
      }
    };
    getCart();
  }, []);

  return (
    <nav
      className={`${
        pathname !== "/" ? "bg-[#1a1a1a]/20" : "bg-transparent fixed"
      } z-[99] px-6 md:px-20 w-full`}
    >
      {isOpen && <Cart />}
      <div className="hidden md:flex items-center gap-20 ">
        <Link href="/">
          <div className="relative w-[120px] h-[100px]">
            <Image src="/logo.png" alt="Logo" className="object-contain" fill />
          </div>
        </Link>
        <Navmenu />
      </div>

      {/* mobile */}
      <div className="md:hidden">
        <div className="flex items-center h-[70px]">
          <div onClick={() => setToggle(!toggle)}>
            <BsPlusLg
              className={`${
                toggle ? "rotate-45 transition" : "rotate-90 transition"
              } text-xl text-font/90 hover:cursor-pointer`}
            />
          </div>
          <Link href="/">
            <div className="relative w-[120px] h-[100px]">
              <Image
                src="/logo.png"
                alt="Logo"
                className="object-contain"
                fill
              />
            </div>
          </Link>
        </div>
        {toggle && <Navmenu />}
      </div>
    </nav>
  );
};

export default Navbar;
