// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
contract Temp {
    struct a_token{
        bool valid;
        string operation;
    }
    struct Log{
        address user;
        string time;
        uint256 granted;
        string operation;
    }

    struct return_data{
        string cid;
        string operation;
    }

    address[] public accounts;
    
    mapping(address=>string[]) public userDatas;
    
    mapping(string => mapping(address => a_token)) public accessPermissions;
    
    mapping(string => Log[]) public lastAccessedBy; 

    
    event getUserDataE(return_data[] _cid);
    
    event users(address[] _users);
    
    
    modifier onlyUser(address _user) {
        require(msg.sender == _user, "Only the user can call this function");
        _;
    }




    function setUserData(string memory _cid,address receiver,string memory _op) public {
       if(userDatas[msg.sender].length==0){
            accounts.push(msg.sender);
        } 
        bool flag=false;
        for(uint8 i=0;i<accounts.length;i++){
            if(accounts[i]==receiver){
                flag=true;
                break;
            }
        } 
        if(flag==false){
            accounts.push(receiver);
        }
        
    flag=false;
    for(uint8 i=0;i<userDatas[msg.sender].length;i++){
        if(keccak256(bytes(userDatas[msg.sender][i])) == keccak256(bytes(_cid))){
            flag=true;
            break;
        }
    }
    if(flag==false){
        userDatas[msg.sender].push(_cid);
    }
        
        accessPermissions[_cid][receiver] =a_token(true,_op);
        accessPermissions[_cid][msg.sender] = a_token(true,"3");
    }



    function getUsers() public view returns(address[] memory){
        return accounts;
    }




    function getUserData(address _user) public{
            string[] memory cids = userDatas[_user];
            return_data[] memory temp_cids_token=new return_data[](cids.length);
            uint256 count = 0;
                for(uint i=0;i<cids.length;i++){
                    if(accessPermissions[cids[i]][msg.sender].valid == true){
    
                        string memory operation = accessPermissions[cids[i]][msg.sender].operation;
                        temp_cids_token[count] = return_data(cids[i],operation);
                        count++;
                    }
                    
                }
                emit getUserDataE(temp_cids_token);
    }



    function getUserCid()public view returns(string[] memory){
        return userDatas[msg.sender];
    }



    function getLastAccessor(string memory _cid) public view returns (Log[] memory) {
        return lastAccessedBy[_cid];
    }



    function updateLog(string memory _cid,string memory _time,uint256 _granted,string memory _op) public {
        lastAccessedBy[_cid].push(Log({user: msg.sender, time: _time,granted: _granted,operation: _op}));
    }


    function deleteLog(string memory _cid) public {
        for(uint8 i=0;i<accounts.length;i++){
                delete accessPermissions[_cid][accounts[i]];
        }
    }

    function grantAccess(address _recipient,string memory _operation) public onlyUser(msg.sender) {
        string[] memory cids = userDatas[msg.sender];
        for(uint i=0;i<cids.length;i++){
            accessPermissions[cids[i]][_recipient].valid = true;  
            accessPermissions[cids[i]][_recipient].operation = _operation;
        }      
    }

    function revokeAccess(address _recipient) public onlyUser(msg.sender) {
        string[] memory cids = userDatas[msg.sender];
        for(uint i=0;i<cids.length;i++){
            accessPermissions[cids[i]][_recipient].valid = false;  
            accessPermissions[cids[i]][_recipient].operation = "0"; 
        }
    }
}