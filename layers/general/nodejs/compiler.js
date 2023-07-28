const fs = require('fs');
const path = require('path');

function modifyImports(filePath, aliasMap) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const lines = fileContent.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.includes('@/')) {
      const updatedLine = replacer(filePath);
      lines[i] = updatedLine;
    }
  }

  const modifiedContent = lines.join('\n');
  fs.writeFileSync(filePath, modifiedContent);
}

const replacer = (filePath) => {
  const marker = 'nodejs/src/';

  const index = filePath.lastIndexOf(marker);
  if (index !== -1) {
    const relativePath = filePath.substring(index + marker.length);
    const upLevels = '../'.repeat((relativePath.match(/\//g) || []).length);
    const resultString = upLevels + relativePath;
    return resultString;
  } else {
    throw new Error('Marker not found in the file path.');
  }
};

function modifyImportsInDirectory(dirPath, aliasMap) {
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const filePath = path.join(dirPath, file);

    if (fs.statSync(filePath).isDirectory()) {
      modifyImportsInDirectory(filePath, aliasMap);
    } else if (filePath.endsWith('.ts')) {
      modifyImports(filePath, aliasMap);
    }
  }
}

const tsConfigPath = path.join(__dirname, 'tsconfig.json');
const tsConfig = require(tsConfigPath);
const aliasMap = tsConfig.compilerOptions.paths;

const srcPath = path.join(__dirname, 'src');
modifyImportsInDirectory(srcPath, aliasMap);

console.log('All imports modified successfully!');
