import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const chrome = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const rootDir = process.cwd();
const sportzPath = path.resolve(rootDir, "public", "projects", "sportz-live.png");
const appforgePath = path.resolve(rootDir, "public", "projects", "appforge-live.png");

console.log("Checking Chrome existence:", fs.existsSync(chrome));

try {
  console.log("Capturing sportz to", sportzPath);
  execSync(`"${chrome}" --headless --hide-scrollbars --window-size=1280,800 --screenshot="${sportzPath}" https://sportz-rho.vercel.app`, { timeout: 20000 });
  console.log("Captured sportz!");
} catch (err) {
  console.error("Sportz error:", err.message);
}

try {
  console.log("Capturing appforge to", appforgePath);
  execSync(`"${chrome}" --headless --hide-scrollbars --window-size=1280,800 --screenshot="${appforgePath}" https://appforge-studios.vercel.app`, { timeout: 20000 });
  console.log("Captured appforge!");
} catch (err) {
  console.error("Appforge error:", err.message);
}

