# Deployment Guide for DSK-UG

This guide explains how to deploy the DSK-UG application to a Virtual Private Server (VPS) with full control over the environment and SSL certificates.

## Prerequisites

1.  **Server (VPS)**: A Linux server (Ubuntu 22.04 LTS recommended) with a public IP address.
2.  **Domain**: You have `dsk-ug.de` pointed to your server's IP address.
    *   Create A-Record for `dsk-ug.de` -> `YOUR_SERVER_IP`
    *   Create A-Record for `www.dsk-ug.de` -> `YOUR_SERVER_IP`
    *   Create A-Record for `admin.dsk-ug.de` -> `YOUR_SERVER_IP`
    *   Create A-Record for `api.dsk-ug.de` -> `YOUR_SERVER_IP`

## Step 1: Server Setup

SSH into your server:
```bash
ssh root@your-server-ip
```

Update and install necessary tools:
```bash
apt update && apt upgrade -y
apt install -y docker.io docker-compose nginx certbot python3-certbot-nginx git
```

Enable Docker:
```bash
systemctl enable docker
systemctl start docker
```

## Step 2: Deploy Application

1.  **Clone the Repository** (or copy your files via SFTP/SCP):
    ```bash
    mkdir -p /var/www/dsk-ug
    cd /var/www/dsk-ug
    # git clone <your-repo-url> . 
    # OR copy files from your local machine
    ```

2.  **Configure Environment**:
    Create a `.env` file in the root directory:
    ```bash
    nano .env
    ```
    Paste your production environment variables (ensure you use strong passwords):
    ```env
    # Database
    MYSQL_DATABASE=dsk_prod
    MYSQL_USER=dsk_user
    MYSQL_PASSWORD=STRONG_PASSWORD_HERE
    MYSQL_ROOT_PASSWORD=STRONG_ROOT_PASSWORD_HERE

    # Backend Keys
    JWT_SECRET=VERY_LONG_RANDOM_STRING
    DEEPSEEK_API_KEY=your_key
    MICROSOFT_CLIENT_ID=your_id
    MICROSOFT_CLIENT_SECRET=your_secret
    MICROSOFT_TENANT_ID=your_tenant
    SUPABASE_URL=your_url
    SUPABASE_KEY=your_key
    ```

3.  **Start the Application**:
    Use the production compose file to build and start the containers.
    ```bash
    docker-compose -f docker-compose.prod.yml up -d --build
    ```

    This will start:
    - **Client Frontend** on port `3000`
    - **Admin Frontend** on port `8080`
    - **Backend API** on port `5000`
    - **Database** (internal)

## Step 3: Configure Nginx (Reverse Proxy)

We will use Nginx installed on the host to route traffic and handle SSL.

1.  **Create Nginx Config**:
    ```bash
    nano /etc/nginx/sites-available/dsk-ug
    ```

2.  **Paste the Configuration**:
    ```nginx
    # Backend API
    server {
        server_name api.dsk-ug.de;

        location / {
            proxy_pass http://localhost:5000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }

    # Admin Frontend
    server {
        server_name admin.dsk-ug.de;

        location / {
            proxy_pass http://localhost:8080;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }

    # Client Frontend (Main Website)
    server {
        server_name dsk-ug.de www.dsk-ug.de;

        location / {
            proxy_pass http://localhost:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
    ```

3.  **Enable the Site**:
    ```bash
    ln -s /etc/nginx/sites-available/dsk-ug /etc/nginx/sites-enabled/
    rm /etc/nginx/sites-enabled/default  # Remove default if present
    nginx -t  # Test config
    systemctl reload nginx
    ```

## Step 4: Setup SSL (HTTPS)

We will use Certbot (Let's Encrypt) to automatically obtain and configure SSL certificates.

Run the following command and follow the prompts:
```bash
certbot --nginx -d dsk-ug.de -d www.dsk-ug.de -d admin.dsk-ug.de -d api.dsk-ug.de
```

Certbot will automatically update your Nginx configuration to use HTTPS and set up auto-renewal.

## Maintenance

- **Update Application**:
    ```bash
    git pull
    docker-compose -f docker-compose.prod.yml up -d --build
    ```
- **View Logs**:
    ```bash
    docker-compose -f docker-compose.prod.yml logs -f
    ```
