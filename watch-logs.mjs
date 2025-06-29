// watch-logs.mjs
import { ethers } from "ethers";
import fs from "fs";
import dotenv from "dotenv";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fetch from "node-fetch";

// Load environment variables from .env file
dotenv.config();

// Load contract ABI
const abi = JSON.parse(fs.readFileSync("./artifacts/contracts/Logger.sol/Logger.json", "utf8")).abi;

// Connect to Hardhat local node
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

// Your deployed Logger contract address
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

// Initialize the contract
const contract = new ethers.Contract(contractAddress, abi, provider);

// Initialize OpenAI and Gemini
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

console.log("🔍 Listening for LogMessage events...\n");

// Event listener
contract.on("LogMessage", async (message) => {
  console.log(`📩 Event received: ${message}\n`);
  const aiResults = await analyzeWithAI(message);

  // Send to frontend server
  try {
    await fetch("http://localhost:3000/api/logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        openai: aiResults.openai,
        gemini: aiResults.gemini,
        timestamp: Date.now()
      }),
    });
    console.log("📤 Sent log to frontend.\n");
  } catch (err) {
    console.error("❌ Error sending to frontend:", err.message);
  }
});

// Function to run both AIs
async function analyzeWithAI(message) {
  console.log("🤖 Analyzing message with OpenAI and Gemini...\n");

  let openaiResponse = "🧪 Mock OpenAI: This log represents a smart contract event triggered with a message.";
  let geminiResponse = "🧪 Mock Gemini: A smart contract emitted this message as part of an event.";

  // --- OpenAI ---
  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Explain this smart contract log in simple terms: "${message}"`,
        },
      ],
    });

    openaiResponse = chatCompletion.choices[0].message.content;
    console.log("✅ OpenAI says:\n", openaiResponse, "\n");
  } catch (error) {
    console.error("❌ OpenAI Error:", error?.message || error);
    console.log(openaiResponse + "\n");
  }

  console.log("-----------------------------\n");

  // --- Gemini ---
  try {
    const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-pro" });
    const result = await model.generateContent(
      `Explain this smart contract log in simple language: "${message}"`
    );
    geminiResponse = await result.response.text();
    console.log("✅ Gemini says:\n", geminiResponse, "\n");
  } catch (error) {
    console.error("❌ Gemini Error:", error?.message || error);
    console.log(geminiResponse + "\n");
  }

  console.log("🎯 Done analyzing.\n");

  return { openai: openaiResponse, gemini: geminiResponse };
}
