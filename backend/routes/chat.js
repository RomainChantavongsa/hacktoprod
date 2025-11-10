const express = require('express');
const router = express.Router();
const ChatService = require('../services/chatService');
const elevenLabsService = require('../services/elevenLabsService');
const { authMiddleware } = require('../utils/jwt');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * GET /api/chat/history - Obtenir l'historique de la conversation
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
 * POST /api/chat/message - Envoyer un message (REST fallback si WebSocket non disponible)
 */
router.post('/message', authMiddleware, asyncHandler(async (req, res) => {
  const utilisateurId = req.user.userId;
  const { message } = req.body;

  if (!message || message.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Le message ne peut pas être vide'
    });
  }

  // Détermine le type d'utilisateur depuis l'entreprise
  const tipoUtente = req.user.type_entreprise;

  const response = await ChatService.processMessage(utilisateurId, message, tipoUtente);

  res.status(200).json({
    success: true,
    data: response
  });
}));

/**
 * POST /api/chat/feedback - Feedback sur un message
 */
router.post('/feedback', authMiddleware, asyncHandler(async (req, res) => {
  const { messageId, utile } = req.body;

  if (!messageId || typeof utile !== 'boolean') {
    return res.status(400).json({
      success: false,
      message: 'Paramètres non valides'
    });
  }

  await ChatService.setMessageFeedback(messageId, utile);

  res.status(200).json({
    success: true,
    message: 'Feedback enregistré'
  });
}));

/**
 * POST /api/chat/close - Fermer la conversation
 */
router.post('/close', authMiddleware, asyncHandler(async (req, res) => {
  const { conversationId } = req.body;

  if (!conversationId) {
    return res.status(400).json({
      success: false,
      message: 'ID de conversation requis'
    });
  }

  await ChatService.closeConversation(conversationId);

  res.status(200).json({
    success: true,
    message: 'Conversation fermée'
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
