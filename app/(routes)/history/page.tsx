"use client";

import { Image } from "@/app/redux/features/cartSlice";
import { dateFormat, dateFormat2 } from "@/util/dateFormat";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
type AddCartType = {
  name: string;
  price: string;
  description: string;
  images: Image[];
  quantity: number;
};
interface Order {
  amount: string;
  createdAt: string;
  id: string;
  paymentIntentID: string;
  orderItems: AddCartType[];
  status: string;
  userId: string;
}

const History = () => {
  const [orders, setOrders] = useState<Order[] | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  const fetchOrders = async () => {
    const response = await fetch("/api/getOrders");
    const data = await response.json();

    return data;
  };

  useEffect(() => {
    if (!session?.user) return router.push("/");
    fetchOrders()
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);
  if (loading)
    return (
      <div className="h-screen text-white flex flex-col items-center justify-center">
        <AiOutlineLoading3Quarters className="text-[3rem] animate-spin" />
        <p className="mt-3">Loading ...</p>
      </div>
    );
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="px-6 md:px-20 overflow-auto min-h-[100vh] text-font">
      <h1 className="text-2xl mt-6">Orders</h1>
      <table className="w-full mt-4 md:text-sm text-[8px]">
        <tbody>
          <tr className="text-left mb-4 border-b-[1px] border-font leading-10">
            <th>Order References</th>
            <th>Status</th>
            <th>Date</th>
            <th>Details</th>
            <th>Total</th>
          </tr>

          {orders?.map((order) => (
            <tr
              key={order.id}
              className="border-b-[1px] border-gray-100 md:leading-[3rem] leading-5"
            >
              <td className="break-words">{order.id}</td>
              <td>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </td>
              <td>{dateFormat2(order.createdAt)}</td>
              <td>
                <Link
                  href={{
                    pathname: `/details/${order.id}`,
                    query: {
                      id: order.id,
                      amount: order.amount,
                      status: order.status,
                      createdAt: order.createdAt,
                      orderItems: JSON.stringify(order.orderItems),
                    },
                  }}
                >
                  <button className="border-[1px] border-black hover:text-black hover:bg-[#e7bd5a] rounded-lg md:px-3 md:text-sm md:py-1 px-1 text-[6px]">
                    View Detail
                  </button>
                </Link>
              </td>
              <td>${Number(order.amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default History;
