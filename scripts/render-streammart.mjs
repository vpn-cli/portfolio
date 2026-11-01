import { execSync } from "child_process";
import path from "path";

const chrome = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const rootDir = process.cwd();
const htmlPath = path.resolve(rootDir, "public", "projects", "stream-mart-preview.html");
const outPath = path.resolve(rootDir, "public", "projects", "stream-mart.png");

console.log("Rendering:", htmlPath);
execSync(`"${chrome}" --headless --hide-scrollbars --window-size=1200,750 --screenshot="${outPath}" "file:///${htmlPath.replace(/\\/g, '/')}"`);
console.log("Rendered stream-mart.png!");

