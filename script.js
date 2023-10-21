const chatContainer = document.getElementById("chat-container");
const chat = document.getElementById("chat");
const userInput = document.getElementById("user-input");

<<<<<<< HEAD
=======
const botResponses = {
    "hello": "Hello there!",
    "how are you": "I'm just a chatbot, but I'm here to help!",
    "name": "My name is Mayzer. What's yours?",
    "bye": "Goodbye! Have a great day!",
    "help": "I can assist you with information or answer questions. Just ask!",
    "thanks": "You're welcome!",
    "default": "I'm not sure how to respond to that.",
    "test": "I'm still working properly.",
    "gimme a secret": "never gonna give you up, never gonna let you down, never gonna run around and desert you. never gonna make you cry, never gonna say goodbye, never gonna tell a lie and hurt you. Seriously, though, Mayzer is better than GPT (or is it?).",
    "i'm dying": "Unfortunately, I am an AI, and do not have the ability do dial your local emergency number. Hope you get better!",
};

>>>>>>> 0dc3c2f422c71c5f7ddefbdaa73125318cc07d8d
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
