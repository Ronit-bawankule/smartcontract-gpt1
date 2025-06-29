require("dotenv").config();
const OpenAI = require("openai");
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testAI() {
  // 🔷 OpenAI
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openaiResponse = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: "Say a cool fact about Ethereum." }],
  });

  console.log("🔷 OpenAI says:", openaiResponse.choices[0].message.content);

  // 🔶 Gemini
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const result = await model.generateContent("Say a cool fact about Ethereum.");
  const response = await result.response;
  const geminiText = response.text();

  console.log("🔶 Gemini says:", geminiText);
}

testAI();
