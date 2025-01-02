// src/components/Player.js
import React, { useState, useEffect } from "react";
import tw from "tailwind-styled-components";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import empty_album from "../assets/empty_album.png";
import menu_icon from "../assets/menu.svg";
import MenuSlide from "./MenuSlide";
import SeekSlider from "./SeekSlider";
import MarqueeWall from "./MarqueeWall";

// const Ball = tw.div`
//   m-auto
//   rounded-full
//   bg-yellow-100
//   shadow-lg
//   absolute
//   z-30
//   pulsating-circle
// `;
const Wrapper = tw.div`max-w-[100%] md:max-w-[70%] m-auto relative`;
const Ball = tw.div `m-auto rounded-full bg-yellow-100 shadow-lg absolutez-30 pulsating-circle before:bg-slate-400 after:bg-slate-400 after:opacity-40`
const SpinningBall = tw.div`
  m-auto w-[24rem] h-[24rem] rounded-full shadow-lg absolute z-30 animate-spin-slow
  flex items-center justify-center pt-4 pb-4 pl-2 pr-2 mt-16 ml-8
  
  shadow-[0_0_15px_rgba(255,255,255,0.9),0_0_30px_rgba(255,255,255,0.7),0_0_45px_rgba(255,255,255,0.5)]
`;
const OutBox = tw.div`flex items-center justify-center flex-col min-w-96 w-full min-h-192 h-full`;
const PlayListName = tw.h1`text-3xl m-auto rounded-full bg-yellow-100 shadow-lg absolute z-30 pulsating-circle`;
const PlayList = tw.h1`text-3xl subpixel-antialiased italic text-slate-600 `;
const TrackContainer = tw.div`m-4`;
const SliderInput = styled.input`
appearance: none;
background-color: #DDD;
border-radius: 25px;

&::-webkit-slider-thumb {
  width: 12px;
  height: 12px;
  -webkit-appearance: none;
  background: #FFF;
  box-shadow: ${(props) => props.boxShadow};
  border-radius: 50%;
  z-index: 30;
}`
const PlaylistBtn = tw.button`z-40 fixed top-4 right-4 md:right-20 py-1 px-3 bg-gray-200 rounded-full text-sm border-1 shadow-lg transition ease-in-out hover:bg-green-100`;
const DiaryBtn = tw.button`z-40 fixed top-4 left-4 py-1 px-3 bg-gray-200 rounded-full text-sm border-1 shadow-lg transition ease-in-out hover:bg-yellow-100`;
const MenuButton = tw.button`z-40 m-4 fixed top-10 md:top-0 right-0`;
const AlbumContainer = tw.article`bg-white p-8 rounded-lg shadow-md min-w-60 max-w-80 m-auto relative -top-40`;
const AlbumImage = tw.img`w-full mb-4 rounded-lg shadow-lg shadow-gray-200`;
const AlbumTitle = tw.h2`text-xl font-semibold mt-4 mb-2`;
const AlbumArtist = tw.p`text-gray-600 text-sm mt-2 mb-4`;
const ButtonContainer = tw.div`mt-4 mb-4 flex flex-row justify-center w-full`;
const IconButton = tw.button`m-4`;
const TimeContainer = tw.div`flex justify-between mt-2 text-sm text-gray-600`;
const VolumeContainer = tw.div`mt-2 mb-2 w-full flex flex-row items-center gap-2 text-sm text-gray-600`;
const VolumeLabel = tw.label`relative inline-flex cursor-pointer`;
const VolumeSwitch = tw.div`relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-violet-300 dark:peer-focus:ring-gray-100 rounded-full peer dark:bg-gray-100 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-00 peer-checked:bg-gray-500`;

function Player({
  togglePlayPause,
  skipToNext,
  skipToPrevious,
  setVolume,
  playPlaylist,
  pliName,
  track,
  isPlaying,
  emotion,
  seekTo,
  currentTime,
  duration,
  userInfo,
  setPliName,
  setEmotion,
}) {
  const navigate = useNavigate();
  const goToPlaylists = () => navigate("/playlists");
  const goToDiary = () => navigate("/diary");

  const [progress, setProgress] = useState(0);
  const [slideMenuToggled, setSlideMenuToggled] = useState(false);
  const [slideMenuSetting, setSlideMenuSetting] = useState("hidden w-0");

  const toggleSlideMenu = () => setSlideMenuToggled(!slideMenuToggled);

  useEffect(() => {
    if (slideMenuToggled) {
      setSlideMenuSetting("w-0");
      setTimeout(
        () =>
          setSlideMenuSetting("w-[300px] transition-all duration-200 ease-in"),
        200
      );
    } else {
      setSlideMenuSetting("w-0 transition-all duration-200 ease-in");
      setTimeout(() => setSlideMenuSetting("hidden"), 200);
    }
  }, [slideMenuToggled]);

  useEffect(() => {
    let interval;
    setProgress(currentTime);

    if (isPlaying) {
      interval = setInterval(() => setProgress((prev) => prev + 1), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTime]);

  useEffect(() => {
    // 트랙이 변경될 때 progress를 0으로 초기화
    setProgress(0);
  }, [pliName]);
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const colorVariants = {
    yellow: [
      "text-yellow-300",
      "text-yellow-400",
      "text-yellow-600",
      "text-yellow-800",
    ],
    green: [
      "text-green-300",
      "text-green-400",
      "text-green-600",
      "text-green-800",
    ],
    blue: ["text-blue-300", "text-blue-400", "text-blue-600", "text-blue-800"],
    red: ["text-red-300", "text-red-400", "text-red-600", "text-red-800"],
    violet: [
      "text-violet-300",
      "text-violet-400",
      "text-violet-600",
      "text-violet-800",
    ],
    gray: ["text-gray-300", "text-gray-400", "text-gray-600", "text-gray-800"],
    teal: ["text-teal-300", "text-teal-400", "text-teal-600", "text-teal-800"],
  };

  const bgColorVariants = {
    yellow: [
      "bg-yellow-100",
      "bg-yellow-200",
      "bg-yellow-400",
      "bg-yellow-800",
    ],
    green: ["bg-green-100", "bg-green-200", "bg-green-400", "bg-green-800"],
    blue: ["bg-blue-100", "bg-blue-200", "bg-blue-400", "bg-blue-800"],
    red: ["bg-red-100", "bg-red-200", "bg-red-400", "bg-red-800"],
    violet: [
      "bg-violet-100",
      "bg-violet-200",
      "bg-violet-400",
      "bg-violet-800",
    ],
    gray: ["bg-gray-100", "bg-gray-200", "bg-gray-400", "bg-gray-800"],
    teal: ["bg-teal-100", "bg-teal-200", "bg-teal-400", "bg-teal-800"],
  };

  const gradientColorVariants = {
    yellow: ["bg-gradient-to-r from-slate-400 from-[8%] via-yellow-200 via-45% to-yellow-500"],
    green: ["bg-gradient-to-r from-slate-400 from-[8%] via-green-200 via-45% to-green-500"],
    blue: ["bg-gradient-to-r from-slate-400 from-[8%] via-blue-200 via-45% to-blue-500"],
    red: ["bg-gradient-to-r from-slate-400 from-[8%] via-red-200 via-45% to-red-500"],
    gray: ["bg-gradient-to-r from-slate-400 from-[8%] via-gray-200 via-45% to-gray-500"],
    violet: ["bg-gradient-to-r from-slate-400 from-[8%] via-violet-200 via-45% to-violet-500"],
    teal: ["bg-gradient-to-r from-slate-400 from-[8%] via-teal-200 via-45% to-teal-500"],
  };

  const gradientColorVariants2 = {
    yellow: ["bg-gradient-to-r from-yellow-200 via-white to-yellow-300"],
    red: ["bg-gradient-to-r from-red-200 via-white to-red-300"],
    blue: ["bg-gradient-to-r from-blue-200 via-white to-blue-300"],
    green: ["bg-gradient-to-r from-green-200 via-white to-green-300"],
    gray: ["bg-gradient-to-r from-gray-200 via-white to-gray-300"],
    teal: ["bg-gradient-to-r from-teal-200 via-white to-teal-300"],
  };

  const text_300 = colorVariants[emotion][0];
  const text_400 = colorVariants[emotion][1];
  const text_600 = colorVariants[emotion][2];
  const text_800 = colorVariants[emotion][3];

  const bg_100 = bgColorVariants[emotion][0];
  const bg_200 = bgColorVariants[emotion][1];
  const bg_400 = bgColorVariants[emotion][2];
  const bg_800 = bgColorVariants[emotion][3];

  const gradientCoverBottom = gradientColorVariants[emotion][0];

  const ballColors = {
    yellow: ['before:bg-yellow-400 after:bg-yellow-400'],
    green: ['before:bg-green-400 after:bg-green-400'],
    blue: ['before:bg-blue-400 after:bg-blue-400'],
    red: ['before:bg-red-400 after:bg-red-400'],
    violet: ['before:bg-violet-400 after:bg-violet-400'],
    gray: ["before:bg-gray-400 after:bg-gray-400"],
    teal: ['before:bg-teal-400 after:bg-teal-400']
  }

  const gradientCoverBottom2 = gradientColorVariants2[emotion][0];

  const [boxShadowColor, setBoxShadowColor] = useState('rgba(0, 0, 0, 0.2)');
  
  useEffect(() => {
    const determineColor = (str) => {
      switch (str) {
        case 'yellow':
          return '0px 0 0 4px #facc15';
        case 'green':
          return '0px 0 0 4px #4ade80';
        case 'blue':
          return '0px 0 0 4px #60a5fa';
        case 'red':
          return '0px 0 0 4px #f87171';
        case 'violet':
          return '0px 0 0 4px #a78bfa';
        case 'gray':
          return '0px 0 0 4px #9ca3af';
        default:
          return '0px 0 0 4px #2dd4bf';
      }
    };

    setBoxShadowColor(determineColor(emotion));
  }, [emotion]);

  return (
    <div class="overflow-x-hidden">
      <PlaylistBtn onClick={goToPlaylists}>기억저장소 가기</PlaylistBtn>
      <DiaryBtn onClick={goToDiary}>일기 쓰러 가기</DiaryBtn>
      <MenuButton className="z-40 m-4 fixed top-10 md:top-0 right-0" onClick={toggleSlideMenu}>
        <img src={menu_icon} alt="Menu" />
      </MenuButton>
      <div className="relative h-full">
        <MenuSlide
          toggleSlideMenu={toggleSlideMenu}
          slideMenuSetting={slideMenuSetting}
          userInfo={userInfo}
          playPlaylist={playPlaylist}
          setPliName={setPliName}
          setEmotion={setEmotion}
        />
        <Wrapper>
          <section>
            <div className={bg_800}>
              <div className="h-6"></div>
            </div>
          </section>
          <section className="relative">
            <MarqueeWall bg_100={bg_100} text_300={text_300} text_400={text_400} text_600={text_600} text_800={text_800}></MarqueeWall>
          </section>

          <section className={gradientCoverBottom}>
            <SpinningBall className={gradientCoverBottom2}>
              <PlayList>{pliName}</PlayList>
            </SpinningBall>
            <Ball className={ballColors[emotion][0]}></Ball>

            <div className="text-center m-auto w-full">
              <div className="flex flex-col justify-center gap-6 w-full max-h-[600px]">
                <div className="mt-4 z-30">
                  <AlbumContainer>
                    {track ? (
                      <div>
                        <AlbumImage src={track.album[0]} alt="Album cover" />
                        <AlbumTitle>{track.name}</AlbumTitle>
                        <AlbumArtist>{track.artists}</AlbumArtist>
                      </div>
                    ) : (
                      <div>
                        <AlbumImage src={empty_album} alt="Empty album" />
                        <AlbumTitle>No track is currently playing</AlbumTitle>
                        <AlbumArtist>Please wait</AlbumArtist>
                      </div>
                    )}
                    <ButtonContainer>
                      <IconButton onClick={skipToPrevious}>
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
                      </IconButton>
                      <IconButton onClick={togglePlayPause}>
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
                      </IconButton>
                      <IconButton onClick={skipToNext}>
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
                      </IconButton>
                    </ButtonContainer>
                    <div className="relative">
                      <SeekSlider
                        progress={progress}
                        duration={duration}
                        seekTo={seekTo}
                        color={emotion}
                      ></SeekSlider>
                    </div>
                    <TimeContainer>
                      <span>{formatTime(progress)}</span>
                      <span>{formatTime(duration)}</span>
                    </TimeContainer>
                  </AlbumContainer>
                </div>
                <div className="mb-4 z-30 relative -top-40">
                  <div className="bg-white p-8 rounded-lg shadow-md flex flex-row gap-4 items-center justify-center text-center min-w-80 max-w-80 m-auto">
                    <VolumeContainer>
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
                      <SliderInput
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        defaultValue={0.5}
                        onChange={(e) => setVolume(e.target.value)}
                        boxShadow={boxShadowColor}
                      />
                    </VolumeContainer>
                    <VolumeContainer>
                      <VolumeLabel>
                        <input
                          id="switch-2"
                          type="checkbox"
                          className="peer sr-only"
                        />
                        <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-violet-300 dark:peer-focus:ring-gray-100 rounded-full peer dark:bg-gray-100 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-00 peer-checked:bg-gray-500"></div>
                      </VolumeLabel>
                      <span>Play next</span>
                    </VolumeContainer>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section>
            <span className="mt-4 mb-4">Made with ❤️ by InsideOutDJ. </span>
          </section>
        </Wrapper>
      </div>
    </div>
  );
}

export default Player;
