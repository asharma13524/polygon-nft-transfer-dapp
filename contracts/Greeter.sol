//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "hardhat/console.sol";

interface IERC20 {
    function transfer(address to, uint256 value) external returns (bool);
    function transferFrom(address from, address to, uint256 value) external returns (bool);
}

contract TransferTokens {
    event Nft(address indexed reciever, uint256 itemsTransferred);


    function transferToken (IERC20 token, bytes[] memory recipients, uint256[] memory values) external {
        uint256 total = 0;
        for(uint256 i=0; i<recipients.length; i++) {
            total += values[i];
        }
        require(token.transferFrom(msg.sender, address(this), total));
        // TODO: rethink storing recipients as byte mem and addr conversion here
        for(uint i = 0; i < recipients.length; i++) {
            require(token.transferFrom(msg.sender, address(uint160(uint256(recipients[i]))), values[i]));
        }
    }
}
