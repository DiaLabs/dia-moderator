# Dia-Moderator

A comprehensive multi-platform content moderation system for Discord, WhatsApp, and Telegram.

/* ![Dia-Moderator]([https://via.placeholder.com/800x400?text=Dia-Moderator](https://cdn.prod.website-files.com/5f9072399b2640f14d6a2bf4/6115b0d6a6d3e95b3145ebe9_1_PyM5eBfN3YXjuZzKgyRa_g.png))

## Features

- **Cross-Platform Support**: Moderate content across Discord, WhatsApp, and Telegram from a single interface
- **Profanity Filtering**: Automatic detection and handling of profane language
- **Spam Protection**: Identify and prevent message flooding and spam
- **Warning System**: Progressive warning system with configurable thresholds
- **AI-Powered Interactions**: Integration with Google's Gemini AI for:
  - Natural language conversations
  - Message summarization
  - Context-aware responses
- **Centralized Dashboard**: Monitor all bots from a clean, intuitive web interface
- **Real-time Updates**: See bot outputs and status changes as they happen
- **QR Code Authentication**: Easy WhatsApp authentication with automatic QR code refreshing

## Project Structure

```
dia-moderator/
├── client/               # React frontend
│   ├── build/            # Production build
│   ├── public/           # Static assets
│   └── src/              # Source files
│       ├── components/   # Reusable components
│       ├── pages/        # Page components
│       ├── services/     # API services
│       └── styles/       # Styling
├── docs/                 # Documentation
├── server/               # Backend server
│   ├── bots/             # Bot implementations
│   │   ├── discord/      # Discord bot
│   │   ├── telegram/     # Telegram bot
│   │   └── whatsapp/     # WhatsApp bot
│   ├── config/           # Configuration
│   └── utils/            # Shared utilities
├── shared/               # Shared resources
│   └── profanity-list.json  # Shared profanity list
└── index.js              # Main entry point
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Discord Developer account (for Discord bot)
- Telegram account (for Telegram bot)
- WhatsApp account on your phone (for WhatsApp bot)
- Gemini API key (for AI features)

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Server Settings
PORT=3001

# Bot Tokens
DISCORD_TOKEN=your_discord_token
TELEGRAM_TOKEN=your_telegram_token

# Bot Settings
PROFANITY_LIMIT=3
MAX_MESSAGES=15
SPAM_LIMIT=5
SPAM_TIME_WINDOW=60000

# AI Integration
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.0-flash
```

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/dia-moderator.git
   cd dia-moderator
   ```

2. Install server dependencies:

   ```bash
   npm install
   ```

3. Install client dependencies:

   ```bash
   cd client
   npm install
   cd ..
   ```

4. Build the client:

   ```bash
   npm run build
   ```

5. Start the application:

   ```bash
   npm start
   ```

## Development

### Server Development

```bash
npm run dev
```

### Client Development

```bash
npm run client
```

### Full Stack Development

To run both server and client concurrently (requires concurrently package):

```bash
npm run dev:full
```

## Bot Setup

### Discord Bot

1. Create a Discord application in the [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a bot for your application
3. Under the "Bot" tab, enable these "Privileged Gateway Intents":
   - Presence Intent
   - Server Members Intent
   - Message Content Intent
4. Copy the bot token and add it to your .env file
5. Generate an OAuth2 URL with the following scopes:
   - bot
   - applications.commands
6. Select the following bot permissions:
   - Manage Messages
   - Read Messages/View Channels
   - Send Messages
   - Kick Members
   - Ban Members
7. Use the generated URL to invite the bot to your server
8. Start the bot through the Dia-Moderator interface

### WhatsApp Bot

1. Start the application
2. Navigate to the Explore Bots page
3. Start the WhatsApp bot
4. Scan the QR code with your WhatsApp app:
   - Open WhatsApp on your phone
   - Tap Menu or Settings
   - Select "WhatsApp Web"
   - Point your phone camera at the QR code
5. The bot is now connected to your WhatsApp account
6. Add the bot to groups or use it in direct messages

### Telegram Bot

1. On Telegram, search for [@BotFather](https://t.me/botfather)
2. Start a chat and send /newbot
3. Follow the instructions to create a new bot
4. Copy the bot token provided by BotFather
5. Add the token to your .env file
6. Start the bot through the Dia-Moderator interface
7. Start a conversation with your bot or add it to groups

## Available Commands

### Discord Bot

- `!warnings` - Check warning count
- `!clearwarnings @user` - Reset warnings (admin only)
- `!warn @user [reason]` - Warn a user (mod only)
- `!ban @user [reason]` - Ban a user (admin only)
- Tag the bot with questions about rules, policies, etc.

### WhatsApp Bot

- `!bot [message]` - Chat with the AI
- `!rules` - Display group rules
- `!summary` - Get a summary of recent messages
- `!test` - Check if bot is working
- `!functions` - Display help message

### Telegram Bot

- `/bot [message]` - Chat with the AI
- `/rules` - Display group rules
- `/summary` - Get a summary of recent messages
- `/test` - Check if bot is working
- `/start` - Get a friendly greeting
- `/functions` - Display help message

## Customization

### Profanity List

Edit `shared/profanity-list.json` to customize the list of words that trigger profanity warnings.

### Bot Messages

Modify response templates in each bot's implementation file:

- Discord: `server/bots/discord/discord_bot.js`
- WhatsApp: `server/bots/whatsapp/whatsapp_bot.js`
- Telegram: `server/bots/telegram/telegram_bot.js`

### UI Customization

The frontend uses styled-components with a theme. Edit `client/src/styles/theme.js` to customize colors, spacing, and other UI elements.

## Troubleshooting

### WhatsApp QR Code Expired

If the QR code expires, click the "Regenerate QR Code" button on the WhatsApp bot page.

### Discord Bot Not Responding

Ensure that you've enabled all required intents in the Discord Developer Portal.

### Telegram Bot Not Starting

Verify that your Telegram token is correct and the bot hasn't been stopped by @BotFather.

### Connection Issues

If you encounter connection problems:

1. Check that all required environment variables are set correctly
2. Ensure your server can make outbound connections to the respective service APIs
3. Check the console output for specific error messages

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Future Enhancements

- Image moderation capabilities
- Voice message moderation
- Analytics dashboard
- More platform integrations (Slack, Microsoft Teams)
- Custom rule creation interface
- Role-based admin panel

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Discord.js](https://discord.js.org/) for Discord API integration
- [whatsapp-web.js](https://wwebjs.dev/) for WhatsApp integration
- [node-telegram-bot-api](https://github.com/yagop/node-telegram-bot-api) for Telegram integration
- [Google Gemini](https://ai.google.dev/) for AI capabilities
