const fs = require('fs');
const path = require('path');

const dirsToScan = [
    path.join(__dirname, 'client', 'src', 'pages'),
    path.join(__dirname, 'client', 'src', 'components')
];

const shadeMap = {
    '400': '600',
    '500': '700',
    '600': '800',
    '700': '900',
    '800': '900'
};

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace light theme text colors to be darker
    content = content.replace(/(?<!(dark|hover|focus):)text-(slate|dark)-(\d{3})/g, (match, p1, p2, p3) => {
        if (shadeMap[p3]) {
            return `text-${p2}-${shadeMap[p3]}`;
        }
        return match;
    });
    
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

for (const dir of dirsToScan) {
    walkDir(dir);
}

// Check App.jsx too
const appPath = path.join(__dirname, 'client', 'src', 'App.jsx');
if (fs.existsSync(appPath)) {
    processFile(appPath);
}

console.log('Done text darken');
