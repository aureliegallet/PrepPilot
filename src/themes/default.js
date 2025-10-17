/**
 * @fileoverview Default theme configuration
 * @module themes/default
 */

/**
 * Default theme with colors and styles
 */
export const defaultTheme = {
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  fontSize: 12,
  colors: {
    primary: '#4A90E2',
    secondary: '#50E3C2',
    accent: '#F5A623',
    success: '#7ED321',
    warning: '#F5A623',
    danger: '#D0021B',
    text: '#333333',
    background: '#FFFFFF',
    grid: '#E0E0E0'
  },
  palette: [
    '#4A90E2',
    '#50E3C2',
    '#F5A623',
    '#7ED321',
    '#BD10E0',
    '#D0021B',
    '#9013FE',
    '#417505'
  ],
  axis: {
    stroke: '#333333',
    strokeWidth: 1,
    fontSize: 11,
    fontColor: '#666666'
  },
  grid: {
    stroke: '#E0E0E0',
    strokeWidth: 1,
    strokeDasharray: '2,2'
  },
  tooltip: {
    background: 'rgba(0, 0, 0, 0.8)',
    color: '#FFFFFF',
    border: '#333333'
  },
  legend: {
    fontSize: 11,
    fontColor: '#666666'
  }
};

/**
 * Dark theme variant
 */
export const darkTheme = {
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  fontSize: 12,
  colors: {
    primary: '#64B5F6',
    secondary: '#4DB6AC',
    accent: '#FFB74D',
    success: '#81C784',
    warning: '#FFB74D',
    danger: '#E57373',
    text: '#E0E0E0',
    background: '#1E1E1E',
    grid: '#424242'
  },
  palette: [
    '#64B5F6',
    '#4DB6AC',
    '#FFB74D',
    '#81C784',
    '#BA68C8',
    '#E57373',
    '#9575CD',
    '#7CB342'
  ],
  axis: {
    stroke: '#E0E0E0',
    strokeWidth: 1,
    fontSize: 11,
    fontColor: '#BDBDBD'
  },
  grid: {
    stroke: '#424242',
    strokeWidth: 1,
    strokeDasharray: '2,2'
  },
  tooltip: {
    background: 'rgba(33, 33, 33, 0.95)',
    color: '#E0E0E0',
    border: '#616161'
  },
  legend: {
    fontSize: 11,
    fontColor: '#BDBDBD'
  }
};
