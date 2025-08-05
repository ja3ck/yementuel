import { v4 as uuidv4 } from 'uuid';

export const SESSION_COOKIE_NAME = 'yementuel_session';
export const SESSION_EXPIRY_HOURS = 24;

/**
 * Generate a unique session ID
 */
export function generateSessionId(): string {
  return uuidv4();
}

/**
 * Get session ID from server-side cookies
 */
export function getSessionIdFromCookies(cookieHeader?: string): string | null {
  if (!cookieHeader) return null;
  
  const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);

  return cookies[SESSION_COOKIE_NAME] || null;
}

/**
 * Create session cookie options
 */
export function getSessionCookieOptions() {
  const maxAge = SESSION_EXPIRY_HOURS * 60 * 60; // Convert hours to seconds
  
  return {
    maxAge,
    httpOnly: false, // Allow client-side access for fallback
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
  };
}

/**
 * Format Set-Cookie header value
 */
export function formatSetCookieHeader(sessionId: string): string {
  const options = getSessionCookieOptions();
  let cookieString = `${SESSION_COOKIE_NAME}=${sessionId}`;
  
  if (options.maxAge) cookieString += `; Max-Age=${options.maxAge}`;
  if (options.httpOnly) cookieString += `; HttpOnly`;
  if (options.secure) cookieString += `; Secure`;
  if (options.sameSite) cookieString += `; SameSite=${options.sameSite}`;
  if (options.path) cookieString += `; Path=${options.path}`;
  
  return cookieString;
}