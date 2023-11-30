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
    <div className="max-w-[1200px] text-white flex flex-col items-center my-4 h-screen mx-20">
      <p className="self-start mb-6 text-font text-sm font-bold tracking-widest">
        ELEPHANT GROUNDS
      </p>
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
        <div className="z-[10000] absolute top-0 right-0 backdrop-blur-sm bg-black/40  w-full h-full flex justify-center pt-[120px]">
          <button
            className="absolute text-3xl top-20 right-20"
            onClick={() => setOpen(false)}
          >
            <MdOutlineClose />
          </button>
          <div className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px]">
            <Image fill src={selectedImg} alt="reno full image" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Renovation;
