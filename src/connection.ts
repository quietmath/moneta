import * as fs from 'fs-extra';
import { Cache } from './cache';

/**
 * @module quietmath/moneta
 */

export class JSONConnection {
    private _db: any;
    private _cache: Cache;
    constructor(dbPath: string, cacheTTL?: number) {
        this._cache = new Cache(cacheTTL || 3600);
        this._db = this._cache.getSync(dbPath);
        if(this._db == null) {
            const exists = fs.statSync(dbPath);
            if(exists) {
                const buffer = fs.readFileSync(dbPath, { encoding: 'utf8' });
                try {
                    this._db = JSON.parse(buffer.toString());
                    this._cache.set(dbPath, this._db);
                }
                catch(e) {
                    throw new Error(`Fatal error loading database: ${ e }`);
                }
            }
            else {
                fs.writeFileSync(dbPath, '{}', { encoding: 'utf8'} );
                this._db = {};
                this._cache.set(dbPath, this._db);

            }
        }
    }
    public async create(): Promise<boolean> {

    }
    public async drop(): Promise<boolean> {

    }
    public async select(): Promise<any> {

    }
    public async insert(): Promise<any> {

    }
    public async update(): Promise<any> {

    }
    public async delete(): Promise<any> {

    }
    public async commit(): Promise<boolean> {

    }
}
