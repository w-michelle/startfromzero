import Image from "next/image";

const Hero = () => {
  return (
    <div className="relative top-0 left-0 min-h-screen z-[10]">
      <Image
        alt="Hero Image"
        src="/hero.png"
        fill
        className="object-cover"
      />
    </div>
  );
};

export default Hero;
