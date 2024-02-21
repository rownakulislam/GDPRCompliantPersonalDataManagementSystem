//Interaction with the blockchain test network(Polygon Mumbai)
require('dotenv').config(); // Load environment variables from a .env file

const { ethers } = require("hardhat");

async function main() {
  const API_KEY = process.env.REACT_APP_API_KEY;
  const PRIVATE_KEY = process.env.REACT_APP_PRIVATE_KEY_A;
  const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;

  if (!API_KEY || !PRIVATE_KEY || !CONTRACT_ADDRESS) {
    console.error("API_KEY, PRIVATE_KEY, or CONTRACT_ADDRESS is missing in the environment variables.");
    return;
  }

  const network = "maticmum";
  const alchemyProvider = new ethers.providers.AlchemyProvider(network, API_KEY);
  const signerA = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);
  const signer1=new ethers.Wallet(process.env.REACT_APP_PRIVATE_KEY_1, alchemyProvider);

  const contract = require("../src/abis/Temp.json"); // Replace with the actual path to your contract's artifact
  const CertContract = new ethers.Contract(CONTRACT_ADDRESS, contract, signerA);
  const transactionObj = await CertContract.setUserData("9999999","0x72195F2BDdf8E1bf51116ffe9eB3c6Ab86707083");

  await transactionObj.wait(); // Wait for the transaction to be mined

  console.log("Uploaded successfully!");

  const transactionObjj = await CertContract.setUserData("111111","0x72195F2BDdf8E1bf51116ffe9eB3c6Ab86707083");

  await transactionObjj.wait(); // Wait for the transaction to be mined

  console.log("Uploaded successfully!");



  const CertContract1 = new ethers.Contract(CONTRACT_ADDRESS, contract, signer1);
  
  var d = new Date();
  d = new Date(d.getTime() - 3000000);
  var date_format_str = d.getFullYear().toString()+"-"+((d.getMonth()+1).toString().length==2?(d.getMonth()+1).toString():"0"+(d.getMonth()+1).toString())+"-"+(d.getDate().toString().length==2?d.getDate().toString():"0"+d.getDate().toString())+" "+(d.getHours().toString().length==2?d.getHours().toString():"0"+d.getHours().toString())+":"+((parseInt(d.getMinutes()/5)*5).toString().length==2?(parseInt(d.getMinutes()/5)*5).toString():"0"+(parseInt(d.getMinutes()/5)*5).toString())+":00";
  const transactionObj1 = await CertContract1.getUserData("0xc8bF66d8A88EddAb25D92F747CdDD9512577E15F",date_format_str);

  const temp=await transactionObj1.wait();
  console.log(temp.events[0].args._cid);

  const inputTypes = ['string[]'];
  const data =temp.events[0].data;
  const decodedData = ethers.utils.defaultAbiCoder.decode(inputTypes, data);
  console.log(decodedData);

  const CertContract2 = new ethers.Contract(CONTRACT_ADDRESS, contract, signerA);
  
  var date_format_str = d.getFullYear().toString()+"-"+((d.getMonth()+1).toString().length==2?(d.getMonth()+1).toString():"0"+(d.getMonth()+1).toString())+"-"+(d.getDate().toString().length==2?d.getDate().toString():"0"+d.getDate().toString())+" "+(d.getHours().toString().length==2?d.getHours().toString():"0"+d.getHours().toString())+":"+((parseInt(d.getMinutes()/5)*5).toString().length==2?(parseInt(d.getMinutes()/5)*5).toString():"0"+(parseInt(d.getMinutes()/5)*5).toString())+":00";
  const transactionObj2 = await CertContract2.getUserData("0xc8bF66d8A88EddAb25D92F747CdDD9512577E15F",date_format_str);

  const temp2=await transactionObj2.wait();
  console.log(temp2.events[0].args._cid);

  

  const lastAccessor = await CertContract1.getLastAccessor(temp.events[0].args._cid[0]);
  console.log(lastAccessor);
  
};


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

 