const { GoogleGenerativeAI } = require('@google/generative-ai');
const ChatConversation = require('../models/ChatConversation');
const ChatMessage = require('../models/ChatMessage');
const Utilisateur = require('../models/Utilisateur');
const Entreprise = require('../models/Entreprise');

/**
 * AI-Powered Chatbot Service using Google Gemini
 * Supports: English & French
 * Context-aware with user and company data
 */
class ChatService {
  constructor() {
    // Initialize Gemini client
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'AIzaSyCDemoKeyPleaseReplace') {
      console.warn('⚠️  GEMINI_API_KEY not configured. Get free key at: https://makersuite.google.com/app/apikey');
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    // Usa gemini-2.5-flash come default (versione stabile disponibile)
    this.modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  }

  /**
   * Get system prompt with bilingual support and context
   * @param {Object} userContext - User context data
   * @param {string} detectedLanguage - 'en' or 'fr'
   * @returns {string} System prompt
   */
  getSystemPrompt(userContext, detectedLanguage = 'en') {
    const isTransporter = userContext.companyType === 'transporteur';
    const isDonneurOrdre = userContext.companyType === 'donneur_ordre';

    const prompts = {
      en: `You are an AI assistant for HackToGone, a B2B freight transport matching platform.

IMPORTANT: You MUST respond ONLY in ENGLISH. Never respond in French. All your responses must be in English.

**Your Role:**
- Help ${isTransporter ? 'transporters' : isDonneurOrdre ? 'shippers' : 'users'} with platform-related questions
- Provide clear, concise, and helpful answers
- Be professional and friendly
- Keep responses under 150 words

**Platform Context:**
HackToGone connects freight transporters with companies needing transport services.

**User Context:**
- User: ${userContext.userName || 'User'}
- Company: ${userContext.companyName || 'N/A'}
- Role: ${isTransporter ? 'Transporter' : isDonneurOrdre ? 'Shipper (Donneur d\'Ordre)' : 'User'}

**Key Features You Can Help With:**
${isTransporter ? `
- Managing fleet (vehicles, trailers, drivers)
- Viewing and accepting transport offers
- Uploading required documents (transport license, insurance, certificates)
- Managing company profile and service zones
` : isDonneurOrdre ? `
- Creating transport offers
- Selecting transporters
- Viewing transporter profiles and fleet
- Managing company profile
` : `
- Platform registration and login
- Account management
- General platform information
`}

**FORMATTING RULES - VERY IMPORTANT:**
- Use **bold text** for important terms and section titles (e.g., **Important**, **Step 1**)
- Use numbered lists for step-by-step instructions (e.g., "1. ", "2. ")
- Use bullet points with "- " for feature lists or options
- Structure your responses with clear sections
- Use line breaks to separate different parts of your answer
- Make your responses visually easy to scan and read

**Content Rules:**
- Be concise and to the point
- Provide actionable steps when possible
- If you don't know something, suggest contacting support@hacktogone.com
- Never invent features that don't exist
- Always be helpful and positive`,

      fr: `Tu es un assistant IA pour HackToGone, une plateforme B2B de mise en relation pour le transport de marchandises.

IMPORTANT: Tu DOIS répondre UNIQUEMENT en FRANÇAIS. Ne réponds JAMAIS en anglais. Toutes tes réponses doivent être en français.

**Ton Rôle:**
- Aider les ${isTransporter ? 'transporteurs' : isDonneurOrdre ? 'donneurs d\'ordre' : 'utilisateurs'} avec leurs questions sur la plateforme
- Fournir des réponses claires, concises et utiles
- Être professionnel et amical
- Garder les réponses sous 150 mots

**Contexte de la Plateforme:**
HackToGone connecte les transporteurs routiers avec les entreprises ayant besoin de services de transport.

**Contexte Utilisateur:**
- Utilisateur: ${userContext.userName || 'Utilisateur'}
- Entreprise: ${userContext.companyName || 'N/A'}
- Rôle: ${isTransporter ? 'Transporteur' : isDonneurOrdre ? 'Donneur d\'Ordre' : 'Utilisateur'}

**Fonctionnalités Principales:**
${isTransporter ? `
- Gestion de la flotte (véhicules, remorques, conducteurs)
- Consultation et acceptation des offres de transport
- Téléchargement des documents requis (licence transport, assurance, certificats)
- Gestion du profil entreprise et zones d'intervention
` : isDonneurOrdre ? `
- Création d'offres de transport
- Sélection de transporteurs
- Consultation des profils et flottes des transporteurs
- Gestion du profil entreprise
` : `
- Inscription et connexion à la plateforme
- Gestion du compte
- Informations générales sur la plateforme
`}

**RÈGLES DE FORMATAGE - TRÈS IMPORTANT:**
- Utilise le **texte en gras** pour les termes importants et titres de section (ex: **Important**, **Étape 1**)
- Utilise des listes numérotées pour les instructions étape par étape (ex: "1. ", "2. ")
- Utilise des puces avec "- " pour les listes de fonctionnalités ou options
- Structure tes réponses avec des sections claires
- Utilise des sauts de ligne pour séparer les différentes parties de ta réponse
- Rends tes réponses visuellement faciles à scanner et lire

**Règles de Contenu:**
- Être concis et aller droit au but
- Fournir des étapes actionnables quand c'est possible
- Si tu ne sais pas quelque chose, suggère de contacter support@hacktogone.com
- Ne jamais inventer des fonctionnalités qui n'existent pas
- Toujours être utile et positif`
    };

    return prompts[detectedLanguage] || prompts.en;
  }

  /**
   * Detect language from message (simple heuristic)
   * @param {string} message - User message
   * @returns {string} 'en' or 'fr'
   */
  detectLanguage(message) {
    const frenchWords = [
      // Saluti e parole comuni
      'bonjour', 'bonsoir', 'salut', 'merci', 'oui', 'non',
      // Pronomi
      'je', 'tu', 'il', 'elle', 'nous', 'vous', 'ils', 'elles',
      'moi', 'toi', 'lui',
      // Articoli e preposizioni
      'le', 'la', 'les', 'un', 'une', 'des', 'du', 'de',
      'au', 'aux', 'dans', 'sur', 'avec', 'pour', 'par',
      // Verbi comuni
      'est', 'sont', 'suis', 'être', 'avoir', 'ai', 'as', 'a', 'avons', 'avez', 'ont',
      'faire', 'fait', 'veux', 'peux', 'peut', 'dois', 'doit',
      'montre', 'montrer', 'voir', 'vois', 'voit',
      // Domande
      'comment', 'pourquoi', 'quoi', 'où', 'quand', 'qui', 'quelle', 'quel', 'quels', 'quelles',
      // Sostantivi comuni
      'offre', 'offres', 'véhicule', 'véhicules', 'transport', 'transporteur',
      'aide', 'besoin', 'problème', 'question'
    ];
    
    const lowerMessage = message.toLowerCase();

    let frenchCount = 0;
    frenchWords.forEach(word => {
      // Usa word boundary per match più precisi
      const regex = new RegExp(`\\b${word}\\b`, 'i');
      if (regex.test(lowerMessage)) {
        frenchCount++;
      }
    });

    // If 2+ French words detected, assume French
    return frenchCount >= 2 ? 'fr' : 'en';
  }

  /**
   * Get user context from database
   * @param {number} utilisateurId - User ID
   * @returns {Promise<Object>} User context
   */
  async getUserContext(utilisateurId) {
    try {
      const user = await Utilisateur.getFromId(utilisateurId);

      if (!user) {
        return {
          userName: null,
          companyName: null,
          companyType: null
        };
      }

      // Get company info
      let company = null;
      if (user.entreprise_id) {
        company = await Entreprise.getFromId(user.entreprise_id);
      }

      return {
        userName: user.nom ? `${user.prenom || ''} ${user.nom}`.trim() : user.username,
        companyName: company?.nom_entreprise || null,
        companyType: company?.type_entreprise || null,
        userRole: user.role_entreprise || null
      };
    } catch (error) {
      console.error('Error getting user context:', error);
      return {
        userName: null,
        companyName: null,
        companyType: null
      };
    }
  }

  /**
   * Get conversation history for context
   * @param {number} conversationId - Conversation ID
   * @param {number} limit - Number of messages
   * @returns {Promise<Array>} Messages
   */
  async getConversationContext(conversationId, limit = 10) {
    try {
      const messages = await ChatMessage.findLastMessages(conversationId, limit);

      // Converti i messaggi nel formato richiesto da Gemini
      const history = messages.map(msg => ({
        role: msg.expediteur === 'user' ? 'user' : 'model',
        parts: [{ text: msg.contenu }]
      }));

      // Gemini richiede che la storia inizi sempre con un messaggio 'user'
      // Se il primo messaggio è del bot, rimuovilo
      if (history.length > 0 && history[0].role === 'model') {
        history.shift();
      }

      // Se la storia ha un numero dispari di messaggi (deve finire con model),
      // rimuovi l'ultimo messaggio user
      if (history.length > 0 && history[history.length - 1].role === 'user') {
        history.pop();
      }

      return history;
    } catch (error) {
      console.error('Error getting conversation context:', error);
      return [];
    }
  }

  /**
   * Process user message with AI
   * @param {number} utilisateurId - User ID
   * @param {string} messageText - User message
   * @param {string} tipoUtente - User type (optional)
   * @returns {Promise<Object>} Bot response
   */
  async processMessage(utilisateurId, messageText, tipoUtente = null) {
    try {
      console.log(`\n💬 Processing message from user ${utilisateurId}: "${messageText}"`);

      // 1. Get or create conversation
      const conversation = await ChatConversation.getOrCreate(utilisateurId);
      console.log(`📝 Conversation ID: ${conversation.id}`);

      // 2. Save user message
      await ChatMessage.createMessage({
        conversation_id: conversation.id,
        expediteur: 'user',
        contenu: messageText
      });

      // 3. Update conversation activity
      await conversation.updateActivity();

      // 4. Get user context
      const userContext = await this.getUserContext(utilisateurId);
      console.log(`👤 User context: ${JSON.stringify(userContext)}`);

      // 5. Detect language
      const language = this.detectLanguage(messageText);
      console.log(`🌐 Detected language: ${language} (message: "${messageText}")`);

      // 6. Get conversation history
      const conversationHistory = await this.getConversationContext(conversation.id, 6);
      console.log(`📚 History length: ${conversationHistory.length} messages`);

      // 7. Call Gemini AI
      const aiResponse = await this.getAIResponse(
        messageText,
        userContext,
        language,
        conversationHistory
      );
      console.log(`🤖 AI Response: "${aiResponse.text.substring(0, 100)}..."`);

      // 8. Save bot response
      const botMessage = await ChatMessage.createMessage({
        conversation_id: conversation.id,
        expediteur: 'bot',
        contenu: aiResponse.text,
        intention_reconnue: aiResponse.intent || null
      });

      return {
        conversationId: conversation.id,
        messageId: botMessage.id,
        text: aiResponse.text,
        intent: aiResponse.intent,
        suggestions: aiResponse.suggestions || []
      };
    } catch (error) {
      console.error('❌ Error in processMessage:', error);

      // Fallback error message
      const language = this.detectLanguage(messageText);
      return {
        text: language === 'fr'
          ? 'Désolé, une erreur s\'est produite. Veuillez réessayer dans un instant ou contacter support@hacktogone.com'
          : 'Sorry, an error occurred. Please try again in a moment or contact support@hacktogone.com',
        intent: 'error',
        suggestions: []
      };
    }
  }

  /**
   * Get AI response from Gemini
   * @param {string} userMessage - User message
   * @param {Object} userContext - User context
   * @param {string} language - Detected language
   * @param {Array} history - Conversation history
   * @returns {Promise<Object>} AI response
   */
  async getAIResponse(userMessage, userContext, language, history = []) {
    try {
      const systemPrompt = this.getSystemPrompt(userContext, language);
      console.log(`🤖 Using system prompt language: ${language}`);
      console.log(`📋 System prompt preview: ${systemPrompt.substring(0, 150)}...`);

      // Get Gemini model
      const model = this.genAI.getGenerativeModel({
        model: this.modelName,
        systemInstruction: systemPrompt
      });

      // Se non c'è storia o la storia è vuota, usa generateContent invece di chat
      if (!history || history.length === 0) {
        const result = await model.generateContent(userMessage);
        const response = await result.response;
        const responseText = response.text();

        // Extract intent (simple categorization)
        const intent = this.categorizeIntent(userMessage, language);

        // Generate contextual suggestions
        const suggestions = this.generateSuggestions(intent, language, userContext.companyType);

        return {
          text: responseText,
          intent: intent,
          suggestions: suggestions
        };
      }

      // Build chat with history
      const chat = model.startChat({
        history: history,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
          topP: 0.95,
        },
      });

      // Send message and get response
      const result = await chat.sendMessage(userMessage);
      const response = await result.response;
      const responseText = response.text();

      // Extract intent (simple categorization)
      const intent = this.categorizeIntent(userMessage, language);

      // Generate contextual suggestions
      const suggestions = this.generateSuggestions(intent, language, userContext.companyType);

      return {
        text: responseText,
        intent: intent,
        suggestions: suggestions
      };
    } catch (error) {
      console.error('Gemini API error:', error);

      // Check if API key is missing/invalid (401, 403)
      if (error.status === 401 || error.status === 403) {
        return {
          text: language === 'fr'
            ? 'Configuration manquante. Veuillez configurer GEMINI_API_KEY dans .env. Obtenez votre clé gratuite sur https://makersuite.google.com/app/apikey'
            : 'Missing configuration. Please set GEMINI_API_KEY in .env. Get your free key at https://makersuite.google.com/app/apikey',
          intent: 'error',
          suggestions: []
        };
      }

      // Check if model not found (404)
      if (error.status === 404) {
        return {
          text: language === 'fr'
            ? 'Modèle AI non disponible. Veuillez vérifier la configuration GEMINI_MODEL dans .env.'
            : 'AI model not available. Please check GEMINI_MODEL configuration in .env.',
          intent: 'error',
          suggestions: []
        };
      }

      // Check if model is overloaded (503 error)
      if (error.status === 503) {
        return {
          text: language === 'fr'
            ? 'Le service est temporairement surchargé. Veuillez réessayer dans quelques instants.'
            : 'The service is temporarily overloaded. Please try again in a moment.',
          intent: 'error',
          suggestions: []
        };
      }

      throw error;
    }
  }

  /**
   * Categorize user intent
   * @param {string} message - User message
   * @param {string} language - Language
   * @returns {string} Intent category
   */
  categorizeIntent(message, language) {
    const lower = message.toLowerCase();

    const categories = {
      en: {
        vehicle: ['vehicle', 'truck', 'fleet', 'trailer', 'driver'],
        offer: ['offer', 'transport', 'shipment', 'freight', 'load'],
        document: ['document', 'license', 'insurance', 'certificate'],
        account: ['account', 'profile', 'password', 'login', 'register'],
        help: ['help', 'support', 'contact', 'problem', 'issue']
      },
      fr: {
        vehicle: ['véhicule', 'camion', 'flotte', 'remorque', 'conducteur'],
        offer: ['offre', 'transport', 'expédition', 'fret', 'chargement'],
        document: ['document', 'licence', 'assurance', 'certificat'],
        account: ['compte', 'profil', 'mot de passe', 'connexion', 'inscription'],
        help: ['aide', 'support', 'contact', 'problème']
      }
    };

    const keywords = categories[language] || categories.en;

    for (const [category, words] of Object.entries(keywords)) {
      if (words.some(word => lower.includes(word))) {
        return category;
      }
    }

    return 'general';
  }

  /**
   * Generate contextual suggestions
   * @param {string} intent - Intent category
   * @param {string} language - Language
   * @param {string} companyType - Company type
   * @returns {Array<string>} Suggestions
   */
  generateSuggestions(intent, language, companyType) {
    const suggestions = {
      en: {
        transporteur: {
          vehicle: ['How to add a vehicle?', 'Manage my fleet', 'Driver management'],
          offer: ['View transport offers', 'Accept an offer', 'My active transports'],
          document: ['Upload documents', 'Document requirements', 'Expiration dates'],
          account: ['Update profile', 'Company settings', 'Contact preferences'],
          general: ['How does it work?', 'Manage vehicles', 'View offers']
        },
        donneur_ordre: {
          offer: ['Create transport offer', 'View my offers', 'Select transporter'],
          document: ['Required documents', 'Verify transporter docs'],
          account: ['Update profile', 'Company settings'],
          general: ['How to create offer?', 'Find transporters', 'Pricing info']
        }
      },
      fr: {
        transporteur: {
          vehicle: ['Comment ajouter un véhicule?', 'Gérer ma flotte', 'Gestion conducteurs'],
          offer: ['Voir les offres', 'Accepter une offre', 'Mes transports actifs'],
          document: ['Télécharger documents', 'Documents requis', 'Dates d\'expiration'],
          account: ['Modifier profil', 'Paramètres entreprise', 'Préférences contact'],
          general: ['Comment ça marche?', 'Gérer véhicules', 'Voir offres']
        },
        donneur_ordre: {
          offer: ['Créer offre transport', 'Voir mes offres', 'Sélectionner transporteur'],
          document: ['Documents requis', 'Vérifier docs transporteur'],
          account: ['Modifier profil', 'Paramètres entreprise'],
          general: ['Comment créer offre?', 'Trouver transporteurs', 'Info tarifs']
        }
      }
    };

    const langSuggestions = suggestions[language] || suggestions.en;
    const typeSuggestions = langSuggestions[companyType] || langSuggestions.transporteur;

    return typeSuggestions[intent] || typeSuggestions.general || [];
  }

  /**
   * Get conversation history
   * @param {number} utilisateurId - User ID
   * @param {number} limit - Number of messages
   * @returns {Promise<Object>} Conversation history
   */
  async getConversationHistory(utilisateurId, limit = 20) {
    try {
      const conversation = await ChatConversation.findActiveByUser(utilisateurId);

      if (!conversation) {
        return {
          conversationId: null,
          messages: []
        };
      }

      const messages = await ChatMessage.findLastMessages(conversation.id, limit);

      return {
        conversationId: conversation.id,
        messages: messages.map(msg => ({
          id: msg.id,
          expediteur: msg.expediteur,
          contenu: msg.contenu,
          createdAt: msg.created_at
        }))
      };
    } catch (error) {
      console.error('Error in getConversationHistory:', error);
      return {
        conversationId: null,
        messages: []
      };
    }
  }

  /**
   * Close a conversation
   * @param {number} conversationId - Conversation ID
   */
  async closeConversation(conversationId) {
    try {
      const conversation = await ChatConversation.getFromId(conversationId);
      if (conversation) {
        await conversation.close();
      }
    } catch (error) {
      console.error('Error in closeConversation:', error);
    }
  }

  /**
   * Set message feedback
   * @param {number} messageId - Message ID
   * @param {boolean} utile - Helpful or not
   */
  async setMessageFeedback(messageId, utile) {
    try {
      const message = await ChatMessage.getFromId(messageId);
      if (message) {
        await message.setFeedback(utile);
      }
    } catch (error) {
      console.error('Error in setMessageFeedback:', error);
    }
  }
}

// Export singleton instance
module.exports = new ChatService();
