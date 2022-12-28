import React from "react";
import Board from "./Board";
import Keyboard from "./Keyboard";
import LeaderBoard from "./Leaderboard";
import { createContext, useState, useEffect } from "react";
import { boardDefault } from "../calculate";
import Stopwatch from "./Stopwatch";
import "../css/Popup.css";
import Popup from "./Popup";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../redux/slice/userSlice";
import { useNavigate } from "react-router-dom";

export const appContext = createContext();

function Game() {
  const [board, setBoard] = useState(boardDefault);
  const [currAttempt, setCurrAttempt] = useState({ attempt: 0, numberPos: 0 });
  const [difficulty, setDifficulty] = useState(0);
  const [diffType, setDiffType] = useState("");
  const [lastboardstatus, setlastboardstatus] = useState([1, 1, 1, 1, 1]);
  const navigate = useNavigate();
  const loginDetails = useSelector((state) => state.user.details);

  // Start : Variable dan Method untuk Timer
  const [time, setTime] = useState({ ms: 0, s: 0, m: 0 });
  const [interv, setInterv] = useState();

  //Music:
  function music() {
    return (
      <div>
        <audio
          src="http://commondatastorage.googleapis.com/codeskulptor-demos/pyman_assets/ateapill.ogg"
          autoPlay
          loop
        />
      </div>
    );
  }

  const updateScore = async (score) => {
    //e.preventDefault();
    try {
      const body = { score };

      const response = await fetch(
        `https://numble-backend-production.up.railway.app/score/${loginDetails.name}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      window.location.reload();
    } catch (err) {
      console.error(err.message);
    }
  };

  var updatedMs = time.ms,
    updatedS = time.s,
    updatedM = time.m;

  const startTimer = () => {
    runTimer();
    setInterv(setInterval(runTimer, 10));
  };

  const runTimer = () => {
    if (updatedS === 60) {
      updatedM++;
      updatedS = 0;
    }

    if (updatedMs === 100) {
      updatedS++;
      updatedMs = 0;
    }
    updatedMs++;
    return setTime({ ms: updatedMs, s: updatedS, m: updatedM });
  };

  const stopTimer = () => {
    clearInterval(interv);
  };
  // End : Variable dan Method untuk Timer

  const dispatch = useDispatch();

  dispatch(getAllUsers());

  function randomNumberInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Start : Popup untuk Choose Difficulty
  function chooseDificulty() {
    return (
      <div className="popup">
        <div className="popup-inner">
          <h1 className="text-dark" style={{ fontSize: "50px" }}>
            Select Difficulty
          </h1>
          <div className="row mt-4">
            <div className="col-md-4">
              <button
                className="btn btn-lg btn-success w-100 mt-3"
                onClick={() => {
                  setDifficulty(5);
                  setDiffType("easy");
                  startTimer();
                }}
              >
                Easy
              </button>
              &nbsp;
            </div>
            <div className="col-md-4">
              <button
                className="btn btn-lg btn-warning w-100 mt-3"
                onClick={() => {
                  setDifficulty(4);
                  setDiffType("medium");
                  startTimer();
                }}
              >
                Medium
              </button>
              &nbsp;
            </div>
            <div className="col-md-4">
              <button
                className="btn btn-lg btn-danger w-100 mt-3"
                onClick={() => {
                  setDifficulty(3);
                  setDiffType("hard");
                  startTimer();
                }}
              >
                Hard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  // End : Popup untuk Choose Difficulty

  const answer = randomNumberInRange(100, 1000);
  const [num] = useState(answer);

  // Start : Check win/lose condition
  let finished = false;

  if (currAttempt.numberPos === 0 && currAttempt.attempt > 0) {
    finished = board[currAttempt.attempt - 1][3] === num ? true : null;
  }

  let msg = "";
  let status = "";
  if (finished) {
    stopTimer();
    msg = "You Win!";
    status = "win";
    finished = true;
  } else if (currAttempt.attempt > difficulty) {
    stopTimer();
    msg = "You Lose!";
    status = "lose";
    finished = true;
  }

  function result(condition) {
    if (condition) {
      return (
        <Popup>
          <h1 className="fw-bold" style={{ fontSize: "50px" }}>
            {msg}
          </h1>
          <h2 className="mt-3" style={{ fontSize: "35px" }}>
            Total Score : {totalScore}
          </h2>
          <h2 className="mt-3" style={{ fontSize: "35px" }}>
            Finished in {time.m}m {time.s}s
          </h2>
          <button
            className="btn btn-primary mt-5"
            onClick={() => updateScore(totalScore)}
          >
            Play Again
          </button>
          {/* <a className="btn btn-primary mt-5" href="/game">
            Play Again
          </a> */}
        </Popup>
      );
    }
  }
  // End : Check win/lose condition

  // Start : Scoring
  let totalScore = 0;
  if (diffType === "easy") {
    totalScore += 500;
  } else if (diffType === "medium") {
    totalScore += 1000;
  } else if (diffType === "hard") {
    totalScore += 2000;
  }

  const timeScore = 36000 - time.m * 600 - time.s * 10 - time.ms;
  if (status === "win") {
    totalScore += timeScore;
  } else {
    totalScore -= 500;
  }

  const attemptScore = 6000 - currAttempt.attempt * 1000;
  totalScore += attemptScore;
  // End : Scoring

  return (
    <div className="App my-3">
      {music()}

      <h1 style={{ fontSize: "50px" }}>{num}</h1>
      <Stopwatch time={time} />

      {difficulty === 0 ? chooseDificulty() : null}

      {/* <button onClick={() => setShowModal(!showModal)}>OPEN</button> */}
      {/* {showModal && <Popup>{msg}</Popup>} */}
      {result(finished)}
      <h2>Halo, {loginDetails.name}</h2>

      <appContext.Provider
        value={{
          board,
          setBoard,
          currAttempt,
          setCurrAttempt,
          lastboardstatus,
          setlastboardstatus,
        }}
      >
        <div className="game">
          <Board difficulty={difficulty} />
          <Keyboard />
        </div>
      </appContext.Provider>

      <LeaderBoard />
    </div>
  );
}

export default Game;
