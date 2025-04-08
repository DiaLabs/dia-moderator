const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');
const { GoogleGenAI } = require("@google/genai");

// Configuration constants
const CONFIG = {
    MAX_MESSAGES: 15,
    PROFANITY_LIMIT: 3,
    SPAM_LIMIT: 5,
    SPAM_TIME_WINDOW: 60000,
    TELEGRAM_TOKEN: '7815785628:AAE0BBaeVMEOrHQqmaGDCcZFVxFMFqllWSM',
    GEMINI_API_KEY: 'AIzaSyDsACSu8MTEXfegE5XCZV0sJT3m_nbRo60',
    MODEL: 'gemini-2.0-flash',
};

// Initialize APIs
const bot = new TelegramBot(CONFIG.TELEGRAM_TOKEN, { polling: true });
const genAI = new GoogleGenAI({ apiKey: CONFIG.GEMINI_API_KEY });

// State management (same as WhatsApp bot)
const state = {
    recentMessages: [],
    profanityCount: {},
    spamCount: {},
    userLastMessage: {},
};

// Load profanity list
const profanityListPath = path.join(__dirname, 'profanity-list.json');
const profanityList = JSON.parse(fs.readFileSync(profanityListPath, 'utf8')).words;

// Helper functions (same logic as WhatsApp bot)
function containsProfanity(message) {
    const lowerCaseMessage = message.toLowerCase();
    return profanityList.some(word => lowerCaseMessage.includes(word));
}

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
    and keep the response concise and easy to understand. Avoid technical jargon unless specifically asked and keep it as short as possible.
    
    User's message: ${message}`;

    try {
        const response = await genAI.models.generateContent({
            model: CONFIG.MODEL,
            contents: prompt,  // Changed from array format to direct string
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
            await chat.removeParticipants([senderId]);
            console.log(`User ${senderId} removed from the group due to excessive profanity.`);
        } catch (error) {
            console.error('Error removing user:', error);
        }
    }

    return true;
}

// Handle commands
bot.onText(/\/start/, (msg) => {
    const welcomeMessage = "👋 Hello! I'm Dia, your friendly Telegram bot. Use /functions to see what I can do!";
    bot.sendMessage(msg.chat.id, welcomeMessage);
});

bot.onText(/\/functions/, (msg) => {
    const helpMessage = "🤖 *Available Bot Commands* 🤖\n\n" +
        "1️⃣ */bot [message]* - Chat with me! Example: /bot How are you?\n" +
        "2️⃣ */rules* - Display group rules\n" +
        "3️⃣ */summary* - Get a summary of recent messages\n" +
        "4️⃣ */test* - Check if bot is working\n" +
        "5️⃣ */start* - Get a friendly greeting\n" +
        "6️⃣ */functions* - Display this help message\n\n" +
        "✨ Feel free to use any of these commands! I'm here to help! ✨";
    
    bot.sendMessage(msg.chat.id, helpMessage, { parse_mode: 'Markdown' });
});

bot.onText(/\/rules/, (msg) => {
    const rules = "📜 *GROUP RULES* 📜\n\n" +
        "1️⃣ *No Profanity* ❌\n" +
        "2️⃣ *Be Respectful* 🤝\n" +
        "3️⃣ *Stay On Topic* 🎯\n" +
        "4️⃣ *No Spam* 🚫\n" +
        "5️⃣ *Follow Admin Guidelines* 📋\n\n" +
        "❗ Three warnings before removal ❗";
    
    bot.sendMessage(msg.chat.id, rules, { parse_mode: 'Markdown' });
});

bot.onText(/\/test/, (msg) => {
    bot.sendMessage(msg.chat.id, 'Bot is working! 🤖');
});

bot.onText(/\/summary/, async (msg) => {
    const summary = await getGeminiSummary(state.recentMessages);
    bot.sendMessage(msg.chat.id, `Recent messages summary:\n\n${summary}`);
});

bot.onText(/\/bot (.+)/, async (msg, match) => {
    const userMessage = match[1];
    const response = await GeminiChat(userMessage);
    bot.sendMessage(msg.chat.id, response);
});

// Handle spam and profanity
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const messageText = msg.text || '';

    // Handle profanity
    if (containsProfanity(messageText)) {
        if (!state.profanityCount[userId]) {
            state.profanityCount[userId] = 0;
        }
        state.profanityCount[userId]++;

        if (state.profanityCount[userId] > CONFIG.PROFANITY_LIMIT) {
            try {
                await bot.kickChatMember(chatId, userId);
                bot.sendMessage(chatId, '⚠️ User removed for excessive profanity.');
            } catch (error) {
                console.error('Error removing user:', error);
            }
        } else {
            const warningsLeft = CONFIG.PROFANITY_LIMIT - state.profanityCount[userId] + 1;
            bot.sendMessage(chatId, `⚠️ Warning: Profanity is not allowed. You have ${warningsLeft} warnings left.`);
        }
        return;
    }

    // Handle spam
        // Handle spam
            const now = Date.now();
            if (!state.userLastMessage[userId]) {
                state.userLastMessage[userId] = { text: messageText, time: now, count: 1 };
            } else if (state.userLastMessage[userId].text === messageText && 
                           now - state.userLastMessage[userId].time < CONFIG.SPAM_TIME_WINDOW) {
                        // Increment spam count for repeated messages within time window
                        state.userLastMessage[userId].count++;
                        
                        if (state.userLastMessage[userId].count >= CONFIG.SPAM_LIMIT) {
                            try {
                                await bot.restrictChatMember(chatId, userId, {
                                    can_send_messages: false,
                                    until_date: Math.floor(Date.now() / 1000) + 3600 // 1 hour mute
                                });
                                bot.sendMessage(chatId, '⚠️ User muted for spamming!');
                                return;
                            } catch (error) {
                                console.error('Error muting user:', error);
                            }
                        } else {
                            bot.sendMessage(
                                chatId, 
                                `⚠️ Stop spamming! Warning ${state.userLastMessage[userId].count}/${CONFIG.SPAM_LIMIT}`
                            );
                        }
                    } else {
                        // Reset spam count for different message or outside time window
                        state.userLastMessage[userId] = { text: messageText, time: now, count: 1 };
                    }

    // Store message for summary
    state.recentMessages.push(messageText);
    if (state.recentMessages.length > CONFIG.MAX_MESSAGES) {
        state.recentMessages.shift();
    }
});

// Error handling
bot.on('polling_error', (error) => {
    console.error('Polling error:', error);
});

console.log('Telegram bot is running...');