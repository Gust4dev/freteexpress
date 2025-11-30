import NodeCache from 'node-cache';

class CacheService {
  private cache: NodeCache;

  constructor() {
    this.cache = new NodeCache();
  }

  public get<T>(key: string): T | undefined {
    return this.cache.get<T>(key);
  }

  public set(key: string, value: any, ttl: number): boolean {
    return this.cache.set(key, value, ttl);
  }

  public del(key: string): number {
    return this.cache.del(key);
  }

  public flush(): void {
    this.cache.flushAll();
  }
}

export const cacheService = new CacheService();
