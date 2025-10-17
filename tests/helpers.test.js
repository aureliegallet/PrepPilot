/**
 * Tests for utility helper functions
 */

import { mergeDeep, formatNumber, generateId, debounce } from '../src/utils/helpers.js';

describe('Helper Functions', () => {
  describe('mergeDeep', () => {
    test('should merge two simple objects', () => {
      const target = { a: 1, b: 2 };
      const source = { b: 3, c: 4 };
      const result = mergeDeep(target, source);
      
      expect(result).toEqual({ a: 1, b: 3, c: 4 });
    });

    test('should deeply merge nested objects', () => {
      const target = { a: { x: 1, y: 2 } };
      const source = { a: { y: 3, z: 4 } };
      const result = mergeDeep(target, source);
      
      expect(result).toEqual({ a: { x: 1, y: 3, z: 4 } });
    });

    test('should not modify original objects', () => {
      const target = { a: 1 };
      const source = { b: 2 };
      mergeDeep(target, source);
      
      expect(target).toEqual({ a: 1 });
      expect(source).toEqual({ b: 2 });
    });
  });

  describe('formatNumber', () => {
    test('should format number with default precision', () => {
      expect(formatNumber(3.14159)).toBe('3.14');
    });

    test('should format number with custom precision', () => {
      expect(formatNumber(3.14159, 3)).toBe('3.142');
    });

    test('should handle integers', () => {
      expect(formatNumber(42)).toBe('42.00');
    });
  });

  describe('generateId', () => {
    test('should generate a string id', () => {
      const id = generateId();
      expect(typeof id).toBe('string');
    });

    test('should start with "chart-"', () => {
      const id = generateId();
      expect(id.startsWith('chart-')).toBe(true);
    });

    test('should generate unique ids', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
    });
  });

  describe('debounce', () => {
    test('should delay function execution', (done) => {
      let called = false;
      const func = () => { called = true; };
      const debouncedFunc = debounce(func, 50);
      
      debouncedFunc();
      expect(called).toBe(false);
      
      setTimeout(() => {
        expect(called).toBe(true);
        done();
      }, 100);
    });

    test('should call function only once for multiple rapid calls', (done) => {
      let callCount = 0;
      const func = () => { callCount++; };
      const debouncedFunc = debounce(func, 50);
      
      debouncedFunc();
      debouncedFunc();
      debouncedFunc();
      
      setTimeout(() => {
        expect(callCount).toBe(1);
        done();
      }, 100);
    });
  });
});
