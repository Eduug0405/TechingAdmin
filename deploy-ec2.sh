#!/bin/bash

# Script de despliegue para EC2
# TechInng Admin Panel Deploy Script

echo "🚀 Iniciando despliegue de TechInng Admin Panel..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir con colores
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Actualizar sistema
print_status "Actualizando sistema..."
sudo yum update -y

# Instalar Node.js y npm
print_status "Instalando Node.js..."
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Verificar instalación
node --version
npm --version

# Instalar PM2 globalmente
print_status "Instalando PM2..."
sudo npm install -g pm2

# Crear directorio de aplicación
print_status "Preparando directorio de aplicación..."
sudo mkdir -p /var/www/techinng-admin
sudo chown -R ec2-user:ec2-user /var/www/techinng-admin
cd /var/www/techinng-admin

# Aquí copiarías los archivos (se explicará después)
print_warning "Recuerda subir los archivos de tu aplicación a este directorio"

# Instalar dependencias del servidor
print_status "Instalando dependencias del servidor..."
npm install express cors path

# Configurar PM2
print_status "Configurando PM2..."
pm2 start server.js --name "techinng-admin"
pm2 save
pm2 startup

# Configurar firewall (abrir puerto 3000)
print_status "Configurando firewall..."
sudo iptables -I INPUT -p tcp --dport 3000 -j ACCEPT
sudo service iptables save

print_success "¡Despliegue completado!"
print_success "Tu aplicación debería estar disponible en: http://TU-IP-EC2:3000"

echo ""
echo "📋 Comandos útiles:"
echo "  - Ver logs: pm2 logs techinng-admin"
echo "  - Reiniciar: pm2 restart techinng-admin"
echo "  - Parar: pm2 stop techinng-admin"
echo "  - Estado: pm2 status"
