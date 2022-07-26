// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Import this file to use console.log
import "hardhat/console.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract SoulboundToken is ERC721EnumerableUpgradeable, OwnableUpgradeable {
  using Counters for Counters.Counter;
  Counters.Counter private tokenIdCounter;
  using ECDSA for bytes32;

  address private signer;
  string private baseURI;

  event Mint(address owner, uint256 tokenId);

  function initialize() initializer public {
    __ERC721_init("SBT", "SBT");
    __Ownable_init();
  }

  function setSigner(address __signer) external onlyOwner {
    signer = __signer;
  }

  function setBaseURI(string memory __baseURI) external onlyOwner{
    baseURI = __baseURI;
  }

  function burn(uint256 __tokenId) external onlyOwner {
    super._burn(__tokenId);
  }

  function _baseURI() internal view virtual override returns (string memory) {
    return baseURI;
  }

  function mint(string memory __message, bytes memory __signature) external {
    bytes32 _messageHash = keccak256(abi.encodePacked(__message, msg.sender));
    require(_verify(_messageHash, __signature, signer), "invalid signature");
    tokenIdCounter.increment();
    uint256 _tokenId = tokenIdCounter.current();
    _safeMint(msg.sender, _tokenId);
    emit Mint(msg.sender, _tokenId);
  }

  function _verify(bytes32 __data, bytes memory __signature, address __account) internal pure returns (bool) {
    return __data
      .toEthSignedMessageHash()
      .recover(__signature) == __account;
  }

  function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal override {
    require(from == address(0) || to == address(0), "token is SOUL BOUND");
    super._beforeTokenTransfer(from, to, tokenId);
  }

  function _afterTokenTransfer(address from, address to, uint256 tokenId) internal override {
    super._afterTokenTransfer(from, to, tokenId);
  }

  function _setApprovalForAll(address owner,address operator,bool approved) internal virtual override {
    console.log("_setApprovalForAll", owner, operator, approved);
    require(false, "token is SOUL BOUND");
  }

  function _approve(address to, uint256 tokenId) internal virtual override {
    require(to == address(0) || false, "token is SOUL BOUND"); // burnable token
    super._approve(to, tokenId);
  }

}
