#!/usr/bin/env sh
set -e

mkdir -p /app/data

echo "[entrypoint] prisma db push…"
node ./node_modules/prisma/build/index.js db push --skip-generate --accept-data-loss

USERS=$(node -e "const{PrismaClient}=require('@prisma/client');const p=new PrismaClient();p.user.count().then(c=>{process.stdout.write(String(c));return p.\$disconnect();}).catch(()=>{process.stdout.write('0');});")

if [ "$USERS" = "0" ]; then
  echo "[entrypoint] empty db, seeding demo data…"
  node ./prisma/seed.cjs || echo "[entrypoint] seed failed (continuing)"
else
  echo "[entrypoint] users already present ($USERS), skipping seed"
fi

echo "[entrypoint] starting Next.js on :${PORT}"
exec "$@"
