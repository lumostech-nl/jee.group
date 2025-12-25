#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up Blog CMS System...\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env.local file...');
  const envExample = fs.readFileSync('.env.example', 'utf8');
  fs.writeFileSync('.env.local', envExample);
  console.log('✅ Created .env.local file. Please update the database and Vercel Blob settings.\n');
} else {
  console.log('✅ .env.local file already exists.\n');
}

// Install dependencies
console.log('📦 Installing dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependencies installed successfully.\n');
} catch (error) {
  console.error('❌ Failed to install dependencies:', error.message);
  process.exit(1);
}

// Generate Prisma client
console.log('🔧 Generating Prisma client...');
try {
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma client generated successfully.\n');
} catch (error) {
  console.error('❌ Failed to generate Prisma client:', error.message);
  process.exit(1);
}

console.log('🎉 Setup complete! Next steps:\n');
console.log('1. Update your .env.local file with your database and Vercel Blob settings');
console.log('2. Set up your PostgreSQL database');
console.log('3. Set up Vercel Blob storage (add BLOB_READ_WRITE_TOKEN to .env.local)');
console.log('4. Run: npx prisma db push');
console.log('5. Run: npm run dev');
console.log('\n📖 For detailed instructions, see the README.md file');
console.log('\n🔗 Access the application:');
console.log('   - Blog: http://localhost:3000');
console.log('   - CMS: http://localhost:3000/cms');
console.log('   - Demo login: admin@example.com / password');
