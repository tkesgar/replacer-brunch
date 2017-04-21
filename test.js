/* eslint-env mocha */
'use strict';

const chaiAsPromised = require('chai-as-promised');
const chai = require('chai').use(chaiAsPromised);
const expect = chai.expect;

const Plugin = require('.');

describe('Plugin', () => {
  describe('with no options', () => {
    const plugin = new Plugin({plugins: {}});

    it('should not modify falsy file', () => {
      const file1 = null;
      const file2 = null;
      return expect(plugin.compile(file1)).to.eventually.deep.equal(file2);
    });

    it('should not modify empty file', () => {
      const file1 = {};
      const file2 = {};
      return expect(plugin.compile(file1)).to.eventually.deep.equal(file2);
    });

    it('should not modify file without data', () => {
      const file1 = {test: 'test'};
      const file2 = {test: 'test'};
      return expect(plugin.compile(file1)).to.eventually.deep.equal(file2);
    });

    it('should not modify file with data', () => {
      const file1 = {data: 'test'};
      const file2 = {data: 'test'};
      return expect(plugin.compile(file1)).to.eventually.deep.equal(file2);
    });
  });

  describe('using string as key', () => {
    const plugin = new Plugin({plugins: {replacer: {
      dict: [{key: '__KEY__', value: '__VALUE__'}],
    }}});

    it('should replace key with value', () => {
      const file1 = {data: 'test'};
      const file2 = {data: 'test'};
      return expect(plugin.compile(file1)).to.eventually.deep.equal(file2);
    });

    it('should not replace anything', () => {
      const file1 = {data: '__KEY'};
      const file2 = {data: '__KEY'};
      return expect(plugin.compile(file1)).to.eventually.deep.equal(file2);
    });
  });

  describe('using global regex as key', () => {
    const plugin = new Plugin({plugins: {replacer: {
      dict: [{key: /__KEY__/g, value: '__VALUE__'}],
    }}});

    it('should replace key with value', () => {
      const file1 = {data: '__KEY__'};
      const file2 = {data: '__VALUE__'};
      return expect(plugin.compile(file1)).to.eventually.deep.equal(file2);
    });

    it('should replace multiple occurrences', () => {
      const file1 = {data: '__KEY__ --- __KEY__'};
      const file2 = {data: '__VALUE__ --- __VALUE__'};
      return expect(plugin.compile(file1)).to.eventually.deep.equal(file2);
    });
  });

  describe('using non-strings as value', () => {

    describe('with object', () => {
      const plugin = new Plugin({plugins: {replacer: {
        dict: [{key: /__KEY__/g, value: {one: 1, two: 'two'}}],
      }}});

      it('should replace key with value', () => {
        const file1 = {data: '__KEY__'};
        const file2 = {data: '{"one":1,"two":"two"}'};
        return expect(plugin.compile(file1)).to.eventually.deep.equal(file2);
      });
    });

    describe('with Number', () => {
      const plugin = new Plugin({plugins: {replacer: {
        dict: [{key: /__KEY__/g, value: 123456}],
      }}});

      it('should replace key with value', () => {
        const file1 = {data: '__KEY__'};
        const file2 = {data: '123456'};
        return expect(plugin.compile(file1)).to.eventually.deep.equal(file2);
      });
    });

    describe('with null', () => {
      const plugin = new Plugin({plugins: {replacer: {
        dict: [{key: /__KEY__/g, value: null}],
      }}});

      it('should replace key with value', () => {
        const file1 = {data: '__KEY__'};
        const file2 = {data: 'null'};
        return expect(plugin.compile(file1)).to.eventually.deep.equal(file2);
      });
    });

  });

  describe('using custom replace function', () => {
    const plugin = new Plugin({plugins: {replacer: {
      dict: [{key: '__KEY__', value: '__VALUE__'}],
      replace: (str, key, value) => str.split(key).join(value),
    }}});

    it('should replace key with value', () => {
      const file1 = {data: 'The quick brown __KEY__ jumps over the lazy __KEY__'};
      const file2 = {data: 'The quick brown __VALUE__ jumps over the lazy __VALUE__'};
      return expect(plugin.compile(file1)).to.eventually.deep.equal(file2);
    });
  });

});
