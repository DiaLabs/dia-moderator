import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components'; // Remove unused keyframes import
import { QRCodeSVG } from 'qrcode.react';
// Remove unused imports
import BotCard from '../components/BotCard';
import { 
  checkBotStatus, 
  runDiscordBot, stopDiscordBot, getDiscordBotOutput,
  runWhatsAppBot, stopWhatsAppBot, getWhatsAppBotOutput, getWhatsAppQRCode, regenerateWhatsAppQRCode,
  runTelegramBot, stopTelegramBot, getTelegramBotOutput
} from '../services/botService';

// Styled components
const PageContainer = styled.div`
  padding: ${({ theme }) => `${theme.spacing.xxl} ${theme.spacing.m}`};
  max-width: 1200px;
  margin: 0 auto;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: ${({ theme }) => theme.spacing.l};
  text-align: center;
  
  span {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const PageDescription = styled.p`
  text-align: center;
  max-width: 800px;
  margin: 0 auto ${({ theme }) => theme.spacing.xxl};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 1.1rem;
`;

const BotGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
`;

const BotDetailSection = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.l};
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.boxShadow};
`;

const BotSectionTitle = styled.h2`
  font-size: 1.8rem;
  margin-bottom: ${({ theme }) => theme.spacing.l};
  color: ${({ theme }) => theme.colors.text};
  
  span {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const QRCodeContainer = styled.div`
  margin: ${({ theme }) => theme.spacing.m} 0;
  padding: ${({ theme }) => theme.spacing.m};
  background-color: #fff;
  border-radius: ${({ theme }) => theme.borderRadius};
  display: inline-block;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const QRCodeActions = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.s};
  margin-top: ${({ theme }) => theme.spacing.m};
`;

const Button = styled.button`
  background-color: ${({ theme, primary }) => primary ? theme.colors.primary : theme.colors.surface};
  color: ${({ theme, primary }) => primary ? '#fff' : theme.colors.text};
  border: 1px solid ${({ theme, primary }) => primary ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => `${theme.spacing.s} ${theme.spacing.m}`};
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${({ theme, primary }) => primary ? theme.colors.primaryDark : theme.colors.backgroundAlt};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const QRCodeTimer = styled.div`
  margin-top: ${({ theme }) => theme.spacing.s};
  font-size: 0.85rem;
  color: ${({ remaining }) => remaining < 10 ? '#e53935' : remaining < 20 ? '#ff9800' : '#4caf50'};
  font-weight: bold;
`;

const SetupInstructions = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.l};
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  padding: ${({ theme }) => theme.spacing.m};
  border-radius: ${({ theme }) => theme.borderRadius};
  
  h3 {
    margin-top: 0;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const OutputContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => theme.spacing.m};
  margin-top: ${({ theme }) => theme.spacing.m};
  font-family: monospace;
  white-space: pre-wrap;
  height: 700px; /* Increased from 300px to 500px */
  max-height: 700px; /* Increased from 300px to 500px */
  overflow-y: auto; /* Enable vertical scrolling */
  overflow-x: hidden; /* Hide horizontal scrollbar */
  position: relative; /* Ensure proper positioning context */
  border: 1px solid ${({ theme }) => theme.colors.border};
  
  pre {
    margin: 0;
    color: ${({ theme }) => theme.colors.textSecondary};
    word-wrap: break-word;
    width: 100%;
    overflow-wrap: break-word;
    white-space: pre-wrap;       /* Preserve line breaks but wrap text */
    word-break: break-word;      /* Break words to prevent overflow */
  }
`;

const InstructionsList = styled.ul`
  margin: ${({ theme }) => theme.spacing.m} 0;
  padding-left: ${({ theme }) => theme.spacing.l};
  
  li {
    margin-bottom: ${({ theme }) => theme.spacing.s};
  }
`;

const ExploreBots = () => {
  const [selectedBot, setSelectedBot] = useState('');
  const [botsRunning, setBotsRunning] = useState({
    whatsapp: false,
    telegram: false,
    discord: false
  });
  const [botOutputs, setBotOutputs] = useState({
    whatsapp: [],
    telegram: [],
    discord: []
  });
  const [qrCode, setQrCode] = useState(null);
  const [qrCodeError, setQrCodeError] = useState('');
  const [qrCodeRefreshing, setQrCodeRefreshing] = useState(false);
  const [qrCodeTimeLeft, setQrCodeTimeLeft] = useState(60);
  const [loading, setLoading] = useState({
    init: true,
    whatsapp: false,
    discord: false,
    telegram: false
  });
  
  // Bot data
  const bots = [
    {
      id: 'discord',
      name: 'Discord Bot',
      description: 'Moderate your Discord server with automatic content filtering, warning systems, and more.',
      image: 'https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png',
      instructions: [
        'Create a Discord application in the Discord Developer Portal',
        'Add your bot token to the .env file',
        'Invite the bot to your server',
        'Start the bot from this interface'
      ]
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp Bot',
      description: 'Keep your WhatsApp groups clean with AI-powered moderation and smart features.',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/640px-WhatsApp.svg.png',
      instructions: [
        'Start the bot from this interface',
        'Scan the QR code with your WhatsApp app',
        'The bot will connect to your WhatsApp account',
        'Add the bot to your groups or use it directly'
      ]
    },
    {
      id: 'telegram',
      name: 'Telegram Bot',
      description: 'Enhance your Telegram channels with automated moderation, summarization, and conversation assistance.',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Telegram_logo.svg/640px-Telegram_logo.svg.png',
      instructions: [
        'Create a new bot using @BotFather on Telegram',
        'Add your bot token to the .env file',
        'Start the bot from this interface',
        'Add the bot to your groups or channels'
      ]
    }
  ];
  
  // Function to update bot statuses
  const updateBotStatuses = useCallback(async () => {
    try {
      const status = await checkBotStatus();
      setBotsRunning({
        discord: status.discord,
        whatsapp: status.whatsapp,
        telegram: status.telegram
      });
    } catch (error) {
      console.error('Failed to update bot statuses:', error);
    }
  }, []);

  // Handle QR code regeneration - move this before the useEffect that depends on it
  const handleRegenerateQRCode = useCallback(async () => {
    if (qrCodeRefreshing) return;
    
    setQrCodeRefreshing(true);
    try {
      await regenerateWhatsAppQRCode();
      setQrCode({
        text: null,
        image: null,
        timestamp: 0
      });
      setQrCodeTimeLeft(60);
      setQrCodeError(null);
      
      // Clear the bot outputs to only show the new QR code
      setBotOutputs(prev => ({
        ...prev,
        whatsapp: []
      }));
      
      // Force immediate check for new QR code
      const qrCodeData = await getWhatsAppQRCode();
      if (qrCodeData) {
        setQrCode({
          ...qrCodeData,
          timestamp: Date.now()
        });
      }
    } catch (error) {
      console.error('Failed to regenerate QR code:', error);
      setQrCodeError('Failed to regenerate QR code. Please try again.');
    } finally {
      setQrCodeRefreshing(false);
    }
  }, [qrCodeRefreshing]);
  
  // Update QR code timer
  useEffect(() => {
    let timer = null;
    
    if (qrCode?.timestamp && qrCodeTimeLeft > 0) {
      timer = setInterval(() => {
        // Calculate time left based on current time and QR code timestamp
        const elapsed = Math.floor((Date.now() - qrCode.timestamp) / 1000);
        const remaining = Math.max(0, 60 - elapsed);
        setQrCodeTimeLeft(remaining);
        
        // Auto-refresh QR code if less than 5 seconds remaining and not already refreshing
        if (remaining <= 5 && !qrCodeRefreshing && botsRunning.whatsapp) {
          handleRegenerateQRCode();
        }
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [qrCode, qrCodeRefreshing, botsRunning.whatsapp, handleRegenerateQRCode, qrCodeTimeLeft]);
  
  // Function to update outputs
  const updateOutputs = useCallback(async () => {
    try {
      if (botsRunning.discord) {
        const discordOutput = await getDiscordBotOutput();
        setBotOutputs(prev => ({
          ...prev,
          discord: discordOutput
        }));
      }
      
      if (botsRunning.whatsapp) {
        const whatsappOutput = await getWhatsAppBotOutput();
        // Filter out any QR code related messages from the output
        const filteredOutput = whatsappOutput.filter(line => 
          !line.includes('QR Code received:') && 
          !line.includes('Scan the QR code') && 
          !line.includes('qr.png')
        );
        
        setBotOutputs(prev => ({
          ...prev,
          whatsapp: filteredOutput
        }));
        
        // Handle QR code separately
        // Only check for QR code every 2 seconds to avoid constant updates
        const now = Date.now();
        const shouldUpdateQR = 
          !qrCode?.text || 
          now - (qrCode?.timestamp || 0) > 2000 || 
          qrCodeTimeLeft <= 0;
          
        if (shouldUpdateQR && !qrCodeRefreshing) {
          try {
            const qrCodeData = await getWhatsAppQRCode();
            if (qrCodeData && qrCodeData.qrcode) {
              // Make sure we have a timestamp
              const updatedQRData = {
                text: qrCodeData.qrcode,
                image: qrCodeData.qrcodeImage,
                timestamp: now
              };
              
              // Only update if it's actually different
              const isDifferentQR = 
                !qrCode?.text || 
                updatedQRData.text !== qrCode.text;
                
              if (isDifferentQR) {
                setQrCode(updatedQRData);
                setQrCodeTimeLeft(60);
                setQrCodeError(null);
              }
            }
          } catch (error) {
            console.error('Error updating QR code:', error);
            // Only set error if we don't already have a valid QR code
            if (!qrCode?.text) {
              setQrCodeError('Failed to retrieve QR code. Try regenerating or restarting the bot.');
            }
          }
        }
      } else {
        // Reset QR code when bot is stopped
        setQrCode({
          text: null,
          timestamp: 0
        });
      }
      
      if (botsRunning.telegram) {
        const telegramOutput = await getTelegramBotOutput();
        setBotOutputs(prev => ({
          ...prev,
          telegram: telegramOutput
        }));
      }
    } catch (error) {
      console.error('Failed to update bot outputs:', error);
    }
  }, [botsRunning, qrCode, qrCodeTimeLeft, qrCodeRefreshing]);

  // Initial load - check bot statuses
  useEffect(() => {
    updateBotStatuses();
  }, [updateBotStatuses]);
  
  // Poll for bot outputs
  useEffect(() => {
    const interval = setInterval(() => {
      updateOutputs();
      updateBotStatuses();
    }, 2000);
    
    return () => clearInterval(interval);
  }, [updateOutputs, updateBotStatuses]);
  
  // Handle Discord bot
  const handleDiscordBot = async () => {
    if (botsRunning.discord) {
      // Stop bot
      setLoading(prev => ({ ...prev, discord: true }));
      try {
        await stopDiscordBot();
        setBotsRunning(prev => ({ ...prev, discord: false }));
      } catch (error) {
        console.error('Error stopping Discord bot:', error);
      } finally {
        setLoading(prev => ({ ...prev, discord: false }));
      }
    } else {
      // Start bot
      setLoading(prev => ({ ...prev, discord: true }));
      try {
        await runDiscordBot();
        setBotsRunning(prev => ({ ...prev, discord: true }));
        setSelectedBot('discord');
      } catch (error) {
        console.error('Error starting Discord bot:', error);
      } finally {
        setLoading(prev => ({ ...prev, discord: false }));
      }
    }
  };
  
  // Handle WhatsApp bot
  const handleWhatsAppBot = async () => {
    if (botsRunning.whatsapp) {
      // Stop bot
      setLoading(prev => ({ ...prev, whatsapp: true }));
      try {
        await stopWhatsAppBot();
        setBotsRunning(prev => ({ ...prev, whatsapp: false }));
        setQrCode(null);
      } catch (error) {
        console.error('Error stopping WhatsApp bot:', error);
      } finally {
        setLoading(prev => ({ ...prev, whatsapp: false }));
      }
    } else {
      // Start bot
      setLoading(prev => ({ ...prev, whatsapp: true }));
      try {
        await runWhatsAppBot();
        setBotsRunning(prev => ({ ...prev, whatsapp: true }));
        setSelectedBot('whatsapp');
        
        // Immediately fetch the QR code without waiting for the polling interval
        try {
          // Add a small delay to give the backend time to generate the QR
          setTimeout(async () => {
            const qrCodeData = await getWhatsAppQRCode();
            if (qrCodeData && (qrCodeData.qrcode || qrCodeData.qrcodeImage)) {
              setQrCode({
                text: qrCodeData.qrcode,
                image: qrCodeData.qrcodeImage,
                timestamp: Date.now()
              });
              setQrCodeTimeLeft(60);
            }
          }, 500); // Reduced delay to 500ms for faster response
        } catch (error) {
          console.error('Error fetching QR code:', error);
        }
      } catch (error) {
        console.error('Error starting WhatsApp bot:', error);
      } finally {
        setLoading(prev => ({ ...prev, whatsapp: false }));
      }
    }
  };
  
  // Handle Telegram bot
  const handleTelegramBot = async () => {
    if (botsRunning.telegram) {
      // Stop bot
      setLoading(prev => ({ ...prev, telegram: true }));
      try {
        await stopTelegramBot();
        setBotsRunning(prev => ({ ...prev, telegram: false }));
      } catch (error) {
        console.error('Error stopping Telegram bot:', error);
      } finally {
        setLoading(prev => ({ ...prev, telegram: false }));
      }
    } else {
      // Start bot
      setLoading(prev => ({ ...prev, telegram: true }));
      try {
        await runTelegramBot();
        setBotsRunning(prev => ({ ...prev, telegram: true }));
        setSelectedBot('telegram');
      } catch (error) {
        console.error('Error starting Telegram bot:', error);
      } finally {
        setLoading(prev => ({ ...prev, telegram: false }));
      }
    }
  };
  
  // Expand the WhatsApp bot details section to implement proper QR code handling
  const renderBotDetails = () => {
    // If no bot is selected, return null
    if (!selectedBot) return null;
    
    // Render bot details based on selected bot
    switch (selectedBot) {
      case 'whatsapp':
        return (
          <BotDetailSection>
            <BotSectionTitle>
              <span>WhatsApp Bot</span> Details
            </BotSectionTitle>
            
            <SetupInstructions>
              <h3>Setup Instructions</h3>
              <InstructionsList>
                <li>Start the bot from this interface</li>
                <li>Scan the QR code with your WhatsApp app</li>
                <li>The bot will connect to your WhatsApp account</li>
                <li>Add the bot to your groups or use it directly</li>
              </InstructionsList>
            </SetupInstructions>
            
            {botsRunning.whatsapp && (
              <>
                <h3>WhatsApp Connection</h3>
                <p>Status: <strong style={{ color: '#4caf50' }}>Bot is running</strong></p>
                
                {/* QR Code Display */}
                {qrCode?.text && (
                  <QRCodeContainer>
                    {/* Display either the provided image or generate one from the text */}
                    {qrCode.image ? (
                      <img 
                        src={`data:image/png;base64,${qrCode.image}`}
                        alt="WhatsApp QR Code" 
                        style={{ maxWidth: '250px', maxHeight: '250px' }}
                      />
                    ) : (
                      <QRCodeSVG value={qrCode.text} size={256} />
                    )}
                    
                    <QRCodeTimer remaining={qrCodeTimeLeft}>
                      Time remaining: {qrCodeTimeLeft} seconds
                    </QRCodeTimer>
                    
                    <QRCodeActions>
                      <Button 
                        primary
                        onClick={handleRegenerateQRCode}
                        disabled={qrCodeRefreshing}
                      >
                        {qrCodeRefreshing ? 'Regenerating...' : 'Regenerate QR Code'}
                      </Button>
                    </QRCodeActions>
                  </QRCodeContainer>
                )}
                
{qrCodeError && (
                  <div style={{ color: '#e53935', margin: '1rem 0' }}>
                    {qrCodeError}
                    <Button
                      primary
                      onClick={handleRegenerateQRCode}
                      style={{ marginLeft: '1rem' }}
                      disabled={qrCodeRefreshing}
                    >
                      Retry
                    </Button>
                  </div>
                )}
              </>
            )}
            
            <h3>Bot Output</h3>
            <OutputContainer>
              <pre>{botOutputs.whatsapp.join('')}</pre>
            </OutputContainer>
            
            {!botsRunning.whatsapp && (
              <div style={{ marginTop: '1rem' }}>
                <Button
                  primary
                  onClick={handleWhatsAppBot}
                  disabled={loading.whatsapp}
                >
                  {loading.whatsapp ? 'Processing...' : 'Start WhatsApp Bot'}
                </Button>
              </div>
            )}
          </BotDetailSection>
        );
      case 'discord':
        // Discord bot details
        return (
          <BotDetailSection>
            <BotSectionTitle>
              <span>Discord Bot</span> Details
            </BotSectionTitle>
            
            <SetupInstructions>
              <h3>Setup Instructions</h3>
              <InstructionsList>
                <li>Create a Discord application in the Discord Developer Portal</li>
                <li>Add your bot token to the .env file</li>
                <li>Invite the bot to your server</li>
                <li>Start the bot from this interface</li>
              </InstructionsList>
            </SetupInstructions>
            
            <h3>Bot Output</h3>
            <OutputContainer>
              <pre>{botOutputs.discord.join('')}</pre>
            </OutputContainer>
            
            <div style={{ marginTop: '1rem' }}>
              <Button
                primary={!botsRunning.discord}
                onClick={handleDiscordBot}
                disabled={loading.discord}
              >
                {loading.discord
                  ? 'Processing...'
                  : botsRunning.discord
                  ? 'Stop Discord Bot'
                  : 'Start Discord Bot'}
              </Button>
            </div>
          </BotDetailSection>
        );
      case 'telegram':
        // Telegram bot details
        return (
          <BotDetailSection>
            <BotSectionTitle>
              <span>Telegram Bot</span> Details
            </BotSectionTitle>
            
            <SetupInstructions>
              <h3>Setup Instructions</h3>
              <InstructionsList>
                <li>Create a new bot using @BotFather on Telegram</li>
                <li>Add your bot token to the .env file</li>
                <li>Start the bot from this interface</li>
                <li>Add the bot to your groups or channels</li>
              </InstructionsList>
            </SetupInstructions>
            
            <h3>Bot Output</h3>
            <OutputContainer>
              <pre>{botOutputs.telegram.join('')}</pre>
            </OutputContainer>
            
            <div style={{ marginTop: '1rem' }}>
              <Button
                primary={!botsRunning.telegram}
                onClick={handleTelegramBot}
                disabled={loading.telegram}
              >
                {loading.telegram
                  ? 'Processing...'
                  : botsRunning.telegram
                  ? 'Stop Telegram Bot'
                  : 'Start Telegram Bot'}
              </Button>
            </div>
          </BotDetailSection>
        );
      default:
        return null;
    }
  };

  return (
    <PageContainer>
      <PageTitle>Explore Our <span>Bots</span></PageTitle>
      <PageDescription>
        Choose a bot to start working with. Each bot offers different features for different platforms.
        You can run them directly from this interface and see their output in real-time.
      </PageDescription>
      
      <BotGrid>
        {bots.map(bot => (
          <BotCard
            key={bot.id}
            name={bot.name}
            description={bot.description}
            image={bot.image}
            status={botsRunning[bot.id] ? 'running' : 'stopped'}
            isRunning={botsRunning[bot.id]}
            isLoading={loading[bot.id]}
            onStart={() => {
              if (bot.id === 'discord') handleDiscordBot();
              else if (bot.id === 'whatsapp') handleWhatsAppBot();
              else if (bot.id === 'telegram') handleTelegramBot();
            }}
            onStop={() => {
              if (bot.id === 'discord') handleDiscordBot();
              else if (bot.id === 'whatsapp') handleWhatsAppBot();
              else if (bot.id === 'telegram') handleTelegramBot();
            }}
          />
        ))}
      </BotGrid>
      
      {renderBotDetails()}
    </PageContainer>
  );
};

export default ExploreBots;