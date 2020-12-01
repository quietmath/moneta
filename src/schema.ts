/**
 * @module quietmath/moneta
 */

export interface DBSettings {
    dbname: string;
    path: string;
    cacheTTL?: number;
}

export interface PairSet {
    key: string,
    data: any
}

export interface ResultSet {
    type: 'select' | 'insert' | 'update' | 'delete';
    success: boolean;
    key: string | Criteria;
    requestedKey?: string;
    value: any;
}

export interface Criteria {
    key?: string;
    where?: [key: string, value: string];
    sort?: [key: string | number, direction: 'ASC' | 'DESC'];
    limit?: number;
}
