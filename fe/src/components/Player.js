// src/components/Player.js
import React, { useState, useEffect } from "react";
import tw from "tailwind-styled-components";
import styled from "styled-components";
import empty_album from '../assets/empty_album.png'

const Ball = tw.div`
  w-full
  h-full
  m-auto
  rounded-full 
  bg-yellow-100 
  shadow-lg 
  transition 
  ease-in-out 
  hover:animate-pulse
  absolute
  z-0
`;
const PlayList = tw.h1`
text-3xl 
`;

const Track = tw.div`
m-4
`;

const Slider = tw.input`
  appearance-none
  w-24
  h-2
  bg-gray-200
  accent-blue-500
  rounded-lg
  cursor-pointer
  transition-opacity
  opacity-100
`;

const SeekSlider = tw.input`
  w-full
  h-2
  accent-teal-500
  opacity-75
  cursor-pointer
  rounded-lg
`;

function Player({
  togglePlayPause,
  skipToNext,
  skipToPrevious,
  setVolume,
  playlists,
  playPlaylist,
  pliName,
  track,
  isPlaying,
  seekTo,
  currentTime,
  duration
}) {
  const [progress, setProgress] = useState(0);

  const getCurrentProgress = () => {
    // Replace this with your actual logic to get the current progress
    return currentTime; // Simulated progress value
  };

  useEffect(() => {
    let interval;
    setProgress(getCurrentProgress()); // Update progress on pause

    if (isPlaying) {
      let prevValue = getCurrentProgress();

      interval = setInterval(() => {
        setProgress((prevValue) => prevValue + 1);
      }, 1000); // Adjust the interval as needed
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTime, skipToNext, skipToPrevious]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div class="max-w-[70%] m-auto">
      <PlayList>
        <h2>{pliName}</h2>
      </PlayList>
      <div class="text-center m-auto relative">
        <Ball>
        </Ball>
        <div class="flex flex-col justify-center gap-6 w-full">
          <div class="mt-20 z-30">
            <article class="bg-white p-8 rounded-lg shadow-md min-w-60 max-w-80 m-auto ">
              {track ? (
                <div>
                  <img class="w-full mt-4 mb-4 rounded-lg shadow-lg shadow-gray-200" src={track.album[0]} alt="Album cover"/>
                  <h2 class="text-xl font-semibold mt-4 mb-2">{track.name}</h2>
                  <p class="text-gray-600 text-sm mt-2 mb-4">{track.artists}</p>
                </div>
                ) : (
                  <div>
                    <img class="w-full mt-4 mb-4 rounded-lg shadow-lg shadow-gray-200" src={empty_album}/>
                    <h2 class="text-xl font-semibold mt-4 mb-2">No track is currently playing</h2>
                    <p class="text-gray-600 text-sm mt-2 mb-4">Please wait</p>
                  </div>
                )}
              <div class="mt-4 mb-4 flex flex-row justify-center w-full">
                <button class="m-4" onClick={skipToPrevious}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 16.811c0 .864-.933 1.406-1.683.977l-7.108-4.061a1.125 1.125 0 0 1 0-1.954l7.108-4.061A1.125 1.125 0 0 1 21 8.689v8.122ZM11.25 16.811c0 .864-.933 1.406-1.683.977l-7.108-4.061a1.125 1.125 0 0 1 0-1.954l7.108-4.061a1.125 1.125 0 0 1 1.683.977v8.122Z"
                    />
                  </svg>
                </button>
                <button class="m-4" onClick={togglePlayPause}>
                  {isPlaying ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-10"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 5.25v13.5m-7.5-13.5v13.5"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-10"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
                      />
                    </svg>
                  )}
                </button>
                <button class="m-4" onClick={skipToNext}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061A1.125 1.125 0 0 1 3 16.811V8.69ZM12.75 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061a1.125 1.125 0 0 1-1.683-.977V8.69Z"
                    />
                  </svg>
                </button>
              </div>
              <div>
                <SeekSlider class="w-full"
                      type="range"
                      min="0"
                      max={duration}
                      step="1"
                      value={progress}
                      onChange={(e) => {
                        seekTo(e.target.value);
                      }}
                    />
              </div>
              <div class="flex justify-between mt-2 text-sm text-gray-600">
                <span>{formatTime(progress)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </article>
          </div>
          <div class="mb-20 z-30">
            <div class="bg-white p-8 rounded-lg shadow-md flex flex-row gap-4 items-center justify-center text-center min-w-80 max-w-80 m-auto">
              <div class="flex flex-row items-center gap-2 mt-2 mb-2 w-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"
                  />
                </svg>
                <Slider
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  onChange={(e) => setVolume(e.target.value)}
                />
              </div>
              <div class="mt-2 mb-2 w-full flex flex-row items-center gap-2 text-sm text-gray-600">
                <label class="relative inline-flex cursor-pointer">
                  <input id="switch-2" type="checkbox" class="peer sr-only" />
                  <label for="switch-2" class="hidden"></label>
                  <div class="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-teal-100 rounded-full peer dark:bg-gray-100 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-00 peer-checked:bg-teal-500"></div>
                </label>
                <span>Play next</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Player;
