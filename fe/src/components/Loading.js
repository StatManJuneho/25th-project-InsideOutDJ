import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import tw from "tailwind-styled-components";

const LoadingCircle = tw.svg`
  animate-spin w-24 text-yellow 
`;

const OutBox = tw.div`
  flex items-center justify-center flex-col min-w-96 w-full  min-h-192 h-full
`;

const LoadingText = tw.h1`
  text-3xl animate-pulse m-6
`;

function Loading({ pliKey, playPlaylist }) {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate("/player");
      playPlaylist(pliKey);
    }, 3000); // 로딩 후 3초 뒤에 플레이어 화면으로 이동

    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <OutBox>
      <LoadingText>기억저장소로 가는 중입니다....</LoadingText>
      <LoadingCircle />
    </OutBox>
  );
}

export default Loading;
