import React, { useEffect, useState, useRef } from "react";
import tw from "tailwind-styled-components";

const SeekSlider = ({ progress, duration, seekTo, color }) => {
  // SEEK SLIDER

  const fullWidth = useRef(null);
  // Calculate the width percentage
  const [sliderWidth, setSliderWidth] = useState(0);
  const width =
    sliderWidth < 9
      ? 0
      : sliderWidth > 8 && sliderWidth < 13
      ? 13
      : sliderWidth;
  const thumbPos = sliderWidth;

  useEffect(() => {
    if (fullWidth.current) {
      setSliderWidth((progress / duration) * fullWidth.current.offsetWidth);
    }
  }, [progress, duration]);

  // COLOR CHANGE

  const bgSliderColorVariants = {
    yellow: ['bg-yellow-400 absolute h-3.5 top-0 left-0 rounded-full mt-1 -mr-0 z-30'],
    green: ['bg-green-400 absolute h-3.5 top-0 left-0 rounded-full mt-1 -mr-0 z-30'],
    blue: ['bg-blue-400 absolute h-3.5 top-0 left-0 rounded-full mt-1 -mr-0 z-30'],
    red: ['bg-red-400 absolute h-3.5 top-0 left-0 rounded-full mt-1 -mr-0 z-30'],
    violet: ['bg-violet-400 absolute h-3.5 top-0 left-0 rounded-full mt-1 -mr-0 z-30'],
    teal: ['bg-teal-400 absolute h-3.5 top-0 left-0 rounded-full mt-1 -mr-0 z-30']
  };

  const strokeSliderColorVariants = {
    blue: ["stroke-blue-400"],
    red: ["stroke-red-400"],
    violet: ["stroke-violet-400"],
    teal: ["stroke-teal-400"],
    yellow: ["stroke-yellow-400"],
    green: ["stroke-green-400"],
    gray: ["stroke-gray-400"],
  };
  //   yellow: ["bg-gradient-to-r from-yellow-200 via-white to-yellow-300"],
  //   red: ["bg-gradient-to-r from-red-200 via-white to-red-300"],
  //   blue: ["bg-gradient-to-r from-blue-200 via-white to-blue-300"],
  //   green: ["bg-gradient-to-r from-green-200 via-white to-green-300"],
  //   gray: ["bg-gradient-to-r from-gray-200 via-white to-gray-300"],
  //   teal: ["bg-gradient-to-r from-gray-200 via-white to-gray-300"],

  const sliderClassName = bgSliderColorVariants[color];
  const strokeClassName = strokeSliderColorVariants[color];

  // const sliderClassName = `bg-${color}-400 absolute h-3.5 top-0 left-0 rounded-full mt-1 -mr-0 z-30`;
  // const strokeClassName = `stroke-${color}-400`;

  return (
    <div className="relative w-full">
      <input
        className="w-full h-3
                        bg-gray-200 rounded-lg opacity-0
                        cursor-pointer appearance-none"
        type="range"
        min="0"
        max={duration}
        step="1"
        value={progress}
        onChange={(e) => {
          seekTo(e.target.value);
        }}
      />

      <div
        className={sliderClassName}
        style={{ width: width, pointerEvents: "none" }}
      ></div>
      <div
        ref={fullWidth}
        className="absolute h-3.5 w-full bg-gray-200 rounded-full -mt-5 z-20"
        style={{ pointerEvents: "none" }}
      ></div>
      <svg
        className="absolute mt-[-22px] z-40 w-[20px] h-[20px] cursor-pointer -translate-x-[50%]"
        style={{ left: thumbPos, pointerEvents: "none" }}
      >
        <circle
          className={strokeClassName}
          cx="10"
          cy="10"
          r="8"
          stroke-width="3.6"
          fill="#FFF"
        />
        <div></div>
      </svg>
    </div>
  );
};

export default SeekSlider;
