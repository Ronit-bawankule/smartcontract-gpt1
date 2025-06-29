import { GoogleGenerativeAI } from "@google/generative-ai";


const ai = new GoogleGenerativeAI("AIzaSyCjrk1AxniVKZFTarY8FePLRjNGLDkzRGU");

async function main() {
  const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

  const result = await model.generateContent("Hello Gemini! What can you do?");
  const response = await result.response;
  const text = response.text();

  console.log("Gemini says:", text);
}

main();
