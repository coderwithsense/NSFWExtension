document.getElementById("sendButton").addEventListener("click", sendMessage);
document.getElementById("userInput").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    sendMessage();
  }
});

// Add event listener for the "Delete All" button
document
  .getElementById("deleteAllButton")
  .addEventListener("click", deleteAllMessages);

// Load chats from localStorage when the page is loaded
window.addEventListener("load", loadChats);

function sendMessage() {
  const userInput = document.getElementById("userInput");
  const message = userInput.value.trim();
  const apiKey = document.getElementById("apiKeyInput").value.trim();

  if (message === "" || apiKey === "") {
    appendSystemMessage("Please enter a message and set the API key.");
    return;
  }

  const chat = { user: message, bot: "" };
  appendMessage(chat, true);
  saveChat(chat);
  userInput.value = "";

  // Replace with your endpoint
  const apiUrl =
    "https://nsfw-chat-bot-dortroxs-projects.vercel.app/api/message";

  fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${apiKey}`,
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({ message: message }),
  })
    .then((response) => response.json())
    .then((data) => {
      chat.bot = data.response;
      updateChat(chat);
      appendMessage(chat, false);
    })
    .catch((error) => {
      console.error("Error:", error);
      const errorMessage = "Sorry, something went wrong with the API.";
      chat.bot = errorMessage;
      updateChat(chat);
      appendMessage(chat, false);
    });
}

function appendSystemMessage(message) {
  const chatWindow = document.getElementById("chatWindow");
  const messageElement = document.createElement("div");
  messageElement.classList.add(
    "p-2",
    "my-2",
    "rounded",
    "shadow",
    "bg-yellow-200"
  );
  messageElement.innerHTML = `<strong>System:</strong> ${message}`;
  chatWindow.appendChild(messageElement);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function appendMessage(chat, isUser) {
  const chatWindow = document.getElementById("chatWindow");
  const messageElement = document.createElement("div");
  messageElement.classList.add(
    "p-2",
    "my-2",
    "rounded",
    "shadow",
    "flex",
    "justify-between",
    "items-center"
  );
  messageElement.classList.add(isUser ? "bg-blue-100" : "bg-gray-200");

  const messageContent = document.createElement("div");
  messageContent.innerHTML = `<strong>${isUser ? "You" : "Bot"}:</strong> ${
    isUser ? chat.user : chat.bot
  }`;

  const copyButton = document.createElement("button");
  copyButton.classList.add(
    "ml-2",
    "bg-gray-300",
    "text-gray-700",
    "p-1",
    "rounded",
    "hover:bg-gray-400"
  );
  copyButton.innerText = "Copy";
  copyButton.addEventListener("click", () => {
    navigator.clipboard
      .writeText(isUser ? chat.user : chat.bot)
      .then(() => {})
      .catch((err) => {
        console.error("Could not copy text: ", err);
      });
  });

  messageElement.appendChild(messageContent);
  messageElement.appendChild(copyButton);
  chatWindow.appendChild(messageElement);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function saveChat(chat) {
  const chats = JSON.parse(localStorage.getItem("chats")) || [];
  chats.push(chat);
  localStorage.setItem("chats", JSON.stringify(chats));
}

function updateChat(updatedChat) {
  const chats = JSON.parse(localStorage.getItem("chats")) || [];
  const index = chats.findIndex(
    (chat) => chat.user === updatedChat.user && chat.bot === ""
  );
  if (index !== -1) {
    chats[index] = updatedChat;
    localStorage.setItem("chats", JSON.stringify(chats));
  }
}

function loadChats() {
  const chats = JSON.parse(localStorage.getItem("chats")) || [];
  chats.forEach((chat) => {
    appendMessage(chat, true);
    if (chat.bot) {
      appendMessage(chat, false);
    }
  });
}

function deleteMessage(chatToDelete) {
  const chats = JSON.parse(localStorage.getItem("chats")) || [];
  const updatedChats = chats.filter(
    (chat) => chat.user !== chatToDelete.user || chat.bot !== chatToDelete.bot
  );
  localStorage.setItem("chats", JSON.stringify(updatedChats));
  reloadChats();
}

function reloadChats() {
  const chatWindow = document.getElementById("chatWindow");
  chatWindow.innerHTML = "";
  loadChats();
}

function deleteAllMessages() {
  localStorage.removeItem("chats");
  reloadChats();
}
