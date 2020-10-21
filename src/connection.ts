import * as fs from 'fs-extra';
import { Cache } from './cache';
import { ResultSet } from './schema';

/**
 * @module quietmath/moneta
 */

export class JSONConnection {
    private _db: any; //This should be a DBCache object off of the Cache object
    private _dbPath: string;
    private _cache: Cache;
    constructor(dbPath: string, cacheTTL?: number) {
        this._dbPath = dbPath;
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
    public create(tableName: string): JSONConnection {
        this._db[tableName] = {};
        this._cache.set(this._dbPath, this._db);
        return this;

    }
    public drop(tableName: string): JSONConnection {
        this._db[tableName] = undefined;
        this._cache.set(this._dbPath, this._db);
        return this;
    }
    public select(tableName: string, key?: string): ResultSet {
        return {
            type: 'select',
            success: true,
            key: key,
            value: this._db[tableName][key] //Need conditional
        };
    }
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public insert(tableName: string, key: string, value: any): ResultSet {
        if(this._db[tableName][key] !== undefined) {
            return {
                type: 'insert',
                success: false,
                key: null,
                requestedKey: key,
                value: value
            };
        }
        this._db[tableName][key] = value;
        this._cache.set(this._dbPath, this._db);
        return {
            type: 'insert',
            success: true,
            key: key,
            requestedKey: key,
            value: value
        };
    }
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public update(tableName: string, key: string, value: any): ResultSet {
        if(this._db[tableName][key] !== undefined) {
            this._db[tableName][key] = value;
            this._cache.set(this._dbPath, this._db);
            return {
                type: 'update',
                success: true,
                key: key,
                requestedKey: key,
                value: value
            };
        }
        return {
            type: 'update',
            success: false,
            key: null,
            requestedKey: key,
            value: value
        };
    }
    public delete(tableName: string, key: string): ResultSet {
        if(this._db[tableName][key] !== undefined) {
            const value = this._db[tableName][key];
            this._db[tableName][key] = undefined;
            this._cache.set(this._dbPath, this._db);
            return {
                type: 'delete',
                success: true,
                key: key,
                requestedKey: key,
                value: value
            };
        }
        return {
            type: 'delete',
            success: false,
            key: null,
            requestedKey: key,
            value: null
        };
    }
    public async commit(): Promise<void> {
        fs.writeFile(this._dbPath, this._db, { encoding: 'utf8' });
    }
}
