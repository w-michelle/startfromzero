import { Suspense } from "react";
import Products from "../../../components/products";
import Loading from "./loading";

const Shop = () => {
  return (
    <div className="text-white">
      <Suspense fallback={<Loading />}>
        <div className="scrollbar px-6 md:px-20 text-font h-screen overflow-y-auto">
          <div className="flex justify-center mt-12">
            <Products />
          </div>
        </div>
      </Suspense>
    </div>
  );
};

export default Shop;