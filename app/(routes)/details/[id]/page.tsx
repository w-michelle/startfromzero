"use client";
import { dateFormat2 } from "@/util/dateFormat";
import Image from "next/image";

const Details = ({ searchParams }: any) => {
  const { amount, createdAt, orderItems, status, id } = searchParams;

  const items = JSON.parse(searchParams.orderItems);

  return (
    <div className="mx-8 md:mx-20 text-sm md:text-md text-font mt-8 h-screen">
      <h1 className="text-sm md:text-lg ">
        Order No.
        <span className="ml-6">{id}</span>
      </h1>

      <div className="mt-4">
        <p>
          Order Date
          <span className="ml-6">{dateFormat2(createdAt)}</span>{" "}
        </p>
        <p>
          Order Status
          <span className="ml-6">{status}</span>
        </p>
      </div>
      <div className="mt-6 w-full">
        {items?.map((item: any) => (
          <div
            key={item.id}
            className="grid grid-cols-4 gap-2 mt-4 pr-2 text-xs items-center"
          >
            <div className="relative w-[50px] h-[50px] md:w-[100px] md:h-[100px]">
              <Image alt="product image" src={item?.images[0].url} fill />
            </div>
            <p>{item.name}</p>
            <p>{`${item.quantity} x $${item.price}`}</p>

            <p>${item.quantity * Number(item.price)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Details;
