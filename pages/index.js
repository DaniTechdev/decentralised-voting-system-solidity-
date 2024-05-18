import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";
import Countdown from "react-countdown";

//INTERNAL IMPORT
import { VotingContext } from "../context/Voter";
import Style from "../styles/index.module.css";
import Card from "../components/Card/Card";
import image from "../assets/candidate-1.jpg";

//SMART CONTRACT IMPORT

const HOME = () => {
  const {
    getNewCandidate,
    candidateArray,
    giveVote,
    currentAccount,
    checkIfWalletIsConnected,
    candidateLength,
    voterLength,
    getAllVoterData,
  } = useContext(VotingContext);

  console.log(candidateArray);
  const [voting, setVoting] = useState(false);

  useEffect(() => {
    checkIfWalletIsConnected();
    getAllVoterData();
  }, []);

  return (
    <div className={Style.home}>
      {currentAccount && (
        <div className={Style.winner}>
          <div className={Style.winner__info}>
            <div className={Style.candidate__list}>
              <p>
                No Candidate : <span>{candidateLength}</span>
              </p>
            </div>
            <div className={Style.candidate__list}>
              <p>
                No Voter : <span>{voterLength}</span>
              </p>
            </div>
          </div>
          <div className={Style.winner__message}>
            <small>
              <Countdown date={Date.now() + 100000} />
            </small>
          </div>
        </div>
      )}

      <Card
        candidateArray={candidateArray}
        giveVote={giveVote}
        getNewCandidate={getNewCandidate}
      />
    </div>
  );
};

export default HOME;
