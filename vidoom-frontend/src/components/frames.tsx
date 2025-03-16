import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;
const frames = ({ frameImages }: { frameImages: any[] }) => {
  const [isClipVideo, setIsClipVideo] = useState(false);
  useEffect(() => {
    console.log(frameImages);
  }, [frameImages]);
  return (
    <>
      {frameImages.map((frameImage: any, index: number) => (
        <div
          key={index}
          className={`flex items-center gap-2 fixed-50 h-auto`}
          style={{
            backgroundImage: `url('${API_URL}${frameImage.url}')`,
            backgroundSize: "contain",
            backgroundPosition: "top",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
      ))}
    </>
  );
};

export default frames;
