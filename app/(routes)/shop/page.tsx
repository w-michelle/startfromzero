import { Suspense } from "react";
import Products from "../../../components/products";
import Loading from "./loading";

const Shop = () => {
  return (
    <Suspense fallback={<Loading />}>
      <div className="text-white">
        <div className="scrollbar px-6 md:px-20 text-font h-screen overflow-y-auto overflow-x-hidden mb-8">
          <div className="flex justify-center mt-12">
            <Products />
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default Shop;
