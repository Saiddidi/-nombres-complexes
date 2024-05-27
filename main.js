// Get the canvas element
const canvas = document.getElementById("drawing");
const ctx = canvas.getContext("2d");

// Define the Julia set parameters
let baseReal = -0.9; // Base value for cReal
let baseImaginary = 0.27015; // Base value for cImaginary
let cReal = baseReal;
let cImaginary = baseImaginary;
const maxIterations = 100;

// Animation parameters
let animationFrameId;
let time = 0;
let animationActive = true; // Initially active

// Resize canvas to fill the window
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  drawJuliaSet();
}

// Function to draw the Julia set
function drawJuliaSet() {
  const width = canvas.width;
  const height = canvas.height;
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  // Iterate over each pixel
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      // Convert pixel coordinates to complex number
      const zx = (x - width / 2) / (width / 4);
      const zy = (y - height / 2) / (height / 4);
      let zr = zx;
      let zi = zy;

      // Iterate the function
      let iterations = 0;
      while (iterations < maxIterations) {
        const zrNew = zr * zr - zi * zi + cReal;
        const ziNew = 2 * zr * zi + cImaginary;
        zr = zrNew;
        zi = ziNew;
        if (zr * zr + zi * zi > 4) break; // Escape condition
        iterations++;
      }

      // Color the pixel based on iterations
      const brightness = (iterations / maxIterations) * 255;
      const index = (x + y * width) * 4;
      data[index] = brightness; // Red
      data[index + 1] = brightness; // Green
      data[index + 2] = brightness; // Blue
      data[index + 3] = 255; // Alpha
    }
  }

  // Put the image data onto the canvas
  ctx.putImageData(imageData, 0, 0);

  if (animationActive) {
    animationFrameId = requestAnimationFrame(update);
  } else {
    cancelAnimationFrame(animationFrameId);
  }
}

// Function to update the Julia set parameters and redraw
function update() {
  time += 0.01; // Increment time
  cReal = baseReal + Math.sin(time) * 0.01;
  cImaginary = baseImaginary + Math.cos(time) * 0.01;

  drawJuliaSet();
}

// Toggle animation when button is clicked
const toggleButton = document.getElementById("toggleButton");
toggleButton.addEventListener("click", () => {
  animationActive = !animationActive;
  if (animationActive) {
    drawJuliaSet(); // Start animation if activated
  }
});

// Debounce resize to improve performance
let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(resizeCanvas, 100);
});

// Initial draw and start animation
resizeCanvas();
drawJuliaSet(); // Initial draw without animation
