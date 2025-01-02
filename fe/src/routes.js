import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Diary from "./components/Diary";
import Loading from "./components/Loading";
import Player from "./components/Player";

function AppRoutes({ playerProps, authProps, loadingProps }) {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login {...authProps} />} />
        <Route
          path="/diary"
          element={<Diary onCreatePlaylist={playerProps.onCreatePlaylist} />}
        />
        <Route path="/loading" element={<Loading {...playerProps} />} />
        {/* loadingProps 전달 */}
        <Route path="/player" element={<Player {...playerProps} />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
