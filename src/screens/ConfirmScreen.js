import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearOrder, setAttendee } from "../actions";
import { Store } from "../store";
import "../styles/ConfirmScreen.css";
import samsung from "../images/samsung_logo.png";

export default function ConfirmScreen() {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(Store);
  const [localattendee, setLocalattendee] = useState({});

  const { number } = state.number;

  const handleClickProceed = () => {
    console.log(localattendee.company);

    const postData = {
      company: localattendee.company,
      table: localattendee.table,
      person: localattendee.person,
      lucky: localattendee.lucky,
      uid: localattendee.uid,
    };

    const url = "https://kiosk-event-api.onrender.com/api/attendee";

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    navigate("/print");
  };

  useEffect(() => {
    const apiUrl = "https://kiosk-event-api.onrender.com/api/attendee/" + number;
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        setLocalattendee(data);
        setAttendee(dispatch, data);
        console.log(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [dispatch, number]);

  return (
    <div className="confirmscreen-container">
      <div className="left-pane">
        <h1 className="yourname">Confirm Your Name</h1>

        {localattendee.person && localattendee.company ? (
          <>
            <div className="attendee-info-container">
              <h1 className="attendee-info">{localattendee.person}</h1>
              <h1 className="attendee-info">{localattendee.company}</h1>
            </div>
            <button className="confirm-button" onClick={handleClickProceed}>
              Confirm
            </button>
          </>
        ) : (
          <div className="loader-container">
            <div className="loader"></div>
          </div>
        )}
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
