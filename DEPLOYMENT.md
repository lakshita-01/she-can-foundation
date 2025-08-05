# Deployment Guide

This guide covers deploying the Intern Dashboard to various platforms.

## 🚀 Local Development

### Quick Setup
1. Run setup script:
   - Windows: `setup.bat`
   - Unix/Mac: `chmod +x setup.sh && ./setup.sh`

2. Start servers:
   ```bash
   # Terminal 1 - Backend
   cd intern_dashboard
   python manage.py runserver
   
   # Terminal 2 - Frontend
   cd intern-dashboard-frontend
   npm start
   ```

## 🌐 Production Deployment

### Backend (Django) Deployment

#### Option 1: Heroku
1. Install Heroku CLI
2. Create `Procfile`:
   ```
   web: gunicorn intern_dashboard.wsgi
   ```
3. Install gunicorn: `pip install gunicorn`
4. Update requirements.txt
5. Deploy:
   ```bash
   heroku create your-app-name
   git push heroku main
   ```

#### Option 2: DigitalOcean/AWS
1. Set up server with Python 3.8+
2. Install dependencies: `pip install -r requirements.txt`
3. Configure nginx/Apache
4. Set environment variables
5. Run with gunicorn: `gunicorn intern_dashboard.wsgi:application`

### Frontend (React) Deployment

#### Option 1: Netlify
1. Build project: `npm run build`
2. Drag build folder to Netlify
3. Configure redirects for SPA

#### Option 2: Vercel
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `build`

#### Option 3: GitHub Pages
1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add to package.json:
   ```json
   "homepage": "https://username.github.io/repository-name",
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d build"
   }
   ```
3. Deploy: `npm run deploy`

## 🔧 Environment Configuration

### Production Settings
Create `intern_dashboard/settings_prod.py`:

```python
from .settings import *

DEBUG = False
ALLOWED_HOSTS = ['your-domain.com']

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('DB_NAME'),
        'USER': os.environ.get('DB_USER'),
        'PASSWORD': os.environ.get('DB_PASSWORD'),
        'HOST': os.environ.get('DB_HOST'),
        'PORT': os.environ.get('DB_PORT'),
    }
}

# Security
SECURE_SSL_REDIRECT = True
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
```

### Environment Variables
```bash
# Django
SECRET_KEY=your-secret-key
DEBUG=False
ALLOWED_HOSTS=your-domain.com

# Database
DB_NAME=your-db-name
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_HOST=your-db-host
DB_PORT=5432

# Firebase (optional)
FIREBASE_CREDENTIALS_PATH=/path/to/credentials.json
```

## 📊 Monitoring & Maintenance

### Health Checks
- Backend: `GET /api/test/`
- Frontend: Check if app loads

### Logging
Configure Django logging in production:

```python
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': 'django.log',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'INFO',
            'propagate': True,
        },
    },
}
```

### Backup Strategy
1. Database backups (daily)
2. Media files backup
3. Configuration backup

## 🔒 Security Checklist

- [ ] Set DEBUG=False
- [ ] Configure ALLOWED_HOSTS
- [ ] Use HTTPS in production
- [ ] Set secure cookies
- [ ] Configure CORS properly
- [ ] Use environment variables for secrets
- [ ] Regular security updates
- [ ] Monitor for vulnerabilities

## 📈 Performance Optimization

### Backend
- Use database connection pooling
- Implement caching (Redis/Memcached)
- Optimize database queries
- Use CDN for static files

### Frontend
- Code splitting
- Lazy loading
- Image optimization
- Bundle analysis

## 🆘 Troubleshooting

### Common Issues
1. **Static files not loading**
   - Run `python manage.py collectstatic`
   - Check STATIC_ROOT setting

2. **CORS errors in production**
   - Update CORS_ALLOWED_ORIGINS
   - Check middleware order

3. **Database connection errors**
   - Verify database credentials
   - Check network connectivity
   - Ensure database server is running

### Monitoring Commands
```bash
# Check Django logs
tail -f django.log

# Check system resources
htop

# Check database connections
python manage.py dbshell
```