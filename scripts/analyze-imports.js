#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ARGS = process.argv.slice(2);

if (ARGS.length === 0) {
  console.error('Usage: node scripts/analyze-imports.js <path-to-app>');
  console.error('Example: node scripts/analyze-imports.js apps/customer-app');
  process.exit(1);
}

const TARGET_DIR = ARGS[0];
const ROOT_PACKAGE_JSON = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));

// Get all available packages from root package.json
const ALL_DEPENDENCIES = {
  ...ROOT_PACKAGE_JSON.dependencies,
  ...ROOT_PACKAGE_JSON.devDependencies,
};

// Regex patterns to find imports/requires
const PATTERNS = [
  /(?:import|from)\s+['"](@?[a-zA-Z0-9\-\.\/]+)['"];?/g,
  /require\(['"](@?[a-zA-Z0-9\-\.\/]+)['"]\)/g,
  /import\s+['"](@?[a-zA-Z0-9\-\.\/]+)['"]/g,
];

const IGNORE_PATTERNS = [
  /^\./, 
  /^~/,
  /^@\//,
];

function extractPackageName(importStr) {
  const trimmed = importStr.trim();
  
  if (IGNORE_PATTERNS.some(pattern => pattern.test(trimmed))) {
    return null;
  }
  
  if (trimmed.startsWith('@')) {
    const parts = trimmed.split('/');
    return `${parts[0]}/${parts[1]}`;
  }
  
  return trimmed.split('/')[0];
}

function findFiles(dir, ext = ['.ts', '.tsx', '.js', '.jsx']) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      if (['.next', 'node_modules', 'dist', '.git', '.nx'].includes(entry.name)) {
        continue;
      }
      results = results.concat(findFiles(fullPath, ext));
    } else if (entry.isFile()) {
      if (ext.some(e => entry.name.endsWith(e))) {
        results.push(fullPath);
      }
    }
  }
  
  return results;
}

function extractImportsFromFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const imports = new Set();
    
    for (const pattern of PATTERNS) {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const packageName = extractPackageName(match[1]);
        if (packageName && ALL_DEPENDENCIES[packageName]) {
          imports.add(packageName);
        }
      }
    }
    
    return imports;
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err.message);
    return new Set();
  }
}

function analyzeApp(appPath) {
  console.log(`\n📦 Analyzing: ${appPath}`);
  console.log('━'.repeat(50));
  
  if (!fs.existsSync(appPath)) {
    console.error(`❌ Directory not found: ${appPath}`);
    process.exit(1);
  }
  
  const sourceDir = path.join(appPath, 'src');
  if (!fs.existsSync(sourceDir)) {
    console.error(`❌ No src/ directory found in ${appPath}`);
    process.exit(1);
  }
  
  const sourceFiles = findFiles(sourceDir);
  console.log(`📄 Found ${sourceFiles.length} source files`);
  
  const allImports = new Set();
  for (const file of sourceFiles) {
    const imports = extractImportsFromFile(file);
    imports.forEach(imp => allImports.add(imp));
  }
  
  const sortedImports = Array.from(allImports).sort();
  
  console.log(`\n✅ Found ${sortedImports.length} dependencies:\n`);
  sortedImports.forEach(pkg => {
    const version = ALL_DEPENDENCIES[pkg];
    console.log(`  ${pkg}@${version}`);
  });
  
  const requiredPackageJson = {
    name: path.basename(appPath),
    version: '1.0.0',
    private: true,
    dependencies: {},
  };
  
  for (const pkg of sortedImports) {
    requiredPackageJson.dependencies[pkg] = ALL_DEPENDENCIES[pkg];
  }
  
  const outputPath = path.join(appPath, 'required-package.json');
  fs.writeFileSync(
    outputPath,
    JSON.stringify(requiredPackageJson, null, 2),
    'utf8'
  );
  
  console.log(`\n💾 Wrote: ${outputPath}`);
  console.log(`\n📋 Summary:`);
  console.log(`  Dependencies found: ${sortedImports.length}`);
  console.log(`  Estimated node_modules size: ~${Math.round(sortedImports.length * 2)}MB`);
}

analyzeApp(TARGET_DIR);
