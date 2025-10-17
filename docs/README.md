# Open DataViz Documentation

Welcome to Open DataViz - an interactive and customizable data visualization library built with open source technologies!

## Table of Contents

- [Getting Started](#getting-started)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Chart Types](#chart-types)
- [Interactive Features](#interactive-features)
- [Customization](#customization)
- [API Reference](#api-reference)
- [Examples](#examples)

## Getting Started

Open DataViz is designed to be easy to use while providing powerful features for creating interactive and customizable data visualizations.

### Key Features

✨ **Interactive**: Built-in support for zooming, panning, tooltips, and filtering  
🎨 **Customizable**: Easy theming, palette adjustments, and component-level styling  
📱 **Responsive**: Charts adapt to container sizes  
🚀 **Performance**: Efficient rendering with D3.js  
📦 **Modular**: Use only what you need  
🎯 **User-Friendly**: Intuitive API with comprehensive documentation  

## Installation

### Using npm

```bash
npm install open-dataviz
```

### Using CDN

```html
<script src="https://d3js.org/d3.v7.min.js"></script>
<script type="module">
  import { LineChart } from 'path/to/open-dataviz/dist/index.esm.js';
</script>
```

## Quick Start

Here's a simple example to get you started:

```javascript
import { LineChart } from 'open-dataviz';

// Create a line chart
const chart = new LineChart('#chart-container', {
  width: 800,
  height: 400,
  margin: { top: 20, right: 20, bottom: 40, left: 50 }
});

// Set data and render
const data = [
  { x: 0, y: 10 },
  { x: 1, y: 20 },
  { x: 2, y: 15 },
  { x: 3, y: 30 }
];

chart.setData(data).render();
```

## Chart Types

### LineChart

Perfect for showing trends over time or continuous data.

```javascript
import { LineChart } from 'open-dataviz';

const lineChart = new LineChart('#container', {
  xKey: 'date',
  yKey: 'value',
  strokeWidth: 2,
  showPoints: true,
  showGrid: true
});
```

**Options:**
- `xKey`: Key for x-axis values (default: 'x')
- `yKey`: Key for y-axis values (default: 'y')
- `strokeWidth`: Line thickness (default: 2)
- `showPoints`: Display data points (default: true)
- `showGrid`: Display grid lines (default: true)

### BarChart

Ideal for comparing discrete categories.

```javascript
import { BarChart } from 'open-dataviz';

const barChart = new BarChart('#container', {
  xKey: 'category',
  yKey: 'value',
  barPadding: 0.1,
  showGrid: true
});
```

**Options:**
- `xKey`: Key for categories (default: 'x')
- `yKey`: Key for values (default: 'y')
- `barPadding`: Space between bars 0-1 (default: 0.1)
- `showGrid`: Display grid lines (default: true)

### ScatterPlot

Great for showing relationships between two variables.

```javascript
import { ScatterPlot } from 'open-dataviz';

const scatterPlot = new ScatterPlot('#container', {
  xKey: 'variable1',
  yKey: 'variable2',
  pointRadius: 5,
  showGrid: true
});
```

**Options:**
- `xKey`: Key for x-axis values (default: 'x')
- `yKey`: Key for y-axis values (default: 'y')
- `pointRadius`: Size of points (default: 5)
- `showGrid`: Display grid lines (default: true)

### PieChart

Perfect for showing proportions and percentages.

```javascript
import { PieChart } from 'open-dataviz';

const pieChart = new PieChart('#container', {
  labelKey: 'category',
  valueKey: 'amount',
  innerRadius: 0,
  showLabels: true
});
```

**Options:**
- `labelKey`: Key for labels (default: 'label')
- `valueKey`: Key for values (default: 'value')
- `innerRadius`: Inner radius for donut chart (default: 0)
- `showLabels`: Display labels (default: true)

## Interactive Features

### Zooming

All linear charts (LineChart, ScatterPlot) support zooming via mouse wheel:

```javascript
const chart = new LineChart('#container', {
  zoomable: true  // Enabled by default
});
```

### Panning

Click and drag to pan around zoomed charts:

```javascript
const chart = new LineChart('#container', {
  pannable: true  // Enabled by default
});
```

### Tooltips

Hover over data points to see detailed information:

```javascript
const chart = new LineChart('#container', {
  tooltips: true  // Enabled by default
});
```

### Filtering

Apply filters to show/hide data dynamically:

```javascript
chart.addFilter(d => d.value > 50);  // Show only values > 50
chart.render();

// Clear all filters
chart.clearFilters();
chart.render();
```

Multiple filters can be applied and they work with AND logic:

```javascript
chart.addFilter(d => d.value > 10);
chart.addFilter(d => d.value < 100);
chart.render();  // Shows values between 10 and 100
```

## Customization

### Themes

Open DataViz comes with built-in themes:

```javascript
import { LineChart, darkTheme } from 'open-dataviz';

const chart = new LineChart('#container');
chart.setTheme(darkTheme);
chart.render();
```

### Custom Theme

Create your own theme:

```javascript
const customTheme = {
  fontFamily: 'Arial, sans-serif',
  fontSize: 14,
  colors: {
    primary: '#FF6B6B',
    secondary: '#4ECDC4',
    background: '#FFFFFF'
  },
  palette: [
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
    '#FFA07A'
  ]
};

chart.setTheme(customTheme);
chart.render();
```

### Color Palettes

Customize colors for multiple data series:

```javascript
const chart = new LineChart('#container', {
  theme: {
    palette: [
      '#E74C3C',
      '#3498DB',
      '#2ECC71',
      '#F39C12'
    ]
  }
});
```

### Margins and Sizing

Adjust chart dimensions and spacing:

```javascript
const chart = new LineChart('#container', {
  width: 1000,
  height: 500,
  margin: { 
    top: 30, 
    right: 30, 
    bottom: 60, 
    left: 70 
  }
});
```

## API Reference

### Base Chart Class

All chart types inherit from the `Chart` base class:

#### Methods

**`setData(data)`**
- Sets the chart data
- Returns: `Chart` instance for chaining
- Example: `chart.setData(myData)`

**`render()`**
- Renders the chart
- Returns: void
- Example: `chart.render()`

**`update(data)`**
- Updates chart with new data
- Returns: void
- Example: `chart.update(newData)`

**`addFilter(filterFn)`**
- Adds a filter function
- Returns: `Chart` instance for chaining
- Example: `chart.addFilter(d => d.value > 50)`

**`clearFilters()`**
- Removes all filters
- Returns: `Chart` instance for chaining
- Example: `chart.clearFilters()`

**`setTheme(theme)`**
- Updates the chart theme
- Returns: `Chart` instance for chaining
- Example: `chart.setTheme(darkTheme)`

**`resize(width, height)`**
- Resizes the chart
- Returns: void
- Example: `chart.resize(1200, 600)`

**`destroy()`**
- Removes the chart and cleans up
- Returns: void
- Example: `chart.destroy()`

### Common Options

All chart types accept these options:

- `width`: Chart width in pixels (default: 800)
- `height`: Chart height in pixels (default: 400)
- `margin`: Object with top, right, bottom, left margins
- `theme`: Theme configuration object
- `interactive`: Enable interactive features (default: true)
- `zoomable`: Enable zoom (default: true)
- `pannable`: Enable pan (default: true)
- `tooltips`: Enable tooltips (default: true)
- `filterable`: Enable filtering (default: true)

## Examples

Check out the `examples/` directory for complete working examples:

- `line-chart.html` - Interactive line chart with all features
- `bar-chart.html` - Bar chart with filtering
- `scatter-plot.html` - Scatter plot with zoom and pan
- `pie-chart.html` - Pie chart with tooltips

To view examples:

1. Build the library: `npm run build`
2. Open any example HTML file in a web browser

## Contributing

We encourage the community to contribute! Share your visualizations, report bugs, or submit pull requests.

### Ways to Contribute

1. **Share Your Visualizations**: Create and share your data visualizations with the community
2. **Report Issues**: Found a bug? Open an issue on GitHub
3. **Submit Pull Requests**: Improve the library with new features or fixes
4. **Improve Documentation**: Help make the docs better
5. **Create Examples**: Add more examples to help others learn

### Development Setup

```bash
# Clone the repository
git clone https://github.com/aureliegallet/MLH-hackfest.git
cd MLH-hackfest

# Install dependencies
npm install

# Build the library
npm run build

# Run tests
npm test

# Lint code
npm run lint
```

## License

MIT License - feel free to use this library in your projects!

## Support

- 📖 Documentation: See this file and inline code documentation
- 💬 Issues: Report bugs or request features on GitHub
- 🌟 Examples: Check the `examples/` directory

Happy visualizing! 📊✨
