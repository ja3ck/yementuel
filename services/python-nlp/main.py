import numpy as np
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import logging
import asyncio
from contextlib import asynccontextmanager
import math
import re

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global variables for model
word_vectors = None

class SimilarityRequest(BaseModel):
    word1: str
    word2: str

class SimilarityResponse(BaseModel):
    word1: str
    word2: str
    similarity: float
    found_word1: bool
    found_word2: bool

class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    vocab_size: int

def create_enhanced_korean_vectors():
    """Create enhanced Korean word vectors with semantic clustering"""
    # Extended Korean vocabulary with semantic groupings
    korean_words = {
        # Fruits (과일)
        "사과": [1.0, 0.8, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
        "바나나": [0.9, 0.9, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
        "딸기": [0.8, 0.8, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
        "포도": [0.7, 0.7, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
        "복숭아": [0.6, 0.9, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
        "수박": [0.5, 0.6, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
        "메론": [0.4, 0.7, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
        "키위": [0.3, 0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
        
        # Animals (동물)
        "고양이": [0.0, 0.0, 1.0, 0.8, 0.0, 0.0, 0.0, 0.0],
        "강아지": [0.0, 0.0, 0.9, 0.9, 0.0, 0.0, 0.0, 0.0],
        "토끼": [0.0, 0.0, 0.8, 0.7, 0.0, 0.0, 0.0, 0.0],
        "곰": [0.0, 0.0, 0.7, 0.6, 0.0, 0.0, 0.0, 0.0],
        "사자": [0.0, 0.0, 0.6, 0.5, 0.0, 0.0, 0.0, 0.0],
        "호랑이": [0.0, 0.0, 0.5, 0.4, 0.0, 0.0, 0.0, 0.0],
        "코끼리": [0.0, 0.0, 0.4, 0.3, 0.0, 0.0, 0.0, 0.0],
        "기린": [0.0, 0.0, 0.3, 0.2, 0.0, 0.0, 0.0, 0.0],
        
        # Buildings (건물)
        "학교": [0.0, 0.0, 0.0, 0.0, 1.0, 0.8, 0.0, 0.0],
        "집": [0.0, 0.0, 0.0, 0.0, 0.9, 0.9, 0.0, 0.0],
        "회사": [0.0, 0.0, 0.0, 0.0, 0.8, 0.7, 0.0, 0.0],
        "병원": [0.0, 0.0, 0.0, 0.0, 0.7, 0.6, 0.0, 0.0],
        "공원": [0.0, 0.0, 0.0, 0.0, 0.6, 0.5, 0.0, 0.0],
        "도서관": [0.0, 0.0, 0.0, 0.0, 0.5, 0.4, 0.0, 0.0],
        "카페": [0.0, 0.0, 0.0, 0.0, 0.4, 0.3, 0.0, 0.0],
        "식당": [0.0, 0.0, 0.0, 0.0, 0.3, 0.2, 0.0, 0.0],
        
        # Emotions (감정)
        "사랑": [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.9],
        "행복": [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.9, 1.0],
        "기쁨": [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.8, 0.8],
        "슬픔": [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.2, 0.1],
        "화남": [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, 0.0],
        "두려움": [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1],
        "평화": [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.7, 0.8],
        
        # Colors (색깔)
        "빨간색": [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
        "파란색": [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
        "노란색": [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
        "초록색": [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
        "검은색": [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
        "흰색": [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
        
        # Common objects (일반 사물)
        "컴퓨터": [0.1, 0.0, 0.0, 0.0, 0.2, 0.1, 0.0, 0.0],
        "핸드폰": [0.0, 0.1, 0.0, 0.0, 0.1, 0.2, 0.0, 0.0],
        "책": [0.0, 0.0, 0.1, 0.0, 0.3, 0.4, 0.0, 0.0],
        "연필": [0.0, 0.0, 0.0, 0.1, 0.2, 0.3, 0.0, 0.0],
        "가방": [0.0, 0.0, 0.0, 0.0, 0.1, 0.2, 0.0, 0.0],
        "신발": [0.0, 0.0, 0.0, 0.0, 0.0, 0.1, 0.0, 0.0],
        "옷": [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, 0.0],
        "모자": [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1],
        
        # Food & Drinks (음식과 음료)
        "음식": [0.5, 0.4, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
        "물": [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
        "우유": [0.3, 0.2, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
        "커피": [0.1, 0.0, 0.0, 0.0, 0.2, 0.3, 0.0, 0.0],
        "차": [0.0, 0.1, 0.0, 0.0, 0.1, 0.2, 0.0, 0.0],
        "주스": [0.4, 0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
        "빵": [0.2, 0.1, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
        "밥": [0.1, 0.0, 0.0, 0.0, 0.1, 0.0, 0.0, 0.0],
        
        # Family & People (가족과 사람)
        "친구": [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.6, 0.7],
        "가족": [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.8, 0.9],
        "부모": [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.7, 0.8],
        "형제": [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.5, 0.6],
        "자매": [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.4, 0.5],
        "선생님": [0.0, 0.0, 0.0, 0.0, 0.5, 0.6, 0.3, 0.4],
        "학생": [0.0, 0.0, 0.0, 0.0, 0.7, 0.8, 0.2, 0.3],
        "의사": [0.0, 0.0, 0.0, 0.0, 0.3, 0.4, 0.0, 0.0],
        
        # Weather & Seasons (날씨와 계절)
        "봄": [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
        "여름": [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
        "가을": [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
        "겨울": [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
        "비": [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
        "눈": [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
        "바람": [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
        "구름": [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
    }
    
    # Convert to numpy arrays and normalize
    vectors = {}
    for word, base_vec in korean_words.items():
        # Extend to higher dimensions with random noise
        full_vec = base_vec + [np.random.normal(0, 0.1) for _ in range(92)]  # Total 100 dimensions
        full_vec = np.array(full_vec)
        
        # Normalize vector
        norm = np.linalg.norm(full_vec)
        if norm > 0:
            full_vec = full_vec / norm
        vectors[word] = full_vec
    
    return vectors

def cosine_similarity(vec1, vec2):
    """Calculate cosine similarity between two vectors"""
    dot_product = np.dot(vec1, vec2)
    norm1 = np.linalg.norm(vec1)
    norm2 = np.linalg.norm(vec2)
    
    if norm1 == 0 or norm2 == 0:
        return 0.0
    
    return dot_product / (norm1 * norm2)

def calculate_similarity(word1: str, word2: str) -> tuple[float, bool, bool]:
    """Calculate similarity between two Korean words"""
    if word_vectors is None:
        return 0.1, False, False
    
    found_word1 = word1 in word_vectors
    found_word2 = word2 in word_vectors
    
    if word1 == word2:
        return 1.0, found_word1, found_word2
    
    if not found_word1 or not found_word2:
        # Use character-based similarity for unknown words
        return character_similarity(word1, word2), found_word1, found_word2
    
    # Calculate cosine similarity
    vec1 = word_vectors[word1]
    vec2 = word_vectors[word2]
    
    similarity = cosine_similarity(vec1, vec2)
    
    # Ensure similarity is between 0 and 1
    similarity = max(0.0, min(1.0, (similarity + 1) / 2))
    
    # Add small random factor for game variety
    similarity += np.random.normal(0, 0.02)  # Small noise
    similarity = max(0.0, min(1.0, similarity))
    
    return float(similarity), found_word1, found_word2

def character_similarity(word1: str, word2: str) -> float:
    """Calculate character-based similarity for unknown words"""
    if word1 == word2:
        return 1.0
    
    # Jaccard similarity
    set1 = set(word1)
    set2 = set(word2)
    intersection = len(set1.intersection(set2))
    union = len(set1.union(set2))
    
    if union == 0:
        return 0.0
    
    jaccard = intersection / union
    
    # Length similarity
    len_sim = 1 - abs(len(word1) - len(word2)) / max(len(word1), len(word2))
    
    # Combined similarity
    similarity = (jaccard * 0.7 + len_sim * 0.3) * 0.5  # Reduce for unknown words
    
    return max(0.05, min(0.4, similarity))  # Cap unknown word similarity

async def load_vectors():
    """Load word vectors asynchronously"""
    global word_vectors
    logger.info("Loading Korean word vectors...")
    word_vectors = create_enhanced_korean_vectors()
    logger.info(f"Loaded {len(word_vectors)} Korean word vectors")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting Korean NLP service...")
    await load_vectors()
    logger.info("Korean NLP service ready!")
    yield
    # Shutdown
    logger.info("Shutting down Korean NLP service...")

# Create FastAPI app
app = FastAPI(
    title="Korean NLP Service",
    description="Enhanced Korean word similarity service",
    version="1.0.0",
    lifespan=lifespan
)

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(
        status="healthy" if word_vectors is not None else "loading",
        model_loaded=word_vectors is not None,
        vocab_size=len(word_vectors) if word_vectors else 0
    )

@app.post("/similarity", response_model=SimilarityResponse)
async def calculate_word_similarity(request: SimilarityRequest):
    """Calculate similarity between two Korean words"""
    if word_vectors is None:
        raise HTTPException(status_code=503, detail="Model not loaded yet")
    
    try:
        similarity, found_word1, found_word2 = calculate_similarity(
            request.word1, request.word2
        )
        
        return SimilarityResponse(
            word1=request.word1,
            word2=request.word2,
            similarity=similarity,
            found_word1=found_word1,
            found_word2=found_word2
        )
    except Exception as e:
        logger.error(f"Error calculating similarity: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "Korean NLP Service", "status": "running", "vocab_size": len(word_vectors) if word_vectors else 0}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)