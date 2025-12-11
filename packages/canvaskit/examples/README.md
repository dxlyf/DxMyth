# DxMyth Renderer System Examples

This directory contains examples demonstrating the usage of the DxMyth Renderer System.

## Examples

### 1. Complex Example (`index.html`)
- Shows a rotating colored cube
- Demonstrates full feature set including geometry, materials, pipelines, and animation
- Uses the `RendererExample` class from `lib/renderer/example.ts`

### 2. Simple Example (`simple-example.html`)
- Shows a rotating colored triangle
- Simplified code demonstrating the basic usage flow
- Easier to understand for beginners

## How to Run

### Using a Local Web Server

To run these examples, you need to serve the files through a web server due to ES module imports.

#### Option 1: Using Node.js http-server

```bash
# Install http-server if not already installed
npm install -g http-server

# Navigate to the examples directory
cd packages/canvaskit/examples

# Start the server
http-server -p 8080
```

Then open your browser and navigate to:
- `http://localhost:8080/index.html` for the complex example
- `http://localhost:8080/simple-example.html` for the simple example

#### Option 2: Using Python

```bash
# Navigate to the examples directory
cd packages/canvaskit/examples

# Start Python 3 server
python -m http.server 8080
```

Then open your browser and navigate to the URLs mentioned above.

### Using VS Code Live Server

If you're using Visual Studio Code, you can install the "Live Server" extension:
1. Install the extension from the VS Code marketplace
2. Open the `examples` directory in VS Code
3. Right-click on either `index.html` or `simple-example.html`
4. Select "Open with Live Server"

## Features Demonstrated

### Common Features
- **Cross-API Support**: Works with WebGL 1.0, WebGL 2.0, and WebGPU (auto-detection)
- **Geometry Management**: Vertex and index buffers with custom attribute layouts
- **Material System**: Basic material with uniform support
- **Render Pipelines**: Shader management and pipeline creation
- **Animation**: Continuous rendering loop with matrix transformations
- **Resource Management**: Proper resource creation and disposal

### Complex Example Additional Features
- **3D Cube**: More complex geometry with multiple faces and colors
- **Perspective Projection**: Realistic 3D projection
- **Camera System**: Basic camera positioning
- **Full Animation Controls**: Start, stop, resize, and dispose functions

### Simple Example Additional Features
- **User Controls**: Buttons to start, stop, and dispose
- **Responsive Design**: Adapts to window size changes
- **Clean Code**: Simplified structure for easier understanding

## Project Structure

```
examples/
├── index.html              # Complex cube example
├── simple-example.html     # Simple triangle example
└── lib/renderer/
    ├── index.ts            # Renderer system entry point
    ├── example.ts          # Complex example implementation
    ├── Renderer.ts         # Renderer base class
    ├── Texture.ts          # Texture management
    ├── Pipeline.ts         # Pipeline management
    ├── Geometry.ts         # Geometry management
    ├── Material.ts         # Material system
    ├── types.ts            # Type definitions
    ├── webgl/              # WebGL implementation
    └── webgpu/             # WebGPU implementation
```

## Browser Compatibility

- **WebGL 1.0**: All modern browsers (Chrome, Firefox, Safari, Edge)
- **WebGL 2.0**: Chrome, Firefox, Safari 15+, Edge
- **WebGPU**: Chrome 113+, Firefox Nightly, Safari Tech Preview

The renderer system automatically detects and uses the best available API.

## Troubleshooting

### "Failed to load module script" Error
- Ensure you're running the files through a web server (not directly from the file system)
- Check that all file paths are correct

### Rendering Issues
- Check the browser console for error messages
- Ensure WebGL/WebGPU is supported and enabled in your browser
- Try updating your browser to the latest version

### Performance Issues
- Disable debug mode in production (`enableDebug: false`)
- Reduce the complexity of geometries
- Limit the number of draw calls

## License

MIT License