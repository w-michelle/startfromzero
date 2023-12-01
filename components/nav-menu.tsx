import AuthForm from "@/app/components/AuthForm";
import {
  clearCart,
  selectCart,
  selectCartOpen,
  setIsCartOpen,
} from "@/app/redux/features/cartSlice";
import { signOut, useSession } from "next-auth/react";

import Link from "next/link";
import { useRef } from "react";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { useDispatch, useSelector } from "react-redux";

import { selectOpen, setClose, setOpen } from "@/app/redux/features/authSlice";
import AuthModal from "./auth-modal";

const Navmenu = () => {
  const session = useSession();

  const modalRef = useRef<HTMLDivElement | null>(null);

  const isOpen = useSelector(selectOpen);
  const cartOpen = useSelector(selectCartOpen);

  const dispatch = useDispatch();
  const cart = useSelector(selectCart);

  const handleSignOut = () => {
    dispatch(clearCart());
    signOut();
  };

  return (
    <div
      className={`flex items-center justify-between w-full text-xs md:text-md`}
    >
      <ul className="flex font-semibold tracking-wider gap-8 text-font/90">
        <li className="hover:text-[#e7bd5a] transition">
          <Link href="/shop">SHOP</Link>
        </li>
        <li className="hover:text-[#e7bd5a] transition">
          <Link href="/renovation">RENOVATION</Link>
        </li>
      </ul>

      <div className="flex items-center gap-8 text-xl md:text-[25px]">
        <div className="relative mr-2">
          <AiOutlineShoppingCart
            className="z-[888] relative cursor-pointer hover:text-[#e7bd5a] transition  text-font/90"
            onClick={() => dispatch(setIsCartOpen())}
          />
          {cart?.length > 0 && (
            <div className="absolute top-0 right-[-2px] w-2 h-2 bg-[#e7bd5a] rounded-full"></div>
          )}
        </div>
        {session.data?.user ? (
          <div
            className="relative hover:cursor-pointer"
            onMouseEnter={() => dispatch(setOpen())}
          >
            <CgProfile className=" hover:text-[#e7bd5a] transition  text-[#c7c5c5]/90" />
            {/* if theres an account show orders and logout else if pop up authform */}

            {isOpen && (
              <div
                className="absolute z-[888] top-0 bg-transparent left-[-100px] text-sm"
                ref={modalRef}
                onMouseEnter={() => dispatch(setOpen())}
                onMouseLeave={() => dispatch(setClose())}
              >
                <div className=" bg-[#efefef] px-4 py-4 rounded-md mt-8 w-[200px] flex flex-col gap-4 ">
                  <p className="font-bold">
                    Welcome {session.data?.user.name}!
                  </p>
                  <Link href="/history">
                    <p className="hover:underline hover:cursor-pointer">
                      Order History
                    </p>
                  </Link>
                  <p
                    className="hover:underline hover:cursor-pointer"
                    onClick={() => handleSignOut()}
                  >
                    Sign Out
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="hover:cursor-pointer">
            <CgProfile
              className=" hover:text-[#e7bd5a] transition  text-[#c7c5c5]/90"
              onClick={() =>
                isOpen ? dispatch(setClose()) : dispatch(setOpen())
              }
            />
            {/* if theres an account show orders and logout else if pop up authform */}
            {isOpen && <AuthModal />}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navmenu;
