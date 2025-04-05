// This script requires the sharp package to be installed
// npm install sharp

const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

// Path to the SVG file
const svgPath = path.join(__dirname, "../public/favicon.svg");
const pngPath = path.join(__dirname, "../public/favicon.png");

// Read the SVG file
const svgBuffer = fs.readFileSync(svgPath);

// Convert SVG to PNG
sharp(svgBuffer)
  .resize(32, 32) // Standard favicon size
  .png()
  .toFile(pngPath)
  .then(() => {
    console.log("Favicon generated successfully!");
  })
  .catch((err) => {
    console.error("Error generating favicon:", err);
  });
