const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs').promises;
const path = require('path');

// Bot configuration
const TOKEN = "8100155424:AAEi70ut0oZCtpHnpAA2XwaHIkSNueqpM1Y";
const ADMIN_CHAT_ID = 1342656052;

// Create bot instance
const bot = new TelegramBot(TOKEN, { polling: true });

// Helper function to read users.json
async function readUsersFile() {
    try {
        const data = await fs.readFile('users.json', 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading users.json:', error);
        return {};
    }
}

// Helper function to write to users.json
async function writeUsersFile(users) {
    try {
        await fs.writeFile('users.json', JSON.stringify(users, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing to users.json:', error);
        return false;
    }
}

// Check if user is admin
function isAdmin(chatId) {
    return chatId === ADMIN_CHAT_ID;
}

// Handle /start command
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    if (!isAdmin(chatId)) {
        bot.sendMessage(chatId, "Access denied.");
        return;
    }
    bot.sendMessage(chatId, "Welcome to GTU Students Admin Bot!\n\nAvailable commands:\n/getpassword nickname - Get user password\n/add nickname password - Add new user\n/delete nickname - Delete user\n/list - List all users");
});

// Handle /getpassword command
bot.onText(/\/getpassword (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    if (!isAdmin(chatId)) {
        bot.sendMessage(chatId, "Access denied.");
        return;
    }

    const nickname = match[1];
    const users = await readUsersFile();

    if (!users[nickname]) {
        bot.sendMessage(chatId, `User "${nickname}" not found.`);
        return;
    }

    bot.sendMessage(chatId, `Password for ${nickname} is: ${users[nickname].password}`);
});

// Handle /add command
bot.onText(/\/add (.+) (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    if (!isAdmin(chatId)) {
        bot.sendMessage(chatId, "Access denied.");
        return;
    }

    const nickname = match[1];
    const password = match[2];
    const users = await readUsersFile();

    if (users[nickname]) {
        bot.sendMessage(chatId, `User "${nickname}" already exists.`);
        return;
    }

    users[nickname] = { password };
    const success = await writeUsersFile(users);

    if (success) {
        bot.sendMessage(chatId, `User "${nickname}" added successfully.`);
    } else {
        bot.sendMessage(chatId, "Failed to add user. Please try again.");
    }
});

// Handle /delete command
bot.onText(/\/delete (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    if (!isAdmin(chatId)) {
        bot.sendMessage(chatId, "Access denied.");
        return;
    }

    const nickname = match[1];
    const users = await readUsersFile();

    if (!users[nickname]) {
        bot.sendMessage(chatId, `User "${nickname}" not found.`);
        return;
    }

    delete users[nickname];
    const success = await writeUsersFile(users);

    if (success) {
        bot.sendMessage(chatId, `User "${nickname}" deleted successfully.`);
    } else {
        bot.sendMessage(chatId, "Failed to delete user. Please try again.");
    }
});

// Handle /list command
bot.onText(/\/list/, async (msg) => {
    const chatId = msg.chat.id;
    if (!isAdmin(chatId)) {
        bot.sendMessage(chatId, "Access denied.");
        return;
    }

    const users = await readUsersFile();
    const userList = Object.keys(users).join('\n');

    if (userList) {
        bot.sendMessage(chatId, `Registered users:\n${userList}`);
    } else {
        bot.sendMessage(chatId, "No users registered yet.");
    }
});

// Handle unknown commands
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    if (!isAdmin(chatId)) {
        bot.sendMessage(chatId, "Access denied.");
        return;
    }

    if (msg.text && msg.text.startsWith('/')) {
        bot.sendMessage(chatId, "Unknown command. Use /start to see available commands.");
    }
});

console.log('Telegram bot is running...'); 