import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import tw from "tailwind-styled-components";

// const LoadingCircle = tw.div`
//   animate-spin w-48 h-48 rounded-full shadow-lg
// `;
const LoadingCircle = tw.div`
  w-48 h-48 rounded-full bg-white shadow-lg
  shadow-[0_0_15px_rgba(255,255,255,0.9),0_0_30px_rgba(255,255,255,0.7),0_0_45px_rgba(255,255,255,0.5)]
  animate-spin
`;

const OutBox = tw.div`
  flex items-center justify-center flex-col min-w-96 w-full min-h-192 h-full
`;

const LoadingText = tw.h1`
  text-3xl animate-pulse m-6
`;

function Loading({ pliKey, playPlaylist }) {
  const navigate = useNavigate();
  const [bgColor, setBgColor] = useState(
    "bg-gradient-to-r from-yellow-200 via-white to-yellow-300"
  );
  useEffect(() => {
    // 0.1초마다 색상을 변경하는 타이머 설정
    const colorTimer = setInterval(() => {
      setBgColor((prevColor) => {
        const colors = [
          "bg-gradient-to-r from-yellow-200 via-white to-yellow-300",
          "bg-gradient-to-r from-red-200 via-white to-red-300",
          "bg-gradient-to-r from-blue-200 via-white to-blue-300",
          "bg-gradient-to-r from-green-200 via-white to-green-300",
          "bg-gradient-to-r from-gray-200 via-white to-gray-300",
        ];
        const currentIndex = colors.indexOf(prevColor);
        const nextIndex = (currentIndex + 1) % colors.length;
        return colors[nextIndex];
      });
    }, 1000);

    const timeout = setTimeout(() => {
      playPlaylist(pliKey); // 플레이리스트 재생
      navigate("/player"); // 완료 후 플레이어 화면으로 이동
    }, 3000); // 3초 대기

    return () => {
      clearTimeout(timeout);
      clearInterval(colorTimer);
    }; // 컴포넌트가 언마운트될 때 타이머를 정리
  }, [navigate, pliKey, playPlaylist]);

  return (
    <OutBox>
      <LoadingText>기억저장소로 가는 중입니다....</LoadingText>
      <LoadingCircle className={bgColor} />
    </OutBox>
  );
}

export default Loading;
