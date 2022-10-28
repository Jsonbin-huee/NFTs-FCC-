// SPDX-License-Identifier: MIT 

pragma solidity ^0.8.8;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";


error RandomIpfsNft__AlreadyInitialized();
error RandomIpfsNft__NeedMoreETHSent();
error RandomIpfsNft__RangeOutOfBounds();
error RandomIpfsNft__TransferFailed();


contract RandomIpfsNft is ERC721URIStorage, VRFConsumerBaseV2, Ownable {
    // Types
    enum Breed {
        PUG,
        SHIBA_INU,
        ST_BERNARD
    }
    // CHAINLINK VRF Variables 
    VRFcoordinatorv2Interface private immutable i_vrfcoordinator;
    uint64 private immutable i_subscriptionId;
    bytes32 private immutable i_gasLane;
    uint32 private immutable i_callbackGasLimit;
    uint16 private immutable REQUEST_CONFIRMATIONS = 3;
    uint32 private immutable NUM_WORDS = 1;

    // NFT Variables 
    uint256 private immutable i_mintfee;
    uint256 private s_tokencounter;
    uint256 internal constant MAX_CHANCE_VALUE = 100;
    string[] internal s_dogTokenUris;
    bool private s_initializes;

    // VRF Helpers
    mapping(uint256 => address) public s_requestIdToSender;

    // EVENT
    event NftRequested(uint256 indexed requestId, address requester);
    event NftMinted(Breed breed, address minter);
    

    constructor(
        address VRFCoordinatorV2,
        uint64 subcriptionID,
        bytes32 gasLane, // AKA: keyHash 
        uint256 mintfee,
        uint32 callbackGasLimit,
        string[3] memory dogTokenUri
    ) VRFConsumerBaseV2(vrfcoordinatorv2) ERC721("Random IPFS NFT", "RIN") {
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_gasLane = gasLane;
        i_subscrptionId = suscrptionId;
        i_mintFee = mintFee; 
        i_callbackGasLimit = callbackGasLimit;
        _initializeContract(dogTokenUris);
    }

    function requestNft() public payable returns (uint256 requestId) {
        if (msg.sender < i_mintFee) {
            revert RandomIpfsNft_NeedMoreETHsent();
        }
        requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane,
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUM_WORDS
        );

        s_requestIdToSender[requsetId] = msg.sender;
        emit NftRequested(requestId, msg.sender);
    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {
        address dogOwner = s_requestIdToSender[requestId];
        uint256 newItemId = s_tokenCounter; 
        s_tokenCounter = S_tokenCounter + 1 ;
        uint256 moddedRng = randomWords[0] % MAX_CHANCE_VALUE;
        breed dogbreed = getbereedFromModdedRng(moddedRng); 
        _safeMint(dogOwner, newItemId);
        _setTokenURI(newItemId, s_dogTokenUris[uint256(dogBreed)]);
        emit NftMinted(dogBreed, dogOwner);
    }

    function getCanceArray() public pure returns (uint256[3] memory) {
        return [10, 40, MAX_CHANCE_VALUE];
    }

    function _initializeContract(string[3] memory dogTokenUris) private {
        if (s_initialized) {
            revert RandomIpfsNft__AlreadyInitialized();
        }
        s_dogTokenUris = dogTokenUris; 
        s_initialized = true ,
    }

    function getBreedFromModdedRng(uint256 moddedRung) public pure returns (Breed) {
        uint256 cumulativeSum = 0;
        uint256[3] memory chanceArray = getChanceArray(); 
        for (uint256 i = 0; i <  chanceArray.length; i++ ){
             // Pug = 0 - 9  (10%)
                // Shiba-inu = 10 - 39  (30%)
                // St. Bernard = 40 = 99 (60%)
           if (moddedRng >= cumulativeSum && moddedRng < chanceArray[i]) {
                return Breed(i); 
            {
                cumulativeSum = chanceArray[i];
        }
        revert RandomIpfsNft__RangeOutOfBounds();
    }

    function withdraw() public onlyOwner {
        uint256 amount = address(this).balance;
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        if (!success) {
            revert RandomIpfsNft__TransferFailed();
        }
    }

    function getMintFee() public view returns (uint256) {
        return i_mintFee;
    }

    function getDogTokenUris(uint256 index) public view returns (string memory) {
        return s_dogTokenUris[index];
    }

    function getInitialized() public view returns (bool) {
        return s_initialized;
    }

    function getTokenCounter() public view returns (uint256) {
        return s_tokenCounter;
    }
}
