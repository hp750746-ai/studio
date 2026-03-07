import { askAI } from "./ai.js";

async function sendMessage() {

  const message = document.getElementById("msg").value;

  const reply = await askAI(message);

  document.getElementById("answer").innerText = reply;

}

window.sendMessage = sendMessage;
