import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import Image from "next/image";

const About = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center mb-14">
      <div className="relative w-[300px] h-[200px] md:w-[700px] md:h-[600px] ">
        <Image
          src="/about.png"
          alt="Start From Zero building"
          className="object-cover"
          fill
        />
      </div>
      <div className="text-[#e1e1e1f4] text-xs px-6 w-[350px] sm:w-[450px] md:w-[600px] md:text-sm text-center flex flex-col justify-center items-center gap-6 mt-6">
        <p className="font-bold text-sm md:text-lg">
          It can serve as a slogan to encourage people when they feel unhappy,
          down, or miserable.
        </p>
        <p>
          Start From Zero is a well-known local brand that originated from
          street art and was founded by artist Dom in 2000. His artworks have
          been exhibited in South Korea, Australia, Denmark, Taiwan, and other
          places.
        </p>
        <p>
          In 2010, he began developing woodwork, incorporating his unique street
          art style into wooden furniture and products. The brand now focuses on
          promoting woodworking culture and handmade woodwork.
        </p>
        <p>START stands for STreet ART, STencil ART and STicker ART.</p>
        <p>There are two meanings behind Start From Zero:</p>
        <p>
          Dom started street art from scratch. He aims to encourage more people
          to engage in street art when they discover his artwork. Additionally,
          it&apos;s not just a slogan to uplift those feeling depressed; we also
          aim to encourage people to pursue what they love starting from zero.
        </p>
      </div>
    </div>
  );
};

export default About;
