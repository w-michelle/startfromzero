import { AiOutlineLoading3Quarters } from "react-icons/ai";
export default function Loading() {
  return (
    <div className="h-screen text-white flex flex-col items-center justify-center">
      <AiOutlineLoading3Quarters className="text-[3rem] animate-spin" />
      <p className="mt-3">Loading ...</p>
    </div>
  );
}
