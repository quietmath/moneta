import { DBSettings } from './schema';
import { JSONConnection } from './connection';

/**
 * @module quietmath/moneta
 */

export class JSONStore {
    private _dbName: string;
    private _settings: DBSettings;
    private _connection: JSONConnection;
    constructor(opts?: string | DBSettings) {
        if(typeof(opts) === 'string') {
            this._dbName = opts;
        }
        else {
            this._settings = opts;
            this._dbName = this._settings.dbname;
        }
    }
    public getConnection(dbName?: string): JSONConnection {
        const name = dbName || this._dbName || 'db.json';
        const path = this._settings.path || process.cwd();
        this._connection = new JSONConnection(`${ path } / ${ name }`, this._settings.cacheTTL);
        return this._connection;
    }
}
