import React, { useEffect, useState } from "react";
import AppRoutes from "./routes";
import axios from "axios";

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
    "streaming"
  ].join(" ");

  const [token, setToken] = useState("");
  const [deviceId, setDeviceId] = useState(null);
  const [player, setPlayer] = useState(null);
  const [pliKey, setPliKey] = useState("");
  const [pliName, setPliName] = useState("");
  const [playlists, setPlaylists] = useState([]);
  const [track, setTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // 유저 토큰 받아오기
  // navigate 정의

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
  }, []);

  //SDK 로딩
  useEffect(() => {
    if (!token) return;

    const initializePlayer = async () => {
      let scriptTag = document.getElementById("spotify-player-script");
      if (!scriptTag) {
        scriptTag = document.createElement("script");
        scriptTag.id = "spotify-player-script";
        scriptTag.src = "https://sdk.scdn.co/spotify-player.js";
        scriptTag.async = true;
        document.body.appendChild(scriptTag);
      }

      window.onSpotifyWebPlaybackSDKReady = () => {
        console.log("Spotify Web Playback SDK is ready");
        if (token) {
          const playerInstance = new window.Spotify.Player({
            name: "InsideOutDJ Webplayer",
            getOAuthToken: (cb) => {
              cb(token);
            },
            volume: 0.5,
          });

          playerInstance.addListener("ready", ({ device_id }) => {
            console.log("Ready with Device ID", device_id);
            setDeviceId(device_id);
            transferPlaybackToDevice(device_id);
          });

          playerInstance.addListener("not_ready", ({ device_id }) => {
            console.log("Device ID has gone offline", device_id);
          });

          playerInstance.addListener("player_state_changed", (state) => {
            console.log(state);
            if (!state) {
              return;
            }

            setIsPlaying(!state.paused);
            setCurrentTime(state.position / 1000);
            setDuration(state.duration / 1000);

            const currentTrack = state.track_window.current_track;
            setTrack({
              name: currentTrack.name,
              artists: currentTrack.artists.map(artist => artist.name).join(', '),
              album: currentTrack.album.images.map((image) => image.url) // Get the cover image URL
            });
          });

          playerInstance.connect().then((success) => {
            if (success) {
              console.log(
                "The Web Playback SDK successfully connected to Spotify!"
              );
              setPlayer(playerInstance); // 플레이어가 초기화된 후에만 상태를 업데이트
            } else {
              console.error(
                "The Web Playback SDK failed to connect to Spotify."
              );
            }
          });
        }
      };

      // cleanup: 컴포넌트가 언마운트될 때 스크립트를 제거하는 로직
      return () => {
        if (scriptTag) {
          document.body.removeChild(scriptTag);
        }
      };
    };

    initializePlayer();
  }, [token]);
  // SDK -> device 인식
  const transferPlaybackToDevice = async (deviceId) => {
    try {
      await axios.put(
        "https://api.spotify.com/v1/me/player",
        {
          device_ids: [deviceId],
          play: false,
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

  const authProps = {
    authEndpoint: AUTH_ENDPOINT,
    clientId: CLIENT_ID,
    redirectUri: REDIRECT_URI,
    scope: SCOPE,
    logout: () => {
      setToken("");
      window.localStorage.removeItem("token");
    },
    token: token,
  };

  const playerProps = {
    player,
    isPlaying,
    togglePlayPause: async () => {
      if (!player) {
        console.error("플레이어가 초기화되지 않았습니다.");
        return;
      }

      try {
        const state = await player.getCurrentState();

        if (!state) {
          console.error("플레이어 상태를 가져올 수 없습니다.");
          return;
        }

        if (state.paused) {
          await player.resume();
          console.log("음악이 재생되었습니다.");
          setIsPlaying(true);
        } else {
          await player.pause();
          console.log("음악이 일시 중지되었습니다.");
          setIsPlaying(false);
        }
      } catch (error) {
        console.error("getCurrentState 호출 중 오류 발생:", error);
      }
    },
    skipToNext: () => {
      if (!player) return;
      player.nextTrack().then(() => {
        console.log("다음 트랙으로 이동했습니다.");
      });
    },
    skipToPrevious: () => {
      if (!player) return;
      player.previousTrack().then(() => {
        console.log("이전 트랙으로 이동했습니다.");
      });
    },
    setVolume: (volume) => {
      if (!player) return;
      player.setVolume(volume).then(() => {
        console.log(`볼륨이 ${volume * 100}%로 설정되었습니다.`);
      });
    },
    playlists,
    playPlaylist: async (playlistUri) => {
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
            context_uri: `spotify:playlist:${playlistUri}`,
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
    },
    pliName,
    onCreatePlaylist: async (diary, title) => {
      const playlistName = `${title} - ${new Date().toLocaleDateString()}`;
      try {
        const userResponse = await axios.get("https://api.spotify.com/v1/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const userId = userResponse.data.id;

        // 플레이리스트 생성
        const playlistResponse = await axios.post(
          `https://api.spotify.com/v1/users/${userId}/playlists`,
          {
            name: playlistName,
            description: "Playlist created based on diary entry",
            public: false,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const newPliKey = playlistResponse.data.id; // 생성된 플레이리스트의 ID
        setPliKey(newPliKey);
        setPliName(playlistResponse.data.name);

        // 예시 데이터
        const uri_base = "spotify:track:";
        const uris = ["2rOA9vEsnpNB6L5XgmibKn", "3PGK6qlEztoGlpJoW603YA"].map(
          (i) => `${uri_base}${i}`
        );

        // 생성된 플레이리스트에 트랙 추가
        await axios.post(
          `https://api.spotify.com/v1/playlists/${newPliKey}/tracks`,
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
        // await axios.put(
        //   "https://api.spotify.com/v1/me/player/play",
        //   {
        //     context_uri: `spotify:playlist:${newPliKey}`,
        //     device_id: deviceId,
        //   },
        //   {
        //     headers: {
        //       Authorization: `Bearer ${token}`,
        //       "Content-Type": "application/json",
        //     },
        //   }
        // );
        // alert("플레이리스트가 재생되었습니다.");
      } catch (error) {
        console.error("플레이리스트 생성 중 오류 발생:", error);
        alert("플레이리스트 생성 중 오류가 발생했습니다.");
      }
    },
    pliKey,
    track: track,
    seekTo: (progress) => {
      const newTime = progress;
      player.seek(newTime * 1000).then(() => {
        console.log(`재생시간 ${newTime}로 설정되었습니다.`);
      });
      setCurrentTime(newTime);
    },
    currentTime: currentTime,
    duration: duration
  };
  return <AppRoutes playerProps={playerProps} authProps={authProps} />;
}

export default App;