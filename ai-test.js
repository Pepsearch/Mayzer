const chatContainer = document.getElementById("chat-container");
const chat = document.getElementById("chat");
const userInput = document.getElementById("user-input");

const apiKey = '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'; // Replace with your actual API key

function appendUserMessage(message) {
    chat.innerHTML += `<div class="user-message">${message}</div>`;
}

function appendBotMessage(message) {
    chat.innerHTML += `<div class="bot-message">${message}</div>`;
    chat.scrollTop = chat.scrollHeight;
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

function sendUserMessageToGPT3(userMessage) {
    const apiUrl = 'https://free.churchless.tech/v1/chat/completions';

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            prompt: userMessage,
            max_tokens: 50, // Adjust max_tokens as needed
            n: 1 // Number of responses to generate
        })
    })
    .then(response => response.json())
    .then(data => {
        const botResponse = data.choices[0].text;
        removeTypingIndicator();
        appendBotMessage(botResponse);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

userInput.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        const userMessage = userInput.value;
        appendUserMessage(userMessage);
        userInput.value = "";

        // Simulate typing before bot response
        simulateTyping();

        // Send the user message to GPT-3.5
        sendUserMessageToGPT3(userMessage);
    }
});
