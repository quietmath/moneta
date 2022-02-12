/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const assert = require('assert');
const Pair = require('../lib/pair');

describe('Unit tests for creating pairs for bulk actions', function() {

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

    it('should create pairs from a key array', function() {
        const keys = [1, 2, 3, 4];
        const pairs = Pair.asPairs(keys, data);
        assert.notEqual(pairs, null);
        assert.notEqual(pairs.length, 0);
        assert.equal(pairs[0].key, 1);
        assert.notEqual(pairs[0].data, null);
    });
    it('should create pairs from a key selection', function() {
        const pairs = Pair.asPairs('title', data);
        assert.notEqual(pairs, null);
        assert.notEqual(pairs.length, 0);
        assert.equal(pairs[0].key, 'fake title');
        assert.notEqual(pairs[0].data, null);
    });
});
