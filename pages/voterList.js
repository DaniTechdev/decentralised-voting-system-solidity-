import React, { useState, useEffect, useContext } from "react";

//INTERNAL IMPORT

import VoterCard from "../components/VoterCard/VoterCard";
import Style from "../styles/voterList.module.css";
import { VotingContext } from "../context/Voter";

const voterList = () => {
  const { getAllVoterData, voterArray } = useContext(VotingContext);

  useEffect(() => {
    getAllVoterData();
  }, []);
  return (
    <div className={voterList}>
      <VoterCard voterArray={voterArray} />
    </div>
  );
};

export default voterList;
