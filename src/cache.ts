import * as NodeCache from 'node-cache';

/**
 * @module quietmath/moneta
 */

export class Cache {
    private _cache: NodeCache;
    constructor(ttlSeconds: number) {
        this._cache = new NodeCache({
            stdTTL: ttlSeconds,
            checkperiod: (ttlSeconds * 0.2)
        });
    }
    public getKeys(): string[] {
        return this._cache.keys();
    }
    public getSync(key: string): any {
        return this._cache.get(key);
    }
    // eslint-disable-next-line @typescript-eslint/ban-types
    public async get(key: string, callback?: Function): Promise<any> {
        const value: any = this._cache.get(key);
        if (value != null) {
            return Promise.resolve(value);
        }
        try {
            if(callback != null) {
                const result: any = await callback();
                this._cache.set(key, result);
                return Promise.resolve(result);
            }
            return Promise.resolve(null);
        }
        catch(e) {
            Promise.reject(e);
        }
    }
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public set(key: string, value: any): void {
        this._cache.set(key, value);
    }
    public del(key: string): number {
        return this._cache.del(key);
    }
    public flush(): void {
        this._cache.flushAll();
    }
}
