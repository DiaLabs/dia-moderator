// Bot services for interacting with the backend server
import { API_BASE_URL } from '../config';

// Store bot states
export const botStates = {
  discord: { running: false, outputs: [] },
  whatsapp: { running: false, outputs: [], qrCode: null, qrCodeImage: null },
  telegram: { running: false, outputs: [] }
};

// Utility function to fetch from API
const fetchAPI = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API fetch error: ${error.message}`);
    throw error;
  }
};

// Function to check bot status
export const checkBotStatus = async () => {
  try {
    const data = await fetchAPI('/status');
    botStates.discord.running = data.discord;
    botStates.whatsapp.running = data.whatsapp;
    botStates.telegram.running = data.telegram;
    return data;
  } catch (error) {
    console.error('Error checking bot status:', error);
    return {
      discord: false,
      whatsapp: false,
      telegram: false
    };
  }
};

// Function to run Discord bot
export const runDiscordBot = async () => {
  try {
    await fetchAPI('/discord/start', { method: 'POST' });
    botStates.discord.running = true;
    return true;
  } catch (error) {
    console.error('Error starting Discord bot:', error);
    return false;
  }
};

// Function to stop Discord bot
export const stopDiscordBot = async () => {
  try {
    await fetchAPI('/discord/stop', { method: 'POST' });
    botStates.discord.running = false;
    return true;
  } catch (error) {
    console.error('Error stopping Discord bot:', error);
    return false;
  }
};

// Function to get Discord bot output
export const getDiscordBotOutput = async () => {
  try {
    const data = await fetchAPI('/discord/output');
    botStates.discord.outputs = data.output;
    return data.output;
  } catch (error) {
    console.error('Error getting Discord bot output:', error);
    return botStates.discord.outputs;
  }
};

// Function to run WhatsApp bot
export const runWhatsAppBot = async () => {
  try {
    await fetchAPI('/whatsapp/start', { method: 'POST' });
    botStates.whatsapp.running = true;
    return true;
  } catch (error) {
    console.error('Error starting WhatsApp bot:', error);
    return false;
  }
};

// Function to stop WhatsApp bot
export const stopWhatsAppBot = async () => {
  try {
    await fetchAPI('/whatsapp/stop', { method: 'POST' });
    botStates.whatsapp.running = false;
    botStates.whatsapp.qrCode = null;
    botStates.whatsapp.qrCodeImage = null;
    return true;
  } catch (error) {
    console.error('Error stopping WhatsApp bot:', error);
    return false;
  }
};

// Function to get WhatsApp bot output
export const getWhatsAppBotOutput = async () => {
  try {
    const data = await fetchAPI('/whatsapp/output');
    botStates.whatsapp.outputs = data.output;
    return data.output;
  } catch (error) {
    console.error('Error getting WhatsApp bot output:', error);
    return botStates.whatsapp.outputs;
  }
};

// Function to get WhatsApp QR code
export const getWhatsAppQRCode = async () => {
  try {
    const data = await fetchAPI('/whatsapp/qrcode');
    
    if (data && data.qrcode) {
      // Store the raw QR code string and image
      botStates.whatsapp.qrCode = data.qrcode;
      botStates.whatsapp.qrCodeImage = data.qrcodeImage;
      return { 
        text: data.qrcode,
        image: data.qrcodeImage 
      };
    }
    return { text: null, image: null };
  } catch (error) {
    console.error('Error getting WhatsApp QR code:', error);
    return { 
      text: botStates.whatsapp.qrCode,
      image: botStates.whatsapp.qrCodeImage 
    };
  }
};

// Function to regenerate WhatsApp QR code
export const regenerateWhatsAppQRCode = async () => {
  try {
    const data = await fetchAPI('/whatsapp/regenerate-qr', {
      method: 'POST'
    });
    return data;
  } catch (error) {
    console.error('Error regenerating WhatsApp QR code:', error);
    throw error;
  }
};

// Function to run Telegram bot
export const runTelegramBot = async () => {
  try {
    await fetchAPI('/telegram/start', { method: 'POST' });
    botStates.telegram.running = true;
    return true;
  } catch (error) {
    console.error('Error starting Telegram bot:', error);
    return false;
  }
};

// Function to stop Telegram bot
export const stopTelegramBot = async () => {
  try {
    await fetchAPI('/telegram/stop', { method: 'POST' });
    botStates.telegram.running = false;
    return true;
  } catch (error) {
    console.error('Error stopping Telegram bot:', error);
    return false;
  }
};

// Function to get Telegram bot output
export const getTelegramBotOutput = async () => {
  try {
    const data = await fetchAPI('/telegram/output');
    botStates.telegram.outputs = data.output;
    return data.output;
  } catch (error) {
    console.error('Error getting Telegram bot output:', error);
    return botStates.telegram.outputs;
  }
};

// Function to check if a bot is running
export const isBotRunning = (botType) => {
  return botStates[botType]?.running || false;
};

// Initialize by checking status on load
checkBotStatus().catch(console.error);