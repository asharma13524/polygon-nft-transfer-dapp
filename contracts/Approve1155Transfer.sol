pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

contract ApproveContractTransfer {
    address contractAddress;

    function approveNFTForTransfer (address _addr, address _contractAddress) public {
        IERC1155(_addr).setApprovalForAll(_contractAddress, true);
    }

    function isApprovedForTransfer (address _addr, address _operator) public {
        IERC1155(_addr).isApprovedForAll(msg.sender, _operator);
    }
}