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
  const tokenCache = new LRUCache({
    max: options?.uniqueTokenPerInterval || 500,
    ttl: options?.interval || 60000, // 1 minute default
  })

  return {
    check: (limit: number, token: string) =>
      new Promise<void>((resolve, reject) => {
        const tokenCount = (tokenCache.get(token) as number[]) || [0]
        if (tokenCount[0] === 0) {
          tokenCache.set(token, tokenCount)
        }
        tokenCount[0] += 1

        const currentUsage = tokenCount[0]
        const isRateLimited = currentUsage >= limit

        return isRateLimited ? reject() : resolve()
      }),
  }
}

/**
 * Duplicate order detection using order fingerprints
 * Prevents the same order from being submitted multiple times
 */
export class DuplicateDetector {
  private cache: LRUCache<string, boolean>

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

  /**
   * Checks if this order is a duplicate
   * Returns true if duplicate, false if unique
   */
  isDuplicate(phone: string, productName: string): boolean {
    const fingerprint = this.createFingerprint(phone, productName)
    const exists = this.cache.has(fingerprint)

    if (!exists) {
      this.cache.set(fingerprint, true)
    }

    return exists
  }

  /**
   * Manually mark an order as processed
   */
  markAsProcessed(phone: string, productName: string): void {
    const fingerprint = this.createFingerprint(phone, productName)
    this.cache.set(fingerprint, true)
  }
}
