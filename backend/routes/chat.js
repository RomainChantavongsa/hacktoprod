const express = require('express');
const router = express.Router();
const ChatService = require('../services/chatService');
const elevenLabsService = require('../services/elevenLabsService');
const { authMiddleware } = require('../utils/jwt');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * GET /api/chat/history - Ottieni storico conversazione
 */
router.get('/history', authMiddleware, asyncHandler(async (req, res) => {
  const utilisateurId = req.user.userId;
  const limit = parseInt(req.query.limit) || 20;

  const history = await ChatService.getConversationHistory(utilisateurId, limit);

  res.status(200).json({
    success: true,
    data: history
  });
}));

/**
 * POST /api/chat/message - Invia un messaggio (REST fallback se WebSocket non disponibile)
 */
router.post('/message', authMiddleware, asyncHandler(async (req, res) => {
  const utilisateurId = req.user.userId;
  const { message } = req.body;

  if (!message || message.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Il messaggio non può essere vuoto'
    });
  }

  // Determina tipo utente dall'azienda
  const tipoUtente = req.user.type_entreprise;

  const response = await ChatService.processMessage(utilisateurId, message, tipoUtente);

  res.status(200).json({
    success: true,
    data: response
  });
}));

/**
 * POST /api/chat/feedback - Feedback su un messaggio
 */
router.post('/feedback', authMiddleware, asyncHandler(async (req, res) => {
  const { messageId, utile } = req.body;

  if (!messageId || typeof utile !== 'boolean') {
    return res.status(400).json({
      success: false,
      message: 'Parametri non validi'
    });
  }

  await ChatService.setMessageFeedback(messageId, utile);

  res.status(200).json({
    success: true,
    message: 'Feedback registrato'
  });
}));

/**
 * POST /api/chat/close - Chiudi conversazione
 */
router.post('/close', authMiddleware, asyncHandler(async (req, res) => {
  const { conversationId } = req.body;

  if (!conversationId) {
    return res.status(400).json({
      success: false,
      message: 'ID conversazione richiesto'
    });
  }

  await ChatService.closeConversation(conversationId);

  res.status(200).json({
    success: true,
    message: 'Conversazione chiusa'
  });
}));

/**
 * POST /api/chat/tts - Convert text to speech using ElevenLabs
 */
router.post('/tts', authMiddleware, asyncHandler(async (req, res) => {
  const { text, language } = req.body;

  if (!text || text.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Text is required'
    });
  }

  // Generate audio using ElevenLabs
  const audioBuffer = await elevenLabsService.textToSpeech(text, language);

  // Set response headers for audio streaming
  res.set({
    'Content-Type': 'audio/mpeg',
    'Content-Length': audioBuffer.length,
    'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
  });

  res.send(audioBuffer);
}));

module.exports = router;
