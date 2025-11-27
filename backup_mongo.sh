#!/bin/bash
# ------------------------------------------------------------
# Script de copia de seguridad de MongoDB (Práctica 1 DAI)
# Autor: Martín Hernández
# ------------------------------------------------------------

# Nombre del contenedor 
CONTAINER_NAME="practica1_tienda_mongo_1"


# Credenciales de conexión
USER="root"
PASS="example"
DB="DAI"

# Carpeta donde se guardarán los backups en el host
BACKUP_DIR="./backups"

# Crear carpeta si no existe
mkdir -p "$BACKUP_DIR"

# Fecha actual (para distinguir backups)
DATE=$(date +%Y-%m-%d_%H-%M-%S)
OUTPUT_DIR="/data/dump"
LOCAL_BACKUP="$BACKUP_DIR/backup_$DATE"

echo "Iniciando copia de seguridad de la base de datos '$DB'..."
echo "Fecha: $DATE"

# Ejecutar mongodump dentro del contenedor
docker exec "$CONTAINER_NAME" mongodump \
  -u "$USER" -p "$PASS" \
  --authenticationDatabase admin \
  --db "$DB" \
  --out "$OUTPUT_DIR"

# Copiar el dump desde el contenedor al host
docker cp "$CONTAINER_NAME":"$OUTPUT_DIR/$DB" "$LOCAL_BACKUP"

if [ $? -eq 0 ]; then
  echo "Copia de seguridad completada correctamente."
  echo "Guardada en: $LOCAL_BACKUP"
else
  echo "Error al realizar la copia de seguridad."
fi
