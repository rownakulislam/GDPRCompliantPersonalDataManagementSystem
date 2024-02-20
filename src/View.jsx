import React, { useState } from 'react';
import { ethers } from 'ethers';
import { create } from 'ipfs-http-client';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './View.css';

const client = create({
  host: '127.0.0.1',
  port: 5001,
  protocol: 'http',
});

function ViewComponent() {
  const [userAddress, setUserAddress] = useState('');
  const [fileUrls, setFileUrls] = useState([]);


  const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;  
  const API_KEY = process.env.REACT_APP_API_KEY;
  const PRIVATE_KEYA=process.env.REACT_APP_PRIVATE_KEY_A;
  const PRIVATE_KEY1=process.env.REACT_APP_PRIVATE_KEY_1;
  const PRIVATE_KEY2=process.env.REACT_APP_PRIVATE_KEY_2;


  const network = 'maticmum';
  const provider = new ethers.providers.AlchemyProvider(network, API_KEY);
  const signer = new ethers.Wallet(PRIVATE_KEY1, provider);

  


  const contractABI = require('./abis/Temp.json');
  const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

  async function fetchFileFromIPFS() {
    try {
      console.log("here");
      var d = new Date();
      d = new Date(d.getTime() - 3000000);
      var date_format_str = d.getFullYear().toString()+"-"+((d.getMonth()+1).toString().length==2?(d.getMonth()+1).toString():"0"+(d.getMonth()+1).toString())+"-"+(d.getDate().toString().length==2?d.getDate().toString():"0"+d.getDate().toString())+" "+(d.getHours().toString().length==2?d.getHours().toString():"0"+d.getHours().toString())+":"+((parseInt(d.getMinutes()/5)*5).toString().length==2?(parseInt(d.getMinutes()/5)*5).toString():"0"+(parseInt(d.getMinutes()/5)*5).toString())+":00";
      console.log(date_format_str);
      const transactionObj1 = await contract.getUserData(userAddress,date_format_str);
      const temp=await transactionObj1.wait();
      console.log(temp.events[0].args);
      const userData=temp.events[0].args._cid;
      console.log(userData);
      let urls = [];
      for(var i=0;i<userData.length;i++){
        if(userData[i]==""){
          continue;
        }
        const stream = client.cat(userData[i].toString());
        let data = [];

        for await (const chunk of stream) {
          data.push(chunk);
        }

        const blob = new Blob(data, { type: 'image/jpeg' });
        const url = URL.createObjectURL(blob);
        urls.push({ cid: userData[i], url: url });
    }
    setFileUrls(urls);
    } catch (error) {
      console.error('Error fetching file from IPFS:', error);
    }
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Your Address"
        onChange={(e) => setUserAddress(e.target.value)}
      />
      
      <button className='up_b' onClick={fetchFileFromIPFS}>Fetch Files from IPFS</button>
      {fileUrls.map((file, index) => (
        <div className='file' key={index}>
          <p>CID: {file.cid}</p>
          <a className='download' href={file.url} download>Download File</a>
        </div>

      ))}
    
    <div className='link_to_view'>
      <div className='b_page'>{<Link to="/">Go to Upload</Link>}</div>
      <div className='b_page'>{<Link to="/view_log">Go to View Logs</Link>}</div>
    </div>
      
    </div>
  );
}

export default ViewComponent;