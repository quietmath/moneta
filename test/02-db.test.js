/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const assert = require('assert');
const { JSONStore } = require('../dist/db');

describe('Unit tests for JSONStore class initialization', function() {
    it('should create a JSONStore object with just a name', function() {
        const db = new JSONStore('codepunk');
        assert.notEqual(db, null);
    });
    it('should create a JSONStore object with a settings object', function() {
        const db = new JSONStore({
            dbname: 'codepunk',
            path: '/home/szul/code/quietmath',
            cacheTTL: 4800
        });
        assert.notEqual(db, null);
    });
});

describe('Unit tests for JSONStore class methods', function() {
    
    const data = {
        title: 'fake title',
        byline: 'fake byline',
        data: {
            meta: 'keyword',
            anchor: [1, 2, 3]
        },
        content: 'lorem ipsum'
    };
    
    const db = new JSONStore({
        dbname: 'codepunk',
        path: '/home/szul/code/quietmath',
        cacheTTL: 3600
    });
    it('should create a table', function() {
        assert.doesNotThrow(() => {
            db.create('pages');
        }, 'Error creating a table.');
    });
    it('should drop a table', function() {
        assert.doesNotThrow(() => {
            db.create('temp');
        }, 'Error creating a table.');
        assert.doesNotThrow(() => {
            db.drop('temp');
        }, 'Error dropping a table.');
    });
});
