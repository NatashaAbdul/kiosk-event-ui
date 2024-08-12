import React, { useContext, useEffect, useState } from "react";
import "../styles/KeyScreen.css";
import { useNavigate } from "react-router-dom";
import { Store } from "../store";
import samsung from "../images/samsung_logo.png";
import { clearOrder, setNumber } from "../actions";
export default function KeyScreen() {
  const navigate = useNavigate();
  const { dispatch } = useContext(Store);
  const [enteredDigits, setEnteredDigits] = useState([]);

  useEffect(() => {}, []);

  const handleDigitClick = (digit) => {
    if (enteredDigits.length < 4) {
      console.log("clicked");
      setEnteredDigits((prevDigits) => [...prevDigits, digit.toString()]);
    }
  };

  const handleEnterClick = async () => {
    try {
      if (enteredDigits.length === 4) {
        const combinedString = enteredDigits.join("");
        await setNumber(dispatch, combinedString);
        navigate("/confirm");
      } else {
        // Optionally provide feedback to the user that 4 digits are required
        console.log("Please enter exactly 4 digits.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const handleDeleteClick = async (x) => {
    try {
      setEnteredDigits([]);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <div className="keyscreen-container">
      <div className="left-pane">
        <h1 className="host">Input Invitation Number</h1>
        <div className="number-input-container">
          {[1, 2, 3, 4].map((_, index) => (
            <div key={index} className="input-circle">
              {enteredDigits[index]}
            </div>
          ))}
        </div>
        <div className="calculator-keypad">
          <div className="calculator-row">
            {[1, 2, 3].map((digit) => (
              <div
                key={digit}
                className="calculator-key"
                onTouchStart={() => handleDigitClick(digit)}
              >
                {digit}
              </div>
            ))}
          </div>
          <div className="calculator-row">
            {[4, 5, 6].map((digit) => (
              <div
                key={digit}
                className="calculator-key"
                onTouchStart={() => handleDigitClick(digit)}
              >
                {digit}
              </div>
            ))}
          </div>
          <div className="calculator-row">
            {[7, 8, 9].map((digit) => (
              <div
                key={digit}
                className="calculator-key"
                onTouchStart={() => handleDigitClick(digit)}
              >
                {digit}
              </div>
            ))}
          </div>
          <div className="calculator-row">
            <div
              className="delete-key"
              onTouchStart={() => handleDeleteClick(0)}
            >
              DEL
            </div>
            <div
              className="calculator-key"
              onTouchStart={() => handleDigitClick(0)}
            >
              0
            </div>
            <div className="enter-key" onTouchStart={() => handleEnterClick(0)}>
              ENT
            </div>
          </div>
        </div>
      </div>
      <div className="right-pane">
        <p
          className="overlay-text"
          onClick={() => {
            clearOrder(dispatch);
            navigate("/");
          }}
        >
          click to start again
        </p>
        <img src={samsung} alt="" className="overlay-image" />
      </div>
    </div>
  );
}
