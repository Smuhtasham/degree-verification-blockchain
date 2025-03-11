import React from "react";
const HomeMain = () => {
  return (
    <section className="bg-[#E8f6f3] h-[calc(100vh-63px)] flex justify-center items-center">
      <div className="w-[80%] mx-auto bg-[#093B3B] rounded-[8px] flex">
        <div className="w-[50%] pb-20">
          <div className="pt-12 text-white pl-8">
            <p className="text-[28px]">Degree Find Out</p>
            <p className="text-[45px] font-bold pt-5">
              Knowledge Meets Innovation
            </p>
            <p className="pt-8 text-[16px] font-normal">
              This platform's simplicity belies its powerful capabilities,
              offering a seamless and enjoyable educational experience.
            </p>
          </div>
          <div className="ml-8 mt-12 py-2 px-4 rounded-[8px] flex gap-2 items-center bg-white w-[40%]">
            
            <input
              type="text"
              placeholder="Search Your Degree"
              className="outline-none"
            />
          </div>
        </div>

        <div className="w-[50%] flex justify-center items-center relative">
          <img src="students.png" className="h-[80%] relative z-10" />

          <img
            src="halfcircle.png"
            className="absolute h-[346px] w-[501px] top-[286px]  right-[19px] z-[1] rotate-180"
          />
        </div>
      </div>
    </section>
  );
};

export default HomeMain;
