import { useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import { Store } from "../store";
import "../styles/PrintScreen.css";
import { clearOrder } from "../actions";
import samsung from "../images/samsung_logo.png";
import qr from "../images/qr.png";

function App() {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(Store);
  const { attendee } = state.attendee;
  function PrintReceipt() {
    function generateReceiptData() {
      var receiptData =
        "<1><c>*********************************************</><e>" +
        "<1>KEEP THIS TICKET FOR LUCKY DRAW</><e>" +
        "<1>                                                </><e>" +
        "<2>" +
        attendee.person +
        "</><e>" +
        "<1>                                                </><e>" +
        "<1>Table Number:</><e>" +
        "<2>" +
        attendee.table +
        "</><e>" +
        "<1>                                                </><e>" +
        "<1>Lucky Draw Number:</><e>" +
        "<2>" +
        attendee.lucky +
        "</><e>" +
        "<1>                                                </><e>" +
        "<1><c>powered by SAMSUNG</><e>" +
        "<1><c>*********************************************</><e>";
      return receiptData;
    }

    function stringToHex(tmp) {
      var str = "";
      var tmp_len = tmp.length;
      var c;
      var tag;

      for (var i = 0; i < tmp_len; i++) {
        if (tmp[i] === "<") {
          tag = true;
        } else if (tmp[i] === ">") {
          tag = false;
        } else {
          if (tag) {
            switch (tmp[i]) {
              // --Text Align Left
              case "l":
                c = "1B6100";
                break;
              // --Text Align Center
              case "c":
                c = "1B6101";
                break;
              // --Text Align Right
              case "r":
                c = "1B6102";
                break;
              // --Underline Text
              case "u":
                c = "1B2D01";
                break;
              // --Bold Text
              case "b":
                c = "1B4701";
                break;
              // --Text Size 1
              case "1":
                //width/height
                var size = "00";
                c = "1D21" + size;
                break;
              // --Text Size 2
              case "2":
                var size = "11";
                c = "1D21" + size;
              // --Text Size 3
              case "3":
                var size = "22";
                c = "1D21" + size;
                break;
              // --Text Size 4
              case "4":
                var size = "33";
                c = "1D21" + size;
                break;
              // --Text Size 5
              case "5":
                var size = "44";
                c = "1D21" + size;
                break;
              // --Text Size 6
              case "6":
                var size = "55";
                c = "1D21" + size;
                break;
              // --Text Size 7
              case "7":
                var size = "66";
                c = "1D21" + size;
                break;
              // --Enter
              case "e":
                c = "0A";
                break;
              // --Set Default Values
              case "/":
                c = "1B61001B2D001B47001D2100";
                break;
              default:
                break;
            }
          } else {
            c = tmp.charCodeAt(i).toString(16);
          }

          str += c;
        }
        if (i == tmp_len - 1) str += "0A0A0A0A1B69";
      }
      return str;
    }
    function openSerialPrint() {
      var BAUDRATE = 115200;
      var option = null;
      var result = false;
      option = {
        baudRate: parseInt(BAUDRATE),
        parity: "NONE",
        dataBits: "BITS8",
        stopBits: "1",
      };
      var printPort = "PRINTERPORT1";

      function onlistener(printSerialData) {}
      try {
        result = window.b2bapis.serialprint.open(printPort, option, onlistener);
        if (result == true) {
        } else {
        }
      } catch (e) {}
    }

    function closeSerialPrint() {
      var result = false;
      var printPort = "PRINTERPORT1";

      try {
        result = window.b2bapis.serialprint.close(printPort);
        if (result == false) {
        }
      } catch (e) {}
    }

    function writeReceipt() {
      var result = false;
      var printPort = "PRINTERPORT1";
      var receiptData = generateReceiptData();
      var data = stringToHex(receiptData);
      try {
        result = window.b2bapis.serialprint.writeData(
          printPort,
          data,
          data.length
        );
      } catch (e) {}
    }

    openSerialPrint();
    writeReceipt();
    closeSerialPrint();
  }

  useEffect(() => {
    setTimeout(() => {
      clearOrder(dispatch);
      navigate("/");
    }, 5000);
  }, []);

  return (
    <div className="printscreen-container">
      <div className="left-pane">
        <h1 className="welcome-print">WELCOME</h1>
        <h1>{attendee.person}</h1>
        <h4 className="yourtable">Your Table Number Is</h4>
        <button className="tablebutton">{attendee.table}</button>
        <h4 className="yourtable">Your Lucky Draw Number Is</h4>
        <button className="tablebutton">{attendee.lucky}</button>
      </div>
      <div className="right-pane">
        <img src={samsung} alt="" />
      </div>
      <button
        className="printscreen-container-print"
        onClick={PrintReceipt()}
      ></button>
    </div>
  );
}

export default App;
