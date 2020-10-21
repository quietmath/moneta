import * as fs from 'fs-extra';
import { DBSettings, ResultSet } from './schema';
import { Cache } from './cache';

/**
 * @module quietmath/moneta
 */

export class JSONStore extends Cache {
    private _db: any;
    private _dbName: string;
    private _dbPath: string;
    private _settings: DBSettings;
    constructor(opts?: string | DBSettings) {
        super((opts as DBSettings)?.cacheTTL || 3600);
        if(typeof(opts) === 'string') {
            this._dbName = opts;
        }
        else {
            this._settings = opts;
            this._dbName = this._settings.dbname;
        }
        const name = this._dbName || 'db.json';
        const path = this._settings.path || process.cwd();
        this._dbPath = `${ path } / ${ name }`;
        this._db = this.getSync(this._dbPath);
        if(this._db == null) {
            const exists = fs.statSync(this._dbPath);
            if(exists) {
                const buffer = fs.readFileSync(this._dbPath, { encoding: 'utf8' });
                try {
                    this._db = JSON.parse(buffer.toString());
                    this.set(this._dbPath, this._db);
                }
                catch(e) {
                    throw new Error(`Fatal error loading database: ${ e }`);
                }
            }
            else {
                fs.writeFileSync(this._dbPath, '{}', { encoding: 'utf8'} );
                this._db = {};
                this.set(this._dbPath, this._db);

            }
        }
    }
    public create(tableName: string): JSONStore {
        this._db[tableName] = {};
        this.set(this._dbPath, this._db);
        return this;

    }
    public drop(tableName: string): JSONStore {
        this._db[tableName] = undefined;
        this.set(this._dbPath, this._db);
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
        this.set(this._dbPath, this._db);
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
            this.set(this._dbPath, this._db);
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
            this.set(this._dbPath, this._db);
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
