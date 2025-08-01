// Simple test script to run the TypeScript server
const { spawn } = require('child_process');
const path = require('path');

process.chdir('/Users/chiragjain/Desktop/Farmer2/backend');

console.log('Starting backend server...');
console.log('Working directory:', process.cwd());

const server = spawn('node', ['node_modules/nodemon/bin/nodemon.js', 'src/server.ts'], {
  stdio: 'inherit',
  cwd: '/Users/chiragjain/Desktop/Farmer2/backend'
});

server.on('error', (err) => {
  console.error('Failed to start server:', err);
});

server.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
});
