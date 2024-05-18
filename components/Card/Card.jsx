import React, { useEffect } from "react";
import Image from "next/image";

//INTERNAL IMPORT

import Style from "./Card.module.css";
import images from "../../assets";

const Card = ({ candidateArray, giveVote, getNewCandidate }) => {
  console.log(candidateArray);

  useEffect(() => {
    getNewCandidate();
  }, []);
  return (
    <div className={Style.card}>
      {candidateArray.map((el) => (
        <div className={Style.card__box}>
          <div className={Style.image}>
            <img src={el[3]} alt="profile" />
          </div>
          <div className={Style.card__info}>
            <h2>
              {el[1]} #{el[2].toNumber()}
            </h2>
            <p>{el[0]}</p>
            <p>Address : {el[6].slice(0, 30)}...</p>
            <p className={Style.total}>Total Vote</p>
          </div>

          <div className={Style.card__vote}>
            <p>{el[4].toNumber()}</p>
          </div>
          <div className={Style.card__button}>
            <button
              onClick={() => giveVote({ id: el[2].toNumber(), address: el[6] })}
            >
              Give Vote
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Card;
