/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const assert = require('assert');
const _ = require('lodash');
const { JSONStore } = require('../dist/db');
const { Pair } = require('../dist/pair');

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
        dbname: 'codepunk.json',
        path: '/home/szul/code/quietmath/moneta',
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
    it('should insert data into a table', function() {
        assert.doesNotThrow(() => {
            db.create('temp');
        }, 'Error creating a table.');
        const result = db.insert('temp', key, data);
        assert.equal(result.success, true);
        assert.equal(result.key, key);
    });
    it('should update data in a table', function() {
        const updateSet = _.cloneDeep(data);
        updateSet.title = 'fake title (updated)';
        const result = db.update('temp', key, updateSet);
        assert.equal(result.success, true);
        assert.equal(result.key, key);
        assert.equal(result.value.title, 'fake title (updated)');
    });
    it('should select data from table', function() {
        const result = db.select('temp', key);
        assert.equal(result.success, true);
        assert.equal(result.key, key);
        assert.notEqual(result.value, null);
    });
    it('should delete data from the table', function() {
        let result = db.delete('temp', key);
        assert.equal(result.success, true);
        assert.equal(result.key, key);
        result = db.select('temp', key);
        assert.equal(result.success, true);
        assert.equal(result.key, key);
        assert.equal(result.value, null);
    });
    it('should commit data', function() {
        assert.doesNotThrow(() => {
            db.commit();
        }, 'Error saving data to disk.');
    });
});

describe('Unit tests for bulk actions and criteria selection', function() {
    
    const data = [
        {
            title: 'fake title',
            byline: 'michael szul',
            data: {
                meta: 'keyword',
                anchor: [1, 2, 3]
            },
            content: 'lorem ipsum'
        },
        {
            title: 'fake title 2',
            byline: 'michael szul',
            data: {
                meta: 'newsletter',
                anchor: [1, 2, 3]
            },
            content: 'lorem ipsum'
        },
        {
            title: 'fake title 3',
            byline: 'bill ahern',
            data: {
                meta: 'podcast',
                anchor: [1, 2, 3]
            },
            content: 'lorem ipsum'
        },
        {
            title: 'fake title 4',
            byline: 'michael szul',
            data: {
                meta: 'keyword',
                anchor: [1, 2, 3]
            },
            content: 'lorem ipsum'
        }
    ];

    const db = new JSONStore({
        dbname: 'codepunk.json',
        path: '/home/szul/code/quietmath/moneta',
        cacheTTL: 3600
    });

    it('should insert multiple records', function() {
        db.create('temp');
        const pairs = Pair.asPairs([1, 2, 3, 4], data);
        const result = db.insertAll('temp', pairs);
        db.commit();
        assert.notEqual(result, null);
        assert.equal(result, 4);
    });

    it('should select based on byline', function() {
        const result = db.select('temp', { where: ['byline', 'michael szul'] });
        assert.notEqual(result, null);
        assert.notEqual(result.length, 0);
        assert.equal(result.value[0].title, 'fake title');
    });

    it('should sort based on byline and select', function() {
        const result = db.select('temp', {
            sort: ['byline', 'ASC']
        });
        assert.notEqual(result, null);
        assert.notEqual(result.length, 0);
        assert.equal(result.value[0].title, 'fake title 3');
    });

});
