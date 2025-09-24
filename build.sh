#!/bin/bash

# Install all dependencies including dev dependencies
npm install --include=dev

# Build the frontend
npm run build

echo "Build completed successfully!"