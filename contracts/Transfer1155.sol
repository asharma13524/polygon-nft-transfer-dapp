//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";



// interface IERC1155 {
//     // function balanceOf(address account, uint256 id) external;
//     // function balanceOfBatch(address[] calldata accounts, uint256[] calldata ids) external;
//     function setApprovalForAll(address operator, bool approved) external;
//     function isApprovedForAll(address account, address operator) external view returns (bool);
//     function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes calldata data) external;
// }

contract ERC1155Tradeable {

    address proxyRegistryAddress;
    constructor (address _proxyRegistryAddress) {
        proxyRegistryAddress = _proxyRegistryAddress
    }

}

contract Transfer1155 {
    address private _token = 0x4f9594CC599497d70c3128773d758B9f780622Cf; // 1155 nft addr
    ERC1155 private token;

    constructor () {
        console.log("contract deployed");
    }

    function approveTransfer(address operator, bool approved) public {
        ERC1155(operator).setApprovalForAll(address(this), approved);
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
        console.log(ERC1155(_addr).isApprovedForAll(msg.sender, address(this)));
        // check if user has enough nfts
        // require(ERC1155(_addr).safeTransferFrom(msg.sender, address(this), total, ""));

        // loop through 1155s and send amount to each address
        // code assumes person is sending different erc1155s
        // frontend should handle logic to grab token id
        // TODO: figure out correct implementation for IERC1155(_addr) or need to just grab contract addr before
        for(uint i = 0; i < _recipients.length; i++) {
            token = ERC1155(_addr);
            token.safeTransferFrom(msg.sender, _recipients[i], _tokenIds[i], _values[i], "");
            i += 1;
        }
    }

    receive() external payable {}
}
