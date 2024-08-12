import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import KeyScreen from "./screens/KeyScreen";
import ConfirmScreen from "./screens/ConfirmScreen";
import PrintScreen from "./screens/PrintScreen";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/key" element={<KeyScreen />} />
        <Route path="/confirm" element={<ConfirmScreen />} />
        <Route path="/print" element={<PrintScreen />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
