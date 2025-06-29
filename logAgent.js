// ===== logAgent.js =====

import "dotenv/config";
import { ethers } from "ethers";
import axios from "axios";
import fs from "fs";

// Load deployed contract address
const { address: contractAddress } = JSON.parse(fs.readFileSync("deployed.json", "utf8"));

// Optional: Print keys loaded (safe for debugging)
console.log("🔑 OpenAI Key Loaded:", process.env.OPENAI_API_KEY?.slice(0, 10) + "...");
console.log("🔑 Gemini Key Loaded:", process.env.GEMINI_API_KEY?.slice(0, 10) + "...");

// Connect to local Hardhat network
const provider = new ethers.JsonRpcProvider("http://localhost:8545");

const abi = [
  {
    anonymous: false,
    inputs: [{ indexed: false, internalType: "string", name: "message", type: "string" }],
    name: "LogMessage",
    type: "event"
  }
];

const contract = new ethers.Contract(contractAddress, abi, provider);
console.log("🧠 logAgent is now listening to", contractAddress);

// Listener
contract.on("LogMessage", async (msg) => {
  console.log("📡 Event received:", msg);

  // Simulated fallback AI responses
  let openaiText = `🧠 Simulated OpenAI response: This message logs a staking event where a user deposited tokens into a pool.`;
  let geminiText = `🌟 Simulated Gemini response: User action indicates a DeFi interaction with Pool 7, possibly staking or liquidity provisioning.`;

  console.log("✅ Using fallback AI responses (API quota exceeded)");
  console.log("🔮 OpenAI:", openaiText);
  console.log("🌟 Gemini:", geminiText);

  try {
    await axios.post("http://localhost:3000/api/logs", {
      message: msg,
      openai: openaiText,
      gemini: geminiText,
      timestamp: Date.now()
    });
    console.log("📤 Log posted to server\n");
  } catch (err) {
    console.log("❌ Failed to post log:", err.message);
  }
});
