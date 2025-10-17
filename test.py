#!/usr/bin/env python3
"""
Open DataViz - Local Testing Script

This script helps you visualize and test the Open DataViz library locally.
It starts a local HTTP server and opens the demo in your browser.

Usage:
    python test.py [--port PORT] [--example EXAMPLE]

Options:
    --port PORT        Port number for the HTTP server (default: 8000)
    --example EXAMPLE  Specific example to open (line, bar, scatter, pie, or demo)
                      If not specified, opens the main demo page
"""

import http.server
import socketserver
import webbrowser
import os
import sys
import argparse
import subprocess
from pathlib import Path


def check_dependencies():
    """Check if Node.js and npm are installed."""
    try:
        subprocess.run(['node', '--version'], capture_output=True, check=True)
        subprocess.run(['npm', '--version'], capture_output=True, check=True)
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        return False


def build_library():
    """Build the library if not already built."""
    dist_path = Path('dist')
    
    # Check if dist folder exists and has the necessary files
    if not dist_path.exists() or not (dist_path / 'index.js').exists():
        print("📦 Building the library...")
        print("   Running: npm install")
        
        try:
            subprocess.run(['npm', 'install'], check=True)
            print("\n   Running: npm run build")
            subprocess.run(['npm', 'run', 'build'], check=True)
            print("✅ Build completed successfully!\n")
        except subprocess.CalledProcessError as e:
            print(f"❌ Build failed: {e}")
            print("\nPlease ensure Node.js and npm are installed and try again.")
            sys.exit(1)
    else:
        print("✅ Library already built!\n")


def start_server(port=8000, example=None):
    """Start a local HTTP server and open the visualization in the browser."""
    
    # Change to the script directory
    os.chdir(Path(__file__).parent)
    
    # Check dependencies
    if not check_dependencies():
        print("⚠️  Warning: Node.js and npm not found.")
        print("   If the library is not built, you'll need to install Node.js.")
        print("   Continuing anyway...\n")
    else:
        # Build the library
        build_library()
    
    # Determine which page to open
    pages = {
        'demo': 'index.html',
        'line': 'examples/line-chart.html',
        'bar': 'examples/bar-chart.html',
        'scatter': 'examples/scatter-plot.html',
        'pie': 'examples/pie-chart.html'
    }
    
    if example and example.lower() in pages:
        page = pages[example.lower()]
        page_name = f"{example.capitalize()} Chart Example"
    else:
        page = 'index.html'
        page_name = "Main Demo"
    
    # Start the server
    handler = http.server.SimpleHTTPRequestHandler
    
    try:
        with socketserver.TCPServer(("", port), handler) as httpd:
            url = f"http://localhost:{port}/{page}"
            
            print("╔══════════════════════════════════════════════════════════════════╗")
            print("║              Open DataViz - Local Test Server                   ║")
            print("╚══════════════════════════════════════════════════════════════════╝")
            print(f"\n🚀 Server started on port {port}")
            print(f"📊 Opening: {page_name}")
            print(f"🌐 URL: {url}\n")
            print("Available pages:")
            print(f"  • Main Demo:        http://localhost:{port}/index.html")
            print(f"  • Line Chart:       http://localhost:{port}/examples/line-chart.html")
            print(f"  • Bar Chart:        http://localhost:{port}/examples/bar-chart.html")
            print(f"  • Scatter Plot:     http://localhost:{port}/examples/scatter-plot.html")
            print(f"  • Pie Chart:        http://localhost:{port}/examples/pie-chart.html")
            print("\n💡 Tips:")
            print("  • Try zooming with mouse wheel on line/scatter charts")
            print("  • Hover over data points to see tooltips")
            print("  • Click buttons to toggle themes and apply filters")
            print("\n⌨️  Press Ctrl+C to stop the server\n")
            print("─" * 68)
            
            # Open browser
            webbrowser.open(url)
            
            # Keep server running
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n\n✋ Server stopped by user")
        print("👋 Thanks for testing Open DataViz!")
        sys.exit(0)
    except OSError as e:
        if "Address already in use" in str(e):
            print(f"❌ Error: Port {port} is already in use")
            print(f"   Try a different port: python test.py --port {port + 1}")
        else:
            print(f"❌ Error: {e}")
        sys.exit(1)


def list_examples():
    """List all available examples."""
    print("\n📊 Available Examples:\n")
    print("  demo      - Main demo with all chart types (default)")
    print("  line      - Line chart example")
    print("  bar       - Bar chart example")
    print("  scatter   - Scatter plot example")
    print("  pie       - Pie chart example")
    print("\nUsage:")
    print("  python test.py --example line")
    print("  python test.py --example bar")
    print()


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description='Test Open DataViz library locally',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python test.py                      # Start server with main demo
  python test.py --port 3000          # Use port 3000
  python test.py --example line       # Open line chart example
  python test.py --list               # List all examples
        """
    )
    
    parser.add_argument(
        '--port',
        type=int,
        default=8000,
        help='Port number for HTTP server (default: 8000)'
    )
    
    parser.add_argument(
        '--example',
        type=str,
        choices=['demo', 'line', 'bar', 'scatter', 'pie'],
        help='Specific example to open'
    )
    
    parser.add_argument(
        '--list',
        action='store_true',
        help='List all available examples'
    )
    
    args = parser.parse_args()
    
    if args.list:
        list_examples()
        sys.exit(0)
    
    start_server(port=args.port, example=args.example)


if __name__ == '__main__':
    main()
