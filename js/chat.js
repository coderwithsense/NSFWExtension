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
  if (message === "") return;

  appendMessage("You", message);
  saveChat("You", message);
  userInput.value = "";

  // Replace with your endpoint
  const apiUrl = "https://api.example.com/chatbot";

  fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: message }),
  })
    .then((response) => response.json())
    .then((data) => {
      appendMessage("Bot", data.response);
      saveChat("Bot", data.response);
    })
    .catch((error) => {
      console.error("Error:", error);
      const errorMessage = "Sorry, something went wrong with the API.";
      appendMessage("Bot", errorMessage);
      saveChat("Bot", errorMessage);
    });
}

function appendMessage(sender, message, index = null) {
  const chatWindow = document.getElementById("chatWindow");
  const messageElement = document.createElement("div");
  messageElement.classList.add("p-2", "my-2", "rounded", "shadow");
  messageElement.classList.add(
    sender === "You" ? "bg-blue-100" : "bg-gray-200"
  );
  messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;

  // Add delete button
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.classList.add("ml-2", "text-red-500");
  deleteButton.addEventListener("click", () => deleteMessage(index));
  messageElement.appendChild(deleteButton);

  chatWindow.appendChild(messageElement);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function saveChat(sender, message) {
  const chats = JSON.parse(localStorage.getItem("chats")) || [];
  chats.push({ sender, message });
  localStorage.setItem("chats", JSON.stringify(chats));
}

function loadChats() {
  const chats = JSON.parse(localStorage.getItem("chats")) || [];
  chats.forEach((chat, index) => {
    appendMessage(chat.sender, chat.message, index);
  });
}

function deleteMessage(index) {
  const chats = JSON.parse(localStorage.getItem("chats")) || [];
  chats.splice(index, 1);
  localStorage.setItem("chats", JSON.stringify(chats));
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
