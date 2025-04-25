const { Client, GatewayIntentBits, Permissions, MessageReference } = require('discord.js');
const fs = require('fs');
const dotenv = require('dotenv');
const path = require('path');
const express = require('express');

// Load environment variables from root .env file
dotenv.config({ path: path.join(__dirname, '../../../.env') });

// Express server for keeping the bot alive
function keepAlive() {
  const server = express();
  server.all('/', (req, res) => {
    res.send('Bot is running!');
  });
  
  server.listen(3000, () => {
    console.log('Server is ready.');
  });
}

// Create bot instance with intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages
    ]
});

// Load profanity list from JSON file in shared directory
const profanityListPath = path.join(__dirname, '../../../shared/profanity-list.json');
const BAD_WORDS = JSON.parse(fs.readFileSync(profanityListPath, 'utf8')).words;

// Configuration constants from environment variables
const CONFIG = {
    PROFANITY_LIMIT: parseInt(process.env.PROFANITY_LIMIT) || 3
};

// Dictionary to store warning counts
const warningCounts = {};

// Policy responses
const POLICY_RESPONSES = {
    "rules": "Server Rules:\n1. No inappropriate language\n2. Be respectful to others\n3. 3 warnings will result in a ban",
    "warning": "Warning System:\n- Bad words = automatic warning\n- 3 warnings = automatic ban\n- Admins can clear warnings",
    "commands": "Available Commands:\n!warnings - Check warning count\n!clearwarnings - Reset warnings (admin only)\n!warn - Warn a user (mod only)\n!ban - Ban a user (admin only)",
    "help": "You can ask me about:\n- rules\n- warning system\n- commands\n- policies",
    "policies": "Chat Policies:\n1. Messages are monitored for bad words\n2. Warning system is automated\n3. Moderators can issue manual warnings\n4. Administrators can clear warnings"
};

// Check if a message contains bad words
function containsBadWords(content) {
    const lowerContent = content.toLowerCase();
    return BAD_WORDS.some(word => lowerContent.includes(word.toLowerCase()));
}

// Process commands
async function processCommand(message) {
    if (!message.content.startsWith('!')) return false;

    const args = message.content.slice(1).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    switch (command) {
        case 'warnings':
            await handleWarningsCommand(message, args);
            return true;
        case 'clearwarnings':
            await handleClearWarningsCommand(message, args);
            return true;
        case 'warn':
            await handleWarnCommand(message, args);
            return true;
        case 'ban':
            await handleBanCommand(message, args);
            return true;
        default:
            return false;
    }
}

// Handle warnings command
async function handleWarningsCommand(message, args) {
    let member = message.mentions.members.first() || message.member;
    const userId = member.id;
    const count = warningCounts[userId] || 0;
    await message.channel.send(`${member} has ${count} warning(s).`);
}

// Handle clearwarnings command
async function handleClearWarningsCommand(message, args) {
    if (!message.member.permissions.has('ADMINISTRATOR')) {
        await message.channel.send('You need administrator permissions to use this command.');
        return;
    }

    const member = message.mentions.members.first();
    if (!member) {
        await message.channel.send('Please mention a user to clear warnings for.');
        return;
    }

    const userId = member.id;
    if (userId in warningCounts) {
        warningCounts[userId] = 0;
        await message.channel.send(`Warnings cleared for ${member}`);
    } else {
        await message.channel.send(`${member} has no warnings to clear.`);
    }
}

// Handle warn command
async function handleWarnCommand(message, args) {
    if (!message.member.permissions.has('KICK_MEMBERS')) {
        await message.channel.send('You need kick permissions to use this command.');
        return;
    }

    const member = message.mentions.members.first();
    if (!member) {
        await message.channel.send('Please mention a user to warn.');
        return;
    }

    const reason = args.slice(1).join(' ') || 'No reason provided';
    await message.channel.send(`${member} has been warned by ${message.author}!\nReason: ${reason}`);
}

// Handle ban command
async function handleBanCommand(message, args) {
    if (!message.member.permissions.has('BAN_MEMBERS')) {
        await message.channel.send('You need ban permissions to use this command.');
        return;
    }

    const member = message.mentions.members.first();
    if (!member) {
        await message.channel.send('Please mention a user to ban.');
        return;
    }

    const reason = args.slice(1).join(' ') || 'No reason provided';
    try {
        await member.ban({ reason });
        await message.channel.send(`${member} has been banned by ${message.author}!`);
    } catch (error) {
        console.error(`Error banning user: ${error}`);
        await message.channel.send('Failed to ban user. Make sure I have the necessary permissions.');
    }
}

// Check if bot has already replied to a message
async function hasAlreadyReplied(channel, message) {
    const messages = await channel.messages.fetch({ limit: 20 });
    return messages.some(reply =>
        reply.author.id === client.user.id &&
        ((reply.reference && reply.reference.messageId === message.id) ||
            (reply.content.includes(message.author.toString()) && reply.createdTimestamp > message.createdTimestamp))
    );
}

// Handle message event
client.on('messageCreate', async message => {
    // Ignore messages from the bot itself
    if (message.author.bot) return;

    // Handle DMs
    if (message.channel.type === 'DM') {
        try {
            const alreadyReplied = await hasAlreadyReplied(message.channel, message);
            if (!alreadyReplied) {
                const content = message.content.toLowerCase();
                let response = "Type help to learn what you can ask about!";

                for (const key in POLICY_RESPONSES) {
                    if (content.includes(key)) {
                        response = POLICY_RESPONSES[key];
                        break;
                    }
                }

                await message.reply(response);
            }
        } catch (error) {
            console.error(`Error handling DM: ${error}`);
        }
        return;
    }

    // Check if bot is mentioned
    if (message.mentions.has(client.user)) {
        try {
            const alreadyReplied = await hasAlreadyReplied(message.channel, message);
            if (!alreadyReplied) {
                const content = message.content.toLowerCase();
                let response = "Type help to learn what you can ask about!";

                for (const key in POLICY_RESPONSES) {
                    if (content.includes(key)) {
                        response = POLICY_RESPONSES[key];
                        break;
                    }
                }

                await message.reply(response);
            }
        } catch (error) {
            console.error(`Error handling mention: ${error}`);
        }
        return;
    }

    // Process commands
    const isCommand = await processCommand(message);
    if (isCommand) return;

    // Check for bad words
    try {
        if (containsBadWords(message.content)) {
            await message.delete();

            // Update warning count
            const userId = message.author.id;
            warningCounts[userId] = (warningCounts[userId] || 0) + 1;

            if (warningCounts[userId] > CONFIG.PROFANITY_LIMIT) {
                try {
                    await message.member.ban({ reason: `Exceeded maximum warnings (${CONFIG.PROFANITY_LIMIT})` });
                    await message.channel.send(`${message.author} has been banned for exceeding ${CONFIG.PROFANITY_LIMIT} warnings!`);
                } catch (error) {
                    console.error(`Failed to ban user: ${error}`);
                }
            } else {
                await message.channel.send(`${message.author}, please watch your language! Warning ${warningCounts[userId]}/${CONFIG.PROFANITY_LIMIT}`);
            }
        }
    } catch (error) {
        console.error(`Error processing message: ${error}`);
    }
});

// Handle ready event
client.once('ready', async () => {
    console.log(`${client.user.tag} has connected to Discord!`);
    console.log(`Bot is in ${client.guilds.cache.size} servers`);
    console.log('Checking message history...');

    // Track processed message IDs to avoid duplicates
    const processedMessages = new Set();

    // Check DM channels
    client.users.cache.forEach(async (user) => {
        if (user.bot) return;

        try {
            const dmChannel = await user.createDM();
            const messages = await dmChannel.messages.fetch({ limit: 100 });

            for (const [_, message] of messages) {
                if (message.author.bot || processedMessages.has(message.id)) continue;

                processedMessages.add(message.id);

                // Check for existing replies
                const alreadyReplied = await hasAlreadyReplied(dmChannel, message);

                if (!alreadyReplied) {
                    const content = message.content.toLowerCase();
                    let response = "Type help to learn what you can ask about!";

                    for (const key in POLICY_RESPONSES) {
                        if (content.includes(key)) {
                            response = POLICY_RESPONSES[key];
                            break;
                        }
                    }

                    await message.reply(response);
                }
            }
        } catch (error) {
            console.error(`Error checking DM channel: ${error}`);
        }
    });

    // Check guild channels
    client.guilds.cache.forEach(async (guild) => {
        guild.channels.cache.filter(channel => channel.type === 'GUILD_TEXT').forEach(async (channel) => {
            try {
                const messages = await channel.messages.fetch({ limit: 100 });

                for (const [_, message] of messages) {
                    if (message.author.bot || processedMessages.has(message.id)) continue;

                    processedMessages.add(message.id);

                    // Check for commands
                    if (message.content.startsWith('!')) {
                        const alreadyReplied = await hasAlreadyReplied(channel, message);

                        if (!alreadyReplied) {
                            await processCommand(message);
                        }
                    }

                    // Check for mentions
                    else if (message.mentions.has(client.user)) {
                        const alreadyReplied = await hasAlreadyReplied(channel, message);

                        if (!alreadyReplied) {
                            const content = message.content.toLowerCase();
                            let response = "Type help to learn what you can ask about!";

                            for (const key in POLICY_RESPONSES) {
                                if (content.includes(key)) {
                                    response = POLICY_RESPONSES[key];
                                    break;
                                }
                            }

                            await message.reply(response);
                        }
                    }

                    // Check for bad words
                    if (containsBadWords(message.content)) {
                        const userId = message.author.id;
                        warningCounts[userId] = (warningCounts[userId] || 0) + 1;

                        if (warningCounts[userId] > CONFIG.PROFANITY_LIMIT) {
                            try {
                                await message.member.ban({ reason: `Exceeded maximum warnings (${CONFIG.PROFANITY_LIMIT})` });
                                await channel.send(`${message.author} has been banned for exceeding ${CONFIG.PROFANITY_LIMIT} warnings!`);
                            } catch (error) {
                                console.error(`Cannot ban user in ${guild.name}: ${error}`);
                            }
                        }

                        await message.delete();
                    }
                }
            } catch (error) {
                console.error(`Error checking channel ${channel.name}: ${error}`);
            }
        });
    });

    console.log('Finished checking message history!');
    console.log('------');
});

// Handle guild join event
client.on('guildCreate', async guild => {
    console.log(`Joined new server: ${guild.name}`);
    console.log('Checking message history...');

    guild.channels.cache.filter(channel => channel.type === 'GUILD_TEXT').forEach(async (channel) => {
        try {
            const messages = await channel.messages.fetch({ limit: 1000 });

            for (const [_, message] of messages) {
                if (message.author.bot) continue;

                if (containsBadWords(message.content)) {
                    const userId = message.author.id;
                    warningCounts[userId] = (warningCounts[userId] || 0) + 1;
                    await message.delete();
                }
            }
        } catch (error) {
            console.error(`Cannot access channel: ${channel.name}`);
        }
    });

    console.log('Finished checking new server history!');
});

// Error handling
client.on('error', error => {
    console.error('Discord client error:', error);
});

// Start the bot
keepAlive();
client.login(process.env.DISCORD_TOKEN);