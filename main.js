const canvas = document.getElementById("drawing");
const ctx = canvas.getContext("2d");

const baseRealInput = document.getElementById("baseReal");
const baseImaginaryInput = document.getElementById("baseImaginary");
const maxIterationsInput = document.getElementById("maxIterations");

let baseReal = parseFloat(baseRealInput.value);
let baseImaginary = parseFloat(baseImaginaryInput.value);
let cReal = baseReal;
let cImaginary = baseImaginary;
let maxIterations = parseInt(maxIterationsInput.value);
let useColor = false;

let zoomLevel = 1;
let offsetX = 0;
let offsetY = 0;
let isDragging = false;
let lastX = 0;
let lastY = 0;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  drawJuliaSet();
}

function drawJuliaSet() {
  const width = canvas.width;
  const height = canvas.height;
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const zx = (x - width / 2 + offsetX) / ((width / 4) * zoomLevel);
      const zy = (y - height / 2 + offsetY) / ((height / 4) * zoomLevel);
      let zr = zx;
      let zi = zy;

      let iterations = 0;
      while (iterations < maxIterations) {
        const zrNew = zr * zr - zi * zi + cReal;
        const ziNew = 2 * zr * zi + cImaginary;
        zr = zrNew;
        zi = ziNew;
        if (zr * zr + zi * zi > 4) break;
        iterations++;
      }

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
      data[index + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

function hsvToRgb(h, s, v) {
  let f = (n, k = (n + h / 60) % 6) =>
    v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
  return [f(5) * 255, f(3) * 255, f(1) * 255];
}

function updateParametersAndDraw() {
  baseReal = parseFloat(baseRealInput.value);
  baseImaginary = parseFloat(baseImaginaryInput.value);
  cReal = baseReal;
  cImaginary = baseImaginary;
  maxIterations = parseInt(maxIterationsInput.value);
  drawJuliaSet();
}

function toggleColorMode() {
  useColor = !useColor;
  drawJuliaSet();
}

function zoomIn() {
  zoomLevel *= 1.1; // Increase zoom level by 10%
  drawJuliaSet();
}

function zoomOut() {
  zoomLevel /= 1.1; // Decrease zoom level by 10%
  drawJuliaSet();
}

function resetZoom() {
  zoomLevel = 1;
  offsetX = 0;
  offsetY = 0;
  drawJuliaSet();
}

function saveImage() {
  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = "fractal.png";
  link.click();
}

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

canvas.addEventListener("mousedown", (event) => {
  isDragging = true;
  lastX = event.clientX;
  lastY = event.clientY;
});

canvas.addEventListener("mousemove", (event) => {
  if (isDragging) {
    const deltaX = event.clientX - lastX;
    const deltaY = event.clientY - lastY;
    offsetX += deltaX;
    offsetY += deltaY;
    lastX = event.clientX;
    lastY = event.clientY;
    drawJuliaSet();
  }
});

canvas.addEventListener("mouseup", () => {
  isDragging = false;
});

let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(resizeCanvas, 250);
});

resizeCanvas();

document.getElementById("menuToggle").addEventListener("click", function () {
  const controls = document.getElementById("controls");
  controls.classList.toggle("show");
});
