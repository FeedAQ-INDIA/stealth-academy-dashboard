#!/bin/bash

# FeedAQ Academy Management Script
# This script provides commands to manage the deployed application

set -e

DEPLOY_DIR="/opt/feedaq-academy/feedaq-academy-dashboard"
cd $DEPLOY_DIR

case "$1" in
    start)
        echo "🚀 Starting FeedAQ Academy services..."
        docker-compose up -d
        echo "✅ Services started successfully!"
        ;;
    stop)
        echo "🛑 Stopping FeedAQ Academy services..."
        docker-compose down
        echo "✅ Services stopped successfully!"
        ;;
    restart)
        echo "🔄 Restarting FeedAQ Academy services..."
        docker-compose down
        docker-compose up -d
        echo "✅ Services restarted successfully!"
        ;;
    update)
        echo "🔄 Updating FeedAQ Academy..."
        
        # Update frontend
        git pull origin main
        
        # Update backend
        cd ../feedaq-academy-backend
        git pull origin main
        cd ../feedaq-academy-dashboard
        
        # Rebuild and restart containers
        docker-compose down
        docker-compose up -d --build
        echo "✅ Update completed successfully!"
        ;;
    logs)
        echo "📋 Showing logs (press Ctrl+C to exit)..."
        docker-compose logs -f
        ;;
    status)
        echo "📊 Service Status:"
        docker-compose ps
        echo ""
        echo "🐳 Docker System Info:"
        docker system df
        ;;
    backup)
        echo "💾 Creating backup..."
        BACKUP_DIR="/opt/feedaq-academy/backups/$(date +%Y%m%d_%H%M%S)"
        sudo mkdir -p $BACKUP_DIR
        
        # Backup application files
        sudo cp -r ../feedaq-academy-dashboard $BACKUP_DIR/
        sudo cp -r ../feedaq-academy-backend $BACKUP_DIR/
        
        echo "✅ Backup created at: $BACKUP_DIR"
        ;;
    cleanup)
        echo "🧹 Cleaning up Docker resources..."
        docker system prune -f
        docker volume prune -f
        echo "✅ Cleanup completed!"
        ;;
    *)
        echo "FeedAQ Academy Management Script"
        echo "Usage: $0 {start|stop|restart|update|logs|status|backup|cleanup}"
        echo ""
        echo "Commands:"
        echo "  start   - Start all services"
        echo "  stop    - Stop all services"
        echo "  restart - Restart all services"
        echo "  update  - Pull latest code and rebuild containers"
        echo "  logs    - Show live logs"
        echo "  status  - Show service status"
        echo "  backup  - Create backup of application files"
        echo "  cleanup - Clean up unused Docker resources"
        exit 1
        ;;
esac