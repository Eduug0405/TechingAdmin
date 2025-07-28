# 🚀 GUÍA DE DESPLIEGUE EN EC2 - TechInng Admin Panel

## 📋 Prerequisitos
- Una instancia EC2 (Amazon Linux 2 recomendado)
- Acceso SSH a la instancia
- Security Group configurado (puerto 22 para SSH, puerto 3000 para la app)

## 🔧 Paso 1: Preparar archivos localmente

### Ya tienes listos estos archivos:
- ✅ `build/` (carpeta generada por npm run build)
- ✅ `server.js` 
- ✅ `server-package.json`
- ✅ `ecosystem.config.json`
- ✅ `deploy-ec2.sh`

## 📦 Paso 2: Subir archivos a EC2

### Opción A: Usando SCP
```bash
# Comprimir archivos
tar -czf techinng-admin.tar.gz build/ server.js server-package.json ecosystem.config.json

# Subir a EC2 (reemplaza la IP y ruta de tu clave)
scp -i tu-clave.pem techinng-admin.tar.gz ec2-user@TU-IP-EC2:~/
scp -i tu-clave.pem deploy-ec2.sh ec2-user@TU-IP-EC2:~/
```

### Opción B: Usando GitHub (recomendado)
```bash
# En tu máquina local, crear repositorio
git init
git add .
git commit -m "Initial deploy"
git remote add origin https://github.com/tu-usuario/techinng-admin.git
git push -u origin main

# En EC2, clonar repositorio
git clone https://github.com/tu-usuario/techinng-admin.git
```

## ⚙️ Paso 3: Configurar EC2

### Conectarse a EC2
```bash
ssh -i tu-clave.pem ec2-user@TU-IP-EC2
```

### Ejecutar script de instalación
```bash
chmod +x deploy-ec2.sh
./deploy-ec2.sh
```

### O instalar manualmente:

#### 1. Instalar Node.js
```bash
sudo yum update -y
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs
```

#### 2. Crear directorio de aplicación
```bash
sudo mkdir -p /var/www/techinng-admin
sudo chown -R ec2-user:ec2-user /var/www/techinng-admin
cd /var/www/techinng-admin
```

#### 3. Copiar archivos
```bash
# Si usaste SCP
tar -xzf ~/techinng-admin.tar.gz -C /var/www/techinng-admin/
cp ~/server-package.json /var/www/techinng-admin/package.json

# Si usaste Git
cp -r ~/techinng-admin/* /var/www/techinng-admin/
mv server-package.json package.json
```

#### 4. Instalar dependencias
```bash
npm install
```

#### 5. Instalar y configurar PM2
```bash
sudo npm install -g pm2
pm2 start ecosystem.config.json
pm2 save
pm2 startup
```

#### 6. Configurar firewall
```bash
sudo iptables -I INPUT -p tcp --dport 3000 -j ACCEPT
sudo service iptables save
```

## 🌐 Paso 4: Configurar Security Group en AWS

En la consola de AWS:
1. Ve a EC2 → Security Groups
2. Selecciona el Security Group de tu instancia
3. Agregar regla de entrada:
   - Type: Custom TCP
   - Port: 3000
   - Source: 0.0.0.0/0 (o tu IP específica)

## ✅ Paso 5: Verificar despliegue

### Comprobar que la app funciona
```bash
curl http://localhost:3000
```

### Ver logs
```bash
pm2 logs techinng-admin
```

### Verificar estado
```bash
pm2 status
```

## 🎯 Resultado Final

Tu aplicación estará disponible en:
**http://TU-IP-EC2:3000**

## 🔧 Comandos útiles

```bash
# Reiniciar aplicación
pm2 restart techinng-admin

# Parar aplicación
pm2 stop techinng-admin

# Ver logs en tiempo real
pm2 logs techinng-admin --lines 100

# Monitorear recursos
pm2 monit
```

## 🔒 Consideraciones de Seguridad

1. **Usa HTTPS**: Configura un certificado SSL
2. **Nginx reverse proxy**: Para mejor rendimiento
3. **Firewall**: Restringe acceso solo a IPs necesarias
4. **Updates**: Mantén el sistema actualizado

## 🚨 Troubleshooting

### Si no funciona:
1. Verifica Security Group (puerto 3000 abierto)
2. Revisa logs: `pm2 logs techinng-admin`
3. Comprueba que el servicio esté corriendo: `pm2 status`
4. Verifica que no haya otro proceso en puerto 3000: `netstat -tlnp | grep 3000`
