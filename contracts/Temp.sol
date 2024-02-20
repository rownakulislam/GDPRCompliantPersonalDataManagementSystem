// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
contract Temp {
    struct UserData {
        string ipfsCID;
    }
    struct Log{
        address user;
        string time;
        uint256 granted;
    }
    address[] public accounts;
    mapping(address=>string[]) public userDatas;
    mapping(string => mapping(address => bool)) public accessPermissions;
    mapping(string => Log[]) public lastAccessedBy; 

    event getUserDataE(string[] _cid);
    
    
    modifier onlyUser(address _user) {
        require(msg.sender == _user, "Only the user can call this function");
        _;
    }

    function setUserData(string memory _cid,address receiver) public {
       if(userDatas[msg.sender].length==0){
            accounts.push(msg.sender);
        } 
        userDatas[msg.sender].push(_cid);
        accessPermissions[_cid][receiver] = true;
        accessPermissions[_cid][msg.sender] = true;
    }

    function getUserData(address _user,string memory _time) public returns(string[] memory){
            string[] memory cids = userDatas[_user];
            string[] memory temp_cids=new string[](cids.length);
            uint256 count = 0;
                for(uint i=0;i<cids.length;i++){
                    if(accessPermissions[cids[i]][msg.sender] == true){
                        lastAccessedBy[cids[i]].push(Log({user: msg.sender, time: _time,granted: 1}));
                        temp_cids[count]=cids[i];
                        count++;
                    }
                    else{
                        lastAccessedBy[cids[i]].push(Log({user: msg.sender, time: _time,granted: 0}));
                    }
                }
                emit getUserDataE(temp_cids);
                return temp_cids;
    }

    function getUserCid()public view returns(string[] memory){
        return userDatas[msg.sender];
    }

    function getLastAccessor(string memory _cid) public view returns (Log[] memory) {
        return lastAccessedBy[_cid];
    }


    function grantAccess(address _recipient) public onlyUser(msg.sender) {
        string[] memory cids = userDatas[msg.sender];
        for(uint i=0;i<cids.length;i++){
            accessPermissions[cids[i]][_recipient] = true;  
        }      
    }

    function revokeAccess(address _recipient) public onlyUser(msg.sender) {
        string[] memory cids = userDatas[msg.sender];
        for(uint i=0;i<cids.length;i++){
            accessPermissions[cids[i]][_recipient] = false;  
        }
    }
}