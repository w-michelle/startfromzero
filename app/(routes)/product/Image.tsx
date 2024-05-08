"use client";
import { CartItem } from "@/app/redux/features/cartSlice";
import Image from "next/image";
import { useState } from "react";
import { Product } from "./[productId]/page";

const ImageSlide = ({ product }: { product: Product }) => {
  const [currentImage, setCurrentImage] = useState("");

  const images = () => {
    console.log(product);
    if (product && product.images) {
      return product.images.map((image, index) => (
        <div
          key={image.id}
          className="relative w-[50px] h-[50px] md:w-[100px] md:h-[100px] hover:cursor-pointer"
          onClick={() => setCurrentImage(image.url)}
        >
          <Image src={image.url} fill alt="product image" />
        </div>
      ));
    }
  };
  return (
    <>
      <div className="relative w-[300px] lg:w-[400px] h-[300px] lg:h-[400px] mt-4">
        <Image
          src={currentImage === "" ? product.images[0].url : currentImage}
          alt={product.name}
          fill
          className="object-contain"
        />
      </div>
      <div className="hidden md:flex mt-2 gap-2 absolute ">{images()}</div>
    </>
  );
};

export default ImageSlide;
