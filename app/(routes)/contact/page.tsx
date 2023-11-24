const Contact = () => {
  return (
    <div className="flex flex-col justify-center h-screen px-16">
      <p className="text-[2rem] md:text-[3rem] text-[#e3e0e0f4]">
        Yat Sang Industrial Building, No.13 Tai Yip St.,
        <br /> Ngau Tau Kok, <br /> Hong Kong{" "}
      </p>
      <div className="flex flex-col gap-4 md:flex-row justify-between w-full text-[#e1e1e1f4] mt-14 text-xs">
        <p>startfromzero_hk@outlook.com</p>
        <p>+852 7071 2448 </p>
        <a href="/">
          <p>INSTAGRAM</p>
        </a>
      </div>
    </div>
  );
};

export default Contact;
