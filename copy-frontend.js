import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function copyDir(src, dest) {
  // Create destination directory if it doesn't exist
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  // Read source directory
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
      console.log(`📁 Copied: ${entry.name}`);
    }
  }
}

// Copy frontend dist to backend
const frontendDist = path.join(__dirname, 'frontend', 'dist');
const backendFrontend = path.join(__dirname, 'backend', 'dist', 'frontend');

if (fs.existsSync(frontendDist)) {
  console.log('📁 Copying frontend files to backend...');
  copyDir(frontendDist, backendFrontend);
  console.log('✅ Frontend files copied successfully!');
} else {
  console.log('❌ Frontend dist folder not found. Run "npm run build:frontend" first.');
}