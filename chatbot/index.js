
import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

// Replace with your Gemini API Key
const API_KEY =process.env.API_KEY;

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash"
});

async function sendMessage() {

  try {

    const input = document.getElementById("userInput");

    const message = input.value.trim();

    // Prevent empty message
    if (message === "") {
      return;
    }

    const chatBox = document.getElementById("chatBox");

    // User Message
    const userDiv = document.createElement("div");

    userDiv.classList.add("message", "user");

    userDiv.innerText = message;

    chatBox.appendChild(userDiv);

    // Clear input field
    input.value = "";

    // Auto scroll
    chatBox.scrollTop = chatBox.scrollHeight;

    // Loading message
    const botDiv = document.createElement("div");

    botDiv.classList.add("message", "bot");

    botDiv.innerText = "Typing...";

    chatBox.appendChild(botDiv);

    chatBox.scrollTop = chatBox.scrollHeight;

    // Send message to Gemini
    const result = await model.generateContent(message);

    const response = await result.response;

    const text = response.text();

    // Replace loading text
    botDiv.innerText = text;

    // Auto scroll
    chatBox.scrollTop = chatBox.scrollHeight;

  }

  catch (error) {

    console.log(error);

    const chatBox = document.getElementById("chatBox");

    const errorDiv = document.createElement("div");

    errorDiv.classList.add("message", "bot");

    errorDiv.innerText = "Error: Something went wrong.";

    chatBox.appendChild(errorDiv);

  }

}

// Allow Enter key
document
  .getElementById("userInput")
  .addEventListener("keypress", function (event) {

    if (event.key === "Enter") {
      sendMessage();
    }

  });

// Make function global for button
window.sendMessage = sendMessage;

