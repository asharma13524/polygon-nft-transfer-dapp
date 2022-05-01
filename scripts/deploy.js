// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  const accounts = await hre.ethers.getSigners();
  const acct = accounts[0].address;
  // deploy ApproveTransfer contract
  // const ApproveContractTransfer = await hre.ethers.getContractFactory("ApproveContractTransfer");
  // const approveContractTransfer = await ApproveContractTransfer.deploy();

  // const MintERC1155 = await hre.ethers.getContractFactory("AirlineTokens");
  // const mintERC1155 = await MintERC1155.deploy(acct);

  // We get the contract to deploy
  const Transfer1155 = await hre.ethers.getContractFactory("Transfer1155");
  const transfer1155 = await Transfer1155.deploy();

  // await approveContractTransfer.deployed();
  // await mintERC1155.deployed();
  await transfer1155.deployed();

  // console.log("ApproveContractTransfer deployed to: ", approveContractTransfer.address);
  // console.log("MintERC1155 deployed to:", mintERC1155.address);
  console.log("Transfer1155 deployed to:", transfer1155.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
