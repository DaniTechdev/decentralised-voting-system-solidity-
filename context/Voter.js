import React, { useState, useEffect } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { create as ipfsHttpClient } from "ipfs-http-client";
import axios from "axios";
import { useRouter } from "next/router";

//INTERNAL IMPORT

import { VotingAddress, VotingAddressAbi } from "./constants";

// const client = ipfsHttpClient("http://ipfs.infura.io:5001/api/v0");

const fetchContract = (signerOrProvider) =>
  new ethers.Contract(VotingAddress, VotingAddressAbi, signerOrProvider);

export const VotingContext = React.createContext();

export const VotingProvider = ({ children }) => {
  const votingTitle = "My first smart contract app";

  const router = useRouter();

  const [currentAccount, setCurrentAccount] = useState();
  const [candidateLength, setCandidateLength] = useState("");
  const pushCandidate = [];
  const candidateIndex = [];
  // const [candidate, setCandidate] = useState([]);
  const [candidateArray, setCandidateArray] = useState(pushCandidate);

  //---END OF CANDIDATE DATA

  console.log(currentAccount);

  const [error, setError] = useState("");
  const highestVote = [];

  //======VOTER SECTION
  const pushVoter = [];
  const [voterArray, setVoterArray] = useState(pushVoter);
  const [voterLength, setVoterLength] = useState("");
  const [voterAddress, setVoterAddress] = useState([]);

  //------CONNECTING WALLETMETAMASK

  const checkIfWalletIsConnected = async () => {
    if (!window.ethereum) return setError("Please Install MetaMask");

    const account = await window.ethereum.request({ method: "eth_accounts" });

    if (account.length) {
      setCurrentAccount(account[0]);
      console.log(currentAccount);
    } else {
      setError("Please Install Metamask & Connect, Reload");
    }
  };

  //---CONNECT WALLET

  const connectWallet = async () => {
    if (!window.ethereum) return setError("Please Install MetaMask");

    const account = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setCurrentAccount(account[0]);
    console.log(currentAccount);
  };

  //-----UPLOAD TO IPFS VOTER IMAGE

  const uploadToIPFS = async (file) => {
    try {
      // const added = await client.add({ content: file });

      // const url = `https://ipfs.infuria.io/ipfs/${added.path}`;

      const formData = new FormData();
      formData.append("file", file);

      const response = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
        data: formData,
        headers: {
          pinata_api_key: `
          1693a8cadad504e5f1b9`,
          pinata_secret_api_key: `
          c9ed011fb121fc59b62f2176ae7df55c63aecbaab8e5dc2d17f5dbffc371655a`,
          "Content-Type": "multipart/form-data",
        },
      });

      const ImgHash = `http://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;

      return ImgHash;
    } catch (error) {
      setError("Error Uploading file to IPFS");
    }
  };

  //-----UPLOAD TO IPFS CANDIDATE IMAGE
  const uploadToIPFScandidate = async (file) => {
    try {
      // const added = await client.add({ content: file });

      // const url = `https://ipfs.infuria.io/ipfs/${added.path}`;

      const formData = new FormData();
      formData.append("file", file);

      const response = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
        data: formData,
        headers: {
          pinata_api_key: `
          1693a8cadad504e5f1b9`,
          pinata_secret_api_key: `
          c9ed011fb121fc59b62f2176ae7df55c63aecbaab8e5dc2d17f5dbffc371655a`,
          "Content-Type": "multipart/form-data",
        },
      });

      const ImgHash = `http://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;

      return ImgHash;
    } catch (error) {
      setError("Error Uploading file to IPFS for Candidate");
    }
  };

  // note: I will make the ipfs pinata changes here
  // const uploadToIPFSCandidate = async (file)=>{}

  //=======CREATE VOTER

  const createVoter = async (formInput, fileUrl, router) => {
    try {
      const { name, address, position } = formInput;

      console.log(name, address, position, "string sucess");

      if ((!name, !address, !position))
        return setError("Input data is missing");

      //CONNECTING SMART CONTRACT
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);

      console.log(contract);

      //PASSING THE DATA RECEIVED TO THE IPFS

      const data = JSON.stringify({ name, address, position, image: fileUrl });
      // const added = await client.add(data);

      // const url = `http://ipfs/infuria.io/ipfs/${added.path}`;

      // const formData = new FormData();
      // formData.append("file", file);

      const response = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        data: data,
        headers: {
          pinata_api_key: `
          1693a8cadad504e5f1b9`,
          pinata_secret_api_key: `
          c9ed011fb121fc59b62f2176ae7df55c63aecbaab8e5dc2d17f5dbffc371655a`,
          "Content-Type": "application/json",
        },
      });

      const url = `http://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;

      console.log(url);

      // return ImgHash;
      console.log(address, name, url, fileUrl, "the sent data");
      const voter = await contract.voterRight(address, name, url, fileUrl);

      voter.wait();
      console.log(voter);
      router.push("/voterList");
    } catch (error) {
      setError("Something wrong creating Voter");
    }
  };

  //---------------GET VOTER DATA

  const getAllVoterData = async () => {
    try {
      //CONNECTING SMART CONTRACT
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);

      //VOTER LIST

      const voterListData = await contract.getVoterList();
      setVoterAddress(voterListData);
      // console.log(voterListData);

      voterListData.map(async (el) => {
        const singleVoterData = await contract.getVoterdata(el);
        // pushCandidate.push(singleVoterData);
        pushVoter.push(singleVoterData);

        console.log(singleVoterData);
      });

      //VOTER LENGTH

      const voterList = await contract.getVoterLength();
      // console.log(voterList.toNumber());
      setVoterLength(voterList.toNumber());
    } catch (error) {
      setError("Something went wrong fetching data");
    }
  };

  // console.log(voterAddress);
  // getAllVoterData();

  // useEffect(() => {
  //   getAllVoterData();
  // }, []);

  //GIVE VOTE

  const giveVote = async (id) => {
    try {
      const voterAddress = id.address;
      const voterId = id.id;

      //CONNECTING SMART CONTRACT
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);

      const voterList = await contract.vote(voterAddress, voterId);

      console.log(voterList);
    } catch (error) {
      console.log(error);
    }
  };

  //--------------------CANDIDATE SECTION----------------------------

  const setCandidate = async (candidateForm, fileUrl, router) => {
    try {
      const { name, address, age } = candidateForm;

      if ((!name, !address, !age)) return setError("Input data is missing");

      console.log(name, address, age, fileUrl);

      //CONNECTING SMART CONTRACT
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);

      console.log(contract);

      //PASSING THE DATA RECEIVED TO THE IPFS

      const data = JSON.stringify({ name, address, image: fileUrl, age });
      // const added = await client.add(data);

      // const url = `http://ipfs/infuria.io/ipfs/${added.path}`;

      // const formData = new FormData();
      // formData.append("file", file);

      const response = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        data: data,
        headers: {
          pinata_api_key: `
          1693a8cadad504e5f1b9`,
          pinata_secret_api_key: `
          c9ed011fb121fc59b62f2176ae7df55c63aecbaab8e5dc2d17f5dbffc371655a`,
          "Content-Type": "application/json",
        },
      });

      const ipfs = `http://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;

      const candidate = await contract.setCandidate(
        address,
        age,
        name,
        fileUrl,
        ipfs
      );

      candidate.wait();
      console.log(candidate);
      router.push("/");
    } catch (error) {
      setError("Something wrong creating Candidate");
    }
  };

  //--GET CANDIDATE DATA
  const getNewCandidate = async () => {
    //CONNECTING SMART CONTRACT
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = fetchContract(signer);
    // console.log(contract);

    //----------ALL CANDIDATE
    const allCandidate = await contract.getCandidate();
    // console.log(allCandidate);

    allCandidate.map(async (el) => {
      const singleCandidateData = await contract.getCandidatedata(el);
      pushCandidate.push(singleCandidateData);
      candidateIndex.push(singleCandidateData[2].toNumber());

      // console.log(singleCandidateData);
    });

    //-----CANDIDATE LENGTH

    const allCandidateLength = await contract.getCandidateLength();
    setCandidateLength(allCandidateLength.toNumber());
    try {
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect(() => {
  //   getNewCandidate();
  // }, []);

  return (
    <VotingContext.Provider
      value={{
        votingTitle,
        checkIfWalletIsConnected,
        connectWallet,
        uploadToIPFS,
        createVoter,
        getAllVoterData,
        giveVote,
        setCandidate,
        getNewCandidate,
        error,
        voterArray,
        voterLength,
        voterAddress,
        currentAccount,
        candidateLength,
        candidateArray,
        uploadToIPFScandidate,
      }}
    >
      {children}
    </VotingContext.Provider>
  );
};

// const Voter = () => {
//   return <div>Voter</div>;
// };

// export default Voter;
