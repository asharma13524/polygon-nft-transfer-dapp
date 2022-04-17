//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "hardhat/console.sol";

interface IERC1155 {
    function isApprovedForAll(address operator, bool approved) external;
    function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes calldata data) external;
    function setApprovalForAll(address operator, bool approved) external;
}

// TODO: do I need abstract contract here?
/*
multiple patterns, can simply import smart contract from github or can implement
interface here with only the functions that I plan on using
*/
abstract contract Transfer1155 is IERC1155 {

    constructor () {
        console.log("contract deployed");
    }

    /**
    * @param _addr the erc1155 token address
    * @param _recipients address[] addresses to airdrop
    * @param _tokenIds uint256[] tokenIds of nfts to airdrop
    * @param _values uint256[] number of nfts to airdrop to address
    */
    function transfer1155 (address _addr, address[] memory _recipients, uint256[] memory _tokenIds, uint256[] memory _values) public {
        uint256 total = 0;
        // sum up total nfts user is trying to send
        for(uint256 i = 0; i < _recipients.length; i++) {
            total += _values[i];
        }
        // check if user has enough nfts
        // require(ERC1155(_addr).safeTransferFrom(msg.sender, address(this), total, ""));

        // loop through 1155s and send amount to each address
        // code assumes person is sending different erc1155s
        // frontend should handle logic to grab token id
        // TODO: figure out correct implementation for IERC1155(_addr) or need to just grab contract addr before
        for(uint i = 0; i < _recipients.length; i++) {
            IERC1155(_addr).safeTransferFrom(msg.sender, _recipients[i], _tokenIds[i], _values[i], "");
            i += 1;
        }
    }
}
