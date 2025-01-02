import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import tw from "tailwind-styled-components";

// 스타일링 컴포넌트 정의
const Container = tw.div`
  flex flex-col items-center p-4 
`;

const Title = tw.h1`
  text-3xl font-bold mb-6 text-center
`;

const PlaylistList = tw.ul`
  w-full max-w-2xl
`;

const PlaylistItem = tw.li`
  p-4 mb-4 bg-white rounded-lg shadow-lg transition-transform transform hover:scale-105 cursor-pointer
`;

const PlaylistName = tw.h2`
  text-xl font-semibold mb-2
`;

const DiaryText = tw.p`
  text-gray-700 mb-2
`;

const EmotionText = tw.p`
  text-gray-500
`;
const DiaryBtn = tw.button`
  fixed top-4 left-4 py-1 px-3 bg-gray-200 rounded-full text-sm border-1 shadow-lg transition ease-in-out hover:bg-yellow-100
`;

function PlaylistsPage({
  token,
  userInfo,
  playPlaylist,
  setPliName,
  setEmotion,
}) {
  const [playlists, setPlaylists] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlaylists = async () => {
      if (!userInfo) return;

      try {
        // FastAPI 서버에서 사용자의 플레이리스트를 가져옴
        const response = await axios.get(
          `http://localhost:8000/users/${userInfo.id}/playlists/`
        );
        console.log("hiii", response.data);
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

  const getEmotionLabel = (x, y) => {
    if (x > 0 && y > 0) return "기쁨 (Joy)";
    if (x > 0 && y < 0) return "평온 (Calmness)";
    if (x < 0 && y > 0) return "분노 (Anger)";
    if (x < 0 && y < 0) return "우울 (Sadness)";
    return "중립 (Neutral)";
  };

  const getEmotionColor = (x, y) => {
    if (x >= 0 && y >= 0) {
      return "bg-yellow-200";
    } else if (x < 0 && y >= 0) {
      return "bg-red-200";
    } else if (x < 0 && y < 0) {
      return "bg-blue-200";
    } else if (x >= 0 && y < 0) {
      return "bg-green-200";
    }
    return "bg-gray-200"; // 기본 색상
  };

  const goToDiary = () => {
    navigate("/diary");
  };

  return (
    <Container>
      <DiaryBtn onClick={goToDiary}>일기 쓰러 가기</DiaryBtn>
      <Title>나의 기억들</Title>
      <PlaylistList>
        {playlists.map((playlist) => (
          <PlaylistItem
            className={getEmotionColor(
              playlist.emotion_analysis.normalized_emotion.x,
              playlist.emotion_analysis.normalized_emotion.y
            )}
            key={playlist.id}
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
            <PlaylistName>{playlist.playlist_name}</PlaylistName>
            <DiaryText>Diary: {playlist.diary}</DiaryText>
            <EmotionText>
              Emotion:{" "}
              {getEmotionLabel(
                playlist.emotion_analysis.normalized_emotion.x,
                playlist.emotion_analysis.normalized_emotion.y
              )}
            </EmotionText>
          </PlaylistItem>
        ))}
      </PlaylistList>
    </Container>
  );
}

export default PlaylistsPage;
