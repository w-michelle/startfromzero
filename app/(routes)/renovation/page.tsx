"use client";
import Image from "next/image";
import { useState } from "react";
import { MdOutlineClose } from "react-icons/md";
const Renovation = () => {
  const [selectedImg, setSelectedImg] = useState("");
  const [open, setOpen] = useState(false);

  const bigImg = (img: string) => {
    setSelectedImg(img);
    setOpen(true);
  };

  let imgarr = [];

  for (let i = 1; i < 12; i++) {
    imgarr.push(`/reno/eg${i}.jpg`);
  }

  return (
    <div className="max-w-[1200px] text-white flex justify-center mx-auto my-4 h-screen">
      <div className="scrollbar grid grid-cols-3 h-[270px] sm:h-[620px] lg:w-[930px] lg:h-[620px] overflow-y-scroll overflow-x-hidden gap-2">
        {imgarr.map((item, index) => (
          <div
            key={index}
            className="relative w-[90px] h-[90px] sm:w-[200px] sm:h-[200px] lg:w-[300px] lg:h-[300px]"
          >
            <Image
              fill
              src={item}
              alt="elephant grind reno"
              className="hover:scale-110 hover:cursor-pointer hover:z-[7777]"
              onClick={() => bigImg(item)}
            />
          </div>
        ))}
      </div>

      {open && (
        <div className="z-[10000] absolute top-0 backdrop-blur-sm bg-black/40  w-full h-screen flex justify-center items-center">
          <button
            className="absolute text-3xl top-20 right-20"
            onClick={() => setOpen(false)}
          >
            <MdOutlineClose />
          </button>
          <div className="relative w-[800px] h-[700px]">
            <Image fill src={selectedImg} alt="reno full image" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Renovation;
