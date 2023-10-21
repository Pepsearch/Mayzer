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
    const apiUrl = 'https://gpt4free.dotm38.repl.co/backend-api/v2/conversation';

    await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'content-type': "application/json",
            "accept": "text/event-stream"
        },
        body: JSON.stringify({
                conversation_id: "",
                action: "_ask",
                model: "gpt-3.5-turbo",
                jailbreak: "default",
                provider: "g4f.Provider.Auto",

                meta: {
                    id: "7292269700039164921",
                    content: {
                        conversation: [],
                        internet_access: `false`,
                        content_type: "text",
                        parts: [
                            {
                                content: userMessage,
                                role: "user"
                            }
                        ]
                    }
                }
            })
        })
    .then(await new Promise(r => setTimeout(r, 10000)))
    .then(async response => {
        var botResponse
        const stream = response.body;
        const reader = stream.getReader();
        console.log(response)

        const readChunk = () => {
            // Read a chunk from the reader
            reader.read()
                .then(({
                    value,
                    done
                }) => {
                    // Check if the stream is done
                    if (done) {
                        // Log a message
                        console.log('Stream finished');
                        return;
                    }
                    // Convert the chunk value to a string
                    const chunkString = new TextDecoder().decode(value);
                    botResponse += chunkString
                    // if (chunkString != undefined){
                    //     botResponse += chunkString
                    // }
                    // Read the next chunk
                    readChunk();
                })
                .catch(error => {
                    // Log the error
                    console.error(error);
                });
        };
        await readChunk()
        console.log(botResponse)
        
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
