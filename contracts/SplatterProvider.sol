// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

import { Ownable } from '@openzeppelin/contracts/access/Ownable.sol';
import { IAssetStore, IAssetStoreEx } from './interfaces/IAssetStore.sol';
import { IAssetProvider } from './interfaces/IAssetProvider.sol';
import './libs/trigonometry.sol';
import "@openzeppelin/contracts/utils/Strings.sol";
import '@openzeppelin/contracts/interfaces/IERC165.sol';
import "hardhat/console.sol";

library Random {
  struct RandomSeed {
    uint256 seed;
    uint256 value;
  }

  function random(Random.RandomSeed memory seed, uint256 max) public pure returns (uint256 ret, Random.RandomSeed memory updateSeed) {
    updateSeed = seed;
    if (updateSeed.value < max * 256) {
      updateSeed.seed = uint256(keccak256(abi.encodePacked(updateSeed.seed)));
      updateSeed.value = updateSeed.seed;
    }
    ret = updateSeed.value % max;
    updateSeed.value /= max;
  }
}

contract SplatterProvider is IAssetProvider, IERC165, Ownable {
  using Strings for uint32;
  using Strings for uint256;
  using Trigonometry for uint16;

  string constant providerKey = "splt";
  address public receiver;

  constructor() {
    receiver = owner();
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
    return
      interfaceId == type(IAssetProvider).interfaceId ||
      interfaceId == type(IERC165).interfaceId;
  }

  function getOwner() external override view returns (address) {
    return owner();
  }

  function getProviderInfo() external view override returns(ProviderInfo memory) {
    return ProviderInfo(providerKey, "Splatter", this);
  }

  function totalSupply() external pure override returns(uint256) {
    return 0; // indicating "dynamically (but deterministically) generated from the given assetId)
  }

  function processPayout(uint256 _assetId) external override payable {
    address payable payableTo = payable(receiver);
    payableTo.transfer(msg.value);
    emit Payout(providerKey, _assetId, payableTo, msg.value);
  }

  function setReceiver(address _receiver) onlyOwner external {
    receiver = _receiver;
  }

  function generateSVGPart(uint256 _assetId) external view override returns(string memory svgPart, string memory tag) {
    uint256 count = 16;
    int32 arc = 100;
    Point[] memory points = new Point[](count);
    for (uint256 i = 0; i < count; i++) {
      uint16 angle = uint16(i * 16384 / count);
      console.log("***", i, uint256(500 + angle.sin() * arc / 32767), uint256(500 + angle.cos() * arc / 32767));
    }
    /*
      uint16 angle = uint16(i * 16384 / count);
      points[i].x = int32(512 + angle.cos() * arc / 32768);
      points[i].y = int32(512 + angle.sin() * arc / 32768);
      points[i].c = true;
    }
    */
    svgPart = PathFromPoints(points);
    tag = string(abi.encodePacked(providerKey, _assetId.toString()));
  }

  struct Point {
    int32 x;
    int32 y;
    bool c;   // true:line, false:bezier
    int32 r; // ratio (0 to 1024)
  }

  function PathFromPoints(Point[] memory points) public pure returns(string memory) {
    bytes memory ret;
    uint256 length = points.length;
    for(uint256 i = 0; i < length; i++) {
      Point memory point = points[i];
      Point memory prev = points[(i + length - 1) % length];
      int32 sx = (point.x + prev.x) / 2;
      int32 sy = (point.y + prev.y) / 2;
      if (i == 0) {
        ret = abi.encodePacked("M", uint32(sx).toString(), ",", uint32(sy).toString());
      }
      if (point.c) {
        ret = abi.encodePacked(ret, "L", uint32(point.x).toString(), ",", uint32(point.y).toString());
      } else {
        Point memory next = points[(i + 1) % length];
        int32 ex = (point.x + next.x) / 2;
        int32 ey = (point.y + next.y) / 2;
        ret = abi.encodePacked(ret, "C",
          uint32(sx + point.r * (point.x - sx) / 1024).toString(), ",",
          uint32(sy + point.r * (point.y - sy) / 1024).toString(), ",",
          uint32(ex + point.r * (point.x - ex) / 1024).toString(), ",",
          uint32(ey + point.r * (point.y - ey) / 1024).toString(), ",",
          uint32(ex).toString(), ",", uint32(ey).toString());
      }
    }
    return string(ret);
  }  
}