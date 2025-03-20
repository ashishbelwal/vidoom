const API_URL = import.meta.env.VITE_API_URL;
const frames = ({
  frameImages,
  videoElement,
}: {
  frameImages: any[];
  videoElement: HTMLVideoElement;
}) => {
  return (
    <div
      className={`flex items-center h-full max-w-[${videoElement.duration * 50}px] w-full overflow-hidden`}
    >
      {frameImages.map((frameImage: any, index: number) => (
        <div
          key={index}
          className={`flex items-center gap-2 h-full w-[${(videoElement.duration * 50) / frameImages.length}px]`}
          style={{
            backgroundImage: `url('${API_URL}${frameImage.url}')`,
            backgroundSize: "contain",
            backgroundPosition: "top",
            backgroundRepeat: "no-repeat",
            width: `${(videoElement.duration * 50) / frameImages.length}px`,
          }}
        ></div>
      ))}
    </div>
  );
};

export default frames;
