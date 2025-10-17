/**
 * @fileoverview Base Chart class providing core functionality for all chart types
 * @module core/Chart
 */

import * as d3 from 'd3';
import { mergeDeep } from '../utils/helpers.js';
import { defaultTheme } from '../themes/default.js';

/**
 * Base Chart class that provides common functionality for all chart types
 * Includes interactive features (zoom, pan, tooltips) and customization options
 */
export class Chart {
  /**
   * Creates a new Chart instance
   * @param {HTMLElement|string} container - Container element or selector
   * @param {Object} options - Configuration options
   * @param {Object} [options.theme] - Theme configuration
   * @param {Object} [options.margin] - Chart margins {top, right, bottom, left}
   * @param {number} [options.width] - Chart width
   * @param {number} [options.height] - Chart height
   * @param {boolean} [options.interactive=true] - Enable interactive features
   * @param {boolean} [options.zoomable=true] - Enable zoom
   * @param {boolean} [options.pannable=true] - Enable pan
   * @param {boolean} [options.tooltips=true] - Enable tooltips
   * @param {boolean} [options.filterable=true] - Enable filtering
   */
  constructor(container, options = {}) {
    // Get container element
    this.container = typeof container === 'string' 
      ? document.querySelector(container) 
      : container;
    
    if (!this.container) {
      throw new Error('Container element not found');
    }

    // Default configuration
    const defaults = {
      theme: defaultTheme,
      margin: { top: 20, right: 20, bottom: 40, left: 50 },
      width: 800,
      height: 400,
      interactive: true,
      zoomable: true,
      pannable: true,
      tooltips: true,
      filterable: true,
      animation: {
        duration: 750,
        ease: d3.easeCubicOut
      }
    };

    // Merge options with defaults
    this.options = mergeDeep(defaults, options);
    
    // Calculate dimensions
    this.width = this.options.width - this.options.margin.left - this.options.margin.right;
    this.height = this.options.height - this.options.margin.top - this.options.margin.bottom;
    
    // Initialize SVG
    this.svg = d3.select(this.container)
      .append('svg')
      .attr('width', this.options.width)
      .attr('height', this.options.height)
      .style('font-family', this.options.theme.fontFamily);
    
    // Create main group for chart content
    this.g = this.svg.append('g')
      .attr('transform', `translate(${this.options.margin.left},${this.options.margin.top})`);
    
    // Initialize scales
    this.xScale = null;
    this.yScale = null;
    
    // Initialize zoom behavior
    if (this.options.interactive && (this.options.zoomable || this.options.pannable)) {
      this.initializeZoom();
    }
    
    // Initialize tooltip
    if (this.options.interactive && this.options.tooltips) {
      this.initializeTooltip();
    }
    
    // Data and filters
    this.data = [];
    this.filteredData = [];
    this.filters = [];
  }

  /**
   * Initialize zoom and pan behavior
   * @private
   */
  initializeZoom() {
    this.zoom = d3.zoom()
      .scaleExtent([0.5, 10])
      .on('zoom', (event) => {
        if (this.onZoom) {
          this.onZoom(event.transform);
        }
      });
    
    this.svg.call(this.zoom);
  }

  /**
   * Initialize tooltip element
   * @private
   */
  initializeTooltip() {
    this.tooltip = d3.select('body')
      .append('div')
      .attr('class', 'dataviz-tooltip')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background-color', this.options.theme.tooltip.background)
      .style('color', this.options.theme.tooltip.color)
      .style('border', `1px solid ${this.options.theme.tooltip.border}`)
      .style('border-radius', '4px')
      .style('padding', '8px')
      .style('font-size', '12px')
      .style('pointer-events', 'none')
      .style('z-index', '1000')
      .style('box-shadow', '0 2px 4px rgba(0,0,0,0.2)');
  }

  /**
   * Show tooltip with content
   * @param {string} content - HTML content for tooltip
   * @param {number} x - X position
   * @param {number} y - Y position
   */
  showTooltip(content, x, y) {
    if (this.tooltip) {
      this.tooltip
        .style('visibility', 'visible')
        .html(content)
        .style('left', `${x + 10}px`)
        .style('top', `${y - 10}px`);
    }
  }

  /**
   * Hide tooltip
   */
  hideTooltip() {
    if (this.tooltip) {
      this.tooltip.style('visibility', 'hidden');
    }
  }

  /**
   * Set data for the chart
   * @param {Array} data - Data array
   * @returns {Chart} This chart instance for chaining
   */
  setData(data) {
    this.data = data;
    this.applyFilters();
    return this;
  }

  /**
   * Add a filter function
   * @param {Function} filterFn - Filter function that returns true/false
   * @returns {Chart} This chart instance for chaining
   */
  addFilter(filterFn) {
    if (this.options.filterable) {
      this.filters.push(filterFn);
      this.applyFilters();
    }
    return this;
  }

  /**
   * Clear all filters
   * @returns {Chart} This chart instance for chaining
   */
  clearFilters() {
    this.filters = [];
    this.applyFilters();
    return this;
  }

  /**
   * Apply all filters to data
   * @private
   */
  applyFilters() {
    this.filteredData = this.data.filter(d => {
      return this.filters.every(filterFn => filterFn(d));
    });
  }

  /**
   * Update theme
   * @param {Object} theme - Theme configuration
   * @returns {Chart} This chart instance for chaining
   */
  setTheme(theme) {
    this.options.theme = mergeDeep(this.options.theme, theme);
    this.svg.style('font-family', this.options.theme.fontFamily);
    if (this.tooltip) {
      this.tooltip
        .style('background-color', this.options.theme.tooltip.background)
        .style('color', this.options.theme.tooltip.color)
        .style('border', `1px solid ${this.options.theme.tooltip.border}`);
    }
    return this;
  }

  /**
   * Render the chart (to be implemented by subclasses)
   * @abstract
   */
  render() {
    throw new Error('render() must be implemented by subclass');
  }

  /**
   * Update the chart with new data
   * @param {Array} data - New data array
   */
  update(data) {
    this.setData(data);
    this.render();
  }

  /**
   * Destroy the chart and clean up
   */
  destroy() {
    if (this.tooltip) {
      this.tooltip.remove();
    }
    this.svg.remove();
  }

  /**
   * Resize the chart
   * @param {number} width - New width
   * @param {number} height - New height
   */
  resize(width, height) {
    this.options.width = width;
    this.options.height = height;
    this.width = width - this.options.margin.left - this.options.margin.right;
    this.height = height - this.options.margin.top - this.options.margin.bottom;
    
    this.svg
      .attr('width', width)
      .attr('height', height);
    
    this.render();
  }
}
