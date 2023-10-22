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

async function sendUserMessageToAI(userMessage) {
    const apiUrl = 'https://gpt4free.dotm38.repl.co/custom/api/conversation';

    await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'content-type': "application/json",
        },
        body: JSON.stringify({
                model: "gpt-3.5-turbo",
                jailbreak: "default",
                provider: "g4f.Provider.Auto",
                internet_access: "false",

                content: {
                    conversation: [],
                    prompt: [
                        {
                            content: userMessage,
                            role: "user"
                        }
                    ]
                }
            })
        })
    .then(await new Promise(r => setTimeout(r, 5000)))
    .then(response => response.text())
    .then(text => {
        const botResponse = text
        console.log(text)
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