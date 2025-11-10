/**
 * ElevenLabs Text-to-Speech Service
 * Supports multilingual TTS with automatic voice selection
 */
class ElevenLabsService {
  constructor() {
    // Initialize ElevenLabs configuration
    this.apiKey = process.env.ELEVENLABS_API_KEY?.trim();
    this.voiceIdEn = (process.env.ELEVENLABS_VOICE_ID_EN || 'pNInz6obpgDQGcFmaJgB').trim();
    this.voiceIdFr = (process.env.ELEVENLABS_VOICE_ID_FR || 'pNInz6obpgDQGcFmaJgB').trim();
    this.apiBaseUrl = 'https://api.elevenlabs.io/v1';

    if (!this.apiKey || this.apiKey === 'your_elevenlabs_api_key_here') {
      console.warn('⚠️  ELEVENLABS_API_KEY not configured. Get your key at: https://elevenlabs.io/app/settings/api-keys');
    }
  }

  /**
   * Detects language from text (simple detection based on French keywords)
   * @param {string} text - Text to analyze
   * @returns {string} 'en' or 'fr'
   */
  detectLanguage(text) {
    const frenchKeywords = [
      'le', 'la', 'les', 'de', 'du', 'des', 'un', 'une',
      'est', 'sont', 'était', 'vous', 'nous', 'je', 'tu',
      'bonjour', 'merci', 'oui', 'non', 'comment', 'quoi',
      'où', 'quand', 'pourquoi', 'qui', 'quel', 'quelle'
    ];

    const lowerText = text.toLowerCase();
    let frenchCount = 0;

    frenchKeywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matches = lowerText.match(regex);
      if (matches) {
        frenchCount += matches.length;
      }
    });

    return frenchCount >= 2 ? 'fr' : 'en';
  }

  /**
   * Get voice ID based on language
   * @param {string} language - 'en' or 'fr'
   * @returns {string} Voice ID
   */
  getVoiceId(language) {
    return language === 'fr' ? this.voiceIdFr : this.voiceIdEn;
  }

  /**
   * Convert text to speech using ElevenLabs API
   * @param {string} text - Text to convert to speech
   * @param {string} language - Optional language override ('en' or 'fr')
   * @returns {Promise<Buffer>} Audio buffer
   */
  async textToSpeech(text, language = null) {
    try {
      // Validate API key
      if (!this.apiKey || this.apiKey === 'your_elevenlabs_api_key_here') {
        throw new Error('ElevenLabs API key not configured');
      }

      // Detect or use provided language
      const detectedLanguage = language || this.detectLanguage(text);
      const voiceId = this.getVoiceId(detectedLanguage);

      console.log(`🎤 Converting text to speech (${detectedLanguage}):`, text.substring(0, 100));

      // Call ElevenLabs API
      const response = await fetch(
        `${this.apiBaseUrl}/text-to-speech/${voiceId}`,
        {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': this.apiKey
          },
          body: JSON.stringify({
            text: text,
            model_id: 'eleven_multilingual_v2',
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75,
              style: 0.0,
              use_speaker_boost: true
            }
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.detail?.message || errorData.message || JSON.stringify(errorData) || response.statusText;
        console.error('❌ ElevenLabs API Response:', {
          status: response.status,
          statusText: response.statusText,
          errorData: errorData
        });
        throw new Error(`ElevenLabs API error: ${response.status} - ${errorMessage}`);
      }

      // Convert response to buffer
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = Buffer.from(arrayBuffer);

      console.log(`✅ Audio generated successfully (${audioBuffer.length} bytes)`);

      return audioBuffer;

    } catch (error) {
      console.error('❌ ElevenLabs TTS error:', error.message);
      throw error;
    }
  }

  /**
   * Get available voices from ElevenLabs
   * @returns {Promise<Array>} List of available voices
   */
  async getVoices() {
    try {
      if (!this.apiKey || this.apiKey === 'your_elevenlabs_api_key_here') {
        throw new Error('ElevenLabs API key not configured');
      }

      const response = await fetch(
        `${this.apiBaseUrl}/voices`,
        {
          method: 'GET',
          headers: {
            'xi-api-key': this.apiKey
          }
        }
      );

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status}`);
      }

      const data = await response.json();
      return data.voices || [];

    } catch (error) {
      console.error('❌ Error fetching voices:', error.message);
      throw error;
    }
  }
}

module.exports = new ElevenLabsService();
