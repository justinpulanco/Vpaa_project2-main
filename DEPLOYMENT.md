# Deployment Guide

## Production Deployment

### Prerequisites
- Ubuntu/CentOS server
- Python 3.8+
- Node.js 14+
- PostgreSQL
- Nginx
- SSL Certificate

### 1. Server Setup

#### Update System
```bash
sudo apt update
sudo apt upgrade -y
```

#### Install Dependencies
```bash
sudo apt install python3-pip python3-venv postgresql postgresql-contrib nginx
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt install nodejs
```

### 2. Database Setup

#### Create PostgreSQL Database
```bash
sudo -u postgres psql
CREATE DATABASE vpaa_db;
CREATE USER vpaa_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE vpaa_db TO vpaa_user;
\q
```

### 3. Backend Deployment

#### Clone Repository
```bash
git clone [your-repo-url]
cd Vpaa_project2
```

#### Setup Virtual Environment
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

#### Environment Variables
Create `.env` file:
```bash
SECRET_KEY=your-super-secret-key-here
DEBUG=False
DATABASE_URL=postgresql://vpaa_user:your_secure_password@localhost/vpaa_db
ALLOWED_HOSTS=your-domain.com,www.your-domain.com
```

#### Database Migration
```bash
cd vpaasystem
python manage.py migrate
python manage.py collectstatic
python manage.py createsuperuser
```

#### Setup Gunicorn
```bash
pip install gunicorn
```

Create gunicorn service:
```bash
sudo nano /etc/systemd/system/vpaa.service
```

```ini
[Unit]
Description=VPAA Django App
After=network.target

[Service]
User=ubuntu
Group=www-data
WorkingDirectory=/path/to/Vpaa_project2/vpaasystem
Environment="PATH=/path/to/Vpaa_project2/venv/bin"
ExecStart=/path/to/Vpaa_project2/venv/bin/gunicorn --workers 3 --bind unix:/path/to/Vpaa_project2/vpaasystem.sock vpaasystem.wsgi:application

[Install]
WantedBy=multi-user.target
```

### 4. Frontend Deployment

#### Build React App
```bash
cd frontend
npm install
npm run build
```

### 5. Nginx Configuration

Create Nginx config:
```bash
sudo nano /etc/nginx/sites-available/vpaa
```

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Frontend
    location / {
        root /path/to/Vpaa_project2/frontend/build;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api/ {
        include proxy_params;
        proxy_pass http://unix:/path/to/Vpaa_project2/vpaasystem.sock;
    }

    # Static files
    location /static/ {
        alias /path/to/Vpaa_project2/vpaasystem/staticfiles/;
    }

    # Media files
    location /media/ {
        alias /path/to/Vpaa_project2/vpaasystem/media/;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/vpaa /etc/nginx/sites-enabled
sudo nginx -t
sudo systemctl restart nginx
```

### 6. SSL Certificate (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

### 7. Start Services

```bash
sudo systemctl start vpaa
sudo systemctl enable vpaa
sudo systemctl restart nginx
```

## Docker Deployment (Alternative)

### Dockerfile (Backend)
```dockerfile
FROM python:3.9
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY vpaasystem/ .
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "vpaasystem.wsgi:application"]
```

### Dockerfile (Frontend)
```dockerfile
FROM node:16 AS build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
```

### docker-compose.yml
```yaml
version: '3.8'
services:
  db:
    image: postgres:13
    environment:
      POSTGRES_DB: vpaa_db
      POSTGRES_USER: vpaa_user
      POSTGRES_PASSWORD: your_password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: .
    depends_on:
      - db
    environment:
      - DATABASE_URL=postgresql://vpaa_user:your_password@db/vpaa_db
    ports:
      - "8000:8000"

  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "80:80"

volumes:
  postgres_data:
```

## Monitoring & Maintenance

### Log Monitoring
```bash
# Django logs
tail -f /var/log/vpaa/django.log

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### Backup Strategy
```bash
# Database backup
pg_dump vpaa_db > backup_$(date +%Y%m%d).sql

# Media files backup
tar -czf media_backup_$(date +%Y%m%d).tar.gz vpaasystem/media/
```

### Updates
```bash
git pull origin main
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput
sudo systemctl restart vpaa
```