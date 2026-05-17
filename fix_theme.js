const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'client', 'src', 'pages');
const componentsDir = path.join(__dirname, 'client', 'src', 'components');

function processFile(filePath) {
    if (filePath.endsWith('Login.jsx') || filePath.endsWith('Signup.jsx')) return;
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace text colors using negative lookbehind to ignore dark:, hover:, focus:
    content = content.replace(/(?<!(dark|hover|focus):)text-slate-900/g, 'text-slate-900 dark:text-slate-100');
    content = content.replace(/(?<!(dark|hover|focus):)text-slate-800/g, 'text-slate-800 dark:text-slate-200');
    content = content.replace(/(?<!(dark|hover|focus):)text-slate-700/g, 'text-slate-700 dark:text-slate-300');
    content = content.replace(/(?<!(dark|hover|focus):)text-slate-600/g, 'text-slate-600 dark:text-slate-400');
    content = content.replace(/(?<!(dark|hover|focus):)text-slate-500/g, 'text-slate-500 dark:text-slate-400');
    content = content.replace(/(?<!(dark|hover|focus):)text-slate-400/g, 'text-slate-400 dark:text-slate-500');
    
    // Replace background colors
    content = content.replace(/(?<!(dark|hover|focus):)bg-white\/90/g, 'bg-white/90 dark:bg-dark-800/90');
    content = content.replace(/(?<!(dark|hover|focus):)bg-white\/80/g, 'bg-white/80 dark:bg-dark-800/80');
    content = content.replace(/(?<!(dark|hover|focus):)bg-slate-50/g, 'bg-slate-50 dark:bg-dark-900');
    
    // Use word boundary for bg-white to avoid matching bg-white/90
    content = content.replace(/(?<!(dark|hover|focus):)bg-white(?!\/)/g, 'bg-white dark:bg-dark-800');
    
    // Borders
    content = content.replace(/(?<!(dark|hover|focus):)border-slate-200/g, 'border-slate-200 dark:border-dark-700');
    content = content.replace(/(?<!(dark|hover|focus):)border-slate-100/g, 'border-slate-100 dark:border-dark-700');
    
    fs.writeFileSync(filePath, content);
}

function walkDir(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else if (fullPath.endsWith('.jsx')) {
            processFile(fullPath);
        }
    }
}

walkDir(pagesDir);
walkDir(componentsDir);
console.log('Done');
