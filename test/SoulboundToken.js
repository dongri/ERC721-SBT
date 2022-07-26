const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");
const Web3 = require("web3");
const web3 = new Web3(ethers.provider);

describe("SoulboundToken", function () {

  let soulboundToken;
  let owner;
  let addr1;
  let addr2;
  let addr3;

  beforeEach(async () => {
    [owner, addr1, addr2, addr3, ...addrs] = await ethers.getSigners();

    const SoulboundToken = await ethers.getContractFactory("SoulboundToken");
    soulboundToken = await upgrades.deployProxy(SoulboundToken);

  })

  it("Check onlyOwner", async function () {
    let contractWithOwner = await soulboundToken.connect(owner);
    let contractWithAdd1 = await soulboundToken.connect(addr1);
    let contractWithAdd2 = await soulboundToken.connect(addr2);

    await expect(contractWithAdd1.setSigner(addr1.address)).to.be.revertedWith("Ownable: caller is not the owner");
    await expect(contractWithAdd1.setBaseURI('https://example.com/')).to.be.revertedWith("Ownable: caller is not the owner");
    await expect(contractWithAdd1.burn(1)).to.be.revertedWith("Ownable: caller is not the owner");

    expect(await contractWithOwner.setSigner(addr1.address)).to.be.ok;
    expect(await contractWithOwner.setBaseURI('https://example.com/')).to.be.ok;

    // mint
    const now = new Date().getTime();
    let message = `verify ${now}`;
    let messageHash = ethers.utils.solidityKeccak256(["string", "address"], [message, addr2.address]);
    let signature = await addr1.signMessage(ethers.utils.arrayify(messageHash));

    expect(await contractWithAdd2.mint(message, signature)).to.be.ok;
    expect(await contractWithOwner.burn(1)).to.be.ok;
  })

  it("Check tokenURI", async function () {
    let contractWithOwner = await soulboundToken.connect(owner);
    let contractWithAdd2 = await soulboundToken.connect(addr2);

    expect(await contractWithOwner.setSigner(addr1.address)).to.be.ok;
    expect(await contractWithOwner.setBaseURI('https://example.com/')).to.be.ok;

    // mint
    const now = new Date().getTime();
    let message = `verify ${now}`;
    let messageHash = ethers.utils.solidityKeccak256(["string", "address"], [message, addr2.address]);
    let signature = await addr1.signMessage(ethers.utils.arrayify(messageHash));

    expect(await contractWithAdd2.mint(message, signature)).to.be.ok;
    let result = await contractWithAdd2.tokenURI(1);
    expect(result).to.equal('https://example.com/1');
  })

  it("Check verify", async function () {
    let contractWithOwner = await soulboundToken.connect(owner);
    let contractWithAdd1 = await soulboundToken.connect(addr1);
    let contractWithAdd2 = await soulboundToken.connect(addr2);

    expect(await contractWithOwner.setSigner(addr1.address)).to.be.ok;
    expect(await contractWithOwner.setBaseURI('https://example.com/')).to.be.ok;

    // mint
    const now = new Date().getTime();
    let message = `verify ${now}`;
    let messageHash = ethers.utils.solidityKeccak256(["string", "address"], [message, addr3.address]);
    let signature = await addr1.signMessage(ethers.utils.arrayify(messageHash));

    await expect(contractWithAdd2.mint(message, signature)).to.be.revertedWith("invalid signature");
    
    messageHash = ethers.utils.solidityKeccak256(["string", "address"], [message+'error', addr2.address]);
    signature = await addr1.signMessage(ethers.utils.arrayify(messageHash));
    
    await expect(contractWithAdd2.mint(message, signature)).to.be.revertedWith("invalid signature");

    messageHash = ethers.utils.solidityKeccak256(["string", "address"], [message, addr2.address]);
    signature = await addr1.signMessage(ethers.utils.arrayify(messageHash));
    
    expect(await contractWithAdd2.mint(message, signature)).to.be.ok;

  })

  it("Check mint", async function () {
    let contractWithOwner = await soulboundToken.connect(owner);
    let contractWithAdd1 = await soulboundToken.connect(addr1);
    let contractWithAdd2 = await soulboundToken.connect(addr2);

    expect(await contractWithOwner.setSigner(addr1.address)).to.be.ok;
    expect(await contractWithOwner.setBaseURI('https://example.com/')).to.be.ok;

    // mint
    const now = new Date().getTime();
    let message = `verify ${now}`;
    let messageHash = ethers.utils.solidityKeccak256(["string", "address"], [message, addr2.address]);
    let signature = await addr1.signMessage(ethers.utils.arrayify(messageHash));

    expect(await contractWithAdd2.mint(message, signature)).to.be.ok;
  })

  it("Check soulbound token", async function () {
    let contractWithOwner = await soulboundToken.connect(owner);
    let contractWithAdd1 = await soulboundToken.connect(addr1);
    let contractWithAdd2 = await soulboundToken.connect(addr2);

    expect(await contractWithOwner.setSigner(addr1.address)).to.be.ok;
    expect(await contractWithOwner.setBaseURI('https://example.com/')).to.be.ok;

    // mint
    const now = new Date().getTime();
    let message = `verify ${now}`;
    let messageHash = ethers.utils.solidityKeccak256(["string", "address"], [message, addr2.address]);
    let signature = await addr1.signMessage(ethers.utils.arrayify(messageHash));

    expect(await contractWithAdd2.mint(message, signature)).to.be.ok;

    // transfer
    await expect(contractWithAdd2.transferFrom(addr2.address, addr3.address, 1)).to.be.revertedWith("token is SOUL BOUND");

    // setApprovalForAll
    await expect(contractWithAdd2.setApprovalForAll(addr3.address, true)).to.be.revertedWith("token is SOUL BOUND");

    // approve
    await expect(contractWithAdd2.approve(addr3.address, 1)).to.be.revertedWith("token is SOUL BOUND");
  })


});
