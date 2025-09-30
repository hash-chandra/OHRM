#!/bin/bash

# OrangeHRM Test Automation Setup Script

echo "🚀 Setting up OrangeHRM Test Automation..."

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed. Please install Node.js (v16 or higher) first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Install Playwright browsers
echo "🌐 Installing Playwright browsers..."
npx playwright install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install Playwright browsers"
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "⚙️ Creating .env file..."
    cp .env.example .env
    echo "✅ Created .env file from template"
else
    echo "✅ .env file already exists"
fi

# Create reports directories if they don't exist
mkdir -p reports/screenshots
mkdir -p reports/videos

echo "📁 Created reports directories"

# Run a quick smoke test to verify setup
echo "🧪 Running smoke test to verify setup..."
npm run test:smoke

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Setup completed successfully!"
    echo ""
    echo "📋 Quick start commands:"
    echo "  npm test                  # Run all tests"
    echo "  npm run test:smoke        # Run smoke tests"
    echo "  npm run test:chrome       # Run tests in Chrome"
    echo "  npm run test:firefox      # Run tests in Firefox"
    echo "  npm run test:headed       # Run tests with browser UI"
    echo "  npm run test:report       # Run tests with HTML report"
    echo ""
    echo "📖 For more information, see README.md"
else
    echo "⚠️ Setup completed but smoke test failed. Please check the configuration."
    echo "💡 Try running: npm run test:headed to see the browser in action"
fi