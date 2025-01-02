// src/components/Login.js
import React from "react";
import { useNavigate } from "react-router-dom";
import tw from "tailwind-styled-components";

const OutBox = tw.div`
  flex items-center justify-center flex-col min-w-96 w-full  min-h-192 h-full
`;

const ProjectName = tw.h1`
  text-5xl animate-pulse
`;

const LogState = tw.a`
  my-4 mt-16 py-3 w-96 bg-gray-200 rounded-full text-center border-1 shadow-lg transition ease-in-out hover:bg-yellow-100
`;

const LogOutState = tw.button`
   my-4 mt-16 py-3 w-96 bg-gray-200 rounded-full text-center border-1 shadow-lg transition ease-in-out hover:bg-red-100
`;

const GoDiary = tw.button`
  my-4 mt-8 py-3 w-96 bg-gray-200 rounded-full text-center border-1 shadow-lg transition ease-in-out hover:bg-blue-100
`;

function Login({ authEndpoint, clientId, redirectUri, scope, token, logout }) {
  const navigate = useNavigate();
  // 로그인 성공 후 일기 화면으로 이동
  const handleLogin = () => {
    if (token) {
      navigate("/diary");
    }
  };
  return (
    <OutBox>
      <ProjectName>InsideOutDJ</ProjectName>
      {!token ? (
        <LogState
          href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=${scope}`}
        >
          스포티파이에 로그인하세요
        </LogState>
      ) : (
        <LogOutState
          onClick={() => {
            logout();
            navigate("/");
          }}
        >
          로그아웃
        </LogOutState>
      )}
      {!token ? (
        <div></div>
      ) : (
        <GoDiary onClick={handleLogin}>오늘의 감정을 기록해보세요</GoDiary>
      )}
    </OutBox>
  );
}

export default Login;
