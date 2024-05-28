// Get the canvas and its context
const canvas = document.getElementById("drawing");
const ctx = canvas.getContext("2d");

// Get input elements for base values and maximum iterations
const baseRealInput = document.getElementById("baseReal");
const baseImaginaryInput = document.getElementById("baseImaginary");
const maxIterationsInput = document.getElementById("maxIterations");

// Initialize variables for base values, complex constants, and settings
let baseReal = parseFloat(baseRealInput.value);
let baseImaginary = parseFloat(baseImaginaryInput.value);
let cReal = baseReal;
let cImaginary = baseImaginary;
let maxIterations = parseInt(maxIterationsInput.value);
let useColor = false;

// Variables for zooming and panning
let zoomLevel = 1;
let targetZoomLevel = zoomLevel;
let zoomSpeed = 0.1;

let centerX = 0;
let centerY = 0;

let isDragging = false;
let lastX = 0;
let lastY = 0;

// Function to resize the canvas based on window size
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  drawJuliaSet();
}

// Function to draw the Julia Set fractal
function drawJuliaSet() {
  // Get canvas dimensions and create image data
  const width = canvas.width;
  const height = canvas.height;
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  // Loop through each pixel to calculate the fractal
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      // Map pixel coordinates to complex plane coordinates
      const zx = (x - width / 2 + centerX) / ((width / 4) * zoomLevel);
      const zy = (y - height / 2 + centerY) / ((height / 4) * zoomLevel);
      let zr = zx;
      let zi = zy;

      let iterations = 0;
      // Iterate the fractal equation until escape condition or max iterations
      while (iterations < maxIterations) {
        const zrNew = zr * zr - zi * zi + cReal;
        const ziNew = 2 * zr * zi + cImaginary;
        zr = zrNew;
        zi = ziNew;
        if (zr * zr + zi * zi > 4) break;
        iterations++;
      }

      // Set pixel color based on iteration count
      const index = (x + y * width) * 4;
      if (useColor) {
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
        const brightness = (iterations / maxIterations) * 255;
        data[index] = data[index + 1] = data[index + 2] = brightness;
      }
      data[index + 3] = 255; // Alpha value
    }
  }

  // Put the image data onto the canvas
  ctx.putImageData(imageData, 0, 0);
}

// Conversion function from HSV to RGB color space
function hsvToRgb(h, s, v) {
  let f = (n, k = (n + h / 60) % 6) =>
    v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
  return [f(5) * 255, f(3) * 255, f(1) * 255];
}

// Function to update parameters and redraw the fractal
function updateParametersAndDraw() {
  baseReal = parseFloat(baseRealInput.value);
  baseImaginary = parseFloat(baseImaginaryInput.value);
  cReal = baseReal;
  cImaginary = baseImaginary;
  maxIterations = parseInt(maxIterationsInput.value);
  drawJuliaSet();
}

// Function to toggle between color and grayscale modes
function toggleColorMode() {
  useColor = !useColor;
  drawJuliaSet();
}

// Function for smooth zooming animation
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

// Functions for zooming in, out, and resetting zoom
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

// Function to save the fractal image
function saveImage() {
  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = "fractal.png";
  link.click();
}

// Event listeners for mouse and touch interactions
// (Not repeating the comments for these functions since they are straightforward)

canvas.addEventListener("mousedown", handleMouseDown);
canvas.addEventListener("mousemove", handleMouseMove);
canvas.addEventListener("mouseup", handleMouseUp);
canvas.addEventListener("mouseleave", handleMouseUp);

canvas.addEventListener("touchstart", handleTouchStart);
canvas.addEventListener("touchmove", handleTouchMove);
canvas.addEventListener("touchend", handleTouchEnd);
canvas.addEventListener("touchcancel", handleTouchEnd);

// Event listeners for input changes and buttons
baseRealInput.addEventListener("input", updateParametersAndDraw);
baseImaginaryInput.addEventListener("input", updateParametersAndDraw);
maxIterationsInput.addEventListener("input", updateParametersAndDraw);
document
  .getElementById("colorToggleButton")
  .addEventListener("click", toggleColorMode);
document.getElementById("zoomInButton").addEventListener("click", zoomIn);
document.getElementById("zoomOutButton").addEventListener("click", zoomOut);
document.getElementById("resetButton").addEventListener("click", resetZoom);
document.getElementById("saveImageButton").addEventListener("click", saveImage);

// Resize canvas on window resize event
let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(resizeCanvas, 250);
});

// Initial resize of canvas and toggle menu event
resizeCanvas();

document.getElementById("menuToggle").addEventListener("click", function () {
  const controls = document.getElementById("controls");
  controls.classList.toggle("show");
});


