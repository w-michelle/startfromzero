"use client";

import { useCallback, useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Input from "./inputs/Input";
import Button from "./Button";
import axios from "axios";
import { toast } from "react-hot-toast";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setClose } from "../redux/features/authSlice";

type Variant = "LOGIN" | "REGISTER";

type ToggleProp = {
  toggle: (boolean: boolean) => void;
};

const AuthForm = () => {
  const [variant, setVariant] = useState<Variant>("LOGIN");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const toggleVariant = useCallback(() => {
    if (variant === "LOGIN") {
      setVariant("REGISTER");
    } else {
      setVariant("LOGIN");
    }
  }, [variant]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const guestSignin = async () => {
    setIsLoading(true);
    try {
      await signIn("credentials", {
        email: "sfzguest@sfz.com",
        password: "sfzguest2023",
        redirect: true,
        callbackUrl: "/",
      });
    } catch (error) {
      toast.error("Something went wrong!");
    }
    setIsLoading(false);
    dispatch(setClose());
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    if (variant === "REGISTER") {
      try {
        await axios.post("/api/register", data);

        await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: true,
          callbackUrl: "/",
        });
      } catch (error) {
        toast.error("Something went wrong!");
      }
      setIsLoading(false);
      dispatch(setClose());
    }
    if (variant === "LOGIN") {
      //NEXTAUTH SIGNIN
      signIn("credentials", {
        ...data,
        redirect: false,
      })
        .then((callback) => {
          if (callback?.error) {
            toast.error("Invalid credentials");
          }
          if (callback?.ok && !callback?.error) {
            toast.success("Logged in!");

            window.location.reload();
            dispatch(setClose());
          }
        })
        .finally(() => setIsLoading(false));
    }
  };

  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-md ">
      <div className="bg-[#292928] p-14 shadow rounded-lg sm:px-16">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {variant === "REGISTER" && (
            <Input id="name" label="Name" register={register} errors={errors} />
          )}
          <Input
            id="email"
            label="Email"
            type="email"
            register={register}
            errors={errors}
          />
          <Input
            id="password"
            label="Password"
            type="password"
            register={register}
            errors={errors}
          />
          <div>
            <Button disabled={isLoading} type="submit" fullWidth>
              {variant === "LOGIN" ? "Sign in" : "Register"}
            </Button>
          </div>
        </form>
        {/* guest */}
        <div className="mt-4 w-full">
          {variant == "LOGIN" && (
            <Button
              disabled={isLoading}
              fullWidth
              guest
              onClick={() => guestSignin()}
            >
              TESTER LOG IN
            </Button>
          )}
        </div>
        <div className="auth-content flex gap-2 justify-center text-sm mt-6 px-2 text-font">
          <div>
            {variant === "LOGIN" ? "New to SFZ?" : "Already have an account?"}
          </div>
          <button
            onClick={() => toggleVariant()}
            className="underline cursor-pointer"
          >
            {variant === "LOGIN" ? "Create an account" : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
