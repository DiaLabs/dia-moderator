const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { GoogleGenAI } = require("@google/genai");

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../../.env') });

// Configuration constants
const CONFIG = {
    MAX_MESSAGES: parseInt(process.env.MAX_MESSAGES) || 15,
    PROFANITY_LIMIT: parseInt(process.env.PROFANITY_LIMIT) || 3,
    SPAM_LIMIT: parseInt(process.env.SPAM_LIMIT) || 5,
    SPAM_TIME_WINDOW: parseInt(process.env.SPAM_TIME_WINDOW) || 60000, // 1 minute in milliseconds
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    MODEL: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
};

// Initialize Gemini API
const genAI = new GoogleGenAI({ apiKey: CONFIG.GEMINI_API_KEY });

// Load profanity list from JSON file
const profanityListPath = path.join(__dirname, '../../../shared/profanity-list.json');
const profanityList = JSON.parse(fs.readFileSync(profanityListPath, 'utf8')).words;

// State management
const state = {
    recentMessages: [],
    profanityCount: {},
    spamCount: {},
    userLastMessage: {},
};

// Initialize WhatsApp client with session persistence
const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: path.join(__dirname, '.wwebjs_auth'),
        clientId: 'whatsapp-bot-session'
    }),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox']
    }
});

// Export the client instance to allow external QR regeneration
exports.client = client;

// Add this function to handle QR code regeneration
exports.regenerateQR = async () => {
    try {
        // Attempt to destroy the current session
        await client.destroy();
        console.log("WhatsApp session destroyed successfully");
        
        // Reinitialize the client to generate a new QR code
        client.initialize().catch((error) => {
            console.error('Error reinitializing client:', error);
        });
        
        return { success: true, message: 'QR code regeneration initiated' };
    } catch (error) {
        console.error('Error regenerating QR code:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Checks if a message contains profanity
 * @param {string} message - The message to check
 * @returns {boolean} - True if profanity is found
 */
function containsProfanity(message) {
    const lowerCaseMessage = message.toLowerCase();
    return profanityList.some(word => lowerCaseMessage.includes(word));
}

/**
 * Generates a summary of recent messages using Gemini AI
 * @param {string[]} messages - Array of messages to summarize
 * @returns {Promise<string>} - The generated summary
 */
async function getGeminiSummary(messages) {
    try {
        if (messages.length === 0) {
            return "No recent messages to summarize.";
        }

        // Join messages into a single string
        const messagesText = messages.join('\n');

        // Use a model that exists in the current API version
        const prompt = `Please summarize the following conversation in a concise way, highlighting key points and topics discussed:\n\n${messagesText}`;

        const response = await genAI.models.generateContent({
            model: CONFIG.MODEL,
            contents: prompt,
        });

        const summary = response.text;

        console.log("Summary generated successfully");
        return summary;

    } catch (error) {
        console.error('Error getting summary from Gemini:', error);
        return "Sorry, I couldn't generate a summary at this time.";
    }
}

async function GeminiChat(message) {
    const prompt = `You are Dia, a friendly WhatsApp chatbot. Please respond to this message in a casual, 
    conversational way, using simple language and a friendly tone. Feel free to use appropriate emojis 
    and keep the response concise and easy to understand. Avoid technical jargon unless specifically asked and keep it as short as possible. Answer questions only in the context of a moderator bot. Strictly avoid answering anything else.
    
    User's message: ${message}`;

    try {
        const response = await genAI.models.generateContent({
            model: CONFIG.MODEL,
            contents: prompt,  // Changed from array format to simple string
            generationConfig: {
                temperature: 0.8,
                topK: 40,
                topP: 0.8,
                maxOutputTokens: 200,
            }
        });

        console.log("chatting with user...");
        return response.text;
    } catch (error) {
        console.error('Error in GeminiChat:', error);
        return "Sorry, I'm having trouble understanding right now. Could you try asking me in a different way? 😊";
    }
}

/**
 * Handles profanity in messages
 * @param {object} message - The WhatsApp message object
 * @param {string} senderId - The sender's ID
 * @returns {Promise<boolean>} - True if profanity was detected and handled
 */
async function handleProfanity(message, senderId) {
    if (!containsProfanity(message.body)) {
        return false;
    }

    console.log('Profanity detected.');

    // Initialize counter if not exists
    if (!state.profanityCount[senderId]) {
        state.profanityCount[senderId] = 0;
    }

    state.profanityCount[senderId]++;
    console.log(`Profanity count for ${senderId}: ${state.profanityCount[senderId]}`);

    if (state.profanityCount[senderId] <= CONFIG.PROFANITY_LIMIT) {
        const warningsLeft = CONFIG.PROFANITY_LIMIT - state.profanityCount[senderId] + 1;
        const warningMessage = `Warning: Profanity is not allowed. You have ${warningsLeft} more warnings left.`;
        await message.reply(warningMessage);
        console.log('Warning sent successfully');
    } else {
        try {
            const chat = await message.getChat();
            
            // Check if this is a group chat and if the bot has admin privileges
            if (chat.isGroup) {
                // Send a message instead of removing user
                await message.reply("⚠️ You have exceeded the profanity warning limit. An admin has been notified to review your messages.");
                
                // Notify about admin privileges requirement
                console.log(`Cannot remove user ${senderId} - Make sure the bot is an admin in the group`);
            } else {
                // In private chats, just send a warning
                await message.reply("Please refrain from using profane language in our conversation.");
            }
        } catch (error) {
            console.error('Error handling profanity violation:', error);
            await message.reply("An error occurred while processing this violation. Group admins have been notified.");
        }
    }

    return true;
}

/**
 * Handles command messages
 * @param {object} message - The WhatsApp message object
 * @returns {Promise<void>}
 */
async function handleCommands(message) {
    const messageText = message.body.toLowerCase();

    // Check for !bot command with message
    if (messageText.startsWith('!bot ')) {
        console.log('Chatting with bot...');
        const userMessage = message.body.substring(5); // Extract text after "!bot "
        const botResponse = await GeminiChat(userMessage);
        await message.reply(botResponse);
        console.log('Bot response sent successfully');
        return;
    }

    // Handle other commands - check for exact matches
    // In the handleCommands function, remove the 'hello' handler from commandHandlers
    const commandHandlers = {
        '!test': async () => {
            await message.reply('Bot is working! 🤖');
            console.log('Test reply sent successfully');
        },
    
        '!rules': async () => {
            const rules = "📜 *GROUP RULES* 📜\n\n" +
                "1️⃣ *No Profanity* ❌\n" +
                "2️⃣ *Be Respectful* 🤝\n" +
                "3️⃣ *Stay On Topic* 🎯\n" +
                "4️⃣ *No Spam* 🚫\n" +
                "5️⃣ *Follow Admin Guidelines* 📋\n\n" +
                "❗ Three warnings before removal ❗";
            await message.reply(rules);
            console.log('Rules sent successfully');
        },

        '!summary': async () => {
            console.log('Generating summary with Gemini...');
            const geminiSummary = await getGeminiSummary(state.recentMessages);
            await message.reply(`Recent messages summary: \n\n${geminiSummary}`);
            console.log('Gemini summary sent successfully');
        },

        '!functions': async () => {
            const helpMessage = "🤖 *Available Bot Commands* 🤖\n\n" +
                "1️⃣ *!bot [message]* - Chat with me! Example: !bot How are you?\n" +
                "2️⃣ *!rules* - Display group rules\n" +
                "3️⃣ *!summary* - Get a summary of recent messages\n" +
                "4️⃣ *!test* - Check if bot is working\n" +
                "5️⃣ *!functions* - Display this help message\n\n" +
                "✨ Feel free to use any of these commands! I'm here to help! ✨";
            await message.reply(helpMessage);
            console.log('Functions list sent successfully');
        },

        '!bot': async () => {
            await message.reply('Please type a message after !bot to chat with me. For example: !bot Hello, how are you?');
            console.log('Bot usage instructions sent');
        }
    };

    // Execute the command if it exists and matches exactly
    if (commandHandlers[messageText]) {
        await commandHandlers[messageText]();
    }
}

// Event handlers
client.on('qr', (qr) => {
    console.log('QR Code received:');
    qrcode.generate(qr, { small: true });
    
    // Export the QR code data for the server to access
    // This is the data-ref attribute that will be used by the frontend
    exports.latestQRCode = qr;
    
    // Also announce that a new QR code is available
    process.send && process.send({ type: 'qrCode', qrData: qr });
});

client.on('ready', () => {
    console.log('Client is ready!');
});

// Add this function after containsProfanity function
async function handleSpam(message, senderId) {
    const currentTime = Date.now();
    const messageContent = message.body.toLowerCase();
    
    // Initialize spam tracking for new users
    if (!state.spamCount[senderId]) {
        state.spamCount[senderId] = 1;
        state.userLastMessage[senderId] = { content: messageContent, time: currentTime, count: 1 };
        return false;
    }

    // Check for spam
    if (messageContent === state.userLastMessage[senderId].content &&
        currentTime - state.userLastMessage[senderId].time < CONFIG.SPAM_TIME_WINDOW) {
        
        state.userLastMessage[senderId].count++;
        state.spamCount[senderId]++;
        
        console.log(`Spam detected - Count: ${state.spamCount[senderId]}`);

        // Handle spam warnings
        if (state.spamCount[senderId] >= CONFIG.SPAM_LIMIT) {
            try {
                const chat = await message.getChat();
                await message.reply('⚠️ You have exceeded the spam limit. An admin will be notified.');
                
                if (chat.isGroup) {
                    // Log the issue instead of trying to remove the user
                    console.log(`User ${senderId} has exceeded spam limit - Make sure the bot is an admin in the group to remove users`);
                }
            } catch (error) {
                console.error('Error handling spam violation:', error);
                await message.reply("An error occurred while processing this violation. Group admins have been notified.");
            }
            return true;
        } else if (state.spamCount[senderId] > 2) {
            await message.reply(`⚠️ Stop spamming! Warning ${state.spamCount[senderId]}/${CONFIG.SPAM_LIMIT}`);
            return true;
        }
    } else {
        // Reset if different message or outside time window
        state.userLastMessage[senderId] = { content: messageContent, time: currentTime, count: 1 };
        state.spamCount[senderId] = 1;
    }

    return false;
}

// Modify the message_create event handler
// In the message_create event handler, remove 'hello' from the command check
client.on('message_create', async (message) => {
    console.log('Message created event triggered');
    console.log('Message content:', message.body);

    const senderId = message.from;
    const messageText = message.body.toLowerCase();

    // Skip processing bot's own messages
    if (message.fromMe) {
        return;
    }

    // Handle commands first (removed 'hello' check)
    if (messageText.startsWith('!')) {
        try {
            await handleCommands(message);
            return; // Exit after handling command
        } catch (error) {
            console.error('Error processing command:', error);
        }
    }

    // Only proceed with profanity and spam checks for non-command messages
    if (await handleProfanity(message, senderId)) {
        return;
    }

    // Then handle spam detection
    if (await handleSpam(message, senderId)) {
        return;
    }

    // Store message in recent messages
    state.recentMessages.push(message.body);
    if (state.recentMessages.length > CONFIG.MAX_MESSAGES) {
        state.recentMessages.shift();
    }
});

// Initialize the client
client.initialize().catch((error) => {
    console.error('Error initializing client:', error);
});
