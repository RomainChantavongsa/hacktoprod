const ChatService = require('./chatService');
const jwt = require('jsonwebtoken');

/**
 * Gestisce gli eventi Socket.io per il chat
 * @param {SocketIO.Server} io - Istanza Socket.io
 */
function setupChatSocketHandlers(io) {
  // Middleware per autenticazione Socket.io
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        console.warn('⚠️ Tentativo connessione senza token');
        return next(new Error('Token non fornito'));
      }

      // Verifica il token JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (!decoded || !decoded.userId) {
        console.warn('⚠️ Token valido ma senza ID utente');
        return next(new Error('Token non valido'));
      }

      socket.userId = decoded.userId;
      socket.userType = decoded.type_entreprise;

      next();
    } catch (error) {
      console.warn('⚠️ Errore autenticazione Socket.io:', error.message);
      next(new Error('Autenticazione fallita'));
    }
  });

  // Gestori eventi
  io.on('connection', (socket) => {
    console.log(`✅ Utente connesso al chat: ${socket.userId}`);

    // Unisci l'utente a una room personale
    socket.join(`user-${socket.userId}`);

    // Evento: invio messaggio
    socket.on('chat:send_message', async (data) => {
      try {
        const { message } = data;

        if (!message || message.trim().length === 0) {
          socket.emit('chat:error', {
            message: 'Il messaggio non può essere vuoto'
          });
          return;
        }

        // Verifica che l'utente sia autenticato
        if (!socket.userId) {
          console.error('❌ Tentativo invio messaggio senza userId');
          socket.emit('chat:error', {
            message: 'Sessione non valida. Ricarica la pagina.'
          });
          return;
        }

        // Processa il messaggio
        const response = await ChatService.processMessage(
          socket.userId,
          message,
          socket.userType
        );

        // Invia risposta al client
        socket.emit('chat:receive_message', {
          conversationId: response.conversationId,
          message: {
            id: response.messageId,
            expediteur: 'bot',
            contenu: response.text,
            createdAt: new Date()
          },
          suggestions: response.suggestions
        });
      } catch (error) {
        console.error('Error in processMessage:', error);
        socket.emit('chat:error', {
          message: 'Errore durante l\'elaborazione del messaggio'
        });
      }
    });

    // Evento: richiesta storico
    socket.on('chat:get_history', async (data) => {
      try {
        if (!socket.userId) {
          console.error('❌ Tentativo recupero storico senza userId');
          socket.emit('chat:error', {
            message: 'Sessione non valida'
          });
          return;
        }

        const limit = data?.limit || 20;
        const history = await ChatService.getConversationHistory(socket.userId, limit);

        socket.emit('chat:history', history);
      } catch (error) {
        console.error('Errore in chat:get_history:', error);
        socket.emit('chat:error', {
          message: 'Errore durante il recupero dello storico'
        });
      }
    });

    // Evento: feedback messaggio
    socket.on('chat:feedback', async (data) => {
      try {
        const { messageId, utile } = data;

        if (!messageId || typeof utile !== 'boolean') {
          socket.emit('chat:error', {
            message: 'Parametri non validi'
          });
          return;
        }

        await ChatService.setMessageFeedback(messageId, utile);

        socket.emit('chat:feedback_success', {
          messageId,
          utile
        });
      } catch (error) {
        console.error('Errore in chat:feedback:', error);
        socket.emit('chat:error', {
          message: 'Errore durante l\'invio del feedback'
        });
      }
    });

    // Evento: chiudi conversazione
    socket.on('chat:close', async (data) => {
      try {
        const { conversationId } = data;

        if (!conversationId) {
          socket.emit('chat:error', {
            message: 'ID conversazione richiesto'
          });
          return;
        }

        await ChatService.closeConversation(conversationId);

        socket.emit('chat:closed', {
          conversationId
        });
      } catch (error) {
        console.error('Errore in chat:close:', error);
        socket.emit('chat:error', {
          message: 'Errore durante la chiusura della conversazione'
        });
      }
    });

    // Evento: l'utente sta scrivendo
    socket.on('chat:typing', () => {
      // Opzionale: potresti implementare un indicatore "bot is typing"
      // Per ora non facciamo nulla
    });

    // Disconnessione
    socket.on('disconnect', () => {
      console.log(`❌ Utente disconnesso dal chat: ${socket.userId}`);
    });
  });

  return io;
}

module.exports = { setupChatSocketHandlers };
