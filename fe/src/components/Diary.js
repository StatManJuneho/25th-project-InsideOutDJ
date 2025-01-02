// // src/components/Diary.js
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import tw from "tailwind-styled-components";

// const OutBox = tw.div`
//   flex items-center justify-center flex-col min-w-96 w-full  min-h-192 h-full
// `;
// const HowAbout = tw.h1`
//   mt-8 text-4xl
// `;
// const CreateBtn = tw.button`
//   my-4 mb-16 py-3 w-96 bg-gray-200 rounded-full text-center border-1 shadow-lg transition ease-in-out hover:bg-blue-100
// `;
// const Title = tw.input`
// mt-8 text-center min-w-96 h-16 text-2xl
// `;

// const DiaryText = tw.textarea`
//  p-3 text-center w-[95%] m-10 h-full text-3xl
// `;
// const PlaylistBtn = tw.button`
//   fixed top-4 right-4 py-1 px-3 bg-gray-200 rounded-full text-sm border-1 shadow-lg transition ease-in-out hover:bg-green-100
// `;

// function Diary({ onCreatePlaylist }) {
//   const [diary, setDiary] = useState("");
//   const [title, setTitle] = useState("");
//   const navigate = useNavigate();

//   const handleDiarySubmit = async () => {
//     const cleanedDiary = diary.replace(/\n/g, " ");

//     await onCreatePlaylist(cleanedDiary, title);
//     navigate("/loading");
//   };

//   const goToPlaylists = () => {
//     navigate("/playlists");
//   };

//   return (
//     <OutBox>
//       <PlaylistBtn onClick={goToPlaylists}>기억저장소 가기</PlaylistBtn>
//       <HowAbout>오늘 하루는 어땠나요?</HowAbout>
//       <OutBox>
//         <Title
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           placeholder="제목을 입력해주세요😉"
//         ></Title>
//         <DiaryText
//           value={diary}
//           onChange={(e) => setDiary(e.target.value)}
//           placeholder="이곳에 작성해주세요...!"
//         />
//       </OutBox>
//       <CreateBtn onClick={handleDiarySubmit}>기억 저장소로 보내기</CreateBtn>
//     </OutBox>
//   );
// }

// export default Diary;

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
const Title = tw.input`
  mt-8 text-center min-w-96 h-16 text-2xl
`;

const DiaryText = tw.textarea`
  p-3 text-center w-[95%] m-10 h-full text-3xl
`;
const PlaylistBtn = tw.button`
  fixed top-4 right-4 py-1 px-3 bg-gray-200 rounded-full text-sm border-1 shadow-lg transition ease-in-out hover:bg-green-100 
`;
const LoadingCircle = tw.div`
  w-48 h-48 rounded-full bg-white shadow-lg
  shadow-[0_0_15px_rgba(255,255,255,0.9),0_0_30px_rgba(255,255,255,0.7),0_0_45px_rgba(255,255,255,0.5)]
  animate-spin
`;
const LoadingText = tw.h1`
  text-3xl animate-pulse m-6
`;

function Diary({ onCreatePlaylist }) {
  const [diary, setDiary] = useState("");
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가
  const [bgColor, setBgColor] = useState(
    "bg-gradient-to-r from-yellow-200 via-white to-yellow-300"
  );
  const navigate = useNavigate();

  const handleDiarySubmit = async () => {
    setIsLoading(true); // 로딩 상태 시작
    const cleanedDiary = diary.replace(/\n/g, " ");
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
    }, 1000); // 0.5초마다 색상 변경
    try {
      await onCreatePlaylist(cleanedDiary, title);
      navigate("/loading");
    } catch (error) {
      console.error("플레이리스트 생성 중 오류 발생:", error);
      setIsLoading(false); // 에러 발생 시 로딩 상태 해제
      clearInterval(colorTimer); // 타이머 정리
    }
  };

  return (
    <OutBox>
      <PlaylistBtn onClick={() => navigate("/playlists")}>
        기억저장소 가기
      </PlaylistBtn>
      <HowAbout>오늘 하루는 어땠나요?</HowAbout>
      <OutBox>
        {isLoading ? (
          <LoadingText>기억 구슬이 생성되고 있습니다.</LoadingText>
        ) : (
          <Title
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력해주세요😉"
            disabled={isLoading} // 로딩 중에는 입력 불가
          />
        )}

        {isLoading ? (
          <LoadingCircle className={bgColor} />
        ) : (
          <DiaryText
            value={diary}
            onChange={(e) => setDiary(e.target.value)}
            placeholder="이곳에 작성해주세요...!"
            disabled={isLoading} // 로딩 중에는 입력 불가
          />
        )}
      </OutBox>

      <CreateBtn onClick={handleDiarySubmit} disabled={isLoading}>
        {isLoading ? "저장 중..." : "기억 저장소로 보내기"}
      </CreateBtn>
    </OutBox>
  );
}

export default Diary;
