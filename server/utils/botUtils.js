/**
 * Shared utility functions for bot management
 */

const fs = require('fs');
const path = require('path');
const config = require('../config/config');

/**
 * Loads the profanity list from the shared directory
 * @returns {Array} Array of profanity words
 */
const loadProfanityList = () => {
  try {
    const profanityListPath = config.bots.shared.profanityListPath;
    return JSON.parse(fs.readFileSync(profanityListPath, 'utf8')).words;
  } catch (error) {
    console.error('Error loading profanity list:', error);
    return [];
  }
};

/**
 * Checks if a message contains profanity
 * @param {string} message - The message to check
 * @param {Array} profanityList - List of profanity words
 * @returns {boolean} True if profanity is found
 */
const containsProfanity = (message, profanityList) => {
  const lowerCaseMessage = message.toLowerCase();
  return profanityList.some(word => lowerCaseMessage.includes(word.toLowerCase()));
};

/**
 * Formats a message for logging
 * @param {string} botType - The type of bot (discord, whatsapp, telegram)
 * @param {string} message - The message to log
 * @returns {string} Formatted log message
 */
const formatLogMessage = (botType, message) => {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${botType.toUpperCase()}] ${message}`;
};

module.exports = {
  loadProfanityList,
  containsProfanity,
  formatLogMessage
};