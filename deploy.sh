#!/bin/bash

# FeedAQ Academy Deployment Script for DigitalOcean
# This script sets up the environment and deploys both frontend and backend

set -e

echo "🚀 Starting FeedAQ Academy deployment..."

# Update system packages
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Docker if not already installed
if ! command -v docker &> /dev/null; then
    echo "🐳 Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
fi

# Install Docker Compose if not already installed
if ! command -v docker-compose &> /dev/null; then
    echo "🔧 Installing Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

# Install Git if not already installed
if ! command -v git &> /dev/null; then
    echo "📥 Installing Git..."
    sudo apt install git -y
fi

# Create deployment directory
DEPLOY_DIR="/opt/feedaq-academy"
echo "📁 Creating deployment directory at $DEPLOY_DIR..."
sudo mkdir -p $DEPLOY_DIR
sudo chown $USER:$USER $DEPLOY_DIR

# Clone or update repositories
cd $DEPLOY_DIR

if [ ! -d "feedaq-academy-dashboard" ]; then
    echo "📥 Cloning frontend repository..."
    # Replace with your actual repository URLs
    git clone https://github.com/FeedAQ-INDIA/feedaq-academy-dashboard.git
else
    echo "🔄 Updating frontend repository..."
    cd feedaq-academy-dashboard
    git pull origin main
    cd ..
fi

if [ ! -d "feedaq-academy-backend" ]; then
    echo "📥 Cloning backend repository..."
    # Replace with your actual repository URLs
    git clone https://github.com/FeedAQ-INDIA/feedaq-academy-backend.git
else
    echo "🔄 Updating backend repository..."
    cd feedaq-academy-backend
    git pull origin main
    cd ..
fi

# Stop existing containers if running
echo "🛑 Stopping existing containers..."
cd feedaq-academy-dashboard
docker-compose down || true

# Build and start containers
echo "🏗️  Building and starting containers..."
docker-compose up -d --build

# Setup firewall rules
echo "🔒 Setting up firewall..."
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 3000/tcp
sudo ufw --force enable

# Install Nginx for reverse proxy (optional but recommended)
if ! command -v nginx &> /dev/null; then
    echo "🌐 Installing Nginx..."
    sudo apt install nginx -y
    sudo systemctl enable nginx
fi

echo "✅ Deployment completed successfully!"
echo "🌐 Frontend should be accessible at: http://$(curl -s ifconfig.me)"
echo "🔧 Backend API should be accessible at: http://$(curl -s ifconfig.me):3000"
echo "📊 Check container status with: docker-compose ps"
echo "📋 View logs with: docker-compose logs -f"