const chatContainer = document.getElementById("chat-container");
const chat = document.getElementById("chat");
const userInput = document.getElementById("user-input");

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

function sendUserMessageToAI(userMessage) {
    const apiUrl = 'https://corsproxy.io/?' + encodeURIComponent('https://gpt4free.paramchosting.repl.co/backend-api/v2/conversation');;

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'content-type': "application/json",
            "accept": "text/event-stream"
        },
        body: {
            "conversation_id": "0f0e8bc2-653b-92f6-c22e-18b508b5db4",
            "action": "_ask",
            "model": "gpt-3.5-turbo",
            "jailbreak": "default",
            "provider": "g4f.Provider.Auto",
            "meta": {
                "id": "7292269700039164921",
                "content": {
                    "conversation": [],
                    "internet_access": false,
                    "content_type": "text",
                    "parts": [
                        {
                            "content": userMessage,
                            "role": "user"
                        }
                    ]
                }
            }
        }
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

        simulateTyping();

        sendUserMessageToAI(userMessage);
    }
});
