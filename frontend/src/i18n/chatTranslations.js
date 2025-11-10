/**
 * Chat Widget Translations
 * Supports: English (en) and French (fr)
 */

export const chatTranslations = {
  en: {
    // Status
    online: 'Online',
    offline: 'Offline',
    
    // Actions
    toggleChat: 'Toggle chat',
    closeChat: 'Close chat',
    sendMessage: 'Send message',
    
    // Placeholders
    messagePlaceholder: 'Type a message...',
    
    // Welcome message
    welcomeMessage: 'Hello! I\'m the virtual assistant of HackToGone. How can I help you today?',
    
    // Error messages
    errorMessage: 'An error occurred. Please try again shortly.',
    
    // Suggestions (default)
    suggestions: {
      howItWorks: 'How does the platform work?',
      createOffer: 'How to create a transport offer?',
      manageDocuments: 'Document management',
      technicalSupport: 'Technical support'
    }
  },
  
  fr: {
    // Status
    online: 'En ligne',
    offline: 'Hors ligne',
    
    // Actions
    toggleChat: 'Basculer chat',
    closeChat: 'Fermer chat',
    sendMessage: 'Envoyer message',
    
    // Placeholders
    messagePlaceholder: 'Écrivez un message...',
    
    // Welcome message
    welcomeMessage: 'Bonjour ! Je suis l\'assistant virtuel de HackToGone. Comment puis-je vous aider aujourd\'hui ?',
    
    // Error messages
    errorMessage: 'Une erreur s\'est produite. Veuillez réessayer dans un instant.',
    
    // Suggestions (default)
    suggestions: {
      howItWorks: 'Comment fonctionne la plateforme ?',
      createOffer: 'Comment créer une offre de transport ?',
      manageDocuments: 'Gestion des documents',
      technicalSupport: 'Support technique'
    }
  }
};

/**
 * Get translation for a key
 * @param {string} lang - Language code ('en' or 'fr')
 * @param {string} key - Translation key (supports nested keys with dot notation)
 * @returns {string} Translated text
 */
export const t = (lang, key) => {
  const keys = key.split('.');
  let value = chatTranslations[lang] || chatTranslations.en;
  
  for (const k of keys) {
    if (value && typeof value === 'object') {
      value = value[k];
    } else {
      return key; // Fallback to key if not found
    }
  }
  
  return value || key;
};

/**
 * Get user's preferred language from browser or localStorage
 * @returns {string} Language code ('en' or 'fr')
 */
export const getPreferredLanguage = () => {
  // Check localStorage first
  const stored = localStorage.getItem('preferredLanguage');
  if (stored && (stored === 'en' || stored === 'fr')) {
    return stored;
  }
  
  // Check browser language
  const browserLang = navigator.language || navigator.userLanguage;
  if (browserLang) {
    if (browserLang.toLowerCase().startsWith('fr')) {
      return 'fr';
    }
    if (browserLang.toLowerCase().startsWith('en')) {
      return 'en';
    }
  }
  
  // Default to English
  return 'en';
};

/**
 * Set user's preferred language
 * @param {string} lang - Language code ('en' or 'fr')
 */
export const setPreferredLanguage = (lang) => {
  if (lang === 'en' || lang === 'fr') {
    localStorage.setItem('preferredLanguage', lang);
  }
};
