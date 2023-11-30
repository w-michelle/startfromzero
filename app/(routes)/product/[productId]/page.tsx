"use client";
import { hkdollar } from "@/util/currency";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import ImageSlide from "../Image";
import { useDispatch } from "react-redux";
import {
  CartItem,
  addToCart,
  setIsCartOpen,
} from "@/app/redux/features/cartSlice";
import axios from "axios";
import { Suspense, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Loading from "./loading";

export type Image = {
  id: string;
  url: string;
};

export type Product = {
  id: string;
  name: string;
  price: string;
  description: string;
  images: Image[];
};

type SearchParams = {
  id: string;
};
const ProductIdPage = () => {
  const [product, setProduct] = useState<Product>();
  const params = useParams();
  const dispatch = useDispatch();

  const handleAddToCart = async (item: CartItem) => {
    dispatch(addToCart(item));
    dispatch(setIsCartOpen());
    const result = await axios.post(`/api/addToCartAction?id=${item.id}`);
  };
  useEffect(() => {
    const getProduct = async () => {
      const response = await axios.get(`/api/product?id=${params.productId}`);
      setProduct(response.data);
      return response.data;
    };
    getProduct();
  }, []);
  if (!product) {
    return null;
  }

  return (
    <Suspense fallback={<Loading />}>
      <div className="flex justify-center mt-4 md:mt-0 h-screen">
        <div className="h-[700px] max-w-[1200px] text-white flex flex-col md:flex-row items-center gap-[20px] px-6 md:px-20">
          <div>
            <ImageSlide product={product} />
          </div>
          <div className="w-full flex flex-col gap-2 text-sm font-thin">
            <h1 className="text-md md:text-xl font-bold tracking-wider">
              {product?.name}
            </h1>
            <p>{hkdollar.format(Number(product?.price))}</p>

            <button
              onClick={() => handleAddToCart({ ...product, quantity: 1 })}
              className="bg-red-600 hover:bg-red-700 text-white w-[150px] py-2 rounded-xl"
            >
              Add to cart
            </button>
            <div className="mt-6">
              <p className="underline mb-2">Description</p>
              <p className="w-[300px]">{product?.description}</p>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default ProductIdPage;
