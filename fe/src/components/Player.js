// src/components/Player.js
import React from "react";
import tw from "tailwind-styled-components";
import styled from "styled-components";

const OutBox = tw.div`
  flex items-center justify-center flex-col min-w-96 w-full  min-h-192 h-full
`;
const Ball = tw.div`
flex items-center justify-center min-w-96 w-96 h-96  rounded-full bg-yellow-100 shadow-lg transition ease-in-out hover:animate-pulse
`;
const PlayListName = tw.h1`
text-3xl 
`;

const Slider = tw.input`
  appearance-none
  w-24
  h-1
  bg-gray-300
  rounded-lg
  cursor-pointer
  accent-blue-500
  transition-opacity
  opacity-100
`;

function Player({
  togglePlayPause,
  skipToNext,
  skipToPrevious,
  setVolume,
  playlists,
  playPlaylist,
  pliName,
  isPlaying,
}) {
  return (
    <OutBox>
      <PlayListName>{pliName}</PlayListName>
      <Ball>
        <div>
          <button onClick={skipToPrevious}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 16.811c0 .864-.933 1.406-1.683.977l-7.108-4.061a1.125 1.125 0 0 1 0-1.954l7.108-4.061A1.125 1.125 0 0 1 21 8.689v8.122ZM11.25 16.811c0 .864-.933 1.406-1.683.977l-7.108-4.061a1.125 1.125 0 0 1 0-1.954l7.108-4.061a1.125 1.125 0 0 1 1.683.977v8.122Z"
              />
            </svg>
          </button>
          <button onClick={togglePlayPause}>
            {isPlaying ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
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
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
                />
              </svg>
            )}
          </button>
          <button onClick={skipToNext}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061A1.125 1.125 0 0 1 3 16.811V8.69ZM12.75 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061a1.125 1.125 0 0 1-1.683-.977V8.69Z"
              />
            </svg>
          </button>

          {/* 볼륨 조절 슬라이더 */}
          <div className="relative flex items-center justify-center mt-4">
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
          {playlists.map((track) => (
            <div key={track.track.id}>{track.track.name}</div>
          ))}
        </div>
      </Ball>
    </OutBox>
  );
}

export default Player;
