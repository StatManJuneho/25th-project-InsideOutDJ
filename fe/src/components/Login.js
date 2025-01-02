// src/components/Login.js
import React from "react";
import { useNavigate } from "react-router-dom";
import tw from "tailwind-styled-components";

import joy_char from "../assets/joy_character.png"

const OutBox = tw.div`
  max-w-[100%] md:max-w-[70%] overflow-hidden m-auto flex flex-col z-20
`;

const ProjectName = tw.h1`
  z-30 m-auto py-20 md:py-40 text-6xl font-black text-center underline decoration-teal-400 animate-pulse content-center subpixel-antialiased italic
`;

const LogState = tw.a`
  z-30 w-full max-w-5/6 p-3 bg-gray-200 rounded-full text-center border-1 shadow-lg transition ease-in-out hover:bg-yellow-100 hover:opacity-70
`;

const LogOutState = tw.button`
   z-30 w-full max-w-5/6 p-3 bg-transparent rounded-full text-center border-1 shadow-lg transition ease-in-out hover:bg-red-100 hover:opacity-70
`;

const GoDiary = tw.button`
  z-30 w-full max-w-5/6 p-3 bg-gray-200 rounded-full text-center border-1 shadow-lg transition ease-in-out hover:bg-blue-100 hover:opacity-70
`;

const SpinningBall = tw.div`
  z-5 m-auto w-[30svh] h-[30svh] rounded-full shadow-lg absolute animate-spin-slow
  flex items-center justify-center pt-4 pb-4 pl-2 pr-2 mt-16 ml-8
  
  shadow-[0_0_5px_rgba(255,255,255,0.9),0_0_30px_rgba(255,255,255,0.7),0_0_45px_rgba(255,255,255,0.5)]
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
      <section className="h-[20svh] bg-teal-100 relative">
        <SpinningBall className="absolute top-5 left-2 z-10 bg-gradient-to-r from-yellow-200 via-white to-yellow-300"></SpinningBall>
        <SpinningBall className="absolute top-40 right-5 z-10 bg-gradient-to-r from-green-200 via-white to-green-300"></SpinningBall>
      </section>
      <section className="w-full h-[60svh] content-center m-auto bg-white z-30">
        <div className="z-30">
          <ProjectName>InsideOutDJ</ProjectName>
        </div>
        <div className="w-5/6 max-w-full md:w-[60svh] m-auto flex flex-col md:flex-row items-center justify-center relative gap-5">
          <img src={joy_char} alt="Joy (character)" className="w-20 absolute -bottom-2 md:bottom-10 right-20 z-20" />
          {!token ? (
            <LogState href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=${scope}`}>
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
        </div>
      </section>
      <section className="h-[20svh] bg-teal-100 relative">
        <SpinningBall className="absolute bottom-9 -left-20 z-10 bg-gradient-to-r from-red-200 via-white to-red-300"></SpinningBall>
        <SpinningBall className="absolute bottom-0 right-2 z-10 bg-gradient-to-r from-blue-200 via-white to-blue-300"></SpinningBall>
      </section>
    </OutBox>
  );
}

export default Login;
