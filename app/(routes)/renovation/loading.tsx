const Loading = () => {
  return (
    <div className="max-w-[1200px] text-white flex flex-col items-center my-4 h-screen mx-20">
      <p className="self-start mb-6 text-font text-sm font-bold tracking-widest">
        ELEPHANT GROUNDS
      </p>
      <div className="scrollbar grid grid-cols-3 h-[270px] sm:h-[620px] lg:w-[930px] lg:h-[620px] overflow-y-scroll overflow-x-hidden gap-2">
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={i}
            className="w-[90px] h-[90px] sm:w-[200px] sm:h-[200px] lg:w-[300px] lg:h-[300px] bg-gray-700/30 animate-pulse rounded-md"
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Loading;
