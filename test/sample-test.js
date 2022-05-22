const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Greeter", function () {
  it("Should return the new greeting once it's changed", async function () {

    const Transfer1155 = await ethers.getContractFactory("Transfer1155");

    const transfer1155 = await Transfer1155.deploy();
    await transfer1155.deployed();

    // TODO: Add logic to transfer 1155s and test
    expect(await transfer1155.transfer1155()).to.equal("");

    // const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // // wait until the transaction is mined
    // await setGreetingTx.wait();

    // expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
});
