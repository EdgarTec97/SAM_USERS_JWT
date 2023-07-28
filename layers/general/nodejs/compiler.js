const fs = require('fs');
const path = require('path');

function modifyImports(filePath, aliasMap) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const lines = fileContent.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.includes('@/')) {
      const updatedLine = line.replace('@/', replacer(filePath));
      lines[i] = updatedLine;
    }
  }

  return lines.join('\n');
}

const replacer = (filePath) => {
  const marker = 'nodejs/src/';

  const index = filePath.lastIndexOf(marker);
  if (index !== -1) {
    const relativePath = filePath.substring(index + marker.length);
    const upLevels = '../'.repeat((relativePath.match(/\//g) || []).length);
    return upLevels || './';
  } else {
    throw new Error('Marker not found in the file path.');
  }
};

function createDirRecursive(targetPath) {
  const parentDir = path.dirname(targetPath);
  if (!fs.existsSync(parentDir)) {
    createDirRecursive(parentDir);
  }
  if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath);
  }
}

function copyFilesRecursively(srcDir, distDir, aliasMap) {
  const files = fs.readdirSync(srcDir);

  for (const file of files) {
    const srcFilePath = path.join(srcDir, file);
    const distFilePath = path.join(distDir, file);

    if (fs.statSync(srcFilePath).isDirectory()) {
      createDirRecursive(distFilePath);
      copyFilesRecursively(srcFilePath, distFilePath, aliasMap);
    } else if (srcFilePath.endsWith('.ts')) {
      const modifiedContent = modifyImports(srcFilePath, aliasMap);
      fs.writeFileSync(distFilePath, modifiedContent);
    } else {
      fs.copyFileSync(srcFilePath, distFilePath);
    }
  }
}

const tsConfigPath = path.join(__dirname, 'tsconfig.json');
const tsConfig = require(tsConfigPath);
const aliasMap = tsConfig.compilerOptions.paths;

const srcPath = path.join(__dirname, 'src');
const distPath = path.join(__dirname, 'dist');

createDirRecursive(distPath);
copyFilesRecursively(srcPath, distPath, aliasMap);

console.log('All imports modified and files copied successfully!');
