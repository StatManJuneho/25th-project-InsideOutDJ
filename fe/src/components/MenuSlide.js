import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import tw from "tailwind-styled-components";

import menu_icon from "../assets/menu.svg";
import arrow_right_icon from "../assets/arrow-right.svg";
import empty_profile from "../assets/default_pf.jpg";
import inside_out_png from "../assets/inside_out.png"

const MenuSlideContainer = tw.div`
  h-full absolute overflow-hidden bg-gray-900 top-0 right-0 m-0 fixed z-40 inset-y-0 border-r border-r-dashed border-r-neutral-200 fixed-start
`;

const SlideContent = tw.div`
  relative pl-3 my-5 overflow-y-scroll
`;

const PlaylistItem = tw.div`
  m-4 select-none cursor-pointer rounded-[.95rem] text-[1.15rem] dark:text-neutral-400/75 text-stone-500 hover:text-dark
`;

const MenuSlide = ({
  toggleSlideMenu,
  slideMenuSetting,
  userInfo,
  playPlaylist,
  setPliName,
  setEmotion,
}) => {
  const [playlists, setPlaylists] = useState([]);
  const navigate = useNavigate();

  const getEmotionColor = (x, y) => {
    if (x > 0 && y >= 0) {
      return "yellow";
    } else if (x < 0 && y > 0) {
      return "red";
    } else if (x < 0 && y <= 0) {
      return "blue";
    } else if (x > 0 && y < 0) {
      return "green";
    }
    return "gray"; // 기본 색상
  };
  useEffect(() => {
    const fetchPlaylists = async () => {
      if (!userInfo) return;

      try {
        // FastAPI 서버에서 사용자의 플레이리스트를 가져옴
        const response = await axios.get(
          `http://localhost:8000/users/${userInfo.id}/playlists/`
        );
        setPlaylists(response.data);
      } catch (error) {
        console.error("Error fetching playlists:", error);
      }
    };

    fetchPlaylists();
  }, [userInfo]);

  const handlePlaylistClick = (playlistId, pliName, emo) => {
    setPliName(pliName);
    setEmotion(emo);
    playPlaylist(playlistId); // 플레이리스트 재생 함수 호출
    navigate("/player"); // 플레이어 페이지로 이동
  };

  return (
    <MenuSlideContainer id="menuslide-framer">
      <div className={slideMenuSetting}>
        <a
          id="mainmenuicon_close"
          className="m-4 absolute top-0 right-0"
          onClick={toggleSlideMenu}
        >
          <img src={arrow_right_icon} alt="Close" />
        </a>
        <div className="h-[96px] m-2 content-center">
          <a
            className="transition-colors duration-200 ease-in"
            href="javascript:void(0)"
          >
            <img
              alt="Logo"
              src={inside_out_png}
              className="w-[60px] h-[60px] inline-block"
            />
          </a>
        </div>

        <div className="pl-3 py-5 flex flex-row basis-10">
          <div className="inline-block m-2 relative cursor-pointer rounded-[.95rem]">
            <img
              className="w-[40px] h-[40px] inline-block rounded-[.95rem]"
              src={empty_profile}
              alt="avatar image"
            />
          </div>
          <div className="m-2">
            <a
              href="javascript:void(0)"
              className="dark:hover:text-primary hover:text-primary transition-colors duration-200 ease-in-out text-[1.075rem] font-medium dark:text-neutral-400/90 text-secondary-inverse text-white"
            >
              {userInfo ? userInfo.display_name : "김와빅"}
            </a>
            <span class="text-secondary-dark dark:text-stone-500 font-medium block text-[0.85rem] text-white">
              {userInfo ? userInfo.email : "노래듣는 돌고래"}
            </span>
          </div>
        </div>

        <div className="hidden border-b border-dashed lg:block dark:border-neutral-700/70 border-neutral-200"></div>

        <SlideContent>
          <div className="m-2">
            <span className="font-semibold text-[0.95rem] uppercase dark:text-neutral-500/80 text-secondary-dark text-white">
              플레이리스트
            </span>
          </div>

          {playlists.length > 0 ? (
            playlists.map((playlist, index) => (
              <PlaylistItem
                key={playlist.playlist_id || index}
                onClick={() =>
                  handlePlaylistClick(
                    playlist.playlist_id,
                    playlist.playlist_name,
                    getEmotionColor(
                      playlist.emotion_analysis.normalized_emotion.x,
                      playlist.emotion_analysis.normalized_emotion.y
                    )
                  )
                }
              >
                - {playlist.playlist_name}
              </PlaylistItem>
            ))
          ) : (
            <div className="m-2 text-white">플레이리스트가 없습니다.</div>
          )}
        </SlideContent>
      </div>
    </MenuSlideContainer>
  );
};

export default MenuSlide;
