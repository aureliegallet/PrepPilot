# Contributing to Open DataViz

Thank you for your interest in contributing to Open DataViz! This document provides guidelines and instructions for contributing.

## 🌟 Ways to Contribute

### 1. Share Your Visualizations

We encourage you to create and share your data visualizations with the community!

- Create unique visualizations using Open DataViz
- Share your code and examples
- Write blog posts or tutorials
- Present your work at community events

### 2. Report Bugs

If you find a bug:

1. Check if it's already reported in Issues
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Your environment (browser, OS, etc.)

### 3. Suggest Features

Have an idea for a new feature?

1. Check existing issues and discussions
2. Create a new issue describing:
   - The feature and its benefits
   - Use cases
   - Proposed implementation (if you have ideas)

### 4. Submit Pull Requests

#### Setup

```bash
# Fork the repository on GitHub
# Clone your fork
git clone https://github.com/YOUR_USERNAME/MLH-hackfest.git
cd MLH-hackfest

# Install dependencies
npm install

# Create a new branch
git checkout -b feature/your-feature-name
```

#### Development

```bash
# Make your changes
# Test your changes
npm test

# Lint your code
npm run lint

# Build the library
npm run build
```

#### Guidelines

- Write clear, concise commit messages
- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Keep changes focused and minimal

#### Submit

```bash
# Commit your changes
git add .
git commit -m "Add feature: your feature description"

# Push to your fork
git push origin feature/your-feature-name

# Create a Pull Request on GitHub
```

## 📝 Code Style

- Use ES6+ JavaScript
- Follow ESLint configuration
- Use meaningful variable names
- Add JSDoc comments for public APIs
- Keep functions small and focused

## 🧪 Testing

When adding new features:

1. Add unit tests if applicable
2. Test in multiple browsers
3. Verify examples still work
4. Check for console errors

## 📚 Documentation

When changing APIs or adding features:

1. Update JSDoc comments
2. Update docs/README.md
3. Add or update examples
4. Update main README.md if needed

## 🎨 Adding Chart Types

To add a new chart type:

1. Create a new file in `src/charts/`
2. Extend the `Chart` base class
3. Implement the `render()` method
4. Export from `src/index.js`
5. Add an example in `examples/`
6. Document in `docs/README.md`

Example structure:

```javascript
import { Chart } from '../core/Chart.js';

export class MyChart extends Chart {
  constructor(container, options = {}) {
    super(container, options);
    // Initialize specific features
  }

  render() {
    // Implement rendering logic
  }
}
```

## 🎯 Priority Areas

We especially welcome contributions in:

- New chart types (heatmap, area, network, etc.)
- Performance improvements
- Accessibility features
- Mobile responsiveness
- Animation options
- Export/save functionality
- More themes and color palettes
- Interactive tutorials
- Real-world examples

## 🤔 Questions?

Feel free to:

- Open an issue for discussion
- Ask in pull request comments
- Reach out to maintainers

## 📜 Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Provide constructive feedback
- Focus on what's best for the community

## 🎉 Recognition

Contributors will be:

- Listed in the project
- Credited in release notes
- Celebrated in the community

Thank you for contributing to Open DataViz! 🙌
