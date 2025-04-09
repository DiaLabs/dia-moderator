# 🛡️ Dia Moderator

Say goodbye to chaos and hello to peace ✌️ in your chat servers!

This bot is your all-in-one moderator for **Discord**, **Telegram**, and **WhatsApp**. It detects bad language, issues warnings, and can even ban repeat offenders. Plus, it's smart enough to talk to users about your community rules like a real mod should!

---

## ✨ Features

- 🚨 **Profanity Filter**: Automatically deletes messages with bad words.
- ⚠️ **Warning System**: Users get warned. 3 strikes? They’re out.
- 🛠️ **Admin Commands**: `!warn`, `!ban`, `!clearwarnings` – you’re in control.
- 💬 **DM Help Assistant**: Users can DM the bot to ask about rules or policies.
- 📚 **Policy Autoresponder**: Responds to mentions with your custom server policies.
- 📖 **Message History Checker**: Monitors and moderates even old messages.

---

## 🛠️ Setup Instructions

### 1. Clone this repo

```bash
git clone https://github.com/your-username/dia-moderator.git
cd dia-moderator
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment setup

Create a `.env` file with your Discord token:

```
DISCORD_TOKEN=your-bot-token-here
```

Also, add a `profanity-list.json` file with an array of words to flag:

```json
["badword1", "badword2", "anotherbadword"]
```

### 4. Run the bot

```bash
node index.js
```

---

## 🤖 Commands

| Command             | Description                             |
|---------------------|-----------------------------------------|
| `!warnings`         | Show warning count for a user           |
| `!clearwarnings`    | Reset a user’s warnings (admin only)    |
| `!warn @user [reason]` | Manually warn a user                 |
| `!ban @user [reason]`  | Ban a user (admin only)              |

---

## 🧠 Chat Triggers

Mention the bot or DM with keywords like:

- `rules` → get server rules
- `commands` → list bot commands
- `warning` → learn about the warning system
- `help` → get help info
- `policies` → see moderation policies

---

## 📦 Supported Platforms

| Platform  | Status     |
|-----------|------------|
| Discord   | ✅ Supported |
| Telegram  | ✅ Supported |
| WhatsApp  | ✅ Supported |

---

## 📄 License

GNU Public License V3 — see [LICENSE](LICENSE) for details.

---

## 💡 Future Plans

- Multi-language support 🌍
- Dashboard for managing warnings 💻
- AI-enhanced moderation 🤖

---

## 👋 Contribute

Pull requests and suggestions welcome! Let's make the internet a nicer place together.

---

> Made with ❤️ and a tiny bit of rage at spammy users.
---
> Itesh Singh Tomar - 12320263
---
> Dhruv Sen - 12318540
---
> Aditya Kumar Anupam - 12320585
