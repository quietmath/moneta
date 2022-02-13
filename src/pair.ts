import { PairSet } from './schema';

/**
 * @module quietmath/moneta
 */

export class Pair {
    public static asPairs(key: string | string[], data: any[]): PairSet[] {
        if(typeof(key) !== 'string') {
            if(key.length !== data.length) {
                throw new Error('Mismatch length between key array and data array.');
            }
        }
        else {
            key = data.map((e: any) => e[key as string]);
            if(key.length === 0 || key[0] == null) {
                throw new Error('Selection criteria for key has created a mismatch.');
            }
        }
        try {
            const result: PairSet[] = [];
            data.forEach((item: any, idx: number) => {
                result.push({
                    key: key[idx],
                    data: item
                });
            });
            return result;
        }
        catch(e) {
            console.log(`Error creating pairs: ${ e }`);
        }
        return [];
    }
}
