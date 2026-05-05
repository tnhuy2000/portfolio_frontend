const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Read .env file
const envPath = path.join(__dirname, '.env');
let port = 3000; // Default port

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const portMatch = envContent.match(/^PORT=(\d+)/m);

  if (portMatch) {
    port = portMatch[1];
    console.log(`Using port ${port} from .env`);
  }
}

// Start Next.js dev server with the port
try {
  execSync(`next dev --turbopack -p ${port}`, {
    stdio: 'inherit',
    cwd: __dirname
  });
} catch (error) {
  process.exit(1);
}
