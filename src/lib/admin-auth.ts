import 'server-only';
import { createHmac, timingSafeEqual } from 'node:crypto';

const cookieName = 'vaynotes_admin';
const sessionLengthSeconds = 60 * 60 * 12;

function requiredConfig() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!username || !password || !secret || secret.length < 32) {
    throw new Error('Admin environment is incomplete.');
  }
  return { username, password, secret };
}

function safeEqual(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function checkCredentials(username: unknown, password: unknown) {
  const config = requiredConfig();
  return typeof username === 'string' && typeof password === 'string' &&
    safeEqual(username, config.username) && safeEqual(password, config.password);
}

export function makeSessionCookie() {
  const { username, secret } = requiredConfig();
  const expires = Math.floor(Date.now() / 1000) + sessionLengthSeconds;
  const signature = createHmac('sha256', secret).update(`${username}:${expires}`).digest('base64url');
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${cookieName}=${expires}.${signature}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${sessionLengthSeconds}${secure}`;
}

export function clearSessionCookie() {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${cookieName}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${secure}`;
}

export function isAdminRequest(request: Request) {
  try {
    const { username, secret } = requiredConfig();
    const cookies = request.headers.get('cookie') ?? '';
    const match = cookies.match(new RegExp(`(?:^|;\\s*)${cookieName}=([^;]+)`));
    if (!match) return false;
    const [expiresString, signature] = match[1].split('.');
    const expires = Number(expiresString);
    if (!Number.isSafeInteger(expires) || expires <= Date.now() / 1000 || !signature) return false;
    const expected = createHmac('sha256', secret).update(`${username}:${expires}`).digest('base64url');
    return safeEqual(signature, expected);
  } catch {
    return false;
  }
}

export function sameOriginRequest(request: Request) {
  const origin = request.headers.get('origin');
  return origin !== null && origin === new URL(request.url).origin;
}

export const adminCookieName = cookieName;
