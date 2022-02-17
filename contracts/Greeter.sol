//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import 'https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol';


import "hardhat/console.sol";

contract NftContract is ERC721 {

    constructor(string memory _greeting) {
        console.log("Deploying a Greeter with greeting:", _greeting);
        greeting = _greeting;
    }

    function transferNFT(address to, uint256 _tokenId) {
        address seller = ownerOf(_tokenId);
        _transfer(seller, msg.sender, _tokenId);
    }

    // function setGreeting(string memory _greeting) public {
    //     console.log("Changing greeting from '%s' to '%s'", greeting, _greeting);
    //     greeting = _greeting;
    // }
    /*
    transfer nfts to

    */
    function transfer(uint256 _tokenId, uint addresses[], ) external payable {
        uint256 price = tokenIdToPrice[_tokenId];
        require(price > 0, 'This token is not for sale');
        require(msg.value == price, 'Incorrect value');

        address seller = ownerOf(_tokenId);
        _transfer(seller, msg.sender, _tokenId);
        tokenIdToPrice[_tokenId] = 0; // not for sale anymore
        payable(seller).transfer(msg.value); // send the ETH to the seller

        emit NftBought(seller, msg.sender, msg.value);
    }
}
