"use client";
import { selectPaymentIntent } from "@/app/redux/features/cartSlice";
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

  const paymentIntent = useSelector(selectPaymentIntent);

  useEffect(() => {
    const getProducts = async () => {
      const allProducts = await axios.get("/api/getProducts");
      setProducts(allProducts.data);
    };
    getProducts();
  }, []);
  return (
    <div className="max-w-[1250px] grid justify-center md:grid-cols-3 lg:grid-cols-4 gap-y-8 gap-x-6 ">
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
              <Image fill src={product.images[0].url} alt="product image" />
            </div>
            <p>{product.name}</p>
            <p>{hkdollar.format(Number(product.price))}</p>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Products;