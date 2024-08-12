import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/HomeScreen.css";
import dragon from "../images/dragon.jpg";

export default function HomeScreen() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/key");
  };

  return (
    <div className="homescreen-container" onClick={handleClick}>
      <div className="full-screen">
        <img src={dragon} alt="Dragon" className="dragon-image" />
      </div>
    </div>
  );
}
