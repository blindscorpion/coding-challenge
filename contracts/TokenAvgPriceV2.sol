pragma solidity ^0.8.0;

import '@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol';
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import "hardhat/console.sol";


contract TokenAvgPriceV2 is Initializable, PausableUpgradeable, OwnableUpgradeable {
    mapping(address => mapping(uint256 => uint256)) public tokenPrice;

    uint256 public yearStart;

    function initialize(uint _yearStart) public initializer {
        __Ownable_init();
        __Pausable_init();
        yearStart = _yearStart;
    }
    
    /// Sets Price for each Day
    function setDailyPrice(address token, uint256 day, uint256 price) external onlyOwner whenNotPaused {
        tokenPrice[token][day] = price;
    }

    /// Calculates average price for a given period measured in days
    function getAveragePrice(address token, uint256 startDay, uint256 endDay) external view returns(uint256) {
        uint256 priceTotal;
        uint256 numDays = endDay - startDay + 1;
        for(uint i=0; i<numDays; i++) {
            priceTotal = priceTotal + tokenPrice[token][startDay + i];
        }

        // console.log("HH Avg Price", priceTotal / numDays);
        return priceTotal / numDays;
    }

    function pause() external whenNotPaused onlyOwner {
        _pause();
    }

    function unpause() external whenPaused onlyOwner {
        _unpause();
    }
}