import { faissClient } from './faiss-client';

// NLP service for word similarity calculations
class NLPService {
  private useExternalService: boolean = true;

  constructor() {
    // Test connection to FAISS service on startup
    this.testFAISSConnection();
  }

  private async testFAISSConnection() {
    try {
      const isConnected = await faissClient.testConnection();
      this.useExternalService = isConnected;
      console.log(`NLP Service mode: ${this.useExternalService ? 'FAISS' : 'Mock'}`);
    } catch (error) {
      console.warn('FAISS service not available, using mock similarity');
      this.useExternalService = false;
    }
  }

  async calculateSimilarity(word1: string, word2: string): Promise<number> {
    if (this.useExternalService) {
      try {
        return await faissClient.calculateSimilarity(word1, word2);
      } catch (error) {
        console.warn('FAISS service failed, falling back to mock:', error);
        this.useExternalService = false;
        return this.mockSimilarity(word1, word2);
      }
    }
    
    return this.mockSimilarity(word1, word2);
  }

  private mockSimilarity(word1: string, word2: string): number {
    // Mock implementation - fallback when FAISS service is unavailable
    if (word1 === word2) {
      return 1.0;
    }
    
    // Simulate some basic similarity based on common characters
    const set1 = new Set(word1.split(''));
    const set2 = new Set(word2.split(''));
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    
    const jaccard = intersection.size / union.size;
    
    // Add some randomness for now
    const randomFactor = Math.random() * 0.3;
    
    return Math.min(jaccard + randomFactor, 0.99);
  }

  /**
   * Get current service status
   */
  async getServiceStatus() {
    if (this.useExternalService) {
      try {
        const health = await faissClient.checkHealth();
        return {
          service: 'FAISS',
          status: health.status,
          model_loaded: health.model_loaded,
          vocab_size: health.vocab_size
        };
      } catch {
        return {
          service: 'FAISS',
          status: 'unavailable',
          model_loaded: false,
          vocab_size: 0
        };
      }
    }
    
    return {
      service: 'Mock',
      status: 'active',
      model_loaded: true,
      vocab_size: 'N/A'
    };
  }

  async loadModel(): Promise<void> {
    // Test FAISS connection
    await this.testFAISSConnection();
    console.log(`NLP Service initialized in ${this.useExternalService ? 'FAISS' : 'Mock'} mode`);
  }
}

export const nlpService = new NLPService();