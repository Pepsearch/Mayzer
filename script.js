const chatContainer = document.getElementById("chat-container");
const chat = document.getElementById("chat");
const userInput = document.getElementById("user-input");

const botResponses = {
    "hello": "Hello there!",
    "how are you": "I'm just a chatbot, but I'm here to help!",
    "name": "I'm just a bot, but you can call me Mayzer!",
    "bye": "Goodbye! Have a great day!",
    "help": "I can assist you with information or answer questions. Just ask!",
    "thanks": "You're welcome!",
    "default": "I'm not sure how to respond to that.",
};

function appendUserMessage(message) {
    chat.innerHTML += `<div class="user-message">${message}</div>`;
}

function appendBotMessage(message) {
    chat.innerHTML += `<div class="bot-message">${message}</div>`;
}

function simulateTyping() {
    chat.innerHTML += `<div class="bot-typing">Mayzer is typing</div>`;
    chat.scrollTop = chat.scrollHeight;
}

function removeTypingIndicator() {
    const typingIndicator = document.querySelector(".bot-typing");
    if (typingIndicator) {
        chat.removeChild(typingIndicator);
    }
}

userInput.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        const userMessage = userInput.value;
        appendUserMessage(userMessage);
        userInput.value = "";

        // Simulate typing before bot response
        simulateTyping();

        // Simulate a slight delay in the bot's response
        setTimeout(() => {
            removeTypingIndicator();

            // Convert user input to lowercase for case insensitivity
            const userMessageLower = userMessage.toLowerCase();

            // Iterate through keywords in a case-insensitive manner
            let botResponse = botResponses["default"];
            for (const keyword in botResponses) {
                if (userMessageLower.includes(keyword)) {
                    botResponse = botResponses[keyword];
                    break;
                }
            }

            appendBotMessage(botResponse);
            chat.scrollTop = chat.scrollHeight;
        }, 1000); // Adjust the delay time as needed (1 second in this example)
    }
});
