# 🤖 SmartContractGPT

A blockchain-powered AI log analyzer that listens to smart contract events and explains them using OpenAI & Google Gemini in real time.

## 🚀 Project Overview

SmartContractGPT is a full-stack dApp that:
- Uses a Solidity smart contract to emit log events on-chain
- Listens to these events using a Node.js backend
- Sends the log message to **OpenAI (GPT-3.5-turbo)** and **Google Gemini (1.5 Pro)** for natural language explanation
- Pushes the results to a frontend dashboard that refreshes every few seconds

Built for hackathons, AI+Web3 showcases, and system observability use cases.

---

## 🧱 Tech Stack

| Layer       | Tech                          |
|------------|-------------------------------|
| Smart Contract | Solidity (`Logger.sol`)       |
| Blockchain     | Hardhat local node / Sepolia |
| AI APIs        | OpenAI, Google Gemini        |
| Backend        | Node.js + Express (`server.mjs`) |
| Frontend       | HTML, JavaScript (`index.html`) |
| Event Watcher  | `watch-logs.mjs`              |
| Agent CLI      | `logAgent.js`                |

---

## 📦 Folder Structure

