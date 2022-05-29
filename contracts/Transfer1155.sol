//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
contract Transfer1155 {
    IERC1155 private token;
    constructor () {
        console.log("contract deployed");
    }

    function transfer1155 (address _addr, address[] memory _recipients, uint256[] memory _tokenIds, uint256[] memory _values) public {
        for(uint i = 0; i < _recipients.length; i++) {
            token = IERC1155(_addr);
            token.safeTransferFrom(msg.sender, _recipients[i], _tokenIds[i], _values[i], "");
        }
    }

    receive() external payable {}
}
