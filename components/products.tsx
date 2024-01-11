"use client";
import { selectPaymentIntent } from "@/app/redux/features/cartSlice";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { hkdollar } from "@/util/currency";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

type Product = {
  id: number;
  name: string;
  price: string;
  description: string;
  images: { url: string }[];
};
const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const getProducts = async () => {
      const allProducts = await axios.get("/api/getProducts");
      setProducts(allProducts.data);

      setLoading(false);
    };
    getProducts();
  }, []);
  if (loading) {
    return (
      <div className="h-screen text-white flex flex-col items-center justify-center">
        <AiOutlineLoading3Quarters className="text-[3rem] animate-spin" />
        <p className="mt-3">Loading ...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1250px] ">
      <div className="relative w-[435px] h-[400px] md:w-[700px] md:h-[400px] lg:w-[1000px] opacity-80 mb-8 mx-auto">
        <Image
          alt="Image of Shop"
          fill
          src="/sfz-shop.jpg"
          className="object-cover object-left"
        />
      </div>
      <div className="grid items-center justify-center md:grid-cols-3 lg:grid-cols-4 gap-y-8 gap-x-6">
        {products?.map((product) => (
          <div key={product.id}>
            <Link
              href={{
                pathname: `/product/${product.id}`,
                query: {
                  id: product.id,
                },
              }}
            >
              <div className="relative w-[200px] h-[200px]">
                <Image src={product.images[0]?.url} alt={product.name} fill />
              </div>
              <p>{product.name}</p>
              <p>{hkdollar.format(Number(product.price))}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
