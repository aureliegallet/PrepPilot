/**
 * @fileoverview Scatter plot implementation with interactive features
 * @module charts/ScatterPlot
 */

import * as d3 from 'd3';
import { Chart } from '../core/Chart.js';

/**
 * Scatter plot with support for zoom, pan, tooltips, and filtering
 * @extends Chart
 */
export class ScatterPlot extends Chart {
  /**
   * Creates a new ScatterPlot instance
   * @param {HTMLElement|string} container - Container element or selector
   * @param {Object} options - Configuration options
   * @param {string} [options.xKey='x'] - Key for x values
   * @param {string} [options.yKey='y'] - Key for y values
   * @param {number} [options.pointRadius=5] - Radius of points
   * @param {boolean} [options.showGrid=true] - Show grid lines
   */
  constructor(container, options = {}) {
    super(container, options);
    
    this.options.xKey = options.xKey || 'x';
    this.options.yKey = options.yKey || 'y';
    this.options.pointRadius = options.pointRadius || 5;
    this.options.showGrid = options.showGrid !== false;
    
    // Setup scales
    this.xScale = d3.scaleLinear().range([0, this.width]);
    this.yScale = d3.scaleLinear().range([this.height, 0]);
    
    // Create axes groups
    this.xAxisGroup = this.g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${this.height})`);
    
    this.yAxisGroup = this.g.append('g')
      .attr('class', 'y-axis');
    
    // Create grid group
    if (this.options.showGrid) {
      this.gridGroup = this.g.append('g')
        .attr('class', 'grid')
        .style('opacity', 0.5);
    }
    
    // Create points group
    this.pointsGroup = this.g.append('g')
      .attr('class', 'points');
    
    // Override zoom handler
    this.onZoom = (transform) => {
      const newXScale = transform.rescaleX(this.xScale);
      const newYScale = transform.rescaleY(this.yScale);
      
      this.xAxisGroup.call(d3.axisBottom(newXScale));
      this.yAxisGroup.call(d3.axisLeft(newYScale));
      
      this.pointsGroup.selectAll('.point')
        .attr('cx', d => newXScale(d[this.options.xKey]))
        .attr('cy', d => newYScale(d[this.options.yKey]));
    };
  }

  /**
   * Render the scatter plot
   */
  render() {
    const data = this.filteredData.length > 0 ? this.filteredData : this.data;
    
    if (!data || data.length === 0) return;
    
    // Update scales
    this.xScale.domain(d3.extent(data, d => d[this.options.xKey]));
    this.yScale.domain(d3.extent(data, d => d[this.options.yKey]));
    
    // Create axes
    const xAxis = d3.axisBottom(this.xScale).ticks(10);
    const yAxis = d3.axisLeft(this.yScale).ticks(10);
    
    // Render grid
    if (this.options.showGrid) {
      this.renderGrid();
    }
    
    // Render axes
    this.xAxisGroup
      .transition()
      .duration(this.options.animation.duration)
      .call(xAxis)
      .selectAll('text')
      .style('fill', this.options.theme.axis.fontColor)
      .style('font-size', `${this.options.theme.axis.fontSize}px`);
    
    this.yAxisGroup
      .transition()
      .duration(this.options.animation.duration)
      .call(yAxis)
      .selectAll('text')
      .style('fill', this.options.theme.axis.fontColor)
      .style('font-size', `${this.options.theme.axis.fontSize}px`);
    
    // Style axis paths and ticks
    this.g.selectAll('.x-axis path, .y-axis path')
      .style('stroke', this.options.theme.axis.stroke)
      .style('stroke-width', this.options.theme.axis.strokeWidth);
    
    this.g.selectAll('.x-axis line, .y-axis line')
      .style('stroke', this.options.theme.axis.stroke);
    
    // Render points
    this.renderPoints(data);
  }

  /**
   * Render grid lines
   * @private
   */
  renderGrid() {
    const xGrid = d3.axisBottom(this.xScale)
      .ticks(10)
      .tickSize(-this.height)
      .tickFormat('');
    
    const yGrid = d3.axisLeft(this.yScale)
      .ticks(10)
      .tickSize(-this.width)
      .tickFormat('');
    
    this.gridGroup.selectAll('.x-grid').remove();
    this.gridGroup.selectAll('.y-grid').remove();
    
    this.gridGroup.append('g')
      .attr('class', 'x-grid')
      .attr('transform', `translate(0,${this.height})`)
      .call(xGrid)
      .selectAll('line')
      .style('stroke', this.options.theme.grid.stroke)
      .style('stroke-dasharray', this.options.theme.grid.strokeDasharray);
    
    this.gridGroup.append('g')
      .attr('class', 'y-grid')
      .call(yGrid)
      .selectAll('line')
      .style('stroke', this.options.theme.grid.stroke)
      .style('stroke-dasharray', this.options.theme.grid.strokeDasharray);
    
    this.gridGroup.selectAll('.domain').remove();
  }

  /**
   * Render data points
   * @private
   */
  renderPoints(data) {
    const self = this;
    const points = this.pointsGroup.selectAll('.point')
      .data(data);
    
    points.enter()
      .append('circle')
      .attr('class', 'point')
      .attr('r', 0)
      .attr('fill', this.options.theme.colors.primary)
      .attr('stroke', '#fff')
      .attr('stroke-width', 1)
      .attr('opacity', 0.7)
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        d3.select(this)
          .attr('r', self.options.pointRadius + 2)
          .attr('opacity', 1);
        const content = `<strong>${self.options.xKey}:</strong> ${d[self.options.xKey]}<br>
                         <strong>${self.options.yKey}:</strong> ${d[self.options.yKey]}`;
        self.showTooltip(content, event.pageX, event.pageY);
      })
      .on('mouseout', function() {
        d3.select(this)
          .attr('r', self.options.pointRadius)
          .attr('opacity', 0.7);
        self.hideTooltip();
      })
      .merge(points)
      .transition()
      .duration(this.options.animation.duration)
      .attr('cx', d => this.xScale(d[this.options.xKey]))
      .attr('cy', d => this.yScale(d[this.options.yKey]))
      .attr('r', this.options.pointRadius);
    
    points.exit()
      .transition()
      .duration(this.options.animation.duration)
      .attr('r', 0)
      .remove();
  }
}
