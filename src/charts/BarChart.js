/**
 * @fileoverview Bar chart implementation with interactive features
 * @module charts/BarChart
 */

import * as d3 from 'd3';
import { Chart } from '../core/Chart.js';

/**
 * Bar chart with support for zoom, pan, tooltips, and filtering
 * @extends Chart
 */
export class BarChart extends Chart {
  /**
   * Creates a new BarChart instance
   * @param {HTMLElement|string} container - Container element or selector
   * @param {Object} options - Configuration options
   * @param {string} [options.xKey='x'] - Key for x values (categories)
   * @param {string} [options.yKey='y'] - Key for y values
   * @param {boolean} [options.showGrid=true] - Show grid lines
   * @param {number} [options.barPadding=0.1] - Padding between bars (0-1)
   */
  constructor(container, options = {}) {
    super(container, options);
    
    this.options.xKey = options.xKey || 'x';
    this.options.yKey = options.yKey || 'y';
    this.options.showGrid = options.showGrid !== false;
    this.options.barPadding = options.barPadding || 0.1;
    
    // Setup scales
    this.xScale = d3.scaleBand()
      .range([0, this.width])
      .padding(this.options.barPadding);
    
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
    
    // Create bars group
    this.barsGroup = this.g.append('g')
      .attr('class', 'bars');
  }

  /**
   * Render the bar chart
   */
  render() {
    const data = this.filteredData.length > 0 ? this.filteredData : this.data;
    
    if (!data || data.length === 0) return;
    
    // Update scales
    this.xScale.domain(data.map(d => d[this.options.xKey]));
    this.yScale.domain([0, d3.max(data, d => d[this.options.yKey])]);
    
    // Create axes
    const xAxis = d3.axisBottom(this.xScale);
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
      .style('font-size', `${this.options.theme.axis.fontSize}px`)
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end');
    
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
    
    // Render bars
    this.renderBars(data);
  }

  /**
   * Render grid lines
   * @private
   */
  renderGrid() {
    const yGrid = d3.axisLeft(this.yScale)
      .ticks(10)
      .tickSize(-this.width)
      .tickFormat('');
    
    this.gridGroup.selectAll('.y-grid').remove();
    
    this.gridGroup.append('g')
      .attr('class', 'y-grid')
      .call(yGrid)
      .selectAll('line')
      .style('stroke', this.options.theme.grid.stroke)
      .style('stroke-dasharray', this.options.theme.grid.strokeDasharray);
    
    this.gridGroup.selectAll('.domain').remove();
  }

  /**
   * Render bars
   * @private
   */
  renderBars(data) {
    const self = this;
    const bars = this.barsGroup.selectAll('.bar')
      .data(data);
    
    bars.enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => this.xScale(d[this.options.xKey]))
      .attr('width', this.xScale.bandwidth())
      .attr('y', this.height)
      .attr('height', 0)
      .attr('fill', (d, i) => this.options.theme.palette[i % this.options.theme.palette.length])
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        d3.select(this)
          .attr('opacity', 0.7);
        const content = `<strong>${self.options.xKey}:</strong> ${d[self.options.xKey]}<br>
                         <strong>${self.options.yKey}:</strong> ${d[self.options.yKey]}`;
        self.showTooltip(content, event.pageX, event.pageY);
      })
      .on('mouseout', function() {
        d3.select(this)
          .attr('opacity', 1);
        self.hideTooltip();
      })
      .merge(bars)
      .transition()
      .duration(this.options.animation.duration)
      .attr('x', d => this.xScale(d[this.options.xKey]))
      .attr('y', d => this.yScale(d[this.options.yKey]))
      .attr('width', this.xScale.bandwidth())
      .attr('height', d => this.height - this.yScale(d[this.options.yKey]))
      .attr('fill', (d, i) => this.options.theme.palette[i % this.options.theme.palette.length]);
    
    bars.exit()
      .transition()
      .duration(this.options.animation.duration)
      .attr('y', this.height)
      .attr('height', 0)
      .remove();
  }
}
