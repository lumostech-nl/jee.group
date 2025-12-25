#!/bin/bash

echo "🚀 Setting up E-commerce Application"

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ .env.local file not found!"
    echo "📝 Please create .env.local file with the required environment variables."
    echo "📖 See README.md for more information."
    exit 1
fi

echo "📦 Installing dependencies..."
pnpm install

echo "🗄️  Generating Prisma client..."
pnpm db:generate

echo "🔄 Setting up database schema..."
pnpm db:push

echo "🌱 Seeding database with sample data..."
pnpm db:seed

echo "🧪 Running tests..."
pnpm test

echo "🏗️  Building application..."
pnpm build

echo "✅ Setup complete!"
echo ""
echo "🚀 To start the development server, run:"
echo "   pnpm dev"
echo ""
echo "🔧 To start the production server, run:"
echo "   pnpm start"
echo ""
echo "📊 To open Prisma Studio (database GUI), run:"
echo "   pnpm db:studio"
echo ""
echo "🧪 To run tests, run:"
echo "   pnpm test"
