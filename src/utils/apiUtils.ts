// Cache configuration
interface CacheConfig {
  key: string
  expiry: number // milliseconds
}

interface CacheData<T> {
  data: T
  timestamp: number
}

/**
 * Creates a cached API request function
 * @param apiFunction The original API function to call
 * @param cacheKey Unique key for cache storage
 * @param expiryTime Cache expiry time in milliseconds (default: 10 minutes)
 * @returns A function that returns cached data or calls API if cache is invalid
 */
export function createCachedApiCall<T>(
  apiFunction: (...args: any[]) => Promise<T>,
  cacheConfig: CacheConfig,
) {
  const { key, expiry = 10 * 60 * 1000 } = cacheConfig

  return async (...args: any[]): Promise<T> => {
    try {
      // Try to get from cache first
      const cachedData = getFromCache<T>(key)
      if (cachedData) {
        // If we have valid cached data, return it immediately
        return cachedData
      }
    } catch (error) {
      console.error('Cache error:', error)
      // Continue to API call if cache fails
    }

    // If no cache or expired, call the API
    const data = await apiFunction(...args)

    // Save to cache
    try {
      saveToCache(key, data, expiry)
    } catch (error) {
      console.error('Error saving to cache:', error)
    }

    return data
  }
}

/**
 * Refreshes cached data in the background
 * @param apiFunction The original API function to call
 * @param cacheKey Unique key for cache storage
 * @returns The fetched data for optional UI updates
 */
export async function refreshCacheInBackground<T>(
  apiFunction: (...args: any[]) => Promise<T>,
  cacheKey: string,
  ...args: any[]
): Promise<T | null> {
  try {
    const data = await apiFunction(...args)
    saveToCache(cacheKey, data)
    return data
  } catch (error) {
    console.error('Background refresh failed:', error)
    return null
  }
}

/**
 * Get data from the cache
 * @param key Cache key
 * @returns Cached data or null if invalid/expired
 */
export function getFromCache<T>(key: string): T | null {
  const cached = localStorage.getItem(key)
  if (!cached) return null

  try {
    const { data, timestamp } = JSON.parse(cached) as CacheData<T>
    const expiry = getCacheExpiry(key)

    // Check if cache is still valid
    if (Date.now() - timestamp < expiry) {
      return data
    }
  } catch (e) {
    console.error('Error parsing cache:', e)
    localStorage.removeItem(key) // Remove invalid cache
  }

  return null
}

/**
 * Save data to cache
 * @param key Cache key
 * @param data Data to cache
 * @param expiry Custom expiry time (optional)
 */
export function saveToCache<T>(key: string, data: T, expiry?: number): void {
  try {
    const cacheData: CacheData<T> = {
      data,
      timestamp: Date.now(),
    }

    localStorage.setItem(key, JSON.stringify(cacheData))

    // If custom expiry is provided, save it
    if (expiry) {
      setCacheExpiry(key, expiry)
    }
  } catch (e) {
    console.error('Error saving cache:', e)
  }
}

/**
 * Set cache expiry time for a key
 */
function setCacheExpiry(key: string, expiry: number): void {
  try {
    const expiryKey = `${key}_expiry`
    localStorage.setItem(expiryKey, expiry.toString())
  } catch (e) {
    console.error('Error saving cache expiry:', e)
  }
}

/**
 * Get cache expiry time for a key
 * Default to 10 minutes if not specified
 */
function getCacheExpiry(key: string): number {
  try {
    const expiryKey = `${key}_expiry`
    const saved = localStorage.getItem(expiryKey)
    return saved ? parseInt(saved, 10) : 10 * 60 * 1000 // Default: 10 minutes
  } catch (e) {
    return 10 * 60 * 1000 // Default: 10 minutes
  }
}
