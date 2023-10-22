const chatContainer = document.getElementById("chat-container");
const chat = document.getElementById("chat");
const userInput = document.getElementById("user-input");

var current_convo = []

function appendUserMessage(message) {
    chat.innerHTML += `<div class="user-message">${message}</div>`;
}

function appendBotMessage(message) {
    chat.innerHTML += `<div class="bot-message">${message}</div>`;
    chat.scrollTop = chat.scrollHeight;
}

function simulateTyping() {
    document.getElementById("user-input").disabled = true;
    chat.innerHTML += `<div class="bot-typing">Mayzer is typing</div>`;
    chat.scrollTop = chat.scrollHeight;
}

function removeTypingIndicator() {
    const typingIndicator = document.querySelector(".bot-typing");
    if (typingIndicator) {
        chat.removeChild(typingIndicator);
        document.getElementById("user-input").disabled = false;
    }
}

async function sendUserMessageToAI(userMessage) {
    const apiUrl = 'https://gpt4free.dotm38.repl.co/custom/api/conversation';
    var botResponse;
    await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'content-type': "application/json",
        },
        body: JSON.stringify({
                model: "gpt-3.5-turbo",
                jailbreak: "Mayzer",
                provider: "g4f.Provider.Geekgpt",
                internet_access: "false",

                content: {
                    conversation: current_convo,
                    prompt: [
                        {
                            role: "user",
                            content: userMessage
                        }
                    ]
                }
            })
        })
    .then(response => {if (response.ok) return response.text()}) // if the response code is 200 then only continue
    .then(async text => {
        if (text) { // if its not 200 then text will be undefined or empty
            botResponse = text
            console.log(text)
            await removeTypingIndicator();
            await appendBotMessage(botResponse);
        }else { // when text is undefined/empty i.e server has error, we just retry the request
            console.log("SERVER ERROR, RETRYING REQUEST")
            await sendUserMessageToAI(userMessage)
            return
        }
    })
    .catch(error => {
        console.error('Error:', error, "\n\n RETRYING REQUEST");
        sendUserMessageToAI(userMessage) // retry
        return
    });

    // Add the new prompt-response to the convo
    await current_convo.push({
        role: "user",
        content: userMessage
    }, {
        role: "assistant",
        content: botResponse
    })
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
