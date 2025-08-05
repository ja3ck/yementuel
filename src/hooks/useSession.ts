'use client';

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const SESSION_STORAGE_KEY = 'yementuel_session';
const SESSION_COOKIE_NAME = 'yementuel_session';

/**
 * Custom hook for managing anonymous user sessions
 */
export function useSession() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Try to get session ID from various sources
    let existingSessionId = getSessionId();
    
    if (!existingSessionId) {
      // Generate new session ID
      existingSessionId = uuidv4();
      setSessionId(existingSessionId);
    }
    
    setSessionId(existingSessionId);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (sessionId) {
      // Store session ID in both cookie and localStorage
      storeSessionId(sessionId);
    }
  }, [sessionId]);

  return {
    sessionId,
    isLoading,
    generateNewSession: () => {
      const newSessionId = uuidv4();
      setSessionId(newSessionId);
      return newSessionId;
    },
  };
}

/**
 * Get session ID from cookie or localStorage
 */
function getSessionId(): string | null {
  // Try cookie first
  if (typeof document !== 'undefined') {
    const cookieValue = getCookie(SESSION_COOKIE_NAME);
    if (cookieValue) return cookieValue;
    
    // Fallback to localStorage
    try {
      const storageValue = localStorage.getItem(SESSION_STORAGE_KEY);
      if (storageValue) return storageValue;
    } catch (error) {
      console.warn('Failed to access localStorage:', error);
    }
  }
  
  return null;
}

/**
 * Store session ID in both cookie and localStorage
 */
function storeSessionId(sessionId: string): void {
  if (typeof document === 'undefined') return;
  
  // Set cookie
  const maxAge = 24 * 60 * 60; // 24 hours in seconds
  document.cookie = `${SESSION_COOKIE_NAME}=${sessionId}; Max-Age=${maxAge}; Path=/; SameSite=Lax`;
  
  // Set localStorage as backup
  try {
    localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
  } catch (error) {
    console.warn('Failed to store session in localStorage:', error);
  }
}

/**
 * Get cookie value by name
 */
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(';').shift();
    return cookieValue || null;
  }
  
  return null;
}