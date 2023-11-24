import Link from "next/link";
import { BsInstagram } from "react-icons/bs";
import { BiLogoFacebook } from "react-icons/bi";
const Footer = () => {
  return (
    <div className="text-[#e9e9e9eb] tracking-wider border-t-[1px] border-[#e1e1e1f4]/10 p-20 text-[0.60rem] flex flex-col gap-8 items-center justify-center w-full">
      <div className="flex gap-4 text-xl">
        <a href="#">
          <BiLogoFacebook />
        </a>
        <a href="#">
          <BsInstagram />
        </a>
      </div>
      <ul className="flex flex-col gap-2 items-center">
        <li>
          <Link href="/about">ABOUT</Link>
        </li>
        <li>
          <Link href="/contact">CONTACT</Link>
        </li>
      </ul>
      <p>&copy; STARTFROMZERO CO.,LTD ALL RIGHTS RESERVED</p>
    </div>
  );
};

export default Footer;
