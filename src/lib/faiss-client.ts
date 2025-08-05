import ky from 'ky';

export interface SimilarityRequest {
  word1: string;
  word2: string;
}

export interface SimilarityResponse {
  word1: string;
  word2: string;
  similarity: number;
  found_word1: boolean;
  found_word2: boolean;
}

export interface HealthResponse {
  status: string;
  model_loaded: boolean;
  vocab_size: number;
}

class FAISSClient {
  private baseUrl: string;
  private client: typeof ky;

  constructor(baseUrl: string = process.env.NLP_SERVICE_URL || 'http://localhost:8000') {
    this.baseUrl = baseUrl;
    this.client = ky.extend({
      prefixUrl: this.baseUrl,
      timeout: 10000, // 10 seconds timeout
      retry: {
        limit: 2,
        methods: ['get', 'post'],
        statusCodes: [408, 413, 429, 500, 502, 503, 504]
      }
    });
  }

  /**
   * Check if the NLP service is healthy and ready
   */
  async checkHealth(): Promise<HealthResponse> {
    try {
      const response = await this.client.get('health').json<HealthResponse>();
      return response;
    } catch (error) {
      console.error('Health check failed:', error);
      throw new Error('NLP service is not available');
    }
  }

  /**
   * Calculate cosine similarity between two Korean words
   */
  async calculateSimilarity(word1: string, word2: string): Promise<number> {
    try {
      const request: SimilarityRequest = { word1, word2 };
      const response = await this.client.post('similarity', {
        json: request
      }).json<SimilarityResponse>();

      return response.similarity;
    } catch (error) {
      console.error('Similarity calculation failed:', error);
      
      // Fallback to mock similarity if service is unavailable
      return this.mockSimilarity(word1, word2);
    }
  }

  /**
   * Mock similarity calculation as fallback
   */
  private mockSimilarity(word1: string, word2: string): number {
    // Simple character-based similarity as fallback
    if (word1 === word2) return 1.0;
    
    const minLength = Math.min(word1.length, word2.length);
    const maxLength = Math.max(word1.length, word2.length);
    
    let commonChars = 0;
    for (let i = 0; i < minLength; i++) {
      if (word1[i] === word2[i]) {
        commonChars++;
      }
    }
    
    // Base similarity on common characters and length difference
    const baseSimilarity = commonChars / maxLength;
    
    // Add some randomness to make it more interesting for testing
    const randomFactor = 0.3 + Math.random() * 0.4; // 0.3 to 0.7
    
    return Math.min(0.95, baseSimilarity * 0.3 + randomFactor);
  }

  /**
   * Test connection to the NLP service
   */
  async testConnection(): Promise<boolean> {
    try {
      const health = await this.checkHealth();
      return health.status === 'healthy' && health.model_loaded;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const faissClient = new FAISSClient();

// Export class for testing or custom instances
export { FAISSClient };