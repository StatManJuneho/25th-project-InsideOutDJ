// src/components/Diary.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import tw from "tailwind-styled-components";

const OutBox = tw.div`
  flex items-center justify-center flex-col min-w-96 w-full  min-h-192 h-full
`;
const HowAbout = tw.h1`
  mt-8 text-4xl
`;
const CreateBtn = tw.button`
  my-4 mb-16 py-3 w-96 bg-gray-200 rounded-full text-center border-1 shadow-lg transition ease-in-out hover:bg-blue-100
`;

const DiaryText = tw.textarea`
 p-3 text-center w-[95%] m-10 h-full 
`;
const PlaylistBtn = tw.button`
  fixed top-4 right-4 py-1 px-3 bg-gray-200 rounded-full text-sm border-1 shadow-lg transition ease-in-out hover:bg-green-100
`;

function Diary({ onCreatePlaylist }) {
  const [diary, setDiary] = useState("");
  const [title, setTitle] = useState("");
  const navigate = useNavigate();

  const handleDiarySubmit = async () => {
    const cleanedDiary = diary.replace(/\n/g, " ");

    await onCreatePlaylist(cleanedDiary, title);
    navigate("/loading");
  };

  const goToPlaylists = () => {
    navigate("/playlists");
  };

  return (
    <OutBox>
      <PlaylistBtn onClick={goToPlaylists}>기억저장소 가기</PlaylistBtn>
      <HowAbout>오늘 하루는 어땠나요?</HowAbout>
      <OutBox>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목"
        ></input>
        <DiaryText
          value={diary}
          onChange={(e) => setDiary(e.target.value)}
          placeholder="이곳에 작성해주세요...!"
        />
      </OutBox>
      <CreateBtn onClick={handleDiarySubmit}>기억 저장소로 보내기</CreateBtn>
    </OutBox>
  );
}

export default Diary;
