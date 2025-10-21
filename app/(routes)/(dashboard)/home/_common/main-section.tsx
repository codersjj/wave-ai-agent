import { RiEmotionHappyFill } from "@remixicon/react";
import Header from "../../_common/header";
import RecentNotes from "./recent-notes";

const MainSection = () => {
  return (
    <>
      <Header />

      <div className="w-full max-w-2xl mx-auto space-y-5 flex flex-col justify-center items-center">
        <div className="mt-16 w-full flex justify-center items-center gap-2">
          <h1
            className="flex items-center gap-2 font-semibold tracking-tighter
            text-xl sm:text-2xl md:text-4xl text-pretty text-gray-800 dark:text-white
            opacity-0 fade-in-up"
          >
            <RiEmotionHappyFill className="size-[24px] md:size-10" />
            How can I help you today?
          </h1>
        </div>

        {/* Chat Interface */}

        <div className="w-full pt-7">
          {/* <div>
            <span className="text-sm dark:text-white/50">Recent Notes</span>
          </div> */}
          {/* Recent Notes */}
          <RecentNotes />
        </div>
      </div>
    </>
  );
};

export default MainSection;
