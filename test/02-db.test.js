/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const assert = require('assert');
const _ = require('lodash');
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
    
    const key = (new Date()).getMilliseconds();

    const data = {
        id: key,
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
    it('should insert data into a table', () => {
        assert.doesNotThrow(() => {
            db.create('temp');
        }, 'Error creating a table.');
        const result = db.insert('temp', key, data);
        assert.equal(result.success, true);
        assert.equal(result.key, key);
    });
    it('should update data in a table', () => {
        const updateSet = _.cloneDeep(data);
        updateSet.title = 'fake title (updated)';
        const result = db.update('temp', key, updateSet);
        assert.equal(result.success, true);
        assert.equal(result.key, key);
        assert.equal(result.value.title, 'fake title (updated)');
    });
    it('should select data from table', () => {
        const result = db.select('temp', key);
        assert.equal(result.success, true);
        assert.equal(result.key, key);
        assert.notEqual(result.value, null);
    });
    it('should delete data from the table', () => {
        let result = db.delete('temp', key);
        assert.equal(result.success, true);
        assert.equal(result.key, key);
        result = db.select('temp', key);
        assert.equal(result.success, true);
        assert.equal(result.key, criteria);
        assert.equal(result.value, null);
    });
});
