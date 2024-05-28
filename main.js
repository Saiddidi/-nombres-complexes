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
let isDragging = false;
let lastX = 0;
let lastY = 0;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  drawJuliaSet();
}

function drawJuliaSet() {
  // Your existing fractal drawing code goes here
}

function hsvToRgb(h, s, v) {
  // Your existing HSV to RGB conversion code goes here
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
  drawJuliaSet();
}

function saveImage() {
  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = "fractal.png";
  link.click();
}

function handleMouseDown(event) {
  isDragging = true;
  lastX = event.clientX;
  lastY = event.clientY;
}

function handleMouseMove(event) {
  if (isDragging) {
    const dx = event.clientX - lastX;
    const dy = event.clientY - lastY;
    lastX = event.clientX;
    lastY = event.clientY;
    canvas.style.cursor = "grabbing";
    canvas.scrollLeft -= dx;
    canvas.scrollTop -= dy;
  }
}

function handleMouseUp() {
  isDragging = false;
  canvas.style.cursor = "grab";
}

function handleTouchStart(event) {
  if (event.touches.length === 1) {
    isDragging = true;
    lastX = event.touches[0].clientX;
    lastY = event.touches[0].clientY;
  }
}

function handleTouchMove(event) {
  if (isDragging && event.touches.length === 1) {
    const dx = event.touches[0].clientX - lastX;
    const dy = event.touches[0].clientY - lastY;
    lastX = event.touches[0].clientX;
    lastY = event.touches[0].clientY;
    canvas.style.cursor = "grabbing";
    canvas.scrollLeft -= dx;
    canvas.scrollTop -= dy;
  }
}

function handleTouchEnd() {
  isDragging = false;
  canvas.style.cursor = "grab";
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

canvas.addEventListener("mousedown", handleMouseDown);
canvas.addEventListener("mousemove", handleMouseMove);
canvas.addEventListener("mouseup", handleMouseUp);
canvas.addEventListener("mouseleave", handleMouseUp);

canvas.addEventListener("touchstart", handleTouchStart);
canvas.addEventListener("touchmove", handleTouchMove);
canvas.addEventListener("touchend", handleTouchEnd);

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

