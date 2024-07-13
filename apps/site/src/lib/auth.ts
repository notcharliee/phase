import CryptoJS from "crypto-js"

import { env } from "~/lib/env"

import type { cookies as cookiesFn } from "next/headers"

const secret = env.AUTH_COOKIE_SECRET
const secretKey = CryptoJS.enc.Base64.parse(secret)

export interface CookieData {
  userId: string
  guildId: string
  createdAt: Date
  expiresAt: Date
}

/**
 * Encrypts the given text using AES-256-CBC with the secret key.
 * @param text The text to encrypt.
 * @returns The encrypted text.
 */
export function encrypt(text: string) {
  const iv = CryptoJS.lib.WordArray.random(16)
  const encrypted = CryptoJS.AES.encrypt(text, secretKey, { iv: iv })
  return iv.toString() + ":" + encrypted.ciphertext.toString(CryptoJS.enc.Hex)
}

/**
 * Decrypts the given text using AES-256-CBC with the secret key.
 * @param text The text to decrypt.
 * @returns The decrypted text.
 */
export function decrypt(text: string) {
  const textParts = text.split(":")
  const iv = CryptoJS.enc.Hex.parse(textParts.shift()!)
  const encryptedText = CryptoJS.enc.Hex.parse(textParts.join(":"))
  const encrypted = CryptoJS.lib.CipherParams.create({
    ciphertext: encryptedText,
    iv: iv,
    key: secretKey,
  })
  const decrypted = CryptoJS.AES.decrypt(encrypted, secretKey, { iv: iv })
  return decrypted.toString(CryptoJS.enc.Utf8)
}

/**
 * Signs the given data using HMAC-SHA256.
 * @param data The data to sign.
 * @returns The signature.
 */
export function sign(data: string) {
  return CryptoJS.HmacSHA256(data, secretKey).toString(CryptoJS.enc.Hex)
}

/**
 * Creates a cookie with the given data.
 * @param cookies The cookies object.
 * @param data The data to store in the cookie.
 * @returns The cookie.
 */
export function createCookie(
  cookies: ReturnType<typeof cookiesFn>,
  data: Pick<CookieData, "userId" | "guildId">,
) {
  const cookieData: CookieData = {
    ...data,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
  }

  const payload = JSON.stringify(data)
  const encryptedPayload = encrypt(payload)
  const signature = sign(encryptedPayload)

  cookies.set("session", `${encryptedPayload}.${signature}`, {
    expires: cookieData.expiresAt,
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  })
}

/**
 * Verifies the given cookie and returns the decrypted payload.
 * @param cookie The cookie to verify.
 * @returns The decrypted payload.
 */
export function verifyCookie(cookie: string) {
  const [encryptedPayload, signature] = cookie.split(".")

  if (!encryptedPayload || sign(encryptedPayload) !== signature) {
    throw new Error("Invalid cookie signature")
  }

  const decryptedPayload = JSON.parse(decrypt(encryptedPayload)) as CookieData
  return decryptedPayload
}
