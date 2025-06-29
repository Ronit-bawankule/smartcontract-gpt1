// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Logger {
    event LogMessage(string message);

    function log(string calldata message) public {
        emit LogMessage(message);
    }
}
