# Open DataViz 📊

An interactive and customizable data visualization library built with open source technologies.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## 🌟 Features

- **Interactive**: Built-in support for zooming, panning, tooltips, and filtering
- **Customizable**: Easy theming, palette adjustments, and component-level styling  
- **Multiple Chart Types**: Line, Bar, Scatter, and Pie charts
- **User-Friendly**: Intuitive API with comprehensive documentation
- **Open Source**: Built with D3.js and modern JavaScript

## 🚀 Quick Start

### Installation

```bash
npm install open-dataviz
```

### Basic Usage

```javascript
import { LineChart } from 'open-dataviz';

// Create a chart
const chart = new LineChart('#chart-container', {
  width: 800,
  height: 400
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

## 📊 Chart Types

- **LineChart**: Perfect for trends and time series data
- **BarChart**: Great for comparing categories
- **ScatterPlot**: Ideal for showing relationships between variables
- **PieChart**: Best for showing proportions and percentages

## ✨ Interactive Features

### Zooming & Panning
All linear charts support mouse wheel zooming and click-drag panning.

### Tooltips
Hover over data points to see detailed information.

### Filtering
Apply dynamic filters to your data:

```javascript
chart.addFilter(d => d.value > 50);
chart.render();
```

## 🎨 Customization

### Themes

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
    palette: ['#E74C3C', '#3498DB', '#2ECC71', '#F39C12']
  }
});
```

## 📚 Documentation

For complete documentation, see [docs/README.md](docs/README.md)

## 🎯 Examples

Check out the `examples/` directory for working examples:

```bash
# Build the library
npm run build

# Open any example HTML file in your browser
# examples/line-chart.html
# examples/bar-chart.html
# examples/scatter-plot.html
# examples/pie-chart.html
```

## 🛠️ Development

```bash
# Install dependencies
npm install

# Build the library
npm run build

# Run tests
npm test

# Lint code
npm run lint

# Generate documentation
npm run docs
```

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

1. **Share Your Visualizations**: Create amazing visualizations and share them with the community
2. **Report Issues**: Found a bug? Let us know!
3. **Submit Pull Requests**: Improve the library with new features or bug fixes
4. **Improve Documentation**: Help make our docs better
5. **Create Examples**: Add more examples to help others learn

See [docs/README.md](docs/README.md) for development setup instructions.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

Built with:
- [D3.js](https://d3js.org/) - Data visualization framework
- [Rollup](https://rollupjs.org/) - Module bundler
- Modern JavaScript (ES6+)

---

Made with ❤️ for the MLH Hackfest community. Happy visualizing!