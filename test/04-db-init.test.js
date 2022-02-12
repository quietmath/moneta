/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const assert = require('assert');
const JSONStore = require('../lib/db');

describe('Unit tests for JSONStore class initialization', function() {
    it('should create a JSONStore object with just a name', function() {
        const db = new JSONStore('codepunk.json');
        assert.notEqual(db, null);
    });
    it('should create a JSONStore object with a settings object', function() {
        const db = new JSONStore({
            dbname: 'codepunk.json',
            path: '/home/szul/code/quietmath/moneta',
            cacheTTL: 4800
        });
        assert.notEqual(db, null);
    });
});
