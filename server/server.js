// Backend server for running bots locally
const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const path = require('path');
const QRCode = require('qrcode');
const config = require('./config/config');

const app = express();
const PORT = config.server.port;

// Add URL validation middleware before any other middleware
app.use((req, res, next) => {
  // Check if the URL contains problematic patterns that could cause path-to-regexp errors
  if (req.originalUrl.includes('://') || req.url.includes('://')) {
    return res.status(400).send('Invalid URL format: URLs with protocols are not supported');
  }
  next();
});

// Configure middleware
app.use(cors());
app.use(express.json());
app.use(express.static(config.server.clientPath));

// Store bot processes
const botProcesses = {
  discord: null,
  whatsapp: null,
  telegram: null
};

// Store bot outputs
const botOutputs = {
  discord: [],
  whatsapp: [],
  telegram: []
};

// Store WhatsApp QR code - raw data-ref for QR generation
let latestWhatsappQRCode = null;
let latestWhatsappQRCodeImage = null;

// Variable to store the WhatsApp bot module for controlling it
let whatsappBotModule = null;

// API endpoints for bot management
app.get('/api/status', (req, res) => {
  res.json({
    discord: botProcesses.discord !== null,
    whatsapp: botProcesses.whatsapp !== null,
    telegram: botProcesses.telegram !== null
  });
});

// Start Discord bot
app.post('/api/discord/start', (req, res) => {
  if (botProcesses.discord) {
    return res.status(400).json({ error: 'Discord bot is already running' });
  }

  try {
    // Clear previous outputs
    botOutputs.discord = [];
    
    // Spawn new process
    const process = spawn('node', [config.bots.discord.path]);
    botProcesses.discord = process;
    
    // Handle stdout
    process.stdout.on('data', (data) => {
      const output = data.toString();
      botOutputs.discord.push(output);
      console.log(`Discord Bot: ${output}`);
    });
    
    // Handle stderr
    process.stderr.on('data', (data) => {
      const output = data.toString();
      botOutputs.discord.push(`ERROR: ${output}`);
      console.error(`Discord Bot Error: ${output}`);
    });
    
    // Handle process exit
    process.on('close', (code) => {
      if (code !== 0) {
        botOutputs.discord.push(`Process exited with code ${code}`);
        console.log(`Discord bot process exited with code ${code}`);
      }
      botProcesses.discord = null;
    });
    
    res.json({ success: true, message: 'Discord bot started successfully' });
  } catch (error) {
    console.error('Error starting Discord bot:', error);
    res.status(500).json({ error: 'Failed to start Discord bot' });
  }
});

// Stop Discord bot
app.post('/api/discord/stop', (req, res) => {
  if (!botProcesses.discord) {
    return res.status(400).json({ error: 'Discord bot is not running' });
  }

  try {
    botProcesses.discord.kill();
    botProcesses.discord = null;
    botOutputs.discord.push('Discord bot stopped manually');
    res.json({ success: true, message: 'Discord bot stopped successfully' });
  } catch (error) {
    console.error('Error stopping Discord bot:', error);
    res.status(500).json({ error: 'Failed to stop Discord bot' });
  }
});

// Get Discord bot output
app.get('/api/discord/output', (req, res) => {
  res.json({ output: botOutputs.discord });
});

// Start WhatsApp bot
app.post('/api/whatsapp/start', (req, res) => {
  if (botProcesses.whatsapp) {
    return res.status(400).json({ error: 'WhatsApp bot is already running' });
  }

  try {
    // Clear previous outputs and QR code
    botOutputs.whatsapp = [];
    latestWhatsappQRCode = null;
    
    // Spawn new process
    const process = spawn('node', [config.bots.whatsapp.path]);
    botProcesses.whatsapp = process;
    
    // Handle messages from child process
    process.on('message', (message) => {
      if (message.type === 'qrCode') {
        latestWhatsappQRCode = message.qrData;
        console.log('New QR code received from WhatsApp bot process');
      }
    });
    
    // Handle stdout
    process.stdout.on('data', (data) => {
      const output = data.toString();
      botOutputs.whatsapp.push(output);
      console.log(`WhatsApp Bot:\n ${output}`);
      
      // Try to detect QR code data from output if process message mechanism failed
      if (output.includes('QR Code received:')) {
        // Try to find the data-ref from the output
        const match = output.match(/data-ref="([^"]+)"/);
        if (match && match[1]) {
          latestWhatsappQRCode = match[1];
          console.log('QR code data-ref extracted from output');
        } else {
          // Fall back to the entire QR code section if data-ref can't be found
          latestWhatsappQRCode = output;
          console.log('QR code received but data-ref not found, storing raw output');
        }
      }
    });
    
    // Handle stderr
    process.stderr.on('data', (data) => {
      const output = data.toString();
      botOutputs.whatsapp.push(`ERROR: ${output}`);
      console.error(`WhatsApp Bot Error: ${output}`);
    });
    
    // Handle process exit
    process.on('close', (code) => {
      if (code !== 0) {
        botOutputs.whatsapp.push(`Process exited with code ${code}`);
        console.log(`WhatsApp bot process exited with code ${code}`);
      }
      botProcesses.whatsapp = null;
      whatsappBotModule = null;
    });
    
    // Require the WhatsApp bot module to interact with it directly
    whatsappBotModule = require('./bots/whatsapp/whatsapp_bot');
    
    res.json({ success: true, message: 'WhatsApp bot started successfully' });
  } catch (error) {
    console.error('Error starting WhatsApp bot:', error);
    res.status(500).json({ error: 'Failed to start WhatsApp bot' });
  }
});

// Stop WhatsApp bot
app.post('/api/whatsapp/stop', (req, res) => {
  if (!botProcesses.whatsapp) {
    return res.status(400).json({ error: 'WhatsApp bot is not running' });
  }

  try {
    botProcesses.whatsapp.kill();
    botProcesses.whatsapp = null;
    whatsappBotModule = null;
    latestWhatsappQRCode = null;
    botOutputs.whatsapp.push('WhatsApp bot stopped manually');
    res.json({ success: true, message: 'WhatsApp bot stopped successfully' });
  } catch (error) {
    console.error('Error stopping WhatsApp bot:', error);
    res.status(500).json({ error: 'Failed to stop WhatsApp bot' });
  }
});

// Get WhatsApp bot output
app.get('/api/whatsapp/output', (req, res) => {
  res.json({ output: botOutputs.whatsapp });
});

// Get WhatsApp QR code
app.get('/api/whatsapp/qrcode', async (req, res) => {
  if (latestWhatsappQRCode) {
    try {
      // Generate base64 image of QR code if it doesn't exist
      if (!latestWhatsappQRCodeImage) {
        latestWhatsappQRCodeImage = await QRCode.toDataURL(latestWhatsappQRCode);
        // Extract base64 data without the data URL prefix
        latestWhatsappQRCodeImage = latestWhatsappQRCodeImage.split(',')[1];
      }
      
      res.json({ 
        qrcode: latestWhatsappQRCode,
        qrcodeImage: latestWhatsappQRCodeImage,
        hasQRCode: true
      });
    } catch (error) {
      console.error('Error generating QR code image:', error);
      res.json({ 
        qrcode: latestWhatsappQRCode,
        hasQRCode: true
      });
    }
  } else {
    res.json({ 
      qrcode: null,
      qrcodeImage: null,
      hasQRCode: false
    });
  }
});

// Regenerate WhatsApp QR code
app.post('/api/whatsapp/regenerate-qr', async (req, res) => {
  if (!botProcesses.whatsapp) {
    return res.status(400).json({ error: 'WhatsApp bot is not running' });
  }

  try {
    if (!whatsappBotModule) {
      whatsappBotModule = require('./bots/whatsapp/whatsapp_bot');
    }
    
    if (whatsappBotModule.regenerateQR) {
      const result = await whatsappBotModule.regenerateQR();
      if (result.success) {
        // Reset the QR code - a new one will be generated
        latestWhatsappQRCode = null;
        latestWhatsappQRCodeImage = null;
        botOutputs.whatsapp.push('QR code regeneration initiated');
        return res.json({ success: true, message: 'QR code regeneration initiated' });
      } else {
        return res.status(500).json({ error: result.error || 'Failed to regenerate QR code' });
      }
    } else {
      return res.status(500).json({ error: 'regenerateQR function not available in WhatsApp bot module' });
    }
  } catch (error) {
    console.error('Error regenerating QR code:', error);
    res.status(500).json({ error: 'Failed to regenerate QR code: ' + error.message });
  }
});

// Get WhatsApp bot status
app.get('/api/whatsapp/status', (req, res) => {
  const isRunning = !!botProcesses.whatsapp;
  res.json({ 
    isRunning,
    outputs: botOutputs.whatsapp,
    hasQRCode: !!latestWhatsappQRCode
  });
});

// Start Telegram bot
app.post('/api/telegram/start', (req, res) => {
  if (botProcesses.telegram) {
    return res.status(400).json({ error: 'Telegram bot is already running' });
  }

  try {
    // Clear previous outputs
    botOutputs.telegram = [];
    
    // Spawn new process
    const process = spawn('node', [config.bots.telegram.path]);
    botProcesses.telegram = process;
    
    // Handle stdout
    process.stdout.on('data', (data) => {
      const output = data.toString();
      botOutputs.telegram.push(output);
      console.log(`Telegram Bot: ${output}`);
    });
    
    // Handle stderr
    process.stderr.on('data', (data) => {
      const output = data.toString();
      botOutputs.telegram.push(`ERROR: ${output}`);
      console.error(`Telegram Bot Error: ${output}`);
    });
    
    // Handle process exit
    process.on('close', (code) => {
      if (code !== 0) {
        botOutputs.telegram.push(`Process exited with code ${code}`);
        console.log(`Telegram bot process exited with code ${code}`);
      }
      botProcesses.telegram = null;
    });
    
    res.json({ success: true, message: 'Telegram bot started successfully' });
  } catch (error) {
    console.error('Error starting Telegram bot:', error);
    res.status(500).json({ error: 'Failed to start Telegram bot' });
  }
});

// Stop Telegram bot
app.post('/api/telegram/stop', (req, res) => {
  if (!botProcesses.telegram) {
    return res.status(400).json({ error: 'Telegram bot is not running' });
  }

  try {
    botProcesses.telegram.kill();
    botProcesses.telegram = null;
    botOutputs.telegram.push('Telegram bot stopped manually');
    res.json({ success: true, message: 'Telegram bot stopped successfully' });
  } catch (error) {
    console.error('Error stopping Telegram bot:', error);
    res.status(500).json({ error: 'Failed to stop Telegram bot' });
  }
});

// Get Telegram bot output
app.get('/api/telegram/output', (req, res) => {
  res.json({ output: botOutputs.telegram });
});

// Catch-all route to serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(config.server.clientPath, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Cleanup function for when the server is shut down
const cleanup = () => {
  console.log('Cleaning up...');
  
  if (botProcesses.discord) {
    botProcesses.discord.kill();
  }
  
  if (botProcesses.whatsapp) {
    botProcesses.whatsapp.kill();
  }
  
  if (botProcesses.telegram) {
    botProcesses.telegram.kill();
  }
  
  process.exit(0);
};

// Handle graceful shutdown
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);