/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const assert = require('assert');
const { Cache } = require('../dist/cache');

describe('Unit tests for cache class', function() {
    let cache;
    it('should create a cache object', function() {
        cache = new Cache(3600);
        assert.notEqual(cache, null);
    });
    it('should set cache value', function() {
        assert.doesNotThrow(() => {
            cache.set('test', 'test');
        }, 'Could not set cache value.');
    });
    it('should get keys', function() {
        const keys = cache.getKeys();
        assert.equal(keys.length > 0, true);
    });
    it('should get the cache value from the synchronous function', function() {
        const value = cache.getSync('test');
        assert.equal(value, 'test');
    });
    it('should delete the cache value', function() {
        cache.del('test');
        const value = cache.getSync('test');
        assert.equal(value, null);
    });
    it('should set value when no cache and retrieve cache value', async function() {
        let value = await cache.get('test-async', async function() {
            return Promise.resolve('test-async');
        });
        assert.equal(value, 'test-async');
        value = cache.getSync('test-async');
        assert.equal(value, 'test-async');
    });
    it('should flush the cache', function() {
        assert.doesNotThrow(() => {
            cache.flush();
        }, 'Could not flush cache.');
        const value = cache.getSync('test-async');
        assert.equal(value, null);
    });
});
