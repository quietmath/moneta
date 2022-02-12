import * as fs from 'fs-extra';
import { cloneDeep } from 'lodash';
import { Criteria, DBSettings, PairSet, ResultSet } from './schema';
import Cache from './cache';
import { mapArray } from './util';

/**
 * @module quietmath/moneta
 */

export default class JSONStore extends Cache {
    private _db: any;
    private _dbName: string;
    private _dbPath: string;
    private _settings: Partial<DBSettings> = {};
    constructor(opts?: string | DBSettings) {
        super((opts as DBSettings)?.cacheTTL || 3600);
        if(typeof(opts) === 'string') {
            this._dbName = opts;
        }
        else {
            this._settings = opts as DBSettings;
            this._dbName = this._settings.dbname as string;
        }
        const name = this._dbName || 'db.json';
        const path = this._settings?.path || process.cwd();
        this._dbPath = `${ path }/${ name }`;
        this._db = this.getSync(this._dbPath);
        if(this._db == null) {
            const exists = fs.existsSync(this._dbPath);
            if(exists) {
                const contents = fs.readFileSync(this._dbPath, { encoding: 'utf8' });
                try {
                    this._db = JSON.parse(contents);
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
    public exists(tableName: string): boolean {
        if(this._db[tableName] != null) {
            return true;
        }
        return false;
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
    public select(tableName: string, criteria?: string | Criteria): ResultSet {
        if(typeof(criteria) === 'string' || typeof(criteria) === 'number') {
            return {
                type: 'select',
                success: true,
                key: criteria,
                value: this._db[tableName][criteria]
            };
        }
        let result = cloneDeep(this._db[tableName]);
        let arrayResult: any[] = [];
        if(criteria?.key != null) {
            result = result[criteria.key];
        }
        if(criteria?.where != null) {
            try {
                for(const r in result) {
                    // eslint-disable-next-line no-prototype-builtins
                    if(result.hasOwnProperty(r)) {
                        if(result[r][criteria.where[0]] != criteria.where[1]) {
                            delete result[r];
                        }
                    }
                }
            }
            catch(e) {
                console.error(`Cannot filter object: ${ e }`);
            }
        }
        if(criteria?.sort != null) {
            let r: any[];
            const sort = (criteria as Criteria).sort as [key: string | number, direction: 'ASC' | 'DESC'];
            if(typeof(sort[0]) === 'string') {
                if(criteria.sort[1].toUpperCase() === 'ASC') {
                    r = Object.entries(result).sort((a: any, b: any) => a[1][sort[0]].localeCompare(b[1][sort[0]]));
                }
                else {
                    r = Object.entries(result).sort((a: any, b: any) => b[1][sort[0]].localeCompare(a[1][sort[0]]));
                }
            }
            else {
                if(criteria.sort[1].toUpperCase() === 'ASC') {
                    r = Object.entries(result).sort((a: any, b: any) => b[1][sort[0]]- a[1][sort[0]]);
                }
                else {
                    r = Object.entries(result).sort((a: any, b: any) => a[1][sort[0]]- b[1][sort[0]]);
                }
            }
            arrayResult = mapArray(r);
        }
        if(arrayResult.length === 0) {
            arrayResult = mapArray(Object.entries(result));
        }
        if(criteria?.limit) {
            if(criteria instanceof Array && criteria.length > criteria.limit) {
                arrayResult = arrayResult.slice(0, criteria.limit);
            }
        }
        return {
            type: 'select',
            success: true,
            key: criteria,
            value: arrayResult
        };
    }
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public insert(tableName: string, key: string, value: any): ResultSet {
        if(this._db[tableName][key] !== undefined) {
            return {
                type: 'insert',
                success: false,
                key: undefined,
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
    public insertAll(tableName: string, pairs: PairSet[]): number {
        let count = 0;
        pairs.forEach((item: PairSet) => {
            if(item != null && item.key != null) {
                try {
                    const result = this.insert(tableName, item.key, item.data);
                    if(result.success) {
                        count++;
                    }
                }
                catch(e) {
                    console.error(`Failed to insert record for ${ item.key }: ${ e }`);
                }
            }
        });
        return count;
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
            key: undefined,
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
            key: undefined,
            requestedKey: key,
            value: null
        };
    }
    public commit(): void {
        fs.writeFileSync(this._dbPath, JSON.stringify(this._db), { encoding: 'utf8' });
    }
}
