/**
 * @fileoverview Utility helper functions
 * @module utils/helpers
 */

/**
 * Deep merge two objects
 * @param {Object} target - Target object
 * @param {Object} source - Source object
 * @returns {Object} Merged object
 */
export function mergeDeep(target, source) {
  const output = Object.assign({}, target);
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = mergeDeep(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}

/**
 * Check if value is an object
 * @param {*} item - Value to check
 * @returns {boolean} True if object
 */
function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * Format number with specified precision
 * @param {number} num - Number to format
 * @param {number} [precision=2] - Decimal precision
 * @returns {string} Formatted number
 */
export function formatNumber(num, precision = 2) {
  return num.toFixed(precision);
}

/**
 * Generate unique ID
 * @returns {string} Unique ID
 */
export function generateId() {
  return `chart-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} Debounced function
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
