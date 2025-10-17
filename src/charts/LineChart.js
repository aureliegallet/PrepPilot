/**
 * @fileoverview Line chart implementation with interactive features
 * @module charts/LineChart
 */

import * as d3 from 'd3';
import { Chart } from '../core/Chart.js';

/**
 * Line chart with support for multiple series, zoom, pan, and tooltips
 * @extends Chart
 */
export class LineChart extends Chart {
  /**
   * Creates a new LineChart instance
   * @param {HTMLElement|string} container - Container element or selector
   * @param {Object} options - Configuration options
   * @param {string} [options.xKey='x'] - Key for x values
   * @param {string} [options.yKey='y'] - Key for y values
   * @param {number} [options.strokeWidth=2] - Line stroke width
   * @param {boolean} [options.showPoints=true] - Show data points
   * @param {boolean} [options.showGrid=true] - Show grid lines
   * @param {boolean} [options.showLegend=true] - Show legend
   */
  constructor(container, options = {}) {
    super(container, options);
    
    this.options.xKey = options.xKey || 'x';
    this.options.yKey = options.yKey || 'y';
    this.options.strokeWidth = options.strokeWidth || 2;
    this.options.showPoints = options.showPoints !== false;
    this.options.showGrid = options.showGrid !== false;
    this.options.showLegend = options.showLegend !== false;
    
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
    
    // Create line group
    this.lineGroup = this.g.append('g')
      .attr('class', 'lines');
    
    // Create points group
    if (this.options.showPoints) {
      this.pointsGroup = this.g.append('g')
        .attr('class', 'points');
    }
    
    // Override zoom handler
    this.onZoom = (transform) => {
      const newXScale = transform.rescaleX(this.xScale);
      const newYScale = transform.rescaleY(this.yScale);
      
      this.xAxisGroup.call(d3.axisBottom(newXScale));
      this.yAxisGroup.call(d3.axisLeft(newYScale));
      
      this.updateLines(newXScale, newYScale);
    };
  }

  /**
   * Render the line chart
   */
  render() {
    const data = this.filteredData.length > 0 ? this.filteredData : this.data;
    
    if (!data || data.length === 0) return;
    
    // Update scales
    this.xScale.domain(d3.extent(data, d => d[this.options.xKey]));
    this.yScale.domain([0, d3.max(data, d => d[this.options.yKey])]);
    
    // Create axes
    const xAxis = d3.axisBottom(this.xScale)
      .ticks(10);
    
    const yAxis = d3.axisLeft(this.yScale)
      .ticks(10);
    
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
    
    // Render line
    this.renderLine(data);
    
    // Render points
    if (this.options.showPoints) {
      this.renderPoints(data);
    }
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
   * Render line path
   * @private
   */
  renderLine(data) {
    const line = d3.line()
      .x(d => this.xScale(d[this.options.xKey]))
      .y(d => this.yScale(d[this.options.yKey]))
      .curve(d3.curveMonotoneX);
    
    const path = this.lineGroup.selectAll('.line')
      .data([data]);
    
    path.enter()
      .append('path')
      .attr('class', 'line')
      .attr('fill', 'none')
      .attr('stroke', this.options.theme.colors.primary)
      .attr('stroke-width', this.options.strokeWidth)
      .merge(path)
      .transition()
      .duration(this.options.animation.duration)
      .attr('d', line);
    
    path.exit().remove();
  }

  /**
   * Update lines with new scales (for zoom/pan)
   * @private
   */
  updateLines(xScale, yScale) {
    const data = this.filteredData.length > 0 ? this.filteredData : this.data;
    
    const line = d3.line()
      .x(d => xScale(d[this.options.xKey]))
      .y(d => yScale(d[this.options.yKey]))
      .curve(d3.curveMonotoneX);
    
    this.lineGroup.selectAll('.line')
      .data([data])
      .attr('d', line);
    
    if (this.options.showPoints) {
      this.pointsGroup.selectAll('.point')
        .attr('cx', d => xScale(d[this.options.xKey]))
        .attr('cy', d => yScale(d[this.options.yKey]));
    }
  }

  /**
   * Render data points
   * @private
   */
  renderPoints(data) {
    const points = this.pointsGroup.selectAll('.point')
      .data(data);
    
    const self = this;
    
    points.enter()
      .append('circle')
      .attr('class', 'point')
      .attr('r', 4)
      .attr('fill', this.options.theme.colors.primary)
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        d3.select(this).attr('r', 6);
        const content = `<strong>${self.options.xKey}:</strong> ${d[self.options.xKey]}<br>
                         <strong>${self.options.yKey}:</strong> ${d[self.options.yKey]}`;
        self.showTooltip(content, event.pageX, event.pageY);
      })
      .on('mouseout', function() {
        d3.select(this).attr('r', 4);
        self.hideTooltip();
      })
      .merge(points)
      .transition()
      .duration(this.options.animation.duration)
      .attr('cx', d => this.xScale(d[this.options.xKey]))
      .attr('cy', d => this.yScale(d[this.options.yKey]));
    
    points.exit().remove();
  }
}
