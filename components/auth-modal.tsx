import AuthForm from "@/app/components/AuthForm";
import { selectOpen, setClose, setOpen } from "@/app/redux/features/authSlice";
import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

const AuthModal = () => {
  //i want this modal to pop up when there is no user signed in
  const session = useSession();
  const isOpen = useSelector(selectOpen);
  const dispatch = useDispatch();
  const modalRef = useRef<HTMLDivElement | null>(null);

  // Function to close the modal when clicking outside of it
  const handleOutsideClick = (e: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      dispatch(setClose());
    }
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
    <>
      <div className="z-[999] absolute flex justify-center items-center left-0 top-0 backdrop-blur-sm bg-black/40  w-screen h-screen ">
        <div ref={modalRef}>
          <AuthForm />
        </div>
      </div>
    </>
  );
};

export default AuthModal;
