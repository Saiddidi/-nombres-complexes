// Get the canvas element and its 2D rendering context
const canvas = document.getElementById("drawing");
const ctx = canvas.getContext("2d");

// Get input elements for base values and max iterations
const baseRealInput = document.getElementById("baseReal");
const baseImaginaryInput = document.getElementById("baseImaginary");
const maxIterationsInput = document.getElementById("maxIterations");

// Initialize variables for Julia Set parameters
let baseReal = parseFloat(baseRealInput.value);
let baseImaginary = parseFloat(baseImaginaryInput.value);
let cReal = baseReal;
let cImaginary = baseImaginary;
let maxIterations = parseInt(maxIterationsInput.value);
let useColor = false;

// Initialize zoom-related variables
let zoomLevel = 1;
let targetZoomLevel = zoomLevel;
let zoomSpeed = 0.1;

// Initialize center coordinates and dragging state variables
let centerX = 0;
let centerY = 0;
let isDragging = false;
let lastX = 0;
let lastY = 0;

// Function to resize the canvas based on window size
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  drawJuliaSet(); // Redraw Julia Set after resizing
}

// Function to draw the Julia Set fractal
function drawJuliaSet() {
  const width = canvas.width;
  const height = canvas.height;
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      // Calculate complex numbers based on zoom and center
      const zx = (x - width / 2 + centerX) / ((width / 4) * zoomLevel);
      const zy = (y - height / 2 + centerY) / ((height / 4) * zoomLevel);
      let zr = zx;
      let zi = zy;

      let iterations = 0;
      while (iterations < maxIterations) {
        // Julia Set algorithm iteration
        const zrNew = zr * zr - zi * zi + cReal;
        const ziNew = 2 * zr * zi + cImaginary;
        zr = zrNew;
        zi = ziNew;
        if (zr * zr + zi * zi > 4) break; // Escape condition
        iterations++;
      }

      const index = (x + y * width) * 4;
      if (useColor) {
        // Coloring based on iteration count
        if (iterations === maxIterations) {
          data[index] = data[index + 1] = data[index + 2] = 0;
        } else {
          const hue = Math.floor((360 * iterations) / maxIterations);
          const [r, g, b] = hsvToRgb(hue, 1, 1);
          data[index] = r;
          data[index + 1] = g;
          data[index + 2] = b;
        }
      } else {
        // Grayscale coloring based on iteration count
        const brightness = (iterations / maxIterations) * 255;
        data[index] = data[index + 1] = data[index + 2] = brightness;
      }
      data[index + 3] = 255; // Alpha channel
    }
  }

  ctx.putImageData(imageData, 0, 0); // Draw the image data onto the canvas
}

// Convert HSV color to RGB color
function hsvToRgb(h, s, v) {
  let f = (n, k = (n + h / 60) % 6) =>
    v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
  return [f(5) * 255, f(3) * 255, f(1) * 255];
}

// Update parameters and redraw Julia Set
function updateParametersAndDraw() {
  baseReal = parseFloat(baseRealInput.value);
  baseImaginary = parseFloat(baseImaginaryInput.value);
  cReal = baseReal;
  cImaginary = baseImaginary;
  maxIterations = parseInt(maxIterationsInput.value);
  drawJuliaSet();
}

// Toggle between color and grayscale modes
function toggleColorMode() {
  useColor = !useColor;
  drawJuliaSet();
}

// Smooth zooming function
function smoothZoom(newZoomLevel) {
  const frames = 10;
  const deltaZoom = (newZoomLevel - zoomLevel) / frames;
  let currentFrame = 0;

  function animateZoom() {
    zoomLevel += deltaZoom;
    drawJuliaSet();
    currentFrame++;
    if (currentFrame < frames) {
      requestAnimationFrame(animateZoom);
    } else {
      zoomLevel = newZoomLevel;
    }
  }

  animateZoom();
}

// Zoom functions
function zoomIn() {
  const newZoomLevel = zoomLevel * 1.1;
  smoothZoom(newZoomLevel);
}

function zoomOut() {
  const newZoomLevel = zoomLevel / 1.1;
  smoothZoom(newZoomLevel);
}

function resetZoom() {
  smoothZoom(1);
}

// Save the canvas image as a PNG file
function saveImage() {
  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = "fractal.png";
  link.click();
}

// Event listeners for mouse and touch interactions
// (Omitted for brevity, but they handle dragging, zooming, and touch gestures)

// Event listener for input changes to update parameters and redraw
baseRealInput.addEventListener("input", updateParametersAndDraw);
baseImaginaryInput.addEventListener("input", updateParametersAndDraw);
maxIterationsInput.addEventListener("input", updateParametersAndDraw);

// Event listeners for UI buttons
document
  .getElementById("colorToggleButton")
  .addEventListener("click", toggleColorMode);
document.getElementById("zoomInButton").addEventListener("click", zoomIn);
document.getElementById("zoomOutButton").addEventListener("click", zoomOut);
document.getElementById("resetButton").addEventListener("click", resetZoom);
document.getElementById("saveImageButton").addEventListener("click", saveImage);

// Resize canvas when the window is resized
let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(resizeCanvas, 250);
});

resizeCanvas(); // Initial canvas resize

// Show/hide controls menu toggle
document.getElementById("menuToggle").addEventListener("click", function () {
  const controls = document.getElementById("controls");
  controls.classList.toggle("show");
});
