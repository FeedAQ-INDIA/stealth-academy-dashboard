# FeedAQ Academy - DigitalOcean Deployment Guide

This guide will help you deploy both FeedAQ Academy Dashboard (React) and Backend (Node.js) on a single DigitalOcean droplet using Docker.

## 🚀 Quick Deployment (Automated)

### Prerequisites
- DigitalOcean account
- Basic familiarity with SSH and terminal commands

### Step 1: Create DigitalOcean Droplet

1. Log into your DigitalOcean account
2. Click "Create" → "Droplets"
3. Choose the following configuration:
   - **Image**: Ubuntu 22.04 LTS
   - **Plan**: Basic
   - **CPU Options**: Regular (2 GB RAM / 1 vCPU minimum recommended)
   - **Datacenter**: Choose closest to your users
   - **Authentication**: SSH Key (recommended) or Password
   - **Hostname**: feedaq-academy

4. Click "Create Droplet"
5. Note the droplet's IP address

### Step 2: Connect to Your Droplet

```bash
ssh root@YOUR_DROPLET_IP
```

### Step 3: Run Automated Deployment

```bash
# Download and run the deployment script
curl -fsSL https://raw.githubusercontent.com/YOUR_USERNAME/feedaq-academy-dashboard/main/deploy.sh -o deploy.sh
chmod +x deploy.sh
./deploy.sh
```

**That's it!** Your application should now be running at:
- Frontend: `http://YOUR_DROPLET_IP`
- Backend API: `http://YOUR_DROPLET_IP:3000`

---

## 🔧 Manual Deployment (Step-by-Step)

If you prefer to understand each step or customize the deployment:

### Step 1: Prepare the Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Git
sudo apt install git -y

# Log out and back in to apply Docker group changes
exit
```

### Step 2: Clone Repositories

```bash
# Create deployment directory
sudo mkdir -p /opt/feedaq-academy
sudo chown $USER:$USER /opt/feedaq-academy
cd /opt/feedaq-academy

# Clone both repositories
git clone https://github.com/YOUR_USERNAME/feedaq-academy-dashboard.git
git clone https://github.com/YOUR_USERNAME/feedaq-academy-backend.git
```

### Step 3: Configure Environment

```bash
cd feedaq-academy-dashboard

# Copy the provided docker files (they should already be in the repo)
# If not, create them using the content from this guide
```

### Step 4: Deploy with Docker Compose

```bash
# Build and start containers
docker-compose up -d --build

# Check status
docker-compose ps
```

### Step 5: Configure Firewall

```bash
# Allow necessary ports
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw allow 3000/tcp # Backend API
sudo ufw --force enable
```

---

## 📊 Management Commands

Use the provided management script for easy operations:

```bash
# Make the management script executable
chmod +x manage.sh

# Available commands:
./manage.sh start     # Start services
./manage.sh stop      # Stop services
./manage.sh restart   # Restart services
./manage.sh update    # Update and rebuild
./manage.sh logs      # View logs
./manage.sh status    # Check status
./manage.sh backup    # Create backup
./manage.sh cleanup   # Clean up Docker resources
```

---

## 🔒 Security Recommendations

### 1. Setup SSL/HTTPS
```bash
# Install Certbot for Let's Encrypt
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate (replace with your domain)
sudo certbot --nginx -d yourdomain.com
```

### 2. Configure Nginx (Optional but Recommended)
```bash
# Install Nginx
sudo apt install nginx -y

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/feedaq-academy
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:3000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/feedaq-academy /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 3. Setup Monitoring
```bash
# Install monitoring tools
sudo apt install htop iotop nethogs -y

# Setup log rotation
sudo nano /etc/logrotate.d/feedaq-academy
```

---

## 🐛 Troubleshooting

### Check Container Status
```bash
cd /opt/feedaq-academy/feedaq-academy-dashboard
docker-compose ps
docker-compose logs -f
```

### Common Issues

1. **Port already in use**
   ```bash
   sudo lsof -i :80
   sudo lsof -i :3000
   # Kill the process using the port if needed
   ```

2. **Permission denied**
   ```bash
   sudo chown -R $USER:$USER /opt/feedaq-academy
   ```

3. **Out of disk space**
   ```bash
   docker system prune -f
   docker volume prune -f
   ```

4. **Memory issues**
   ```bash
   # Check memory usage
   free -h
   # Consider upgrading droplet size
   ```

### View System Resources
```bash
# Check disk usage
df -h

# Check memory usage
free -h

# Check CPU usage
top
```

---

## 🔄 Updates and Maintenance

### Regular Updates
```bash
# Update system packages monthly
sudo apt update && sudo apt upgrade -y

# Update application (weekly or as needed)
cd /opt/feedaq-academy/feedaq-academy-dashboard
./manage.sh update
```

### Backup Strategy
```bash
# Create backup
./manage.sh backup

# Setup automated daily backups (crontab)
crontab -e
# Add: 0 2 * * * /opt/feedaq-academy/feedaq-academy-dashboard/manage.sh backup
```

---

## 📈 Scaling Considerations

For production use, consider:

1. **Database**: Use external database service (DigitalOcean Managed Database)
2. **Load Balancer**: DigitalOcean Load Balancer for multiple droplets
3. **CDN**: DigitalOcean Spaces + CDN for static assets
4. **Monitoring**: Set up proper monitoring with alerts
5. **Backup**: Automated backup solutions

---

## 💰 Cost Optimization

- **Basic Droplet**: $6/month (1 GB RAM, 1 vCPU) - For testing
- **Standard Droplet**: $12/month (2 GB RAM, 1 vCPU) - For small production
- **Performance Droplet**: $24/month (4 GB RAM, 2 vCPUs) - For medium production

---

## 📞 Support

If you encounter issues:

1. Check the logs: `./manage.sh logs`
2. Check container status: `./manage.sh status`
3. Review this guide for troubleshooting steps
4. Contact your development team

---

## 🎯 Quick Reference

**Droplet IP**: `YOUR_DROPLET_IP`
**Frontend URL**: `http://YOUR_DROPLET_IP`
**Backend API**: `http://YOUR_DROPLET_IP:3000`
**SSH Command**: `ssh root@YOUR_DROPLET_IP`
**Management Script**: `/opt/feedaq-academy/feedaq-academy-dashboard/manage.sh`