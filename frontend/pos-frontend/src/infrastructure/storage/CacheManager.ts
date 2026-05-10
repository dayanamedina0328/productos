export interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

export interface CachePolicy {
  /** Tiempo de vida en milisegundos */
  ttl: number;
}

const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutos

/**
 * CacheManager — caché en memoria con políticas de expiración configurables.
 * Útil para evitar peticiones repetidas a la API en un corto período.
 */
export class CacheManager {
  private readonly store = new Map<string, CacheEntry<unknown>>();
  private readonly policies = new Map<string, CachePolicy>();

  /** Registra una política de expiración para un prefijo de clave */
  registerPolicy(keyPrefix: string, policy: CachePolicy): void {
    this.policies.set(keyPrefix, policy);
  }

  private getTtl(key: string): number {
    for (const [prefix, policy] of this.policies) {
      if (key.startsWith(prefix)) return policy.ttl;
    }
    return DEFAULT_TTL;
  }

  set<T>(key: string, data: T): void {
    const ttl = this.getTtl(key);
    this.store.set(key, { data, expiresAt: Date.now() + ttl });
  }

  get<T>(key: string): T | null {
    const entry = this.store.get(key) as CacheEntry<T> | undefined;
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return entry.data;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  invalidate(key: string): void {
    this.store.delete(key);
  }

  /** Invalida todas las claves que empiecen con el prefijo dado */
  invalidateByPrefix(prefix: string): void {
    for (const key of this.store.keys()) {
      if (key.startsWith(prefix)) this.store.delete(key);
    }
  }

  clear(): void {
    this.store.clear();
  }

  /** Elimina entradas expiradas (limpieza manual) */
  purgeExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.store) {
      if (now > entry.expiresAt) this.store.delete(key);
    }
  }
}
