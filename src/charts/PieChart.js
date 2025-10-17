/**
 * @fileoverview Pie chart implementation with interactive features
 * @module charts/PieChart
 */

import * as d3 from 'd3';
import { Chart } from '../core/Chart.js';

/**
 * Pie chart with support for tooltips and filtering
 * @extends Chart
 */
export class PieChart extends Chart {
  /**
   * Creates a new PieChart instance
   * @param {HTMLElement|string} container - Container element or selector
   * @param {Object} options - Configuration options
   * @param {string} [options.labelKey='label'] - Key for labels
   * @param {string} [options.valueKey='value'] - Key for values
   * @param {number} [options.innerRadius=0] - Inner radius (0 for pie, >0 for donut)
   * @param {boolean} [options.showLabels=true] - Show labels
   * @param {boolean} [options.showLegend=true] - Show legend
   */
  constructor(container, options = {}) {
    super(container, options);
    
    this.options.labelKey = options.labelKey || 'label';
    this.options.valueKey = options.valueKey || 'value';
    this.options.innerRadius = options.innerRadius || 0;
    this.options.showLabels = options.showLabels !== false;
    this.options.showLegend = options.showLegend !== false;
    
    // Calculate radius
    this.radius = Math.min(this.width, this.height) / 2;
    
    // Move group to center
    this.g.attr('transform', `translate(${this.width / 2 + this.options.margin.left},${this.height / 2 + this.options.margin.top})`);
    
    // Create arc generator
    this.arc = d3.arc()
      .innerRadius(this.options.innerRadius)
      .outerRadius(this.radius);
    
    // Create pie layout
    this.pie = d3.pie()
      .value(d => d[this.options.valueKey])
      .sort(null);
    
    // Create slices group
    this.slicesGroup = this.g.append('g')
      .attr('class', 'slices');
    
    // Create labels group
    if (this.options.showLabels) {
      this.labelsGroup = this.g.append('g')
        .attr('class', 'labels');
    }
  }

  /**
   * Render the pie chart
   */
  render() {
    const data = this.filteredData.length > 0 ? this.filteredData : this.data;
    
    if (!data || data.length === 0) return;
    
    // Render slices
    this.renderSlices(data);
    
    // Render labels
    if (this.options.showLabels) {
      this.renderLabels(data);
    }
  }

  /**
   * Render pie slices
   * @private
   */
  renderSlices(data) {
    const self = this;
    const slices = this.slicesGroup.selectAll('.slice')
      .data(this.pie(data));
    
    slices.enter()
      .append('path')
      .attr('class', 'slice')
      .attr('fill', (d, i) => this.options.theme.palette[i % this.options.theme.palette.length])
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('transform', function() {
            const [x, y] = self.arc.centroid(d);
            return `translate(${x * 0.1},${y * 0.1})`;
          })
          .attr('opacity', 0.8);
        
        const content = `<strong>${d.data[self.options.labelKey]}:</strong> ${d.data[self.options.valueKey]}`;
        self.showTooltip(content, event.pageX, event.pageY);
      })
      .on('mouseout', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('transform', 'translate(0,0)')
          .attr('opacity', 1);
        self.hideTooltip();
      })
      .merge(slices)
      .transition()
      .duration(this.options.animation.duration)
      .attrTween('d', function(d) {
        const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return function(t) {
          return self.arc(interpolate(t));
        };
      });
    
    slices.exit().remove();
  }

  /**
   * Render labels
   * @private
   */
  renderLabels(data) {
    const labelArc = d3.arc()
      .innerRadius(this.radius * 0.7)
      .outerRadius(this.radius * 0.7);
    
    const labels = this.labelsGroup.selectAll('.label')
      .data(this.pie(data));
    
    labels.enter()
      .append('text')
      .attr('class', 'label')
      .attr('transform', d => `translate(${labelArc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .style('fill', this.options.theme.axis.fontColor)
      .style('font-size', `${this.options.theme.fontSize}px`)
      .text(d => d.data[this.options.labelKey])
      .merge(labels)
      .transition()
      .duration(this.options.animation.duration)
      .attr('transform', d => `translate(${labelArc.centroid(d)})`);
    
    labels.exit().remove();
  }
}
