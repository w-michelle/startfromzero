import Hero from "@/components/hero";
import Image from "next/image";
import AuthForm from "./components/AuthForm";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

export default function Home() {
  return (
    <>
      <Hero />
    </>
  );
}
