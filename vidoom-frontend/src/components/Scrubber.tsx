import { motion } from "framer-motion";

const API_URL = import.meta.env.VITE_API_URL;
const Scrubber = ({
  frameImages,
  loader,
  currentTime,
  setCurrentTime,
}: {
  frameImages: any;
  loader: boolean;
  currentTime: number;
  setCurrentTime: (time: number) => void;
}) => {
  return (
    <div className="p-4 w-full ">
      {loader ? (
        <div className="flex w-full h-12 bg-[#ffffff0f]  overflow-hidden">
          <motion.div
            animate={{ x: ["-100%", "100%"] }}
            transition={{
              duration: 2,
              ease: "easeInOut",
              times: [0, 0.2, 0.5, 0.8, 1],
              repeat: Infinity,
              repeatDelay: 1,
            }}
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#f5f5f5",
              borderRadius: 5,
              opacity: 0.05,
            }}
          />
        </div>
      ) : (
        <div className="flex w-full h-12 bg-[#ffffff0f] overflow-hidden">
          {frameImages.map((frameImage: any, index: number) => (
            <img
              key={index}
              src={`${API_URL}${frameImage.url}`}
              alt="thumbnail"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Scrubber;
