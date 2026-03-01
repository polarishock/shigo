const fs = require('fs');
const path = require('path');

const files = [
  'src/lib/utils.ts',
  'src/firebase.ts',
  'src/components/BottomNav.tsx',
  'src/components/Layout.tsx',
  'src/components/PackingList.tsx',
  'src/pages/Schedule.tsx',
  'src/pages/Bookings.tsx',
  'src/pages/Expense.tsx',
  'src/pages/Journal.tsx',
  'src/pages/Planning.tsx',
  'src/pages/Members.tsx',
  'src/App.tsx'
];

let allImports = new Set();
let allCode = [];

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf-8');
  const lines = content.split('\n');
  let codeLines = [];
  
  lines.forEach(line => {
    if (line.startsWith('import ')) {
      // If it's a local import, ignore it
      if (line.includes("from './") || line.includes("from '../")) {
        return;
      }
      allImports.add(line);
    } else if (line.startsWith('export default function App')) {
      codeLines.push(line);
    } else if (line.startsWith('export default function ')) {
      codeLines.push(line.replace('export default function ', 'function '));
    } else if (line.startsWith('export default ')) {
      // skip export default app;
    } else if (line.startsWith('export ')) {
      codeLines.push(line.replace('export ', ''));
    } else {
      codeLines.push(line);
    }
  });
  
  allCode.push(`// --- ${file} ---`);
  allCode.push(codeLines.join('\n'));
});

// Combine imports from the same package
const importMap = new Map();
Array.from(allImports).forEach(imp => {
  const match = imp.match(/import\s+(?:({[^}]+})|([^{}\s]+))\s+from\s+['"]([^'"]+)['"]/);
  if (match) {
    const pkg = match[3];
    if (!importMap.has(pkg)) {
      importMap.set(pkg, new Set());
    }
    if (match[1]) {
      const items = match[1].replace(/[{}]/g, '').split(',').map(s => s.trim());
      items.forEach(item => importMap.get(pkg).add(item));
    } else if (match[2]) {
      importMap.get(pkg).add(`default as ${match[2]}`);
    }
  } else {
    // For imports like import 'package';
    // Just keep them as is
  }
});

let combinedImports = [];
for (const [pkg, items] of importMap.entries()) {
  const defaultImports = Array.from(items).filter(item => item.startsWith('default as ')).map(item => item.replace('default as ', ''));
  const namedImports = Array.from(items).filter(item => !item.startsWith('default as '));
  
  let importStr = 'import ';
  if (defaultImports.length > 0) {
    importStr += defaultImports[0];
    if (namedImports.length > 0) {
      importStr += ', ';
    }
  }
  if (namedImports.length > 0) {
    importStr += `{ ${namedImports.join(', ')} }`;
  }
  importStr += ` from '${pkg}';`;
  combinedImports.push(importStr);
}

const finalCode = combinedImports.join('\n') + '\n\n' + allCode.join('\n');
fs.writeFileSync('src/CombinedApp.tsx', finalCode);
console.log('Done');
