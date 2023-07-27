// External modules
import fs from 'fs';
import path from 'path';

// Webpack plugins
import { Configuration as WebpackConfiguration } from 'webpack';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import NodemonPlugin from 'nodemon-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import NodeExternals from 'webpack-node-externals';
import CopyPlugin from 'copy-webpack-plugin';

// Environment config
declare const process: any, __dirname: any;
const mode: any = process.env.NODE_ENV ?? 'development';
const copyEnvFile: any = fs.existsSync('./.env')
  ? [
      new CopyPlugin({
        patterns: [{ from: '.env' }]
      })
    ]
  : [];

// Eslint config
const lintDirtyModulesOnly: boolean =
  mode === 'development'
    ? process.env.ESLINT_DIRTY_MODE === 'false'
      ? false
      : true
    : false;

// Bundle config options
const configuration: WebpackConfiguration = {
  mode,
  devtool: 'eval-cheap-module-source-map',
  target: 'node',
  entry: path.resolve(__dirname, 'src'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.js',
    clean: true
  },
  stats: 'minimal',
  module: {
    rules: [
      {
        test: /\.(ts|js)?$/,
        use: {
          loader: 'swc-loader',
          options: {
            jsc: {
              parser: {
                syntax: 'typescript',
                tsx: false,
                decorators: true,
                dynamicImport: true
              },
              transform: {
                legacyDecorator: true,
                decoratorMetadata: true
              }
            },
            module: {
              type: 'commonjs'
            }
          }
        },
        exclude: [/node_modules/]
      },
      {
        test: /\.hbs?$/,
        use: 'handlebars-loader'
      }
    ]
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin(),
    new NodemonPlugin({
      ignore: ['src/**/*.spec.ts']
    }),
    new ESLintPlugin({
      extensions: ['.ts', '.js'],
      threads: true,
      lintDirtyModulesOnly
    }),
    ...copyEnvFile
  ],
  externals: [NodeExternals()] as WebpackConfiguration['externals'],
  resolve: {
    extensions: ['.ts', '.js', '.json'],
    plugins: [new TsconfigPathsPlugin()]
  },
  ignoreWarnings: [/Critical dependency:/]
};

export default configuration;
