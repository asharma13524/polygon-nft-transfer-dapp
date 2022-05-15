//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";

contract Transfer1155 {
    IERC1155 private token;
    constructor () {
        console.log("contract deployed");
    }

    function transfer1155 (address _addr, address[] memory _recipients, uint256[] memory _tokenIds, uint256[] memory _values) public {
        // uint256 total = 0;
        // sum up total nfts user is trying to send
        // for(uint256 i = 0; i < _recipients.length; i++) {
        //     total += _values[i];
        // }
        // check if user has enough nfts
        // require(ERC1155(_addr).safeTransferFrom(msg.sender, address(this), total, ""));

        // loop through 1155s and send amount to each address
        // code assumes person is sending different erc1155s
        // frontend should handle logic to grab token id
        for(uint i = 0; i < _recipients.length; i++) {
            token = IERC1155(_addr);
            token.safeTransferFrom(msg.sender, _recipients[i], _tokenIds[i], _values[i], "");
        }
    }

    receive() external payable {}
}
