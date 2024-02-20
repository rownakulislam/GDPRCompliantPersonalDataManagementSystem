import React, { useRef, useState } from 'react';
import { ethers } from 'ethers';
import { create } from 'ipfs-http-client';


const client = create({
  host: '127.0.0.1',
  port: 5001,
  protocol: 'http',
});

function UploadFileComponent() {
  const fileInput = useRef(null);
  const [fileCid, setFileCid] = useState(null);
  //const [userAddress, setUserAddress] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');

  const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;  
  const API_KEY = process.env.REACT_APP_API_KEY;
  const PRIVATE_KEYA=process.env.REACT_APP_PRIVATE_KEY_A;
  const PRIVATE_KEY1=process.env.REACT_APP_PRIVATE_KEY_1;
  const PRIVATE_KEY2=process.env.REACT_APP_PRIVATE_KEY_2;

  async function handleUploadToIPFS() {
    const file = fileInput.current.files[0];
    if (!file) {
      console.log('No file selected');
      return;
    }

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const { cid } = await client.add(reader.result);
        console.log(cid);
        setFileCid(cid.toString());
      };
      reader.readAsArrayBuffer(file);
      
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }

  const handleSendToContract = async () => {
    try {
      const network = 'maticmum';
      const provider = new ethers.providers.AlchemyProvider(network, API_KEY);
      const signer = new ethers.Wallet(PRIVATE_KEYA, provider);
  
      const contractABI = require('./abis/Temp.json');
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
  
      const transaction = await contract.setUserData(fileCid,recipientAddress);
     
    
      await transaction.wait();
      console.log('Transaction successful');
    } catch (error) {
      console.error('Error sending to contract:', error);
    }
  };

  return (
    <div>
      <div>
      <input type="file" ref={fileInput} />
      <button className='b' onClick={handleUploadToIPFS}>Upload to IPFS</button>
      </div>
      <div>
      <input
        type="text"
        placeholder="Recipient Address"
        onChange={(e) => setRecipientAddress(e.target.value)}
      />
      </div>
      <button className='b' onClick={handleSendToContract}>Send to Contract</button>
    </div>
  );
}

export default UploadFileComponent;