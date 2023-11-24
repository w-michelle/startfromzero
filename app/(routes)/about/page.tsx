import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import Image from "next/image";

const About = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center mb-14">
      <div className="relative w-[300px] h-[200px] md:w-[700px] md:h-[600px] ">
        <Image
          src="/about.png"
          alt="about image"
          className="object-cover"
          fill
        />
      </div>
      <div className="text-[#e1e1e1f4] text-xs px-6 w-[350px] sm:w-[450px] md:w-[600px] md:text-sm text-center flex flex-col justify-center items-center gap-6 mt-6">
        <p className="font-bold text-sm md:text-lg">
          It can be a slogan for encouraging people when they are unhappy, down
          or miserable.
        </p>
        <p>
          Start From Zero is a well-known local brand which started with street
          art and founded by artist Dom in 2000. His artworks have been
          exhibited in South Korea, Australia, Denmark, Tai Wan etc.
        </p>
        <p>
          In 2010, he began to develop woodwork and incorporate with unique
          street art style into wooden furniture and products. The brand is now
          focusing on promote woodworking culture and handmade woodwork.
        </p>
        <p>START stands for STreet ART, STencil ART and STicker ART.</p>
        <p>There are two meanings of Start From Zero:</p>
        <p>
          Dom started street art from scratch. He wants to encourage more people
          to do street art when discover his artwork. Moreover, it is not only a
          slogan to cheer people up when they’re depressed, we also want
          encourage people to do what they love from zero.
        </p>
      </div>
    </div>
  );
};

export default About;
