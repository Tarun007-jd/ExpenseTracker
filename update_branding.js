const fs = require('fs');
const path = require('path');

const filesToUpdate = [
    path.join(__dirname, 'client', 'src', 'pages', 'Login.jsx'),
    path.join(__dirname, 'client', 'src', 'pages', 'Signup.jsx'),
    path.join(__dirname, 'client', 'src', 'components', 'Sidebar.jsx')
];

for (const file of filesToUpdate) {
    if (!fs.existsSync(file)) continue;
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace text
    content = content.replace(/>ExpenseTracker</g, '>JD Expense Tracker<');
    content = content.replace(/alt="ExpenseTracker"/g, 'alt="JD Expense Tracker"');
    content = content.replace(/Join ExpenseTracker/g, 'Join JD Expense Tracker');
    
    // Replace import
    content = content.replace(/JD expense Icon\.png/g, 'jd_icon.png');
    
    fs.writeFileSync(file, content);
}

console.log('Branding updated');
