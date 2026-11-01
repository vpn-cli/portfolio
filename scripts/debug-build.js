const { exec } = require('child_process');

console.log('Running next build...');
const child = exec('npx next build');
child.stdout.pipe(process.stdout);
child.stderr.pipe(process.stderr);
child.on('exit', (code) => {
  console.log('Exit code:', code);
});
