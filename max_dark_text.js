const fs = require('fs');
const path = require('path');

const dirsToScan = [
    path.join(__dirname, 'client', 'src', 'pages'),
    path.join(__dirname, 'client', 'src', 'components')
];

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace light theme text colors to be the darkest possible (900)
    content = content.replace(/(?<!(dark|hover|focus):)text-slate-\d{3}/g, (match) => {
        return 'text-slate-900';
    });

    content = content.replace(/(?<!(dark|hover|focus):)text-dark-\d{3}/g, (match) => {
        return 'text-dark-900';
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

console.log('Done max text darken');
