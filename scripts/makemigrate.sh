#!/bin/sh

echo "Digite o nome da migration:"
read MIGRATION_NAME

npx prisma migrate dev --name "$MIGRATION_NAME"
