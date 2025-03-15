import { Triangle } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const defaultMarkersTime = 30; // in seconds

const Scale = ({ num }: { num: number }) => {
  return (
    <div
      className="h-auto flex items-center justify-between absolute top-0 left-0 w-full opacity-[0.3] cursor-drag"
      style={{ pointerEvents: "none" }}
    >
      {Array.from({ length: num }).map((_, index) => {
        if (index === 0) {
          return <div key={index} className="w-[0.5px] h-4 bg-white"></div>;
        } else if (index === num - 1) {
          return (
            <div key={index} className="w-[0.5px] h-4 bg-white opacity-0"></div>
          );
        } else {
          return <div key={index} className="w-[0.5px] h-2 bg-white"></div>;
        }
      })}
    </div>
  );
};

const secondToPixel = (seconds: number) => {
  return seconds * 10;
};

const TimelineMarkers = ({ frameLength }: { frameLength: number }) => {
  const [markers, setMarkers] = useState<number[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Refs to track dragging state and smooth scroll values.
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const targetScrollLeftRef = useRef(0);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      startXRef.current = e.pageX - element.getBoundingClientRect().left;
      scrollLeftRef.current = element.scrollLeft;
      targetScrollLeftRef.current = element.scrollLeft;
      element.style.cursor = "grabbing";
    };

    const handleMouseLeave = () => {
      isDraggingRef.current = false;
      element.style.cursor = "grab";
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      element.style.cursor = "grab";
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      e.preventDefault();
      const x = e.pageX - element.getBoundingClientRect().left;
      const walk = x - startXRef.current;
      targetScrollLeftRef.current = scrollLeftRef.current - walk;
    };

    element.addEventListener("mousedown", handleMouseDown);
    element.addEventListener("mouseleave", handleMouseLeave);
    element.addEventListener("mouseup", handleMouseUp);
    element.addEventListener("mousemove", handleMouseMove);
    element.style.cursor = "grab";

    return () => {
      element.removeEventListener("mousedown", handleMouseDown);
      element.removeEventListener("mouseleave", handleMouseLeave);
      element.removeEventListener("mouseup", handleMouseUp);
      element.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    let animationFrameId: number;
    const element = containerRef.current;
    if (!element) return;

    const animate = () => {
      const diff = targetScrollLeftRef.current - element.scrollLeft;
      if (Math.abs(diff) > 0.5) {
        element.scrollLeft += diff * 0.1;
      } else {
        element.scrollLeft = targetScrollLeftRef.current;
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  useEffect(() => {
    const markersArr = [];
    for (let i = 0; i < defaultMarkersTime; i++) {
      markersArr.push(i);
    }
    setMarkers(markersArr);
  }, [frameLength]);

  return (
    <div
      ref={containerRef}
      className="markers flex overflow-x-auto hide-scrollbar relative"
      style={{
        width: "100%",
        whiteSpace: "nowrap",
        cursor: "grab",
      }}
    >
      <Triangle
        className={`absolute top-0 left-0 w-4 h-4 rotate-180 translate-x-[-50%]  text-white`}
        fill="white"
      />
      {markers.map((marker) => (
        <div
          key={marker}
          className="marker inline-block h-auto flex items-center justify-start relative cursor-grab select-none pt-4"
          style={{ minWidth: 50, position: "relative" }}
        >
          <span className="text-[#ffffff70] text-xs">{marker}</span>
          <Scale num={5} />
        </div>
      ))}
    </div>
  );
};

export default TimelineMarkers;
