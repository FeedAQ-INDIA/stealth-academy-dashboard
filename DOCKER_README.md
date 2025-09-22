# Docker Files Overview

This directory contains Docker configuration files for deploying FeedAQ Academy on DigitalOcean.

## Files Created

### Frontend (feedaq-academy-dashboard/)
- `Dockerfile` - Multi-stage build for React app with Nginx
- `nginx.conf` - Nginx configuration for serving React app
- `.dockerignore` - Files to exclude from Docker build context
- `docker-compose.yml` - Orchestration for both frontend and backend

### Backend (feedaq-academy-backend/)
- `Dockerfile` - Node.js backend container configuration
- `.dockerignore` - Files to exclude from Docker build context

### Deployment Scripts
- `deploy.sh` - Automated deployment script for DigitalOcean
- `manage.sh` - Management script for running operations
- `DEPLOYMENT_GUIDE.md` - Complete deployment documentation

## Quick Start

1. Create a DigitalOcean droplet (Ubuntu 22.04 LTS)
2. SSH into the droplet
3. Run the deployment script:
   ```bash
   curl -fsSL YOUR_REPO_URL/deploy.sh -o deploy.sh
   chmod +x deploy.sh
   ./deploy.sh
   ```

## Architecture

- **Frontend**: React app built and served by Nginx on port 80
- **Backend**: Node.js API running on port 3000
- **Network**: Docker bridge network for internal communication
- **Volumes**: Persistent storage for logs

## Management

Use the management script for common operations:
```bash
./manage.sh start|stop|restart|update|logs|status|backup|cleanup
```

For detailed instructions, see `DEPLOYMENT_GUIDE.md`.