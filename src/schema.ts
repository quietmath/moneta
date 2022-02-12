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
    key: string | Criteria | undefined;
    requestedKey?: string | undefined;
    value: any | any[];
}

export interface Criteria {
    key?: string | undefined;
    where?: [key: string, value: string] | undefined;
    sort?: [key: string | number, direction: 'ASC' | 'DESC'] | undefined;
    limit?: number | undefined;
}
