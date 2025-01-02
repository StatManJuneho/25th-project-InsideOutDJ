// src/components/Player.js
import React, { useState, useEffect } from "react";
import tw from "tailwind-styled-components";
import Marquee from "react-fast-marquee";
import empty_album from "../assets/empty_album.png";
import menu_icon from "../assets/menu.svg";
import arrow_right_icon from "../assets/arrow-right.svg";
import SeekSlider from "./SeekSlider";
import empty_profile from "../assets/default_pf.jpg"

const Wrapper = tw.div`
  max-w-[100%]
  md:max-w-[70%]
  m-auto
  relative
`;

const Ball = tw.div`
  m-auto
  rounded-full 
  bg-yellow-100 
  shadow-lg 
  absolute
  z-30
  pulsating-circle
`;
const PlayList = tw.h1`
  text-4xl subpixel-antialiased italic text-slate-600 pt-4 pb-4 pl-2 pr-2
`;

const Track = tw.div`
m-4
`;

const Slider = tw.input`
  appearance-none
  w-24
  h-2
  bg-gray-300
  rounded-lg
  cursor-pointer
  transition-opacity
  opacity-100
  range range-xs
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
  duration,
}) {
  const [progress, setProgress] = useState(0);

  // SPOTIFY PLAYER

  const getCurrentProgress = () => {
    // Replace this with your actual logic to get the current progress
    return currentTime; // Simulated progress value
  };

  useEffect(() => {
    let interval;
    setProgress(getCurrentProgress()); // Update progress on pause

    if (isPlaying) {
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
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // SLIDE MENU

  const [slideMenuToggled, setSlideMenuToggled] = useState(false);
  const [slideMenuSetting, setSlideMenuSetting] = useState('hidden w-0')

  // toggle the slide menu with animation
  const toggleSlideMenu = () => {
    setSlideMenuToggled(!slideMenuToggled);
  }

  useEffect(() => {
    if(slideMenuToggled) {
      setSlideMenuSetting('w-0')
        
      setTimeout(function () {
        setSlideMenuSetting('w-[300px] transition-all duration-200 ease-in')
      }, 200);
    } else {
      setSlideMenuSetting('w-0 transition-all duration-200 ease-in')

      setTimeout(function () {
        setSlideMenuSetting('hidden')
      }, 200);
    }
  }, [slideMenuToggled]);

  // COLOR CHANGE

  const [color, setColor] = useState('violet');

  const colorVariants = {
    blue: ['text-blue-300', 'text-blue-400', 'text-blue-600', 'text-blue-800'],
    red: ['text-red-300', 'text-red-400', 'text-red-600', 'text-red-800'],
    violet: ['text-violet-300', 'text-violet-400', 'text-violet-600 bg-violet-200', 'text-violet-800  bg-violet-200'],
    teal: ['text-teal-300', 'text-teal-400', 'text-teal-600', 'text-teal-800']
  }

  const bgColorVariants = {
    blue: ['bg-blue-100', 'bg-blue-200', 'bg-blue-400', 'bg-blue-800'],
    red: ['bg-red-100', 'bg-red-200', 'bg-red-400', 'bg-red-800'],
    violet: ['bg-violet-100', 'bg-violet-200', 'bg-violet-400', 'bg-violet-800'],
    teal: ['bg-teal-100', 'bg-teal-200', 'bg-teal-400', 'bg-teal-800']
  }

  const gradientColorVariants = {
    blue: ['bg-gradient-to-r from-slate-400 from-[8%] via-blue-200 via-45% to-blue-500'],
    red: ['bg-gradient-to-r from-slate-400 from-[8%] via-red-200 via-45% to-red-500'],
    violet: ['bg-gradient-to-r from-slate-400 from-[8%] via-violet-200 via-45% to-violet-500'],
    teal: ['bg-gradient-to-r from-slate-400 from-[8%] via-teal-200 via-45% to-teal-500']
  }

  const text_300 = colorVariants[color][0];
  const text_400 = colorVariants[color][1];
  const text_600 = colorVariants[color][2];
  const text_800 = colorVariants[color][3];

  const bg_100 = bgColorVariants[color][0];
  const bg_200 = bgColorVariants[color][1];
  const bg_400 = bgColorVariants[color][2];
  const bg_800 = bgColorVariants[color][3];

  const gradientCoverBottom = gradientColorVariants[color][0];

  // const text_300 = `text-${color}-300`;
  // const text_400 = `text-${color}-400`;
  // const text_600 = `text-${color}-600`;
  // const text_800 = `text-${color}-800`;

  // const bg_100 = `bg-${color}-100`;
  // const bg_200 = `bg-${color}-200`;
  // const bg_400 = `bg-${color}-400`;
  // const bg_800 = `bg-${color}-800`;

  // const gradientCoverBottom = `bg-gradient-to-r from-slate-400 from-[8%] via-${color}-200 via-45% to-${color}-500`;

  return (
    <div class="relative h-full">
      <button id="mainmenuicon_btn" className="m-4 absolute top-0 right-0" onClick={toggleSlideMenu}><img src={menu_icon} alt="Menu"/></button>
      <div
        class="h-full absolute overflow-hidden bg-gray-900 top-0 right-0 m-0 fixed z-40 inset-y-0 border-r border-r-dashed border-r-neutral-200 fixed-start"
        id="menuslide-framer"
      >
        <div class={slideMenuSetting}>
          <a id="mainmenuicon_close" className="m-4 absolute top-0 right-0" onClick={toggleSlideMenu}>
            <img src={arrow_right_icon} alt="Close"/>
          </a>
          <div class="h-[96px] m-4 content-center">
            <a
                class="transition-colors duration-200 ease-in"
                href="javascript:void(0)"
              >
              <img
                alt="Logo"
                src="https://raw.githubusercontent.com/Loopple/loopple-public-assets/main/riva-dashboard-tailwind/img/logos/loopple.svg"
                class="inline"
              />
            </a>
          </div>

          <div class="px-8 py-5 flex flex-row">
            <div class="inline-block m-2 relative cursor-pointer rounded-[.95rem]">
              <img
                  class="w-[40px] h-[40px] inline-block rounded-[.95rem]"
                  src={empty_profile}
                  alt="avatar image"
                />
            </div>
            <div class="m-2">
              <a
                href="javascript:void(0)"
                class="dark:hover:text-primary hover:text-primary transition-colors duration-200 ease-in-out text-[1.075rem] font-medium dark:text-neutral-400/90 text-secondary-inverse"
              >
                김와빅
              </a>
              <span class="text-secondary-dark dark:text-stone-500 font-medium block text-[0.85rem]">
                노래듣는 돌고래
              </span>
            </div>
            <a
              class="text-base font-medium leading-normal text-center items-center cursor-pointer rounded-[.95rem] transition-colors duration-150 ease-in-out text-dark bg-transparent shadow-none border-0"
              href="javascript:void(0)"
              >
              <span class="leading-none transition-colors duration-200 ease-in-out peer shrink-0 group-hover:text-primary text-secondary-dark">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="white"
                  class="w-6 h-6 m-4"
                >
                  <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
                    ></path>
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                </svg>
              </span>
            </a>
          </div>
          
          <div class="hidden border-b border-dashed lg:block dark:border-neutral-700/70 border-neutral-200"></div>

          <div class="relative pl-3 my-5 overflow-y-scroll">

            {/* <!-- menu item --> */}
            <div class="m-4">
            <span class="font-semibold text-[0.95rem] uppercase dark:text-neutral-500/80 text-secondary-dark">
                  플레이리스트
                </span>
            </div>

            {/* <!-- menu item --> */}
            <div class="m-4">
              <span class="m-4 select-none cursor-pointer rounded-[.95rem]">
                <a
                  href="javascript:;"
                  class="text-[1.15rem] dark:text-neutral-400/75 text-stone-500 hover:text-dark"
                >
                  - 2024. 8. 19
                </a>
              </span>
            </div>

            {/* <!-- menu item --> */}
            <div class="m-4">
              <span class="m-4 select-none cursor-pointer my-[.4rem] rounded-[.95rem]">
                <a
                  href="javascript:;"
                  class="text-[1.15rem] dark:text-neutral-400/75 text-stone-500 hover:text-dark"
                >
                  - 2024. 8. 18
                </a>
              </span>
            </div>

            {/* <!-- menu item --> */}
            <div class="m-4">
              <span class="m-4 select-none cursor-pointer my-[.4rem] rounded-[.95rem]">
                <a
                  href="javascript:;"
                  class="text-[1.15rem] dark:text-neutral-400/75 text-stone-500 hover:text-dark"
                >
                  - 2024. 8. 17
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
      <Wrapper>
        <section>
          <div className={bg_800}>
            <div className="h-6">

            </div>
          </div>
        </section>
        <section className="relative">
          <div 
            className="w-full h-full absolute bg-gradient-to-b from-transparent from-30% to-slate-50 to-85% z-30 opacity-80"
            style={{pointerEvents: "none"}}>
          
          </div>
          <div className={bg_100}>
            <div className="max-h-[600px] w-full overflow-hidden z-20">
              <div className={text_800}>
                <Marquee speed={15} pauseOnHover={true} className="text-8xl font-black italic mt-3 mb-2 subpixel-antialiased drop-shadow-[0_4px_4px_rgb(45, 212, 191)]">
                  #나의추천노래 #InsideOutDJ #YBIGTA-신입프로젝트&nbsp;
                </Marquee>
              </div>
              <div className={text_600}>
                <Marquee speed={35} pauseOnHover={true} className="text-8xl font-black italic mt-2 tb-2 subpixel-antialiased drop-shadow-[0_4px_4px_rgb(45, 212, 191)]">
                  #감성 #스트리밍 #스포티파이 #내플레이리스트 #음악 #플레이어&nbsp;
                </Marquee>
              </div>
              <div className={text_600}>
                <Marquee speed={35} pauseOnHover={true} className="text-8xl font-black italic mt-2 tb-3 subpixel-antialiased drop-shadow-[0_4px_4px_rgb(45, 212, 191)]">
                  #평온 #희망 #노스탤지어 #외로움 #우울 #기쁨 #그리움 #화남 #열정 #흥분 #감동 #행복 #슬픔 #만족 #설렘 #두려움&nbsp;
                </Marquee>
              </div>
              <div className={text_400}>
                <Marquee speed={25} pauseOnHover={true} className="text-6xl font-bold italic mt-3 tb-2 subpixel-antialiased drop-shadow-[0_4px_4px_rgb(45, 212, 191)]">
                  #기쁨 #슬픔 #흥분 #평온 #노스탤지어 #열정 #그리움 #만족 #외로움 #감동 #우울 #희망 #두려움 #화남 #행복 #설렘&nbsp;
                </Marquee>
              </div>
              <div className={text_400}>
                <Marquee speed={25} pauseOnHover={true} className="text-6xl font-bold italic mt-2 tb-3 subpixel-antialiased drop-shadow-[0_4px_4px_rgb(45, 212, 191)]">
                  #트로트 #CCM #힙합 #레게 #클래식 #포크 음악 #컨트리 뮤직 #일렉트로닉 뮤직 #블루스 #재즈 #팝 #록 음악 #발라드 #디스코 #로큰롤 #전자 음악&nbsp;
                </Marquee>
              </div>
              <div className={text_300}>
                <Marquee speed={25} pauseOnHover={true} className="text-6xl font-bold italic mt-3 tb-2 subpixel-antialiased">
                  #블루스 #일렉트로닉 뮤직 #트로트 #클래식 #록 음악 #발라드 #디스코 #재즈 #로큰롤 #CCM #레게 #전자 음악 #힙합 #팝 #포크 음악 #컨트리 뮤직&nbsp;
                </Marquee>
              </div>
              <div className={text_300}>
                <Marquee speed={25} pauseOnHover={true} className="text-6xl font-bold italic mt-2 tb-3 subpixel-antialiased">
                  #레게 #발라드 #록 음악 #컨트리 뮤직 #블루스 #힙합 #전자 음악 #CCM #클래식 #포크 음악 #트로트 #일렉트로닉 뮤직 #팝 #로큰롤 #재즈 #디스코&nbsp;
                </Marquee>
              </div>
            </div>
          </div>
        </section>
        <section class={gradientCoverBottom}>
          <PlayList>{pliName}</PlayList>
          <Ball></Ball>
          <div class="text-center m-auto w-full">
            <div class="flex flex-col justify-center gap-6 w-full max-h-[600px]">
              <div class="mt-4 z-30">
                <article class="bg-white p-8 rounded-lg shadow-md min-w-60 max-w-80 m-auto relative -top-80">
                  {track ? (
                    <div>
                      <img
                        class="w-full mb-4 rounded-lg shadow-lg shadow-gray-200"
                        src={track.album[0]}
                        alt="Album cover"
                      />
                      <h2 class="text-xl font-semibold mt-4 mb-2">
                        {track.name}
                      </h2>
                      <p class="text-gray-600 text-sm mt-2 mb-4">
                        {track.artists}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <img
                        class="w-full mt-4 mb-4 rounded-lg shadow-lg shadow-gray-200"
                        src={empty_album}
                        alt="Empty album"
                      />
                      <h2 class="text-xl font-semibold mt-4 mb-2">
                        No track is currently playing
                      </h2>
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
                  <div class="relative">
                    <SeekSlider
                      progress={progress}
                      duration={duration}
                      seekTo={seekTo}
                      color={color}
                      style="{{ box-shadow: 0px 0 0 4px rgb(124, 58, 237)}}"
                    ></SeekSlider>
                  </div>
                  <div class="flex justify-between mt-2 text-sm text-gray-600">
                    <span>{formatTime(progress)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </article>
              </div>
              <div class="mb-4 z-30 relative -top-80">
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
                    <div>
                      <Slider
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        onChange={(e) => setVolume(e.target.value)}
                      />
                    </div>
                  </div>
                  <div class="mt-2 mb-2 w-full flex flex-row items-center gap-2 text-sm text-gray-600">
                    <label class="relative inline-flex cursor-pointer">
                      <input
                        id="switch-2"
                        type="checkbox"
                        class="peer sr-only"
                      />
                      <label for="switch-2" class="hidden"></label>
                      <div
                        class="relative w-9 h-5 bg-gray-200 peer-focus:outline-none 
                      peer-focus:ring-4 peer-focus:ring-violet-300 dark:peer-focus:ring-gray-100 
                      rounded-full peer dark:bg-gray-100 peer-checked:after:translate-x-full 
                      rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white 
                      after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white 
                      after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 
                      after:transition-all dark:border-gray-00 peer-checked:bg-gray-500"
                      ></div>
                    </label>
                    <div className="content-center">
                      <span>Play next</span>
                    </div>
                  </div>
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
  );
}

export default Player;
