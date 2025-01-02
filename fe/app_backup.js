import { useEffect, useState } from "react";
import axios from "axios";
import tw from "tailwind-styled-components";

const Father = tw.div`
  flex items-center justify-center
`;

const Container = tw.div`
  flex flex-col items-center justify-center h-12rem
`;

const HelloApp = tw.h1`
  font-bold hover:bg-blue-700 w-50rem
`;

function App() {
  const CLIENT_ID = "072d48a69d3247b0a03ac8c3734997b2";
  const REDIRECT_URI = "http://localhost:3000/";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";

  const SCOPE = [
    "playlist-modify-public",
    "playlist-modify-private",
    "user-modify-playback-state",
    "user-read-playback-state",
    "user-read-currently-playing",
    "streaming",
  ].join(" ");

  const RESPONSE_TYPE = "token";

  const [token, setToken] = useState("");
  const [deviceId, setDeviceId] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [pliKey, setPliKey] = useState("");
  const [pliName, setPliName] = useState("");
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    if (!token && hash) {
      token = hash
        .substring(1)
        .split("&")
        .find((elem) => elem.startsWith("access_token"))
        .split("=")[1];
      window.location.hash = "";
      window.localStorage.setItem("token", token);
    }
    setToken(token);

    if (token) {
      window.onSpotifyWebPlaybackSDKReady = () => {
        const player = new window.Spotify.Player({
          name: "Web Playback SDK Player",
          getOAuthToken: (cb) => {
            cb(token);
          },
          volume: 0.5,
        });

        player.addListener("ready", ({ device_id }) => {
          console.log("Ready with Device ID", device_id);
          setDeviceId(device_id);

          // 여기서 Transfer Playback API 호출
          transferPlaybackToDevice(device_id);
        });

        player.addListener("not_ready", ({ device_id }) => {
          console.log("Device ID has gone offline", device_id);
        });

        player.addListener("player_state_changed", (state) => {
          console.log(state);
        });

        player.connect();
        setPlayer(player);
      };
    }
  }, [token]);

  const transferPlaybackToDevice = async (deviceId) => {
    try {
      await axios.put(
        "https://api.spotify.com/v1/me/player",
        {
          device_ids: [deviceId],
          play: true,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Playback transferred to device:", deviceId);
    } catch (error) {
      console.error("Playback transfer failed:", error);
      alert("Playback transfer failed. Please try again.");
    }
  };

  const logout = () => {
    setToken("");
    window.localStorage.removeItem("token");
  };

  const createPlaylist = async () => {
    const playlistName = prompt("플레이리스트 이름을 입력하세요:");
    if (!playlistName) return;

    try {
      const userResponse = await axios.get("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userId = userResponse.data.id;

      const playlistResponse = await axios.post(
        `https://api.spotify.com/v1/users/${userId}/playlists`,
        {
          name: playlistName,
          description: "Generated by React App",
          public: false,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setPliKey(playlistResponse.data.id);

      alert(`플레이리스트가 생성되었습니다: ${playlistResponse.data.name}`);
    } catch (error) {
      console.error("플레이리스트 생성 중 오류 발생:", error);
      alert("플레이리스트 생성 중 오류가 발생했습니다.");
    }
  };

  const editPlaylist = async () => {
    if (!pliKey) {
      alert("플레이리스트를 먼저 생성하세요.");
      return;
    }

    let uri_base = "spotify:track:";
    let uris = ["2rOA9vEsnpNB6L5XgmibKn", "3PGK6qlEztoGlpJoW603YA"].map(
      (i) => `${uri_base}${i}`
    );

    try {
      const editPlaylistResponse = await axios.post(
        `https://api.spotify.com/v1/playlists/${pliKey}/tracks`,
        {
          uris: uris,
          position: 0,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(editPlaylistResponse);
      alert("플레이리스트에 곡이 추가되었습니다!");
    } catch (error) {
      console.error("플레이리스트 수정 중 오류 발생:", error);
      alert("플레이리스트 수정 중 오류가 발생했습니다.");
    }
  };

  const getPlayList = async () => {
    try {
      const response = await axios.get(
        `https://api.spotify.com/v1/playlists/${pliKey}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      setPliName(response.data.name);
      setPlaylists(response.data.tracks.items);
    } catch (error) {
      console.error("플레이리스트 가져오는 중 오류 발생:", error);
      alert("플레이리스트 가져오는 중 오류가 발생했습니다.");
    }
  };

  const playPlaylist = async (playlistUri) => {
    console.log("Attempting to play playlist with URI:", playlistUri);
    console.log("Using device ID:", deviceId);

    if (!deviceId) {
      alert("플레이어가 준비되지 않았습니다. 잠시 후 다시 시도하세요.");
      return;
    }

    try {
      await axios.put(
        "https://api.spotify.com/v1/me/player/play",
        {
          context_uri: playlistUri,
          device_id: deviceId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      alert("플레이리스트가 재생되었습니다.");
    } catch (error) {
      console.error("플레이리스트 재생 중 오류 발생:", error);
      console.log("Response:", error.response);
      alert("플레이리스트 재생 중 오류가 발생했습니다.");
    }
  };

  const renderPlaylists = () => {
    return playlists.map((playlist) => (
      <div key={playlist.track.id}>
        <h3>{playlist.track.name}</h3>
        <p>Track ID: {playlist.track.id}</p>
      </div>
    ));
  };

  const togglePlayPause = async () => {
    const state = await player.getCurrentState();
    if (!state) {
      console.error("플레이어 상태를 가져올 수 없습니다.");
      return;
    }

    if (state.paused) {
      player.resume().then(() => {
        console.log("음악이 재생되었습니다.");
      });
    } else {
      player.pause().then(() => {
        console.log("음악이 일시 중지되었습니다.");
      });
    }
  };
  const skipToNext = () => {
    player.nextTrack().then(() => {
      console.log("다음 트랙으로 이동했습니다.");
    });
  };
  const skipToPrevious = () => {
    player.previousTrack().then(() => {
      console.log("이전 트랙으로 돌아갔습니다.");
    });
  };
  const setVolume = (volume) => {
    player.setVolume(volume).then(() => {
      console.log(`볼륨이 ${volume * 100}%로 설정되었습니다.`);
    });
  };

  return (
    <Father>
      <Container>
        <HelloApp>Spotify React 테스트 앱</HelloApp>
        {!token ? (
          <a
            href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`}
          >
            스포티파이에 로그인하세요
          </a>
        ) : (
          <button onClick={logout}>로그아웃</button>
        )}

        {token && (
          <>
            <button onClick={createPlaylist}>플레이리스트 생성</button>
            <button onClick={editPlaylist}>플리에 곡 추가하기</button>
            <button onClick={getPlayList}>플레이리스트 가져오기</button>
            <button onClick={() => playPlaylist(`spotify:playlist:${pliKey}`)}>
              플레이리스트 재생
            </button>
            <h2>{pliName}</h2>
            {renderPlaylists()}

            {/* 재생/일시 중지 버튼 */}
            <button onClick={togglePlayPause}>재생/일시 중지</button>

            {/* 다음 트랙으로 건너뛰기 버튼 */}
            <button onClick={skipToNext}>다음 트랙</button>

            {/* 이전 트랙으로 돌아가기 버튼 */}
            <button onClick={skipToPrevious}>이전 트랙</button>

            {/* 볼륨 조절 슬라이더 */}
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              onChange={(e) => setVolume(e.target.value)}
            />
          </>
        )}
      </Container>
    </Father>
  );
}

export default App;