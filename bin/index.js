#!/usr/bin/env node

/* eslint-disable no-console */

const path = require('path');
const fs = require('fs');
const parse = require('../src/parse');

const args = process.argv.splice(2);

const getArgsValue = option => {
  const indexOfOption = args.indexOf(option);
  const indexOfValue = indexOfOption >= 0 ? indexOfOption + 1 : indexOfOption;
  return args[indexOfValue];
};

const argsOutputValue = getArgsValue('--output') || getArgsValue('-o');
const argsTemplateValue = getArgsValue('--template') || getArgsValue('-t');

if (!argsTemplateValue)
  throw new Error('Please provide templates path (--template || -t) ');

const templatePath = path.join(process.cwd(), argsTemplateValue);
const outputPath = path.join(
  process.cwd(),
  argsOutputValue || argsTemplateValue,
);

if (fs.statSync(templatePath).isDirectory()) {
  const files = getAllFiles(templatePath, '.ulka');
  files.forEach(file => {
    const relPath = path.relative(templatePath, file);

    const newOutputPath = path
      .join(outputPath, relPath)
      .replace('.ulka', '.html');

    createDirectories(path.parse(newOutputPath).dir).then(_ => {
      generateHtml(file, newOutputPath);
      console.log('>> Html File generated: ' + newOutputPath);
    });
  });
} else {
  createDirectories(path.parse(outputPath).dir).then(_ => {
    const newOutputPath = path.join(
      path.parse(outputPath).dir,
      path.parse(templatePath).name + '.html',
    );
    generateHtml(templatePath, newOutputPath);
    console.log('>> Html File generated: ' + newOutputPath);
  });
}

function generateHtml(templatePath, outputPath) {
  const ulkaTemplate = fs.readFileSync(templatePath, 'utf-8');
  const htmlTemplate = parse(ulkaTemplate);
  fs.writeFileSync(outputPath, htmlTemplate);
}

async function createDirectories(pathname) {
  return await fs.promises.mkdir(pathname, {
    recursive: true,
  });
}

function getAllFiles(dirPath, ext, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(file => {
    const pathTo = path.join(dirPath, file);
    if (fs.statSync(pathTo).isDirectory()) {
      arrayOfFiles = getAllFiles(pathTo, ext, arrayOfFiles);
    } else {
      if (!ext || file.endsWith(ext)) arrayOfFiles.push(pathTo);
    }
  });

  return arrayOfFiles;
}
