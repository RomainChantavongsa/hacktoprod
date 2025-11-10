import { useState, useEffect, useRef } from 'react';
import chatService from '../../services/chatService';
import { t, getPreferredLanguage, setPreferredLanguage } from '../../i18n/chatTranslations';
import './ChatWidget.scss';

/**
 * Funzione per formattare il testo del bot con supporto Markdown
 */
const formatBotMessage = (text) => {
  if (!text) return '';
  
  // Sostituisci **grassetto**
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  
  // Sostituisci *corsivo*
  text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
  
  // Sostituisci liste numerate (es. "1. ", "2. ")
  text = text.replace(/^(\d+)\.\s(.+)$/gm, '<div class="list-item numbered"><span class="list-marker">$1.</span><span class="list-content">$2</span></div>');
  
  // Sostituisci liste puntate (es. "- " o "• ")
  text = text.replace(/^[-•]\s(.+)$/gm, '<div class="list-item"><span class="list-marker">•</span><span class="list-content">$1</span></div>');
  
  // Sostituisci link
  text = text.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  
  // Sostituisci a capo con <br>
  text = text.replace(/\n/g, '<br>');
  
  return text;
};

/**
 * Widget chat floating per assistenza utenti
 * Supporta: Inglese e Francese
 */
const ChatWidget = ({ token, isAuthenticated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [language, setLanguage] = useState(getPreferredLanguage());
  const [playingMessageIndex, setPlayingMessageIndex] = useState(null);
  const [loadingAudioIndex, setLoadingAudioIndex] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const audioRef = useRef(null);

  // Auto-scroll verso l'ultimo messaggio
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Connessione al chat quando l'utente è autenticato
  useEffect(() => {
    if (isAuthenticated && token && !chatService.isConnected()) {
      chatService.connect(token);
      setIsConnected(true);

      // Richiedi storico conversazione
      setTimeout(() => {
        chatService.getHistory(20);
      }, 500);
    }

    return () => {
      if (isAuthenticated) {
        chatService.removeAllListeners();
      }
    };
  }, [isAuthenticated, token]);

  // Listeners per eventi chat
  useEffect(() => {
    if (!isAuthenticated) return;

    const unsubMessage = chatService.onMessage((response) => {
      // Aggiungi messaggio bot
      if (response.message) {
        setMessages(prev => [...prev, response.message]);
      } else if (response.text) {
        setMessages(prev => [...prev, {
          mittente: 'bot',
          contenuto: response.text,
          createdAt: new Date()
        }]);
      }

      // Aggiorna suggerimenti
      if (response.suggestions && response.suggestions.length > 0) {
        setSuggestions(response.suggestions);
      }

      setIsTyping(false);
    });

    const unsubError = chatService.onError((error) => {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        mittente: 'bot',
        contenuto: t(language, 'errorMessage'),
        createdAt: new Date()
      }]);
      setIsTyping(false);
    });

    const unsubHistory = chatService.onHistory((history) => {
      if (history.messages && history.messages.length > 0) {
        setMessages(history.messages);
      } else {
        // Messaggio di benvenuto se non c'è storico
        setMessages([{
          mittente: 'bot',
          contenuto: t(language, 'welcomeMessage'),
          createdAt: new Date()
        }]);
        setSuggestions([
          t(language, 'suggestions.howItWorks'),
          t(language, 'suggestions.createOffer'),
          t(language, 'suggestions.manageDocuments'),
          t(language, 'suggestions.technicalSupport')
        ]);
      }
    });

    return () => {
      unsubMessage();
      unsubError();
      unsubHistory();
    };
  }, [isAuthenticated, language]);

  // Invia messaggio
  const handleSendMessage = (e) => {
    e?.preventDefault();

    if (!inputMessage.trim() || !isConnected) return;

    // Aggiungi messaggio utente alla lista
    const userMessage = {
      mittente: 'user',
      contenuto: inputMessage,
      createdAt: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);
    setSuggestions([]);

    // Invia al server
    chatService.sendMessage(inputMessage);
  };

  // Gestisce click su suggerimento
  const handleSuggestionClick = (suggestion) => {
    setInputMessage(suggestion);
    inputRef.current?.focus();
  };

  // Toggle apertura widget
  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  // Cambia lingua
  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'fr' : 'en';
    setLanguage(newLang);
    setPreferredLanguage(newLang);
  };

  // Riproduci messaggio con TTS
  const handlePlayMessage = async (messageContent, index) => {
    try {
      console.log('🎵 handlePlayMessage called with:', {
        index,
        hasToken: !!token,
        tokenPreview: token ? token.substring(0, 20) + '...' : 'NO TOKEN',
        isAuthenticated
      });

      // Se sta già riproducendo questo messaggio, ferma
      if (playingMessageIndex === index && audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
        setPlayingMessageIndex(null);
        return;
      }

      // Ferma qualsiasi audio in riproduzione
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      setLoadingAudioIndex(index);
      setPlayingMessageIndex(null);

      // Rimuovi i tag HTML dal testo prima di inviarlo al TTS
      const plainText = messageContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

      // Chiamata API per generare audio
      console.log('🎤 Calling TTS API:', {
        url: `${import.meta.env.VITE_API_URL}/chat/tts`,
        text: plainText.substring(0, 50) + '...',
        language: language
      });

      const response = await fetch(`${import.meta.env.VITE_API_URL}/chat/tts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          text: plainText,
          language: language
        })
      });

      console.log('📡 TTS API Response:', {
        status: response.status,
        statusText: response.statusText,
        contentType: response.headers.get('content-type')
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ TTS API Error:', errorText);
        throw new Error(`Failed to generate audio: ${response.status} ${errorText}`);
      }

      // Converti la risposta in blob e crea un URL
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      // Crea e riproduci l'audio
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onplay = () => {
        setLoadingAudioIndex(null);
        setPlayingMessageIndex(index);
      };

      audio.onended = () => {
        setPlayingMessageIndex(null);
        URL.revokeObjectURL(audioUrl);
      };

      audio.onerror = () => {
        setLoadingAudioIndex(null);
        setPlayingMessageIndex(null);
        URL.revokeObjectURL(audioUrl);
        console.error('Error playing audio');
      };

      await audio.play();

    } catch (error) {
      console.error('❌ Error with TTS:', {
        message: error.message,
        stack: error.stack,
        error: error
      });
      setLoadingAudioIndex(null);
      setPlayingMessageIndex(null);
      alert(`Failed to play audio: ${error.message || 'Unknown error'}`);
    }
  };

  // Non mostrare se non autenticato
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className={`chat-widget ${isOpen ? 'open' : ''}`}>
      {/* Pulsante floating */}
      <button
        className="chat-toggle-btn"
        onClick={toggleChat}
        aria-label={t(language, 'toggleChat')}
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        )}
        {!isOpen && messages.length === 0 && (
          <span className="notification-badge"></span>
        )}
      </button>

      {/* Finestra chat */}
      {isOpen && (
        <div className="chat-window">
          {/* Header */}
          <div className="chat-header">
            <div className="chat-header-info">
              <h3>Romain</h3>
              <span className={`status ${isConnected ? 'online' : 'offline'}`}>
                {isConnected ? t(language, 'online') : t(language, 'offline')}
              </span>
            </div>
            <button 
              onClick={toggleLanguage} 
              className="language-btn" 
              aria-label="Change language"
              title={`Switch to ${language === 'en' ? 'French' : 'English'}`}
            >
              {language === 'en' ? '🇫🇷' : '🇬🇧'}
            </button>
            <button onClick={toggleChat} className="close-btn" aria-label={t(language, 'closeChat')}>
              ×
            </button>
          </div>

          {/* Messaggi */}
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.mittente}`}>
                <div className="message-bubble">
                  {msg.mittente === 'bot' ? (
                    <>
                      <div
                        className="message-content"
                        dangerouslySetInnerHTML={{ __html: formatBotMessage(msg.contenuto) }}
                      />
                      <button
                        className={`play-audio-btn ${playingMessageIndex === index ? 'playing' : ''}`}
                        onClick={() => handlePlayMessage(msg.contenuto, index)}
                        disabled={loadingAudioIndex === index}
                        aria-label={playingMessageIndex === index ? 'Stop audio' : 'Play audio'}
                        title={playingMessageIndex === index ? 'Stop' : 'Listen'}
                      >
                        {loadingAudioIndex === index ? (
                          <svg className="spinner" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"></circle>
                          </svg>
                        ) : playingMessageIndex === index ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <rect x="6" y="4" width="4" height="16"></rect>
                            <rect x="14" y="4" width="4" height="16"></rect>
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <polygon points="5 3 19 12 5 21 5 3"></polygon>
                          </svg>
                        )}
                      </button>
                    </>
                  ) : (
                    <p>{msg.contenuto}</p>
                  )}
                  <span className="message-time">
                    {new Date(msg.createdAt).toLocaleTimeString(language === 'fr' ? 'fr-FR' : 'en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="message bot">
                <div className="message-bubble typing">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggerimenti */}
          {suggestions.length > 0 && (
            <div className="chat-suggestions">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className="suggestion-chip"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form className="chat-input-container" onSubmit={handleSendMessage}>
            <input
              ref={inputRef}
              type="text"
              className="chat-input"
              placeholder={t(language, 'messagePlaceholder')}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={!isConnected}
            />
            <button
              type="submit"
              className="send-btn"
              disabled={!inputMessage.trim() || !isConnected}
              aria-label={t(language, 'sendMessage')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="228" height="328" viewBox="0 0 241 241" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
