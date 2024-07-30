#!/bin/bash
npx concurrently "npm run build:backend && npm run start:backend" "sleep 5 && npm run build:frontend && npm run start:frontend"
