import { LRUCache } from 'lru-cache'

type Options = {
  uniqueTokenPerInterval?: number
  interval?: number
}

/**
 * Rate Limiter using LRU Cache
 *
 * Protects against:
 * - Spam submissions
 * - Brute force attacks
 * - DoS attempts
 *
 * Usage:
 * const limiter = rateLimit({ interval: 60000, uniqueTokenPerInterval: 500 })
 * await limiter.check(10, ipAddress) // 10 requests per minute
 */
export default function rateLimit(options?: Options) {
  const tokenCache = new LRUCache<string, number>({
    max: options?.uniqueTokenPerInterval || 500,
    ttl: options?.interval || 60000, // 1 minute default
  })

  return {
    check: (limit: number, token: string) =>
      new Promise<void>((resolve, reject) => {
        const currentUsage = (tokenCache.get(token) ?? 0) + 1
        tokenCache.set(token, currentUsage)
        const isRateLimited = currentUsage > limit

        return isRateLimited ? reject() : resolve()
      }),
  }
}

/**
 * Duplicate order detection using order fingerprints
 * Prevents the same order from being submitted multiple times
 */
export class DuplicateDetector {
  private cache: LRUCache<string, 'processing' | 'processed'>

  constructor(ttlMs: number = 5 * 60 * 1000) { // 5 minutes default
    this.cache = new LRUCache({
      max: 1000,
      ttl: ttlMs,
    })
  }

  /**
   * Creates a fingerprint from order data
   * Same phone + product + similar timestamp = duplicate
   */
  createFingerprint(phone: string, productName: string): string {
    const normalized = phone.replace(/[\s-+]/g, '')
    return `${normalized}:${productName}`
  }

  // Reserve a fingerprint before processing. False means duplicate/in-flight request.
  reserve(phone: string, productName: string): boolean {
    const fingerprint = this.createFingerprint(phone, productName)
    if (this.cache.has(fingerprint)) {
      return false
    }

    this.cache.set(fingerprint, 'processing')
    return true
  }

  /**
   * Checks if this order fingerprint exists
   * Returns true if duplicate, false if unique
   */
  isDuplicate(phone: string, productName: string): boolean {
    const fingerprint = this.createFingerprint(phone, productName)
    return this.cache.has(fingerprint)
  }

  /**
   * Mark a reserved order as fully processed.
   */
  markAsProcessed(phone: string, productName: string): void {
    const fingerprint = this.createFingerprint(phone, productName)
    this.cache.set(fingerprint, 'processed')
  }

  /**
   * Release a reservation when processing fails.
   */
  release(phone: string, productName: string): void {
    const fingerprint = this.createFingerprint(phone, productName)
    if (this.cache.get(fingerprint) === 'processing') {
      this.cache.delete(fingerprint)
    }
  }
}
