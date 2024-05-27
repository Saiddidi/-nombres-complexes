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

let animationFrameId;
let time = 0;
let animationActive = true;

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
      const zx = (x - width / 2) / (width / 4);
      const zy = (y - height / 2) / (height / 4);
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

      const brightness = (iterations / maxIterations) * 255;
      const index = (x + y * width) * 4;
      data[index] = brightness;
      data[index + 1] = brightness;
      data[index + 2] = brightness;
      data[index + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);

  if (animationActive) {
    animationFrameId = requestAnimationFrame(update);
  } else {
    cancelAnimationFrame(animationFrameId);
  }
}

function update() {
  time += 0.05; // Faster animation
  cReal = baseReal + Math.sin(time) * 0.05;
  cImaginary = baseImaginary + Math.cos(time) * 0.05;

  drawJuliaSet();
}

document.getElementById("confirmButton").addEventListener("click", () => {
  baseReal = parseFloat(baseRealInput.value);
  baseImaginary = parseFloat(baseImaginaryInput.value);
  cReal = baseReal;
  cImaginary = baseImaginary;
  maxIterations = parseInt(maxIterationsInput.value);
  drawJuliaSet();
});

document.getElementById("toggleButton").addEventListener("click", () => {
  animationActive = !animationActive;
  if (animationActive) {
    drawJuliaSet();
  } else {
    cancelAnimationFrame(animationFrameId);
  }
});

let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(resizeCanvas, 250); // Improved responsiveness
});

resizeCanvas();
drawJuliaSet();
