import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // Serves your index.html, JS, CSS
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});


// Path for storing logs
const logFilePath = path.join(__dirname, "logs.json");

// Utility function to read logs from file
const readLogsFromFile = () => {
  try {
    if (fs.existsSync(logFilePath)) {
      const data = fs.readFileSync(logFilePath, "utf8");
      return JSON.parse(data);
    }
    return [];
  } catch (err) {
    console.error("Error reading logs:", err);
    return [];
  }
};

// Utility function to write logs to file
const writeLogsToFile = (logs) => {
  try {
    fs.writeFileSync(logFilePath, JSON.stringify(logs, null, 2));
  } catch (err) {
    console.error("Error writing logs:", err);
  }
};

// In-memory store for logs (initially empty, will be read from file)
let logs = readLogsFromFile();

// POST: Receive logs from logAgent.js
app.post("/api/logs", (req, res) => {
  try {
    const { message, openai, gemini, timestamp } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Missing message" });
    }

    const log = {
      message,
      openai: openai || "No OpenAI response",
      gemini: gemini || "No Gemini response",
      timestamp: timestamp || Date.now(),
    };

    logs.push(log);
    console.log("📥 Log received:", log.message);

    // Write updated logs to file
    writeLogsToFile(logs);

    res.json({ status: "ok" });
  } catch (err) {
    console.error("Error processing log:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET: Return all logs to frontend
app.get("/api/logs", (req, res) => {
  try {
    res.json(logs);
  } catch (err) {
    console.error("Error fetching logs:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET: Return current contract address
app.get("/api/address", (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync("deployed.json", "utf8"));
    res.json({ address: data.address });
  } catch (err) {
    console.error("Error reading contract address:", err);
    res.status(500).json({ error: "Could not load deployed.json" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
