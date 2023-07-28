const tsconfigPaths = require('tsconfig-paths');

const baseUrl = './'; // La misma baseUrl que tienes en tsconfig.json
const { paths } = require('./tsconfig.json').compilerOptions;

tsconfigPaths.register({
  baseUrl,
  paths
});
