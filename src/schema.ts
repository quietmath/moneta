/**
 * @module quietmath/moneta
 */

export interface DBSettings {
    dbname: string;
    path: string;
    cacheTTL?: number;
}

export interface ResultSet {
    type: 'select' | 'insert' | 'update' | 'delete';
    success: boolean;
    key: string;
    requestedKey?: string;
    value: any;
}
