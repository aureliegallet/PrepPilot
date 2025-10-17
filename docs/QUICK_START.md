# Quick Start Guide

Get started with Open DataViz in minutes!

## Try It Locally First! 🚀

The fastest way to see Open DataViz in action is using our test script:

```bash
# From the project root, run:
python test.py
```

This single command will:
- ✅ Check and install dependencies automatically
- ✅ Build the library
- ✅ Start a local web server
- ✅ Open the interactive demo in your browser

### Advanced Options

```bash
# Open specific examples
python test.py --example line      # Line chart
python test.py --example bar       # Bar chart
python test.py --example scatter   # Scatter plot
python test.py --example pie       # Pie chart

# Use a different port
python test.py --port 3000

# List all available examples
python test.py --list
```

**Requirements:** Python 3.x (Node.js will be installed automatically if needed)

---

## Installation

### Option 1: Using npm (Recommended)

```bash
npm install open-dataviz
```

### Option 2: Direct Download

Download the library files from the `dist/` folder and include them in your project.

## Basic Usage

### 1. Include the Library

**Using ES Modules:**
```html
<script type="module">
  import { LineChart } from 'open-dataviz';
</script>
```

**Using UMD (Browser):**
```html
<script src="path/to/d3.min.js"></script>
<script src="path/to/open-dataviz/dist/index.umd.js"></script>
<script>
  const { LineChart } = OpenDataViz;
</script>
```

### 2. Create a Container

```html
<div id="my-chart"></div>
```

### 3. Initialize and Render

```javascript
// Create a line chart
const chart = new LineChart('#my-chart', {
  width: 800,
  height: 400
});

// Prepare your data
const data = [
  { x: 0, y: 10 },
  { x: 1, y: 25 },
  { x: 2, y: 15 },
  { x: 3, y: 30 },
  { x: 4, y: 20 }
];

// Set data and render
chart.setData(data).render();
```

## Complete Example

Here's a complete HTML file to get you started:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My First Chart</title>
  <style>
    #chart {
      margin: 20px;
    }
  </style>
</head>
<body>
  <h1>My Data Visualization</h1>
  <div id="chart"></div>

  <script src="https://d3js.org/d3.v7.min.js"></script>
  <script src="path/to/open-dataviz/dist/index.umd.js"></script>
  <script>
    const { LineChart } = OpenDataViz;

    // Create chart
    const chart = new LineChart('#chart', {
      width: 800,
      height: 400,
      margin: { top: 20, right: 20, bottom: 40, left: 50 }
    });

    // Add data
    const data = Array.from({ length: 20 }, (_, i) => ({
      x: i,
      y: Math.random() * 100
    }));

    // Render
    chart.setData(data).render();
  </script>
</body>
</html>
```

## Chart Types

### Line Chart

```javascript
import { LineChart } from 'open-dataviz';

const chart = new LineChart('#container', {
  xKey: 'date',
  yKey: 'value',
  showPoints: true,
  showGrid: true
});
```

### Bar Chart

```javascript
import { BarChart } from 'open-dataviz';

const chart = new BarChart('#container', {
  xKey: 'category',
  yKey: 'value',
  barPadding: 0.1
});
```

### Scatter Plot

```javascript
import { ScatterPlot } from 'open-dataviz';

const chart = new ScatterPlot('#container', {
  xKey: 'variable1',
  yKey: 'variable2',
  pointRadius: 5
});
```

### Pie Chart

```javascript
import { PieChart } from 'open-dataviz';

const chart = new PieChart('#container', {
  labelKey: 'category',
  valueKey: 'amount',
  showLabels: true
});
```

## Interactive Features

### Enable/Disable Features

```javascript
const chart = new LineChart('#container', {
  interactive: true,    // Master switch
  zoomable: true,       // Enable zoom
  pannable: true,       // Enable pan
  tooltips: true,       // Show tooltips
  filterable: true      // Allow filtering
});
```

### Add Filters

```javascript
// Filter to show only values greater than 50
chart.addFilter(d => d.value > 50);
chart.render();

// Add multiple filters (AND logic)
chart.addFilter(d => d.value < 100);
chart.render();

// Clear all filters
chart.clearFilters();
chart.render();
```

### Update Data

```javascript
// Update with new data
const newData = generateNewData();
chart.update(newData);
```

## Customization

### Apply a Theme

```javascript
import { LineChart, darkTheme } from 'open-dataviz';

const chart = new LineChart('#container');
chart.setTheme(darkTheme);
chart.render();
```

### Custom Colors

```javascript
const chart = new LineChart('#container', {
  theme: {
    colors: {
      primary: '#FF6B6B'
    },
    palette: [
      '#E74C3C',
      '#3498DB',
      '#2ECC71',
      '#F39C12',
      '#9B59B6'
    ]
  }
});
```

### Adjust Margins and Size

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

## Common Patterns

### Responsive Chart

```javascript
const chart = new LineChart('#container');

// Resize on window resize
window.addEventListener('resize', () => {
  const container = document.getElementById('container');
  chart.resize(container.offsetWidth, 400);
});
```

### Dynamic Data Updates

```javascript
// Update every second
setInterval(() => {
  const newData = fetchLatestData();
  chart.update(newData);
}, 1000);
```

### Loading Data from API

```javascript
async function loadAndRenderChart() {
  const response = await fetch('/api/data');
  const data = await response.json();
  
  const chart = new LineChart('#container');
  chart.setData(data).render();
}

loadAndRenderChart();
```

## Next Steps

- Check out the [full documentation](README.md)
- Explore the [examples](../examples/) directory
- Read the [API reference](README.md#api-reference)
- Learn about [contributing](../CONTRIBUTING.md)

## Need Help?

- 📖 [Full Documentation](README.md)
- 💬 Open an issue on GitHub
- 🌟 Check the examples for inspiration

Happy visualizing! 📊✨
