import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3001';

/**
 * Tipi per i messaggi del chat
 */
export interface ChatMessage {
  id?: number;
  expediteur: 'user' | 'bot';
  contenu: string;
  createdAt?: Date | string;
}

export interface ChatResponse {
  conversationId: number;
  messageId?: number;
  message?: ChatMessage;
  text?: string;
  intent?: string;
  suggestions?: string[];
}

export interface ChatHistory {
  conversationId: number | null;
  messages: ChatMessage[];
}

/**
 * Callback types
 */
type MessageCallback = (response: ChatResponse) => void;
type ErrorCallback = (error: { message: string }) => void;
type HistoryCallback = (history: ChatHistory) => void;

/**
 * Servizio per gestire la comunicazione Socket.io con il chat backend
 */
class ChatService {
  private socket: Socket | null = null;
  private messageCallbacks: MessageCallback[] = [];
  private errorCallbacks: ErrorCallback[] = [];
  private historyCallbacks: HistoryCallback[] = [];
  private connected: boolean = false;

  /**
   * Connette al server Socket.io
   */
  connect(token: string): void {
    if (this.socket?.connected) {
      console.log('Chat già connesso');
      return;
    }

    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling']
    });

    // Setup event listeners
    this.socket.on('connect', () => {
      console.log('✅ Connesso al chat');
      this.connected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Disconnesso dal chat');
      this.connected = false;
    });

    this.socket.on('chat:receive_message', (data: ChatResponse) => {
      this.messageCallbacks.forEach(cb => cb(data));
    });

    this.socket.on('chat:error', (error: { message: string }) => {
      this.errorCallbacks.forEach(cb => cb(error));
    });

    this.socket.on('chat:history', (history: ChatHistory) => {
      this.historyCallbacks.forEach(cb => cb(history));
    });

    this.socket.on('connect_error', (error) => {
      console.error('Errore connessione chat:', error.message);
      this.errorCallbacks.forEach(cb => cb({ message: 'Errore di connessione al chat' }));
    });
  }

  /**
   * Disconnette dal server
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }

  /**
   * Verifica se è connesso
   */
  isConnected(): boolean {
    return this.connected && this.socket?.connected === true;
  }

  /**
   * Invia un messaggio al bot
   */
  sendMessage(message: string): void {
    if (!this.socket || !this.connected) {
      console.error('Socket non connesso');
      this.errorCallbacks.forEach(cb => cb({ message: 'Non connesso al server' }));
      return;
    }

    this.socket.emit('chat:send_message', { message });
  }

  /**
   * Richiede lo storico della conversazione
   */
  getHistory(limit: number = 20): void {
    if (!this.socket || !this.connected) {
      console.error('Socket non connesso');
      return;
    }

    this.socket.emit('chat:get_history', { limit });
  }

  /**
   * Invia feedback su un messaggio
   */
  sendFeedback(messageId: number, utile: boolean): void {
    if (!this.socket || !this.connected) {
      console.error('Socket non connesso');
      return;
    }

    this.socket.emit('chat:feedback', { messageId, utile });
  }

  /**
   * Chiude la conversazione corrente
   */
  closeConversation(conversationId: number): void {
    if (!this.socket || !this.connected) {
      console.error('Socket non connesso');
      return;
    }

    this.socket.emit('chat:close', { conversationId });
  }

  /**
   * Notifica che l'utente sta scrivendo
   */
  sendTyping(): void {
    if (!this.socket || !this.connected) {
      return;
    }

    this.socket.emit('chat:typing');
  }

  /**
   * Registra callback per messaggi ricevuti
   */
  onMessage(callback: MessageCallback): () => void {
    this.messageCallbacks.push(callback);
    // Ritorna funzione per rimuovere il callback
    return () => {
      this.messageCallbacks = this.messageCallbacks.filter(cb => cb !== callback);
    };
  }

  /**
   * Registra callback per errori
   */
  onError(callback: ErrorCallback): () => void {
    this.errorCallbacks.push(callback);
    return () => {
      this.errorCallbacks = this.errorCallbacks.filter(cb => cb !== callback);
    };
  }

  /**
   * Registra callback per storico
   */
  onHistory(callback: HistoryCallback): () => void {
    this.historyCallbacks.push(callback);
    return () => {
      this.historyCallbacks = this.historyCallbacks.filter(cb => cb !== callback);
    };
  }

  /**
   * Rimuove tutti i callback
   */
  removeAllListeners(): void {
    this.messageCallbacks = [];
    this.errorCallbacks = [];
    this.historyCallbacks = [];
  }
}

// Esporta singleton
export const chatService = new ChatService();
export default chatService;
