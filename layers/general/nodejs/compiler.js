const fs = require('fs');
const path = require('path');

function modifyImports(filePath, aliasMap) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const lines = fileContent.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.includes('@/')) {
      const updatedLine = line.replace(/@\/(\w+)/g, (_, alias) => {
        if (aliasMap[alias]) {
          return aliasMap[alias];
        } else {
          throw new Error(
            `Path alias not found for alias '@/${alias}' in tsconfig.json.`
          );
        }
      });

      lines[i] = updatedLine;
    }
  }

  const modifiedContent = lines.join('\n');
  fs.writeFileSync(filePath, modifiedContent);
}

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
