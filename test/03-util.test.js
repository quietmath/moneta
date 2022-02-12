/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const assert = require('assert');
const { mapArray } = require('../lib/util');

describe('Unit tests for utility functions', function() {

    const data = {
        'my-key-one': {
            title: 'fake title',
            byline: 'michael szul',
            data: {
                meta: 'keyword',
                anchor: [1, 2, 3]
            },
            content: 'lorem ipsum'
        },
        'my-key-two': {
            title: 'fake title 2',
            byline: 'michael szul',
            data: {
                meta: 'newsletter',
                anchor: [1, 2, 3]
            },
            content: 'lorem ipsum'
        }
    };

    it('should create pairs from a key array', function() {
        const result = mapArray(Object.entries(data));
        assert.notEqual(result, null);
        assert.equal(result[0].result_key, 'my-key-one');
    });

});
